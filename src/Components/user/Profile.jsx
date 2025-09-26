import { useEffect } from "react";
import { post_auth_data } from "../../ApiServices";
import { getJwtData } from "../../Utils";
import { useNavigate } from "react-router-dom";
import { post_data } from "../../ApiServices";
import { convertToPayload, setTokenData } from "../../Utils";
import { FormikProvider, useFormik } from "formik";
import { profileFormSchema } from "../../Schema";
import { Form } from "react-bootstrap";
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { useState } from "react";

function Profile() {
  const [loader, setLoader] = useState(false);
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();

  const Profileform = useFormik({
    initialValues: {
      fullname: "",
      phoneNumber: "",
      alternameNumber: "",
      emailId: "",
      companyName: "",
      officeEmailId: "",
      officePhoneNumber: "",
      altOfficePhoneNumber: "",
      companyAddress: "",
      clientId: "",
      clientSecret: "",
      profile_img: "",
    },
    validationSchema: profileFormSchema,
    onSubmit: (values, { setSubmitting }) => {
      console.log("VALLLL", values);

      setSubmitting(true);
      handleSubmit(values);
      setSubmitting(false);
    },
  });
  console.log("Formik errors →", Profileform.errors);
  console.log("Formik values →", Profileform.values);
  console.log("Formik isValid →", Profileform.isValid);
  console.log("Formik isSubmitting →", Profileform.isSubmitting);

  const handleSubmit = (values) => {
    // let payload = {
    //   fullName: Profileform.values.fullName,
    //   phoneNumber: Profileform.values.phoneNumber,
    //   alternameNumber: Profileform.values.alternameNumber,
    //   emailId: Profileform.values.emailId,
    //   companyName: Profileform.values.companyName,
    //   officeEmailId: Profileform.values.officeEmailId,
    //   officePhoneNumber: Profileform.values.officePhoneNumber,
    //   altOfficePhoneNumber: Profileform.values.altOfficePhoneNumber,
    //   companyAddress: Profileform.values.companyAddress,
    //   clientId: Profileform.values.clientId,
    //   clientSecret: Profileform.values.clientSecret,
    // };

    const payload = { ...values };

    console.log("Payload for profile update:", payload);

    setLoader(true);
    post_data("portal/private", convertToPayload("profileDetails", payload), {})
      .then((response) => {
        setLoader(false);
        if (response.data.status) {
          setTokenData(response.data.userdata);
          success_swal_toast(response.data.message || "Updated successfully");
          navigate("/user/profile");
        } else {
          error_swal_toast(response.data.message || "Something went wrong");
        }
      })
      .catch((error) => {
        setLoader(false);
        error_swal_toast(error.message || "Something went wrong");
        console.error("Error during profile update:", error);
      });
  };

  const getUserData = () => {
    post_auth_data(
      "portal/private",
      convertToPayload("get-user-by-id", { user_id: getJwtData().sub }),
      {}
    )
      .then((response) => {
        if (response.data.status) {
          // console.log(response.data.data[0]);
          setFullName(response.data.data[0].fullname || "");
          setEmailId(response.data.data[0].emailid || "");
          setProfileImage(response.data.data[0].profileImage || "");
          Profileform.setValues({
            fullName: response.data.data[0].fullname || "",
            phoneNumber: response.data.data[0].mobileno || "",
            alternameNumber: response.data.data[0].alternameNumber || "",
            emailId: response.data.data[0].emailid || "",
            companyName: response.data.data[0].companyName || "",
            officeEmailId: response.data.data[0].officeEmailId || "",
            officePhoneNumber: response.data.data[0].officePhoneNumber || "",
            altOfficePhoneNumber:
              response.data.data[0].altOfficePhoneNumber || "",
            companyAddress: response.data.data[0].companyAddress || "",
            clientId: response.data.data[0].clientId || "",
            clientSecret: response.data.data[0].clientSecret || "",
          });
        } else {
          error_swal_toast(response.data.message || "something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error during signup:", error);
      });
  };

  const uploadProfileImage2 = (fileInput = {}) => {
    console.log("File input:", fileInput);
    localStorage.setItem("profileImage", JSON.stringify(fileInput));
    // const formData = new FormData();
    // formData.append('profileImage', fileInput);
    // post_data("portal/private/upload-profile-image", formData, {})
    //     .then((response) => {
    //         if (response.data.status) {
    //             success_swal_toast("Profile image uploaded successfully");
    //         } else {
    //             error_swal_toast(response.data.message || "Failed to upload profile image");
    //         }
    //     }).catch((error) => {
    //         error_swal_toast(error.message || "something went wrong");
    //         console.error("Error during profile image upload:", error);
    //     });
    // return () => {
    //     console.log("Profile image upload function called");
    // }
  };

  const uploadProfileImage = (fileInput = {}) => {
    if (!fileInput) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result;

      localStorage.setItem("profileImage", base64String);

      const payload = {
        profileImage: base64String,
      };

      console.log("PAYLOAD", payload);

      post_data("portal/private/upload-profile-image", payload, {})
        .then((response) => {
          if (response.data.status) {
            success_swal_toast("Profile image uploaded successfully");
          } else {
            error_swal_toast(
              response.data.message || "Failed to upload profile image"
            );
          }
        })
        .catch((error) => {
          error_swal_toast(error.message || "Something went wrong");
          console.error("Error during profile image upload:", error);
        });
    };

    reader.readAsDataURL(fileInput);
  };

  const handlePhoneInput = (field, value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    Profileform.setFieldValue(field, digitsOnly);
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      <div className="card-new p-4 mt-4">
        <FormikProvider value={Profileform}>
          <Form onSubmit={Profileform.handleSubmit}>
            <div className="card-bg card-gradient">
              <div className="row d-flex justify-content-between">
                <div className="col-6 p-3 d-flex">
                  <img
                    className="profileImage"
                    src="/assets/img/userImage.png"
                  />
                  <div className="d-flex flex-column justify-content-center ms-3">
                    <h5 className="profileHeaders">{fullName}</h5>
                    <span className="text-white">{emailId}</span>
                  </div>
                </div>
                <div className="col-3 d-flex justify-content-end align-items-center">
                  <input
                    type="file"
                    className="d-none"
                    id="profileImageInput"
                    onChange={(e) => uploadProfileImage(e.target.files[0])}
                  />
                  <label
                    htmlFor="profileImageInput"
                    className="btn btn-upload "
                  >
                    <i className="fa fa-upload"></i> Upload New Photo
                  </label>
                </div>
              </div>
            </div>

            <div
              className="w-100 d-flex flex-column card-bg mt-3"
              onSubmit={Profileform.handleSubmit}
            >
              <p className=" color-blue mt-3 font-600">Personal Details</p>

              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    class="form-control p-3"
                    id="fullname"
                    name="fullname"
                    placeholder="Enter Full Name"
                    value={Profileform.values.fullname}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.fullname &&
                    Profileform.errors.fullname && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.fullname}
                      </div>
                    )}
                </div>

                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    class="form-control p-3"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="Enter Phone No."
                    value={Profileform.values.phoneNumber}
                    onChange={(e) =>
                      handlePhoneInput("phoneNumber", e.target.value)
                    }
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.phoneNumber &&
                    Profileform.errors.phoneNumber && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.phoneNumber}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    class="form-control p-3"
                    id="alternameNumber"
                    name="alternameNumber"
                    placeholder="Alt. Phone No."
                    value={Profileform.values.alternameNumber}
                    onChange={(e) =>
                      handlePhoneInput("alternameNumber", e.target.value)
                    }
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.alternameNumber &&
                    Profileform.errors.alternameNumber && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.alternameNumber}
                      </div>
                    )}
                </div>
                <div className="col-3 mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    class="form-control p-3"
                    id="emailId"
                    name="emailId"
                    placeholder="Enter Email ID"
                    value={Profileform.values.emailId}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.emailId &&
                    Profileform.errors.emailId && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.emailId}
                      </div>
                    )}
                </div>
              </div>
              <p className="color-blue font-600 mt-xl-5 mt-lg-4 mt-md-3 mt-sm-2 mt-1">
                Company Details
              </p>
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    class="form-control p-3"
                    id="companyName"
                    name="companyName"
                    placeholder="Enter Company Name"
                    value={Profileform.values.companyName}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.companyName &&
                    Profileform.errors.companyName && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.companyName}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    class="form-control p-3"
                    id="officeEmailId"
                    name="officeEmailId"
                    placeholder="Enter Company Name"
                    value={Profileform.values.officeEmailId}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.officeEmailId &&
                    Profileform.errors.officeEmailId && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.officeEmailId}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    class="form-control p-3"
                    id="officePhoneNumber"
                    name="officePhoneNumber"
                    placeholder="Enter Official Phone No."
                    value={Profileform.values.officePhoneNumber}
                    onChange={(e) =>
                      handlePhoneInput("officePhoneNumber", e.target.value)
                    }
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.officePhoneNumber &&
                    Profileform.errors.officePhoneNumber && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.officePhoneNumber}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    class="form-control p-3"
                    id="altOfficePhoneNumber"
                    name="altOfficePhoneNumber"
                    placeholder="Alt. Official Phone No."
                    value={Profileform.values.altOfficePhoneNumber}
                    onChange={(e) =>
                      handlePhoneInput("altOfficePhoneNumber", e.target.value)
                    }
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.altOfficePhoneNumber &&
                    Profileform.errors.altOfficePhoneNumber && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.altOfficePhoneNumber}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="companyAddress"
                    name="companyAddress"
                    placeholder="Enter Company Address"
                    value={Profileform.values.companyAddress}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.companyAddress &&
                    Profileform.errors.companyAddress && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.companyAddress}
                      </div>
                    )}
                </div>
              </div>
              <h5 className="font-600 mt-xl-5 mt-lg-4 mt-md-3 mt-sm-2 mt-1">
                Credentials
              </h5>

              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="clientId"
                    name="clientId"
                    placeholder="Client ID"
                    value={Profileform.values.clientId}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.clientId &&
                    Profileform.errors.clientId && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.clientId}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="clientSecret"
                    name="clientSecret"
                    placeholder="Client Secret"
                    value={Profileform.values.clientSecret}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                  />
                  {Profileform.touched.clientSecret &&
                    Profileform.errors.clientSecret && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.clientSecret}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <button className="btn btn-outline-primary generate-token">
                    Generate Token <i class="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <button
                  className="btn btn-primary profilePageButton px-3"
                  type="submit"
                >
                  Submit <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </Form>
        </FormikProvider>
      </div>
    </>
  );
}

export default Profile;
