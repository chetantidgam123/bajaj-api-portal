
import { post_data } from "../../ApiServices";
import { convertToPayload } from "../../Utils";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { signupFormSchema } from "../../Schema";
import { Form } from "react-bootstrap";
import PropTypes from 'prop-types';
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import { Link, useLocation } from "react-router-dom";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { useEffect, useState } from "react";
import { LoaderWight } from "../../Loader";
function SignupPage({ setModalName, setShow }) {
  const [loader, setLoader] = useState(false)
  const location = useLocation();
  const signupForm = useFormik({
    initialValues: {
      fullName: "",
      mobileNo: "",
      emailId: "",
      userPassword: "",
      confirmPassword: "",
      terms: false,
    },
    validationSchema: signupFormSchema,
    onSubmit: (values) => {
      console.log("Form submitted:", values);
      handleSubmit();
    },

  })

  const handleSubmit = () => {
    let payload = {
      fullName: signupForm.values.fullName,
      mobileNo: signupForm.values.mobileNo,
      emailId: signupForm.values.emailId,
      userPassword: signupForm.values.userPassword,
    }
    setLoader(true);
    post_data("portal/public", convertToPayload('register-user', payload), {})
      .then((response) => {
        setLoader(false);
        if (response.data.status) {
          setModalName('login');
          success_swal_toast(response.data.message || "User registered successfully");
        } else {
          error_swal_toast(response.data.message || "Something went wrong");
        }
      }).catch((error) => {
        setLoader(false);
        error_swal_toast(error.message || "Something went wrong");
        console.error("Error during signup:", error);
      })
  };

  useEffect(() => {
    if (location.pathname.includes('reset')) {
      setShowLogin(true);
    }
  }, [location])

  return (
    <div>
      <h3>Sign Up</h3>
      <p>Create an account to get started</p>
      <FormikProvider value={signupForm}>
        <Form className="" autoComplete="off">
          <div className="">
            <FloatingInputLabel fieldName={`fullName`} formikFrom={signupForm} labelText={`Full Name`} />
          </div>
          <div className="">
            <FloatingInputLabel fieldName={`emailId`} formikFrom={signupForm} labelText={`Email Address`} />
          </div>
          <div className="">
            <FloatingInputLabel fieldName={`mobileNo`} formikFrom={signupForm} labelText={`Phone Number`} />
          </div>
          <div className="">
            <FloatingInputLabel fieldName={`userPassword`} formikFrom={signupForm} labelText={`Password`} fieldType="password" />
          </div>
          <div className="d-none">
            <label className="form-label mb-1" htmlFor="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Enter your password" className="form-control"
              value={signupForm.values.confirmPassword} onChange={signupForm.handleChange} onBlur={signupForm.handleBlur} />
            <ErrorMessage name={`confirmPassword`} component="small" className='text-danger' />
          </div>
          <div className="">
            <label className="form-label mb-1" htmlFor="userPassword">
              <input style={{ height: "15px", width: "15px", margin: "5px 5px 8px 5px" }} className="form-check-input"
                type="checkbox" id="terms" name="terms" value={signupForm.values.terms}
                checked={signupForm.values.terms} onChange={signupForm.handleChange} />
              <small className="w-100" style={{ fontSize: '0.95em' }} >By creating account you agree to our &nbsp; <Link className="text-primary">Terms of Services</Link></small>
            </label>
            <div>
              <ErrorMessage name={`terms`} component="small" className='text-danger' />
            </div>
          </div>
          <div className="text-center">
            <button type="button" className="btn btn-primary w-100" onClick={signupForm.handleSubmit} disabled={loader}>Sign Up {loader ? <LoaderWight /> : <i className="fa-solid fa-arrow-right"></i>}</button>
            <div className="mt-3">
              Have an account?&nbsp; &nbsp;<Link className="text-primary" onClick={() => { setModalName('login'); signupForm.resetForm(); }}>Sign In</Link>
            </div>
          </div>

        </Form>
      </FormikProvider>
    </div>
  );
}
SignupPage.propTypes = {
  setModalName: PropTypes.func,
  setShow: PropTypes.func,
}
export default SignupPage;
