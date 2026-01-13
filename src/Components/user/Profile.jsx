import { useEffect, useRef, useState } from "react";
import { post_auth_data } from "../../ApiServices";
import { getJwtData, offsetPagination, scrollToTop, sendEmail, convertToPayload } from "../../Utils";
import { FormikProvider, useFormik } from "formik";
import { profileFormSchema } from "../../Schema";
import { Form } from "react-bootstrap";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { LoaderWight, PageLoaderBackdrop } from "../../Loader";
import { ApiListRequestEmail } from "../../emailTemplate";
import PaginateComponent from "../common/Pagination";

const copyToClipboard = (text, label) => {
  navigator.clipboard.writeText(text).then(() => {
    success_swal_toast(`${label} copied!`);
  }).catch(() => {
    error_swal_toast("Failed to copy");
  });
};

function Profile() {
  const [loader, setLoader] = useState({ page: false, submit: false });
  const [fullName, setFullName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAPIs, setSelectedAPIs] = useState([]);

  const [availableAPIs, setAvailableAPIs] = useState([])
  const [accessibleApi, setAccessibleApi] = useState([])

  const [availableCurrentPage, setAvailableCurrentPage] = useState(1);
  const [availableTotalPages, setAvailableTotalPages] = useState(1);

  const [accessibleCurrentPage, setAccessibleCurrentPage] = useState(1);
  const [accessibleTotalPages, setAccessibleTotalPages] = useState(1);

  const [activeTab, setActiveTab] = useState("home");
  const hasFetched = useRef({
    available: false,
    accessible: false,
  });

  useEffect(() => {
    scrollToTop()
  }, [])

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

  useEffect(() => {
    if (activeTab === "available" && !hasFetched.current.available) {
      hasFetched.current.available = true;
      availableAPIList();
    }

    if (activeTab === "accessible" && !hasFetched.current.accessible) {
      hasFetched.current.accessible = true;
      accessibleAPIList();
    }
  }, [activeTab]);

  const accessibleAPIList = async (page = 1) => {
    const payload = {
      category_id: 0,
      subcategory_id: 0,
      limit: offsetPagination,
      page: page
    };

    setLoader(prev => ({ ...prev, page: true }));

    post_auth_data("portal/private", convertToPayload("get-all-accessble-api", payload), {})
      .then((response) => {
        setLoader(prev => ({ ...prev, page: false }));
        if (response.data.satus) {
          setAccessibleApi(response.data.result)
          const totalCount = response?.data?.totalRecords ?? response?.data?.result?.length ?? 0;
          setAccessibleTotalPages(Math.ceil(totalCount / offsetPagination))
          setAccessibleCurrentPage(page);
        } else {
          setLoader(prev => ({ ...prev, page: false }));
          error_swal_toast(response.data.message || "Something went wrong");
        }
      })
      .catch((error) => {
        setLoader(prev => ({ ...prev, page: false }));
        error_swal_toast(error.message || "Something went wrong");
        console.error("Error during profile update:", error);
      });
  };


  const availableAPIList = async (page = 1) => {
    const payload = {
      category_id: 0,
      subcategory_id: 0,
      limit: offsetPagination,
      page: page
    };
    setLoader(prev => ({ ...prev, page: true }));
    post_auth_data("portal/private", convertToPayload("get-user-available-api", payload), {})
      .then((response) => {
        setLoader(prev => ({ ...prev, page: false }));
        if (response.data.status) {
          setAvailableAPIs(response.data.result || [])
          const totalCount = response?.data?.totalRecords;
          setAvailableTotalPages(Math.ceil(totalCount / offsetPagination))
          setAvailableCurrentPage(page)
        } else {
          setLoader(prev => ({ ...prev, page: false }));
          error_swal_toast(response.data.message || "Something went wrong");
        }
      })
      .catch((error) => {
        setLoader(prev => ({ ...prev, page: false }));
        error_swal_toast(error.message || "Something went wrong");
        console.error("Error during profile update:", error);
      });
  };

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
      Profileform.setFieldValue("profile_img", base64String);
    };
    reader.readAsDataURL(file);
  };

  const multipleAPIReq = async () => {
    if (selectedAPIs.length === 0) {
      error_swal_toast("Please select at least one API");
      return;
    }
    setLoader((prev) => ({ ...prev, submit: true }));
    const payL = {
      apis: selectedAPIs.map((api) => ({
        api_id: String(api.uniqueid),
        application_name: api.apiname.trim(), // or just applicationName variable
      })),
    };
    post_auth_data("portal/private", convertToPayload("request-multiple-api-access", payL), {})
      .then((res) => {
        setLoader((prev) => ({ ...prev, submit: false }));
        if (res.data.status) {
          setSelectedAPIs([]);
          sendingMail();
          availableAPIList();
        } else {
          setLoader((prev) => ({ ...prev, submit: false }));
          error_swal_toast(res.data.message || "something went wrong");
        }
      }).catch((error) => {
        setLoader((prev) => ({ ...prev, submit: false }));
        error_swal_toast(error.message || "something went wrong");
        console.log("Error during signup:", error)
      })
  }


  const getUserData = () => {
    setLoader({ ...loader, page: true });
    post_auth_data("portal/private", convertToPayload("get-user-by-id", { user_id: getJwtData().sub }), {})
      .then((response) => {
        setLoader({ ...loader, page: false });
        if (response.data.status) {
          setFullName(response.data.data[0].fullname || "");
          setEmailId(response.data.data[0].emailid || "");
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

  const handleCheckboxChange = (api, isChecked) => {
    setSelectedAPIs((prev) => {
      if (isChecked) {
        return [...prev.filter((item) => item.id !== api.id), api]; // store full object
      } else {
        return prev.filter((item) => item.id !== api.id);
      }
    }
      // prevSelected.includes(id)
      //   ? prevSelected.filter((apiId) => apiId !== id) // remove if already selected
      //   : [...prevSelected, id] // add if newly selected
    );
  };

  const handleTryIt = (api) => {
    window.open(`/try-api/${api.category_unique_id}/${api.sub_cat_unique_id}/${api.uniqueid}`, '_blank');
  };

  const getStatusLabel = (item) => {
    // For Accessible APIs (My APIs), all items in this list are approved since they have access
    // The approved_status field in this context represents the API access approval status
    // If the API is in the accessible list, it means the user's access request was approved
    return <span className="badge bg-success">Approved</span>;
  };


  return (
    <div className="2">
      <div className="row">
        <div className="col-xl-3 col-lg-3 col-md-4 col-sm-12 col-12  mt-4">
          <div className="card p-4 sidebar-bg-color min-height-100">
            <h3>My Profile</h3>
            <ul className="nav nav-pills mb-3 flex-direction-column pt-3" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                {/* <button className="nav-link active w-100 text-start text-sidebar" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Basic Details</button> */}
                <button
                  className={`nav-link w-100 text-start text-sidebar ${activeTab === "home" ? "active" : ""}`}
                  id="pills-home-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-home"
                  type="button"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected={activeTab === "home"}
                  onClick={() => setActiveTab("home")}
                >
                  Basic Details
                </button>
              </li>
              {/* <li className="nav-item" role="presentation">
                <button
                  className={`nav-link w-100 text-start text-sidebar ${activeTab === "available" ? "active" : ""}`}
                  id="pills-profile-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-profile"
                  type="button"
                  role="tab"
                  aria-controls="pills-profile"
                  aria-selected={activeTab === "available"}
                  onClick={() => setActiveTab("available")}
                >
                  Available APIs
                </button>
              </li> */}
              <li className="nav-item" role="presentation">
                {/* <button className="nav-link  w-100 text-start text-sidebar" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Accessible APIs</button> */}
                <button
                  className={`nav-link w-100 text-start text-sidebar ${activeTab === "accessible" ? "active" : ""}`}
                  id="pills-contact-tab"
                  data-bs-toggle="pill"
                  data-bs-target="#pills-contact"
                  type="button"
                  role="tab"
                  aria-controls="pills-contact"
                  aria-selected={activeTab === "accessible"}
                  onClick={() => setActiveTab("accessible")}
                >
                  My APIs
                </button>
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
                        {isEditing && (
                          <>
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
                          </>
                        )}
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
                        <label className="form-label" htmlFor="clientId">Client Id:</label>
                        <div className="input-group">
                          <input type="text" className="form-control p-3" id="clientId"
                            name="clientId" placeholder="Client ID" value={Profileform.values.clientId}
                            onChange={Profileform.handleChange} onBlur={Profileform.handleBlur} disabled />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => copyToClipboard(Profileform.values.clientId, "Client ID")}
                            title="Copy Client ID"
                          >
                            <i className="fa fa-copy"></i>
                          </button>
                        </div>
                        {Profileform.touched.clientId &&
                          Profileform.errors.clientId && (
                            <div className="text-danger mt-1">
                              {Profileform.errors.clientId}
                            </div>
                          )}
                      </div>
                      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                        <label className="form-label" htmlFor="clientSecret">Client Secret Key:</label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control p-3"
                            id="clientSecret"
                            name="clientSecret"
                            placeholder="Client Secret"
                            value={Profileform.values.clientSecret}
                            onChange={Profileform.handleChange}
                            onBlur={Profileform.handleBlur} disabled />
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => copyToClipboard(Profileform.values.clientSecret, "Client Secret")}
                            title="Copy Client Secret"
                          >
                            <i className="fa fa-copy"></i>
                          </button>
                        </div>
                        {Profileform.touched.clientSecret &&
                          Profileform.errors.clientSecret && (
                            <div className="text-danger mt-1">
                              {Profileform.errors.clientSecret}
                            </div>
                          )}
                      </div>

                    </div>
                    <div className="d-flex justify-content-end mt-3">
                      {!isEditing ? (
                        <button
                          type="button"
                          className="btn btn-secondary profilePageButton px-3"
                          onClick={(e) => { e.preventDefault(); setIsEditing(true) }}
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
                            className="btn btn-secondary profilePageButton px-3"
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
            <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
              <div className="card-bg  p-4 mt-4">
                <div className="card p-3">
                  <h4 className="mb-0">My APIs</h4>
                  <div className="mt-3 ">
                    <div className="api-table-container">
                      <table className="custom-table-new">
                        <thead className="custom-thead-new">
                          <tr className="custom-tr-new">
                            {/* <th className="custom-th-new"><input type="checkbox"/></th> */}
                            <th className="custom-th-new">API Name</th>
                            <th className="custom-th-new">API Description</th>
                            <th className="custom-th-new">Status</th>
                            <th className="custom-th-new">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {accessibleApi.length > 0 && accessibleApi.map((item, index) => (
                            <tr key={item.id} className="custom-tr-new">
                              <td className="custom-td-new">{item.apiname}</td>
                              <td className="custom-td-new">{item.description}</td>
                              <td className="custom-td-new">{getStatusLabel(item)}</td>
                              <td className="custom-td-new">
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleTryIt(item)}
                                >
                                  Try it
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {accessibleTotalPages > 1 && (
                        <PaginateComponent
                          currentPage={accessibleCurrentPage}
                          totalPages={accessibleTotalPages}
                          onPageChange={(page) => accessibleAPIList(page)}
                        />)}
                    </div>
                  </div>
                </div>
              </div>
              {loader.page && <PageLoaderBackdrop />}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;