import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Modal } from "react-bootstrap";
import { useFormik } from "formik";
import { post_data } from "../../ApiServices";
import { convertToPayload, getTokenData } from "../../Utils";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { footerContactSchema } from "../../Schema";
import SignupPage from "../auth/SignupPage";
import Login from "../auth/Login";
import ForgotPassword from "../auth/ForgotPassword";
import ResetPassword from "../auth/ResetPasswrd";

function FooterHome() {

  const [loader, setLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [modalName, setModalName] = useState("");

  // ✅ your same useFormik structure, just fixed
  const contactForm = useFormik({
    initialValues: {
      fullname: "",
      emailid: "",
      mobileno: "",
      description: "",
    },
    validationSchema: footerContactSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoader(true);
        const payload = convertToPayload("add-contact-us", values);
        const response = await post_data("portal/public", payload, {});
        console.log(response);
        success_swal_toast("Message sent successfully!");
        resetForm();
      } catch (error) {
        error_swal_toast(error.message || "Failed to send message");
      } finally {
        setLoader(false);
      }
    },
  });

  useEffect(() => {
    const modal = document.getElementById("exampleModal");

    const handleModalClose = () => {
      contactForm.resetForm(); // ✅ clears Formik fields and errors
    };

    if (modal) {
      modal.addEventListener("hidden.bs.modal", handleModalClose);
    }

    return () => {
      if (modal) {
        modal.removeEventListener("hidden.bs.modal", handleModalClose);
      }
    };
  }, [contactForm]);


  return (
    <>
      <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content p-2 position-relative">
            <div className="">
              {/* <h5 className="modal-title " id="exampleModalLabel">Conatct us</h5> */}

              <button type="button" className="btn-close close-absolute" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body contactus py-1">

              <div className="row pt-1">
                <div className="col-xl-5 col-lg-6 col-md-6 col-12 signUpsideBanner">
                  <div className="">
                    <img
                      src="/assets/img/Bajaj Logo.png"
                      alt="Bajaj Logo"
                      className="mt-2"
                    />
                    <div className="authContent">
                      <h1 className="title">Contact Us</h1>
                      <p>
                        We re here to help you get the most out of our APIs. Whether you need technical support, have questions about integration, or want to explore partnership opportunities, feel free to reach out.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-xl-7 col-lg-6 col-md-6 col-12 ps-5">
                  <ul className="nav nav-pills mb-3 d-flex justify-content-start mt-5" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="nav-link active contact-tabs-border" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Get In Touch</button>
                    </li>
                    <li className="nav-item ms-3" role="presentation">
                      <button className="nav-link contact-tabs-border" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Suggest an API</button>
                    </li>
                  </ul>
                  <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                      <form onSubmit={contactForm.handleSubmit}>
                        <div className="mb-3 mt-4">
                          <input type="text" name="fullname" className="form-control p-3" id="fullname" placeholder="Enter Full Name" value={contactForm.values.fullname} onChange={contactForm.handleChange} onBlur={contactForm.handleBlur} />
                          {contactForm.touched.fullname && contactForm.errors.fullname && (
                            <div className="text-danger">
                              {contactForm.errors.fullname}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <input type="text" name="emailid" className="form-control p-3" id="emailid" placeholder="Enter Email ID" value={contactForm.values.emailid} onChange={contactForm.handleChange} onBlur={contactForm.handleBlur} />
                          {contactForm.touched.emailid && contactForm.errors.emailid && (
                            <div className="text-danger">
                              {contactForm.errors.emailid}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <input type="text" name="mobileno" className="form-control p-3" id="mobileno" placeholder="Phone Number" value={contactForm.values.mobileno} onChange={contactForm.handleChange} onBlur={contactForm.handleBlur} />
                          {contactForm.touched.mobileno && contactForm.errors.mobileno && (
                            <div className="text-danger">
                              {contactForm.errors.mobileno}
                            </div>
                          )}
                        </div>
                        <div className="mb-3">
                          <textarea className="form-control p-3" name="description" id="description" rows="3" placeholder="Type here" value={contactForm.values.description} onChange={contactForm.handleChange} onBlur={contactForm.handleBlur}></textarea>
                          {contactForm.touched.description && contactForm.errors.description && (
                            <div className="text-danger">
                              {contactForm.errors.description}
                            </div>
                          )}
                        </div>
                        <div className="d-flex justify-content-center pb-4">
                          {/* <button type="button" className="btn btn-blue w-100">Submit </button> */}
                          <button type="submit" className="btn btn-blue w-100" disabled={loader}>{loader ? "Submitting..." : "Submit"} </button>
                        </div>
                      </form>
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                      <form action="">
                        <div className="mb-3 mt-4">
                          <input type="text" className="form-control p-3" id="contactname" placeholder="Enter Full Name" />
                        </div>
                        <div className="mb-3">
                          <input type="text" className="form-control p-3" id="contactemail" placeholder="Enter Email ID" />
                        </div>
                        <div className="mb-3">
                          <input type="text" className="form-control p-3" id="contactphone" placeholder="Phone Number" />
                        </div>
                        <div className="mb-3">
                          <textarea className="form-control p-3" id="exampleFormControlTextarea2" rows="3" placeholder="Type here"></textarea>
                        </div>
                        <div className="d-flex justify-content-center pb-4">

                          <button type="button" className="btn btn-blue w-100">Submit </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
      <div className="footer">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            <div className="col-2 d-flex justify-content-center mb-3">
              {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s" alt="" /> */}
              <img src="/assets/img/Bajaj-new-campaign.png" alt="" width={'300px'} />
            </div>
          </div>

        </div>
        <div className="border-top border-bottom">
          <div className="container my-3">
            <ul className="">
              {/* <li><Link to={"/user/profile"}>Documentation</Link></li> */}
              <li>
                {/* {!getTokenData() ? (
                                <Link to="#" onClick={(e) => {
                                  e.preventDefault();
                                  setModalName("signup");
                                  setShow(true);
                                }}>Documentation</Link>
                              ) : (
                                <Link to={"/api/0"}>Documentation</Link>
                              )} */}
                <Link to={"/api/0"}>Documentation</Link>
              </li>
              <li><Link to={"/Contactus"} data-bs-toggle="modal" data-bs-target="#exampleModal">Contact Us</Link></li>
              <li><Link to={"/SupportCenter"}>Support Center</Link></li>
              <li><Link to={""}>About Us</Link></li>
              {/* <li><Link to={"/user/profile"}>Careers</Link></li> */}
              <li><Link to={"/TermsofServices"}>Terms of Service</Link></li>
              <li><Link to={"/Privacypolicy"}>Privacy Policy</Link></li>
            </ul>

          </div>
        </div>
        <div className="container">
          <p className="text-center text-white mt-3 mb-0">Copyright © 2025. All rights reserved</p>
        </div>
      </div>

      {/* Auth Modal */}
      <Modal size="lg" show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton className="border-bottom-0 py-0"></Modal.Header>
        <Modal.Body className="pt-0">
          <div className="col-12 px-3">
            <div className="row">
              <div className="col-xl-5 col-lg-5 col-md-5 col-12 signUpsideBanner">
                <img
                  src="/assets/img/Bajaj Logo.png"
                  alt="NA"
                  className="mt-2"
                />
                <div className="authContent">
                  <h1 className="title">
                    Welcome to Bajaj API Developer Portal.
                  </h1>
                  <p>
                    Your one-stop destination for accessing, integrating, and
                    managing powerful APIs that drive seamless digital
                    experiences.
                  </p>
                </div>
              </div>
              <div className="col-xl-7 col-lg-7 col-md-7 col-12 ps-4">
                {modalName == "signup" && (
                  <SignupPage setModalName={setModalName} setShow={setShow} />
                )}
                {modalName == "login" && (
                  <Login setModalName={setModalName} setShow={setShow} />
                )}
                {modalName == "forget-pass" && (
                  <ForgotPassword setModalName={setModalName} setShow={setShow} />
                )}
                {modalName == "reset-pass" && (
                  <ResetPassword setModalName={setModalName} setShow={setShow} />
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </>
  )
}

export default FooterHome
