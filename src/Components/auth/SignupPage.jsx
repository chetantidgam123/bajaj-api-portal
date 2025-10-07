
import { post_data } from "../../ApiServices";
import { convertToPayload, sendEmail } from "../../Utils";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { signupFormSchema } from "../../Schema";
import { Form, Modal, Button } from "react-bootstrap";
import PropTypes from 'prop-types';
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import { Link, useLocation } from "react-router-dom";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { useEffect, useState } from "react";
import { LoaderWight } from "../../Loader";
import { signUpOtpEmail, adminNotificationEmail } from "../../emailTemplate";

function SignupPage({ setModalName, setShow }) {
  const [loader, setLoader] = useState(false)
  const [otpSent, setOtpSent] = useState(false);
  // const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");

  const [otpCountdown, setOtpCountdown] = useState(600); // 10 minutes in seconds
  const [resendCountdown, setResendCountdown] = useState(30);
  const [canResendOtp, setCanResendOtp] = useState(false);


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
  const sendOtp = async (email) => {

    if (!signupForm.values.fullName || !signupForm.values.emailId || !signupForm.values.mobileNo || !signupForm.values.userPassword) {
      return error_swal_toast("Please fill all required fields correctly.");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 5 * 60 * 1000; // 5 minutes
    localStorage.setItem("signupOtp", JSON.stringify({ otp, expiry }));

    const firstName = signupForm.values.fullName.split(" ")[0] || "User"; // extract first name
    const emailBody = signUpOtpEmail({ firstName: firstName, otp: otp });

    try {
      await sendEmail({ body: emailBody, toRecepients: [email], subject: String("Your OTP for Email Verification"), contentType: String('text/html') });
      success_swal_toast("OTP has been sent to your email!");
      // setShowOtpModal(true);
      setOtpSent(true);
    } catch (err) {
      error_swal_toast("Failed to send OTP email.");
    }
    console.log("Generated OTP:", otp); // debug
  };

  const verifyOtpAndRegister = async (values) => {
    const stored = JSON.parse(localStorage.getItem("signupOtp"));
    // console.log(values.fullName, values.mobileNo, values.emailId, values.userPassword)
    if (!stored) return error_swal_toast("OTP not generated or expired.");
    // if (!stored) {
    //   error_swal_toast("OTP not generated or expired.");
    //   verifyOtpAndRegister(false);
    //   return;
    // }

    if (Date.now() > stored.expiry) {
      error_swal_toast("OTP expired. Please request again.");
      localStorage.removeItem("signupOtp");
      // setShowOtpModal(false);
      setOtpSent(false);
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
        const adminEmail = "ctidgam1997@gmail.com";
        // const adminEmail = "meshramsagar715@gmail.com"
        // const adminName = "Chetan";
        // const currentDateTime = new Date().toLocaleString();
        const emailBody =  adminNotificationEmail({
          adminName: "Admin",
          userName: values.fullName,
          userEmail: values.emailId,
          requestedOn: new Date().toLocaleString()
        })
        const subject = "Action Required - New User Login Request for BAJAJ API Developer Portal"
        await sendEmail({ body: emailBody, toRecepients: [adminEmail], subject: subject, contentType: 'text/html' });
        setModalName("login");
        // setShowOtpModal(false);
        setOtpSent(false)
        signupForm.resetForm();
      } else if (res?.data?.errors) {
        const message = res?.data?.errors?.shortDescription?.[0]?.message || "Invalid data or password format";
        error_swal_toast(message);
        signupForm.resetForm();
        // setShowOtpModal(false);
        setOtpSent(false)
      } else if(!res?.data?.status) {
          error_swal_toast(res.data.message)
      }

    } catch (error) {
      setLoader(false);
      // setShowOtpModal(false)
      setOtpSent(false)
      error_swal_toast(error.message || "Failed to send email or register user");
    }
  };

  useEffect(() => {
    if (location.pathname.includes('reset')) {
      setShow(true);
    }
  }, [location])

   useEffect(() => {
  let timer;
  if (otpSent && otpCountdown > 0) {
    timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
  } 
  // else if (otpCountdown === 0) {
  //   setCanResendOtp(true); // allow resend when timer finishes
  // }
  return () => clearInterval(timer);
}, [otpSent, otpCountdown]);

useEffect(() => {
  let timer;
  if (otpSent && resendCountdown > 0) {
    timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
  } else if (resendCountdown === 0) {
    setCanResendOtp(true); // enable resend after 30 seconds
  }
  return () => clearInterval(timer);
}, [otpSent, resendCountdown]);

const formatTime = (seconds) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;
};

const handleResendOtp = () => {
  sendOtp(otpEmail);
  setResendCountdown(30); // reset 30 sec timer for resend
  setCanResendOtp(false);
  setOtpCountdown(600); // reset full OTP validity countdown if needed
};

  return (
       <div style={{ height: "30.5em" }}>

      {!otpSent ? (
        <>
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
      </FormikProvider> </> 
      ): (
        <div className="p-3">
          <h4>Enter OTP</h4>
          <p>OTP sent on <b>{otpEmail}</b></p>
          <input
            type="text"
            name="enteredOtp"
            className="form-control my-3"
            placeholder="Enter OTP"
            value={signupForm.values.enteredOtp}
            onChange={(e) => signupForm.setFieldValue("enteredOtp", e.target.value)}
          />
          <div className="d-flex justify-content-between pb-3">
            <div><b>{formatTime(otpCountdown)}</b></div>
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
            onClick={() => verifyOtpAndRegister(signupForm.values)}
            // onClick={async () => {
            //   setLoader(true);
            //   await verifyOtpAndRegister(signupForm.values);
            //   setLoader(false); // optionally
            // }}
            disabled={loader}
          >
            {loader ? <LoaderWight /> : "Verify & Login"}
          </button>

          <div className="mt-3 text-center">
            <Link
              className="text-primary"
              onClick={() => {
                setOtpSent(false);
                signupForm.setFieldValue("enteredOtp", "");
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
SignupPage.propTypes = {
  setModalName: PropTypes.func,
  setShow: PropTypes.func,
}
export default SignupPage;
