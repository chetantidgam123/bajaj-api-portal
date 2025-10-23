import { useEffect } from "react";
import { post_auth_data } from "../../ApiServices";
import { getJwtData } from "../../Utils";
import { useNavigate } from "react-router-dom";
import { convertToPayload, setTokenData } from "../../Utils";
import { FormikProvider, useFormik } from "formik";
import { profileFormSchema } from "../../Schema";
import { Form } from "react-bootstrap";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { useState } from "react";
import { LoaderWight, PageLoaderBackdrop } from "../../Loader";
import { sendEmail } from "../../Utils";
import { ApiListRequestEmail } from "../../emailTemplate";

function Profile() {
  const [loader, setLoader] = useState({ page: false, submit: false });
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAPIs, setSelectedAPIs] = useState([]);

  const [availableAPIs, setAvailableAPIs] = useState([
  { name: "Perform Otp SignIn With VIN", description: "Lorem ipsum dolor sit amet" },
  { name: "Otp Login Verification Request", description: "Lorem ipsum dolor sit amet" },
  { name: "Get All States", description: "Lorem ipsum dolor sit amet" },
  { name: "Models By Brand", description: "Lorem ipsum dolor sit amet" },
  { name: "Generate Token", description: "Lorem ipsum dolor sit amet" },
]);

  const navigate = useNavigate();

  const Profileform = useFormik({
    initialValues: {
      fullname: "",
      mobileno: "",
      mobileno2: "",
      emailid: "",
      company_name: "",
      company_email: "",
      company_mobile: "",
      company_office_mobile: "",
      company_address: "",
      clientId: "",
      clientSecret: "",
      profile_img: "",
    },
    validationSchema: profileFormSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      handleSubmit(values);
      setSubmitting(false);
    },
  });

  const handleSubmit = (values) => {
    const payload = {
      ...values,
      mobileno: values.mobileno?.toString() || "",
      mobileno2: values.mobileno2?.toString() || "",
      company_mobile: values.company_mobile?.toString() || "",
      company_office_mobile: values.company_office_mobile?.toString() || "",
    };

    setLoader({ ...loader, submit: true });
    post_auth_data("portal/private", convertToPayload("update-profile", payload), {})
      .then((response) => {
        setLoader({ ...loader, submit: false });
        if (response.data.status) {
          success_swal_toast(response.data.message || "Updated successfully");
          setIsEditing(false);
        } else {
          error_swal_toast(response.data.message || "Something went wrong");
        }
      })
      .catch((error) => {
        setLoader({ ...loader, submit: false });
        error_swal_toast(error.message || "Something went wrong");
        console.error("Error during profile update:", error);
      });
  };

  const uploadProfileImage = (file) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    const maxSize = 240 * 1024; // 240 KB in bytes

    // ✅ Check file type
    if (!allowedTypes.includes(file.type)) {
      error_swal_toast("Only JPG, JPEG, and PNG files are allowed.");
      return;
    }

    if (file.size > maxSize) {
      error_swal_toast("File size must be less than 240 KB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      setProfileImage(base64String);
      Profileform.setFieldValue("profile_img", base64String);
    };
    reader.readAsDataURL(file);
  };

  const getUserData = () => {
    setLoader({ ...loader, page: true });
    post_auth_data("portal/private", convertToPayload("get-user-by-id", { user_id: getJwtData().sub }), {})
      .then((response) => {
        setLoader({ ...loader, page: false });
        if (response.data.status) {
          console.log(response.data.data[0]);
          setFullName(response.data.data[0].fullname || "");
          setEmailId(response.data.data[0].emailid || "");
          setProfileImage(response.data.data[0].profileImage || "");
          Profileform.setValues({
            fullname: response.data.data[0].fullname || "",
            mobileno: response.data.data[0].mobileno || "",
            mobileno2: response.data.data[0].mobileno2 || "",
            emailid: response.data.data[0].emailid || "",
            company_name: response.data.data[0].company_name || "",
            company_email: response.data.data[0].company_email || "",
            company_mobile: response.data.data[0].company_mobile || "",
            company_office_mobile:
              response.data.data[0].company_office_mobile || "",
            company_address: response.data.data[0].company_address || "",
            clientId: response.data.data[0].client_id || "",
            clientSecret: response.data.data[0].client_secret || "",
            profile_img: response.data.data[0].profile_img || "",
          });
        } else {
          error_swal_toast(response.data.message || "something went wrong");
        }
      })
      .catch((error) => {
        setLoader({ ...loader, page: false });
        console.error("Error during signup:", error);
      });
  };

  const handlePhoneInput = (field, value) => {
    const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
    Profileform.setFieldValue(field, digitsOnly.toString());
  };

  useEffect(() => {
    getUserData();
  }, []);

 const sendingMail = async () => {
  if (selectedAPIs.length === 0) {
    error_swal_toast("Please select at least one API to request access.");
    return;
  }
  const userName = fullName;
  const subject = "APIs Approval Is In Process"; 
  const userEmail = emailId;
  const emailBody = ApiListRequestEmail({
    status: "Requested",
    selectedAPIs,
  });

  await sendEmail({
    body: emailBody,
    toRecepients: [userEmail],
    subject,
    contentType: "text/html"
  });

  success_swal_toast("Request sent successfully!");
};

  const handleCheckboxChange = (apiName, isChecked) => {
  setSelectedAPIs((prev) => {
    if (isChecked) {
      return [...prev, apiName];
    } else {
      return prev.filter((name) => name !== apiName);
    }
  });
};


  return (
    <>
    <div className="2">
<div className="row">
<div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12  mt-4">
<div className="card p-4 sidebar-bg-color min-height-100">
<h3>My Profile</h3>
<ul className="nav nav-pills mb-3 flex-direction-column pt-3" id="pills-tab" role="tablist">
  <li className="nav-item" role="presentation">
    <button className="nav-link active w-100 text-start text-sidebar" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Basic Details</button>
  </li>
  <li class="nav-item" role="presentation">
    <button className="nav-link  w-100 text-start text-sidebar" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Available APIs</button>
  </li>
  <li className="nav-item" role="presentation">
    <button className="nav-link  w-100 text-start text-sidebar" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Accessible APIs</button>
  </li>
</ul>

</div>
</div>
<div className="col-xl-9 col-lg-9 col-md-8 col-sm-12 col-12">
  <div className="tab-content" id="pills-tabContent">
  <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab"> <div className="card-new p-4 mt-4">
        <FormikProvider value={Profileform}>
          <Form onSubmit={Profileform.handleSubmit}>
            <div className="card-bg card-gradient">
              <div className="row d-flex justify-content-between">
                <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 p-3 d-flex">
                  <img className="profileImage" src={Profileform.values.profile_img || "/assets/img/userImage.png"} />
                  <div className="d-flex flex-column justify-content-center ms-3">
                    <h5 className="profileHeaders">{fullName}</h5>
                    <span className="text-white">{emailId}</span>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12 d-flex justify-content-end align-items-center">
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
              // onSubmit={Profileform.handleSubmit}
            >
              <p className=" color-blue mt-3 font-600 mb-2">Personal Details</p>

              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="fullname"
                    name="fullname"
                    placeholder="Enter Full Name"
                    value={Profileform.values.fullname}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                    disabled={!isEditing}
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
                    className="form-control p-3"
                    id="mobileno"
                    name="mobileno"
                    placeholder="Enter Phone No."
                    value={Profileform.values.mobileno}
                    onChange={(e) =>
                      handlePhoneInput("mobileno", e.target.value)
                    }
                    onBlur={Profileform.handleBlur}
                    disabled={true}
                  />
                  {Profileform.touched.mobileno &&
                    Profileform.errors.mobileno && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.mobileno}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="mobileno2"
                    name="mobileno2"
                    placeholder="Alt. Phone No."
                    value={Profileform.values.mobileno2}
                    onChange={(e) =>
                      handlePhoneInput("mobileno2", e.target.value)
                    }
                    onBlur={Profileform.handleBlur}
                    disabled={!isEditing}
                  />
                  {Profileform.touched.mobileno2 &&
                    Profileform.errors.mobileno2 && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.mobileno2}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="emailid"
                    name="emailid"
                    placeholder="Enter Email ID"
                    value={Profileform.values.emailid}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                    disabled={!isEditing}
                  />
                  {Profileform.touched.emailid &&
                    Profileform.errors.emailid && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.emailid}
                      </div>
                    )}
                </div>
              </div>
              <p className="color-blue font-600 mt-xl-5 mt-lg-4 mt-md-3 mt-sm-2 mt-1 mb-2">
                Company Details
              </p>
              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="company_name"
                    name="company_name"
                    placeholder="Enter Company Name"
                    value={Profileform.values.company_name}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                    disabled={!isEditing}
                  />
                  {Profileform.touched.company_name &&
                    Profileform.errors.company_name && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.company_name}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="company_email"
                    name="company_email"
                    placeholder="Enter Company Email"
                    value={Profileform.values.company_email}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                    disabled={!isEditing}
                  />
                  {Profileform.touched.company_email &&
                    Profileform.errors.company_email && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.company_email}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="company_mobile"
                    name="company_mobile"
                    placeholder="Enter Official Phone No."
                    value={Profileform.values.company_mobile}
                    onChange={(e) =>
                      handlePhoneInput("company_mobile", e.target.value)
                    }
                    onBlur={Profileform.handleBlur}
                    disabled={!isEditing}
                  />
                  {Profileform.touched.company_mobile &&
                    Profileform.errors.company_mobile && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.company_mobile}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="company_office_mobile"
                    name="company_office_mobile"
                    placeholder="Alt. Official Phone No."
                    value={Profileform.values.company_office_mobile}
                    onChange={(e) =>
                      handlePhoneInput("company_office_mobile", e.target.value)
                    }
                    onBlur={Profileform.handleBlur}
                    disabled={!isEditing}
                  />
                  {Profileform.touched.company_office_mobile &&
                    Profileform.errors.company_office_mobile && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.company_office_mobile}
                      </div>
                    )}
                </div>
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input
                    type="text"
                    className="form-control p-3"
                    id="company_address"
                    name="company_address"
                    placeholder="Enter Company Address"
                    value={Profileform.values.company_address}
                    onChange={Profileform.handleChange}
                    onBlur={Profileform.handleBlur}
                    disabled={!isEditing}
                  />
                  {Profileform.touched.company_address &&
                    Profileform.errors.company_address && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.company_address}
                      </div>
                    )}
                </div>
              </div>
              <h5 className="font-600 mt-xl-5 mt-lg-4 mt-md-3 mt-sm-2 mt-1 mb-2">
                Credentials
              </h5>

              <div className="row">
                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                  <input type="text" className="form-control p-3" id="clientId"
                    name="clientId" placeholder="Client ID" value={Profileform.values.clientId}
                    onChange={Profileform.handleChange} onBlur={Profileform.handleBlur} disabled />
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
                    onBlur={Profileform.handleBlur} disabled />
                  {Profileform.touched.clientSecret &&
                    Profileform.errors.clientSecret && (
                      <div className="text-danger mt-1">
                        {Profileform.errors.clientSecret}
                      </div>
                    )}
                </div>
              </div>
              {/* <div className="d-flex justify-content-end mt-3">
                <button className="btn btn-primary profilePageButton px-3" type="submit" disabled={loader.submit}>
                  Submit {loader.submit && <LoaderWight />}
                </button>
              </div> */}
             <div className="d-flex justify-content-end mt-3">
              {!isEditing ? (
                <button
                  type="button"
                  className="btn btn-secondary profilePageButton px-3"
                  onClick={(e) => {e.preventDefault(); setIsEditing(true)}}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    className="btn btn-primary profilePageButton px-3 me-2"
                    type="submit"
                    disabled={loader.submit}
                  >
                    Save {loader.submit && <LoaderWight />}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-secondary profilePageButton px-3"
                    onClick={() => {
                      getUserData(); // reload old data
                      setIsEditing(false); // disable edit mode
                    }}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
            </div>
          </Form>
        </FormikProvider>
        {loader.page && <PageLoaderBackdrop />}
      </div></div>
  <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
    <div className="card-bg  p-4 mt-4">
<div className="card p-3">
<h4 class="mb-0">Available APIs</h4>
<div className="mt-3 ">
<div className="api-table-container">
    <table className="custom-table-new">
      <thead className="custom-thead-new">
        <tr className="custom-tr-new">
          <th className="custom-th-new"><input type="checkbox"/></th>
          <th className="custom-th-new">API Name</th>
          <th className="custom-th-new">API Description</th>
        </tr>
      </thead>
      {/* <tbody>
        <tr className="custom-tr-new">
          <td className="custom-td-new"><input type="checkbox"/></td>
          <td className="custom-td-new">Perform Otp SignIn With VIN</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          <td className="custom-td-new"><input type="checkbox"/></td>
          <td className="custom-td-new">Otp Login Verification Request</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          <td className="custom-td-new"><input type="checkbox"/></td>
          <td className="custom-td-new">Get All States</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          <td className="custom-td-new"><input type="checkbox"/></td>
          <td className="custom-td-new">Models By Brand</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          <td className="custom-td-new"><input type="checkbox"/></td>
          <td className="custom-td-new">Generate Token</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          <td className="custom-td-new"><input type="checkbox"/></td>
          <td className="custom-td-new">Perform Otp SignIn With VIN</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          <td className="custom-td-new"><input type="checkbox"/></td>
          <td className="custom-td-new">Otp Login Verification Request</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          <td className="custom-td-new"><input type="checkbox"/></td>
          <td className="custom-td-new">Get All States</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
      </tbody> */}
      <tbody>
        {availableAPIs.map((api, index) => (
          <tr key={index} className="custom-tr-new">
            <td className="custom-td-new">
              <input
                type="checkbox"
                checked={selectedAPIs.includes(api.name)}
                onChange={(e) => handleCheckboxChange(api.name, e.target.checked)}
              />
            </td>
            <td className="custom-td-new">{api.name}</td>
            <td className="custom-td-new">{api.description}</td>
          </tr>
        ))}
      </tbody>
    </table>

    <button className="btn-request" onClick={sendingMail}>Request Access</button>
  </div>
</div>
</div>
    </div>
  </div>
  <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
     <div className="card-bg  p-4 mt-4">
<div className="card p-3">
<h4 class="mb-0">Accessible APIs</h4>
<div className="mt-3 ">
<div className="api-table-container">
    <table className="custom-table-new">
      <thead className="custom-thead-new">
        <tr className="custom-tr-new">
          {/* <th className="custom-th-new"><input type="checkbox"/></th> */}
          <th className="custom-th-new">API Name</th>
          <th className="custom-th-new">API Description</th>
        </tr>
      </thead>
      <tbody>
        <tr className="custom-tr-new">
          {/* <td className="custom-td-new"><input type="checkbox"/></td> */}
          <td className="custom-td-new">Perform Otp SignIn With VIN</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          {/* <td className="custom-td-new"><input type="checkbox"/></td> */}
          <td className="custom-td-new">Otp Login Verification Request</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          {/* <td className="custom-td-new"><input type="checkbox"/></td> */}
          <td className="custom-td-new">Get All States</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          {/* <td className="custom-td-new"><input type="checkbox"/></td> */}
          <td className="custom-td-new">Models By Brand</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          {/* <td className="custom-td-new"><input type="checkbox"/></td> */}
          <td className="custom-td-new">Generate Token</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          {/* <td className="custom-td-new"><input type="checkbox"/></td> */}
          <td className="custom-td-new">Perform Otp SignIn With VIN</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          {/* <td className="custom-td-new"><input type="checkbox"/></td> */}
          <td className="custom-td-new">Otp Login Verification Request</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
        <tr className="custom-tr-new">
          {/* <td className="custom-td-new"><input type="checkbox"/></td> */}
          <td className="custom-td-new">Get All States</td>
          <td className="custom-td-new">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</td>
        </tr>
      </tbody>
    </table>

    {/* <button className="btn-request">Try it</button> */}
  </div>
</div>
</div>
    </div>
  </div>
</div>

</div>
</div>
    </div>
     
    </>
  );
}

export default Profile;