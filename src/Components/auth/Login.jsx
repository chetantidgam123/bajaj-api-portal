import { Link, useNavigate } from "react-router-dom";
import { post_data } from "../../ApiServices";
import { convertToPayload, setTokenData, sendEmail } from "../../Utils";
import { FormikProvider, useFormik } from "formik";
import { loginFormSchema } from "../../Schema";
import { Form, Modal, Button } from "react-bootstrap";
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import PropTypes from 'prop-types';
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { useState } from "react";
import { LoaderWight } from "../../Loader";
import { loginOtpEmail } from "../../emailTemplate";

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

function Login({ setModalName, setShow }) {
    const [loader, setLoader] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const [backendTokenData, setBackendTokenData] = useState(null); // store token data temporarily
    const navigate = useNavigate();

    const Loginform = useFormik({
        initialValues: {
            emailId: "",
            userPassword: "",
            enteredOtp: "",
        },
        validationSchema: loginFormSchema,
        onSubmit: () => {
            handleLoginCheck();
        },
    });

    // Step 1: Verify credentials with backend
    const handleLoginCheck = async () => {
        const payload = {
            emailId: Loginform.values.emailId,
            userPassword: Loginform.values.userPassword,
        };
        setLoader(true);
        try {
            const res = await post_data("portal/public", convertToPayload('login', payload), {});
            setLoader(false);
            if (res.data.status) {
                // Store backend token temporarily
                setBackendTokenData(res.data.userdata);

                // Store email to send OTP
                setOtpEmail(Loginform.values.emailId);

                // Generate OTP
                const otp = generateOtp();
                const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
                localStorage.setItem("loginOtp", JSON.stringify({ otp, expiry }));

                const firstName =
                    res?.data?.userdata?.fullname || "User";
                const emailBody = loginOtpEmail({ firstName: firstName, otp: otp });

                // Send OTP via email
                await sendEmail({
                    body: emailBody,
                    toRecepients: [Loginform.values.emailId],
                    subject: "In OTP for Bajaj Developer Portal",
                    contentType: "text/html"
                });

                success_swal_toast("OTP sent to your email!");
                setShowOtpModal(true);
                console.log("Generated OTP:", otp);
            } else {
                error_swal_toast(res.data.message || "Invalid credentials");
            }
        } catch (err) {
            setLoader(false);
            error_swal_toast(err.message || "Something went wrong");
        }
    };

    // Step 2: Verify OTP and finalize login
    const verifyOtpAndLogin = () => {
        const stored = JSON.parse(localStorage.getItem("loginOtp"));
        if (!stored) {
            error_swal_toast("OTP expired or not generated");
            return;
        }
        if (Date.now() > stored.expiry) {
            error_swal_toast("OTP expired. Please request again");
            localStorage.removeItem("loginOtp");
            setShowOtpModal(false);
            return;
        }
        if (Loginform.values.enteredOtp !== stored.otp) {
            error_swal_toast("Invalid OTP. Try again");
            return;
        }

        // OTP is valid → set backend token and login
        setTokenData(backendTokenData);

        localStorage.removeItem("loginOtp");
        setShowOtpModal(false);
        setShow(false);
        Loginform.resetForm();

        success_swal_toast("Login successful!");
        navigate('/get-started');
    };

    return (
        <div style={{ height: "30.5em", display: 'flex', alignItems: 'center' }}>
            <FormikProvider value={Loginform}>
                <Form className="w-100">
                    <h3>Sign In</h3>
                    <p className="text-muted">Sign in to your account</p>
                    <FloatingInputLabel fieldName="emailId" formikFrom={Loginform} labelText="Email Address" />
                    <FloatingInputLabel fieldName="userPassword" formikFrom={Loginform} labelText="Password" fieldType="password" />
                    <div className="d-flex justify-content-between mb-2">
                        <small>
                            <Link className="text-primary" onClick={() => setModalName('forget-pass')}>Forgot Password?</Link>
                        </small>
                    </div>
                    <div className="text-center">
                        <button type="button" className="btn btn-blue w-100" onClick={Loginform.handleSubmit} disabled={loader}>
                            Sign In {loader && <LoaderWight />}
                        </button>
                        <div className="mt-3">
                            New to our product? <Link className="text-primary" onClick={() => { setModalName('signup'); Loginform.resetForm(); }}>Sign Up</Link>
                        </div>
                    </div>
                </Form>
            </FormikProvider>

            {/* OTP Modal */}
            <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter OTP</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter OTP"
                        value={Loginform.values.enteredOtp || ""}
                        onChange={e => Loginform.setFieldValue("enteredOtp", e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowOtpModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={verifyOtpAndLogin}>Verify & Login</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

Login.propTypes = {
    setModalName: PropTypes.func,
    setShow: PropTypes.func,
};

export default Login;
