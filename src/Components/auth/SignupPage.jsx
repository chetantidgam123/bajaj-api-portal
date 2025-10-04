
import { post_data } from "../../ApiServices";
import { convertToPayload,sendEmail } from "../../Utils";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { signupFormSchema } from "../../Schema";
import { Form, Modal, Button } from "react-bootstrap";
import PropTypes from 'prop-types';
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import { Link, useLocation } from "react-router-dom";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { useEffect, useState } from "react";
import { LoaderWight } from "../../Loader";

function SignupPage({ setModalName, setShow }) {
  const [loader, setLoader] = useState(false)
  // const [otpSent, setOtpSent] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const location = useLocation();
  const signupForm = useFormik({
    initialValues: {
      fullName: "",
      mobileNo: "",
      emailId: "",
      userPassword: "",
      confirmPassword: "",
      terms: false,
      enteredOtp: "",
    },
    validationSchema: signupFormSchema,
    onSubmit: (values) => {
      sendOtp(values.emailId);
      setOtpEmail(values.emailId);
      // setShowOtpModal(true);
    },

  })

    // Step 1: Generate OTP and save in localStorage
  const sendOtp = async(email) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    localStorage.setItem("signupOtp", JSON.stringify({ otp, expiry }));
    try {
      await sendEmail({ body: String(`Your OTP is: ${otp}`), toRecepients: [email], subject: String("check OTP"), contentType: String('application/json') });
      success_swal_toast("OTP has been sent to your email!");
      setShowOtpModal(true);
    } catch(err){
      error_swal_toast("Failed to send OTP email.");
    }
    console.log("Generated OTP:", otp); // debug
  };

  const verifyOtpAndRegister = async (values) => {
    const stored = JSON.parse(localStorage.getItem("signupOtp"));
     console.log(values.fullName, values.mobileNo, values.emailId, values.userPassword)
     if (!stored) {
      error_swal_toast("OTP not generated or expired.");
      verifyOtpAndRegister(false);
      return;
    }

    if (Date.now() > stored.expiry) {
      error_swal_toast("OTP expired. Please request again.");
      localStorage.removeItem("signupOtp");
      setShowOtpModal(false);
      return;
    }

    if (values.enteredOtp !== stored.otp) {
      error_swal_toast("Invalid OTP. Try again.");
      return;
    }

    localStorage.removeItem("signupOtp"); // remove OTP after success
    setLoader(true);

    try {
      // await sendEmail({ body: `Your OTP is: ${stored.otp}`, toRecepients: [otpEmail] });
      let payload = {
        fullName: String(values.fullName),
        mobileNo: String(values.mobileNo),
        emailId: String(values.emailId),
        userPassword: String(values.userPassword),
      }
      console.log(payload)
      const res = await post_data("portal/public", convertToPayload("register-user", payload), {});
      setLoader(false);
      if (res?.data?.status) {
        success_swal_toast(res.data.message || "User registered successfully");
        setModalName("login");
        setShowOtpModal(false);
        signupForm.resetForm();
      } else if(res?.data?.errors){
        const message = res?.data?.errors?.shortDescription?.[0]?.message || "Invalid data or password format";
        error_swal_toast(message);
        signupForm.resetForm();
        setShowOtpModal(false);
      }
    } catch(error) {
      setLoader(false);
      setShowOtpModal(false)
      error_swal_toast(error.message || "Failed to send email or register user");
    }
  };

  useEffect(() => {
    if (location.pathname.includes('reset')) {
      setShow(true);
    }
  }, [location])

  return (
       <div style={{ height: "30.5em" }}>
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
          {/* <div className="">
            <label className="form-label mb-1" htmlFor="userPassword">
              <input style={{ height: "15px", width: "15px", margin: "5px 5px 8px 5px" }} className="form-check-input"
                type="checkbox" id="terms" name="terms" value={signupForm.values.terms}
                checked={signupForm.values.terms} onChange={signupForm.handleChange} />
              <small className="w-100" style={{ fontSize: '0.95em' }} >By creating account you agree to our &nbsp; <Link className="text-primary">Terms of Services</Link></small>
            </label>
            <div>
              <ErrorMessage name={`terms`} component="small" className='text-danger' />
            </div>
          </div> */}
          <div className="text-center">
            {/* <button type="button" className="btn btn-primary w-100" onClick={signupForm.handleSubmit} disabled={loader}>Sign Up {loader ? <LoaderWight /> : <i className="fa-solid fa-arrow-right"></i>}</button> */}
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={() => {
                  sendOtp(signupForm.values.emailId);
                  setOtpEmail(signupForm.values.emailId);
                  // setShowOtpModal(true); // show OTP popup
                }}
              >
                Send OTP
              </button>
            <div className="mt-3">
              Have an account?&nbsp; &nbsp;<Link className="text-primary" onClick={() => { setModalName('login'); signupForm.resetForm(); }}>Sign In</Link>
            </div>
          </div>

        </Form>
      </FormikProvider>


      <div>
        {/* OTP Modal */}
        <Modal show={showOtpModal} onHide={() => setShowOtpModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Enter OTP</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              type="text"
              value={signupForm.values.enteredOtp || ""}
              onChange={(e) => signupForm.setFieldValue("enteredOtp", e.target.value)}
              placeholder="Enter OTP"
              className="form-control"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowOtpModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => verifyOtpAndRegister(signupForm.values)}>Verify & Submit</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
SignupPage.propTypes = {
  setModalName: PropTypes.func,
  setShow: PropTypes.func,
}
export default SignupPage;
