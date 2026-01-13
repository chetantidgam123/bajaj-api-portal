
import { post_data } from "../../ApiServices";
import { convertToPayload, sendEmail, adminEmail, encrypt, verifyBaseLink } from "../../Utils";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { signupFormSchema } from "../../Schema";
import { Form } from "react-bootstrap";
import PropTypes from 'prop-types';
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import { Link, useLocation } from "react-router-dom";
import { error_swal_toast } from "../../SwalServices";
import { useEffect, useState } from "react";
import { Loader } from "../../Loader";
import { adminNotificationEmail, signUpVerifyEmail } from "../../emailTemplate";

function SignupPage({ setModalName, setShow }) {
  const [loader, setLoader] = useState(false)
  const [otpSent, setOtpSent] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [resendCountdown, setResendCountdown] = useState(90);
  const [canResendOtp, setCanResendOtp] = useState(false);


  const location = useLocation();
  const signupForm = useFormik({
    initialValues: {
      fullName: "",
      companyName: "",
      mobileNo: "",
      emailId: "",
      userPassword: "",
      confirmPassword: "",
      // terms: false,
      enteredOtp: "",
    },
    validationSchema: signupFormSchema,
    onSubmit: (values) => {
      verifyOtpAndRegister(values)
    },

  })

  // Step 1: Generate OTP and save in localStorage
  const sendOtp = async (email) => {
    if (!signupForm.values.fullName || !signupForm.values.companyName || !signupForm.values.emailId || !signupForm.values.mobileNo || !signupForm.values.userPassword) {
      return error_swal_toast("Please fill all required fields correctly.");
    }

    const encryptedEmail = encodeURIComponent(encrypt(email));
    const verifyLink = `${verifyBaseLink}/${encryptedEmail}`;
    const firstName = signupForm.values.fullName.split(" ")[0] || "User"; // extract first name
    const emailBody = signUpVerifyEmail({ firstName: firstName, verifyLink: verifyLink });


    try {
      setLoader(true)
      await sendEmail({ body: emailBody, toRecepients: [email], subject: String("Email Verification"), contentType: String('text/html') });
      setOtpSent(true);
      setLoader(false)
    } catch (err) {
      setLoader(false)
      console.log(err)
      error_swal_toast("Failed to send email.");
    }
  };

  const verifyOtpAndRegister = async (values) => {
    setLoader(true);
    try {
      let payload = {
        fullName: String(values.fullName),
        companyName: String(values.companyName),
        mobileNo: String(values.mobileNo),
        emailId: String(values.emailId),
        userPassword: String(values.userPassword),
      }
      const res = await post_data("portal/public", convertToPayload("register-user", payload), {});
      if (res?.data?.status) {
        const emailBody = adminNotificationEmail({
          adminName: "Admin",
          userName: values.fullName,
          userEmail: values.emailId,
          mobileNo: values.mobileNo,
          requestedOn: new Date().toLocaleString()
        })
        const subject = "Action Required - New User Login Request for BAJAJ API Developer Portal"
        await sendEmail({ body: emailBody, toRecepients: [adminEmail], subject: subject, contentType: 'text/html' });
        await sendOtp(values.emailId);
        setOtpEmail(values.emailId);
        signupForm.resetForm();
        setLoader(false);
      } else if (res?.data?.errors) {
        const message = res?.data?.errors?.shortDescription?.[0]?.message || "Invalid data or password format";
        error_swal_toast(message);
        signupForm.resetForm();
        setOtpSent(false)
        setLoader(false);
      } else if (!res?.data?.status) {
        setLoader(false);
        error_swal_toast(res.data.message)
      }

    } catch (error) {
      setLoader(false);
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
    if (otpSent && resendCountdown > 0) {
      timer = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(timer);
  }, [otpSent, resendCountdown]);

  return (
    <div style={{ height: "35em" }}>
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
                <FloatingInputLabel fieldName={`companyName`} formikFrom={signupForm} labelText={`Company Name`} />
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
              <div className="text-center">
                <button type="submit" className="btn btn-primary w-100"
                  onClick={signupForm.handleSubmit} disabled={loader} >
                  Sign Up {loader && <Loader />}
                </button>
                <div className="mt-3">
                  Have an account?&nbsp; &nbsp;
                  <Link className="text-primary" onClick={() => { setModalName('login'); signupForm.resetForm(); }}>Sign In</Link>
                </div>
              </div>

            </Form>
          </FormikProvider>
        </>
      ) : (
        // <div className="my-4 w-100">
        //   <h3>Enter OTP</h3>
        //   <p>OTP sent on <b>{otpEmail}</b></p>
        //   <div className="position-relative my-3">
        //     <input
        //       type={showPassword ? "text" : "password"}
        //       name="enteredOtp"
        //       className="form-control pe-5"
        //       placeholder="Enter OTP"
        //       value={signupForm.values.enteredOtp}
        //       onChange={(e) => signupForm.setFieldValue("enteredOtp", e.target.value)}
        //     />
        //     <i
        //       className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"} position-absolute top-50 end-0 translate-middle-y me-3`}
        //       role="button"
        //       onClick={() => setShowPassword(!showPassword)}
        //     ></i>
        //   </div>
        //   {/* <div className="d-flex justify-content-between pb-3">
        //     <div><b>{formatTime(otpCountdown)}</b></div>
        //     <div>
        //       <button
        //         className="btn btn-link p-0"
        //         disabled={!canResendOtp}
        //         onClick={handleResendOtp}
        //       >
        //         Resend OTP
        //       </button>
        //     </div>
        //   </div> */}
        //   <div className="d-flex justify-content-between pb-3">
        //     {resendCountdown > 0 ? (
        //       <>
        //         <div><b>{formatTime(resendCountdown)}</b></div>
        //         <div>
        //           <button className="btn btn-link p-0" disabled>Resend OTP</button>
        //         </div>
        //       </>
        //     ) : (
        //       <div className="text-end w-100">
        //         <button
        //           className="btn btn-link p-0"
        //           disabled={!canResendOtp}
        //           onClick={handleResendOtp}
        //         >
        //           Resend OTP
        //         </button>
        //       </div>
        //     )}
        //   </div>
        //   <button
        //     className="btn btn-primary w-100"
        //     onClick={() => verifyOtpAndRegister(signupForm.values)}
        //     // onClick={async () => {
        //     //   setLoader(true);
        //     //   await verifyOtpAndRegister(signupForm.values);
        //     //   setLoader(false); // optionally
        //     // }}
        //     // disabled={loader}
        //     disabled={loader || !signupForm.values.enteredOtp}
        //   >
        //     {loader ? <LoaderWight /> : "Verify & Login"}
        //   </button>

        //   <div className="mt-3 text-center">
        //     <Link
        //       className="text-primary"
        //       onClick={() => {
        //         setOtpSent(false);
        //         signupForm.setFieldValue("enteredOtp", "");
        //       }}
        //     >
        //       Back to Sign Up
        //     </Link>
        //   </div>
        // </div>
        <div className="d-flex flex-column align-items-center justify-content-center text-center my-5 w-100" style={{ minHeight: "250px" }}>
          <span className="mb-3 fs-1 text-primary">
            <i className="fa-solid fa-circle-check"></i>
          </span>
          <p>User Registered Succesfully</p>
          <p className=" fw-medium">
            Kindly check your mailbox, a verification link has been shared to your email.
          </p>
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
