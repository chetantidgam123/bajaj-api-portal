
import { post_data } from "../../ApiServices";
import { convertToPayload } from "../../Utils";
import { FormikProvider, useFormik } from "formik";
import { resetPassSchema } from "../../Schema";
import { Form } from "react-bootstrap";
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import PropTypes from 'prop-types';
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderWight } from "../../Loader";
function ResetPassword({ setModalName, setShow }) {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loader, setLoader] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const resetPassForm = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: resetPassSchema,
        onSubmit: () => {
            handleSubmit();
        },

    })

    const handleSubmit = () => {
        let payload = {
            "unique_id": token,
            "password": resetPassForm.values.password,
            "confirmpass": resetPassForm.values.confirmPassword
        }
        setLoader(true);
        post_data("portal/public", convertToPayload('reset-password', payload), {})
            .then((response) => {
                setLoader(false);
                if (response.data.status) {
                    setShowSuccess(true);
                    success_swal_toast(response.data.message || "login successfully")
                } else {
                    error_swal_toast(response.data.message || "something went wrong");
                    setModalName('forget-pass')
                }
            }).catch((error) => {
                setLoader(false);
                error_swal_toast(error.message || "something went wrong");
                console.error("Error during signup:", error);
            })
    };

    return (
        <div className="">
            {!showSuccess && <FormikProvider value={resetPassForm}>
                <Form className="">
                    <div className="" style={{ opacity: '0', height: '82px' }}>
                        <FloatingInputLabel fieldName={`emailId12`} formikFrom={resetPassForm} labelText={`Email Address`} />
                    </div>
                    <h3>Almost there !</h3>
                    <p className="text-muted">Create new password for your account</p>
                    <div className="">
                        <FloatingInputLabel fieldName={`password`} formikFrom={resetPassForm} labelText={`Password`} fieldType={`password`} />
                    </div>
                    <div className="mb-5">
                        <FloatingInputLabel fieldName={`confirmPassword`} formikFrom={resetPassForm} labelText={`Confirm Password`} fieldType={`password`} />
                    </div>
                    <div className="text-center my-4">
                        <button type="button" className="btn btn-primary w-100" onClick={resetPassForm.handleSubmit} disabled={loader}>
                            Update Password {loader && <LoaderWight />}
                        </button>
                    </div>
                    <div className="" style={{ opacity: '0', height: '82px' }}>
                        <FloatingInputLabel fieldName={`emailId1234`} formikFrom={resetPassForm} labelText={`Email Address`} />
                    </div>
                </Form>
            </FormikProvider>}
            {showSuccess &&
                <div className="d-flex align-item-center loginModalHeight">
                    <div className="successtext bg-white">
                        <img src="/assets/img/mail.png" alt="NA" className="my-3" />
                        <h2>
                            Sucess!
                        </h2>
                        <small className="text-muted">
                            Your password has been successfully updated!
                        </small>
                        <div className="text-center mt-3">
                            <button type="button" className="btn btn-primary w-100" onClick={() => { setModalName('login'); navigate('/') }}>Sign In </button>
                        </div>
                    </div>
                </div>
            }
        </div>

    );
}
ResetPassword.propTypes = {
    setModalName: PropTypes.func,
    setShowLogin: PropTypes.func,
}
export default ResetPassword;
