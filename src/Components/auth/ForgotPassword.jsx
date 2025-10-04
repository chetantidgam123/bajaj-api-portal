
import { Link } from "react-router-dom";
import { FormikProvider, useFormik } from "formik";
import { forgotPassSchema } from "../../Schema";
import { Form } from "react-bootstrap";
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import PropTypes from 'prop-types';
import { useState } from "react";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { convertToPayload } from "../../Utils";
import { Loader, LoaderWight } from "../../Loader";
import { post_data } from "../../ApiServices";
function ForgotPassword({ setModalName, setShowLogin }) {
    const [isLinkSent, setIsLinkSent] = useState(false);
    const [loader, setLoader] = useState({ emailSend: false })
    const forgotPasswordForm = useFormik({
        initialValues: {
            emailId: ""
        },
        validationSchema: forgotPassSchema,
        onSubmit: () => {
            handleSubmit();
        },

    })

    const handleSubmit = async () => {
        let payload = {
            "emailId": forgotPasswordForm.values.emailId,
            "domain_url": `${import.meta.env.VITE_APP_BASE_URL}email/`
        }
        setLoader({ ...loader, emailSend: true });
        post_data("portal/public", convertToPayload('forgot-password', payload), {})
            .then((response) => {
                setLoader({ ...loader, emailSend: false });
                if (response.data.status) {
                    setIsLinkSent(true);
                    success_swal_toast(response.data.message || "Email sent successfully");
                } else {
                    error_swal_toast(response.data.message || "Please try again.");
                }
            }).catch((error) => {
                setLoader({ ...loader, emailSend: false });
                error_swal_toast(error.message || "something went wrong.");
            })
    };



    return (
        <div className="" style={{ height: "30.5em", display: 'flex', alignItems: 'center' }}>
            {
                !isLinkSent && <FormikProvider value={forgotPasswordForm}>
                    <Form className="my-4 w-100">
                        <h3>Forgot Password</h3>
                        <p className="text-muted">Don't worry we'll help you to reset your password</p>
                        <div className="">
                            <FloatingInputLabel fieldName={`emailId`} formikFrom={forgotPasswordForm} labelText={`Email Address`} />
                        </div>
                        <div className="text-center">
                            <button type="button" className="btn btn-primary w-100" disabled={loader.emailSend} onClick={forgotPasswordForm.handleSubmit}>
                                Send Link {loader.emailSend ? <LoaderWight /> : <i className="fa-solid fa-arrow-right mx-1 d-none"></i>}
                            </button>
                            <div className="mt-2 mb-1">
                                <Link className="text-primary" onClick={() => { setModalName('login'); forgotPasswordForm.resetForm() }}>Back to Sign In</Link>
                            </div>
                        </div>
                    </Form>
                </FormikProvider>
            }
            {isLinkSent &&
                <div className="d-flex align-item-center loginModalHeight">
                    <div className="linktext">
                        <img src="/assets/img/success.png" alt="NA" className="my-3" />
                        <p className="mb-2">
                            Kindly check your mail box, a reset link has been shared over the mail <b>{forgotPasswordForm.values.emailId}</b>.
                        </p>
                        <button className="btn btn-primary" onClick={() => { setIsLinkSent(false) }}>Change Email</button>
                        <div className="d-flex justify-content-between mt-3">
                            <small className="" style={{ fontSize: '0.95em' }} >Haven't received link?</small>
                            <small><button className="span-btn text-primary bg-light" onClick={forgotPasswordForm.handleSubmit} disabled={loader.emailSend}>Resend Link {loader.emailSend && <Loader />}</button></small>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}
ForgotPassword.propTypes = {
    setModalName: PropTypes.func,
    setShowLogin: PropTypes.func,
}
export default ForgotPassword;
