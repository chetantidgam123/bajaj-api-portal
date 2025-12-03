import { Link, useNavigate } from "react-router-dom";
import { post_data } from "../../ApiServices";
import { convertToPayload, setTokenData, sendEmail, OTP_KEY } from "../../Utils";
import { FormikProvider, useFormik } from "formik";
import { loginFormSchema } from "../../Schema";
import { Form, Modal, Button } from "react-bootstrap";
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import PropTypes from 'prop-types';
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { useState, useEffect } from "react";
import { LoaderWight, Loader } from "../../Loader";
import { loginOtpEmail } from "../../emailTemplate";
import { BasicLoader } from "../../Loader";
import { encrypt, decrypt } from "../../Utils";

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

function Login({ setModalName, setShow }) {
    const [loader, setLoader] = useState(false);
    const [otpEmail, setOtpEmail] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [basicLoader, setBasicLoader] = useState(false)
    const [showPassword, setShowPassword] = useState(false);
    // const [otpCountdown, setOtpCountdown] = useState(90); // 10 minutes in seconds
    const [resendCountdown, setResendCountdown] = useState(90);
    const [canResendOtp, setCanResendOtp] = useState(false);
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

    // useEffect(() => {
    //     let timer;
    //     if (otpSent && otpCountdown > 0) {
    //         timer = setInterval(() => setOtpCountdown(prev => prev - 1), 1000);
    //     }
    //     return () => clearInterval(timer);
    // }, [otpSent, otpCountdown]);

    // Resend button countdown (30 sec)
    useEffect(() => {
        let timer;
        if (otpSent && resendCountdown > 0) {
            timer = setInterval(() => setResendCountdown(prev => prev - 1), 1000);
        } else if (resendCountdown === 0) {
            setCanResendOtp(true);
        }
        return () => clearInterval(timer);
    }, [otpSent, resendCountdown]);

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    // Step 1: Verify credentials with backend
    const handleLoginCheck = async () => {
        const payload = {
            emailId: Loginform.values.emailId,
            userPassword: Loginform.values.userPassword,
        };
        setLoader(true);
        try {
            const res = await post_data("portal/public", convertToPayload('login', payload), {});
            // setLoader(false);
            if (res.data.status) {
                // Store backend token temporarily
                setBackendTokenData(res.data.userdata);

                // Store email to send OTP
                setOtpEmail(Loginform.values.emailId);

                // Generate OTP
                const otp = generateOtp();
                // const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
                // localStorage.setItem("loginOtp", JSON.stringify({ otp, expiry }));

                // const otpPayload = JSON.stringify({ otp, expiry: Date.now() + 90 * 1000 });
                const otpPayload = JSON.stringify({ otp, expiry: Date.now() + 10 * 60 * 1000 }); // 10 minutes
                const encryptedOtp = encrypt(otpPayload);
                localStorage.setItem(OTP_KEY, encryptedOtp);

                const firstName =
                    res?.data?.userdata?.fullname || "User";
                const emailBody = loginOtpEmail({ firstName: firstName, otp: otp });

                // Send OTP via email
                await sendEmail({
                    body: emailBody,
                    toRecepients: [Loginform.values.emailId],
                    subject: "Sign In OTP for Bajaj Developer Portal",
                    contentType: "text/html"
                });
                setLoader(false);
                success_swal_toast("OTP sent to your email!");
                setOtpSent(true);
                // setOtpCountdown(90);
                setResendCountdown(90);
                setCanResendOtp(false);
                console.log("Generated OTP:", otp);
            } else {
                setLoader(false);
                error_swal_toast(res.data.message || "Invalid credentials");
            }
        } catch (err) {
            setLoader(false);
            error_swal_toast(err.message || "Something went wrong");
        }
    };

    // Step 2: Verify OTP and finalize login
    const verifyOtpAndLogin = () => {
        // const stored = JSON.parse(localStorage.getItem("loginOtp"));
        const encryptedOtp = localStorage.getItem(OTP_KEY);
        const decrypted = decrypt(encryptedOtp);
        const stored = decrypted ? JSON.parse(decrypted) : null;

        if (!stored) {
            error_swal_toast("OTP expired or not generated");
            setBasicLoader(false)
            return;
        }
        if (Date.now() > stored.expiry) {
            error_swal_toast("OTP expired. Please request again");
            localStorage.removeItem(OTP_KEY);
            setBasicLoader(false)
            setOtpSent(false);
            return;
        }
        if (Loginform.values.enteredOtp !== stored.otp) {
            setBasicLoader(false)
            error_swal_toast("Invalid OTP. Try again");
            setBasicLoader(false);
            return;
        }

        // OTP is valid → set backend token and login
        setTokenData(backendTokenData);
        localStorage.removeItem(OTP_KEY);
        setShow(false);
        Loginform.resetForm();
        setBasicLoader(false)
        success_swal_toast("Login successful!");
        // navigate('/get-started');        
        if (backendTokenData?.role === 1) {
            navigate('/master/dashboard');
        } else {
            navigate('/get-started');
        }
    };

    const handleResendOtp = async () => {
        const otp = generateOtp();
        const expiry = Date.now() + 5 * 60 * 1000;
        // localStorage.setItem("loginOtp", JSON.stringify({ otp, expiry }));

        // const otpPayload = JSON.stringify({ otp, expiry: Date.now() + 90 * 1000 });
        const otpPayload = JSON.stringify({ otp, expiry: Date.now() + 10 * 60 * 1000 }); // 10 minutes
        const encryptedOtp = encrypt(otpPayload);
        localStorage.setItem(OTP_KEY, encryptedOtp);


        const firstName = backendTokenData.firstname || "User";
        const emailBody = `<p>Dear ${firstName},</p><p>Your OTP is <b>${otp}</b></p>`;

        try {
            await sendEmail({
                body: emailBody,
                toRecepients: [otpEmail],
                subject: "Your OTP for login",
                contentType: "text/html"
            });
            success_swal_toast("OTP resent to your email!");
            setResendCountdown(90);
            setCanResendOtp(false);
            // setOtpCountdown(90); // optional: reset OTP timer
            console.log("Generated OTP (resend):", otp);
        } catch (err) {
            error_swal_toast("Failed to resend OTP");
        }
    };


    return (
        <div style={{ height: "30.5em", display: 'flex', alignItems: 'center' }}>
            {!otpSent ? (
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
                                Sign In {loader && <Loader />}
                            </button>
                            <div className="mt-3">
                                New to our product? <Link className="text-primary" onClick={() => { setModalName('signup'); Loginform.resetForm(); }}>Sign Up</Link>
                            </div>
                        </div>
                    </Form>
                </FormikProvider>) : (
                <div className="my-4 w-100">
                    <h4>Enter OTP</h4>
                    <p>OTP sent on <b>{otpEmail}</b></p>
                    <div className="position-relative my-3">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="enteredOtp"
                            className="form-control pe-5"
                            placeholder="Enter OTP"
                            maxLength={6}
                            value={Loginform.values.enteredOtp}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                if (value.length <= 6) {
                                    Loginform.setFieldValue("enteredOtp", value);
                                }
                            }}
                            onKeyPress={(e) => {
                                if (!/[0-9]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                        />
                        <i
                            className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute top-50 end-0 translate-middle-y me-3`}
                            role="button"
                            onClick={() => setShowPassword(!showPassword)}
                        ></i>
                    </div>
                    {Loginform.values.enteredOtp && Loginform.values.enteredOtp.length < 6 && (
                        <div className="text-danger small mb-2">OTP must be 6 digits</div>
                    )}
                    <div className="d-flex justify-content-between pb-3">
                        {/* <div><b>{formatTime(otpCountdown)}</b></div> */}
                        <div>{!canResendOtp && <b>{formatTime(resendCountdown)}</b>}</div>
                        <div>
                            <button
                                className="btn btn-link p-0"
                                disabled={!canResendOtp}
                                onClick={handleResendOtp}
                            >
                                Resend OTP
                            </button>
                        </div>
                    </div>
                    <button
                        className="btn btn-primary w-100"
                        onClick={() => {
                            setBasicLoader(true)
                            verifyOtpAndLogin()
                        }}
                        disabled={basicLoader || Loginform.values.enteredOtp.length !== 6}
                    >
                        {/* {loader ? <LoaderWight /> : "Verify & Login"} */}
                        Verify & Login {basicLoader && <LoaderWight />}
                    </button>

                    <div className="mt-3 text-center">
                        <Link
                            className="text-primary"
                            onClick={() => {
                                setOtpSent(false);
                                Loginform.setFieldValue("enteredOtp", "");
                            }}
                        >
                            Back to Sign Up
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}

Login.propTypes = {
    setModalName: PropTypes.func,
    setShow: PropTypes.func,
};

export default Login;
