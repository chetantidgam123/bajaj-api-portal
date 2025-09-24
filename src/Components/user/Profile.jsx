import { useEffect } from "react"
import { post_auth_data } from "../../ApiServices"
import { getJwtData } from "../../Utils"
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
    const [fullName, setFullName] = useState('');
    const [emailId, setEmailId] = useState('');
    const [profileImage, setProfileImage] = useState('');
    const navigate = useNavigate();

    const Profileform = useFormik({
        initialValues: {
            fullName: "",
            phoneNumber: "",
            alternameNumber: "",
            emailId: "",
            companyName: "",
            officeEmailId: "",
            officePhoneNumber: "",
            companyAddress: "",
            clientId: "",
            clientSecret: ""
        },
        validationSchema: profileFormSchema,
        onSubmit: () => {
            handleSubmit();
        },

    })

    const handleSubmit = () => {
        let payload = {
            firstName: Profileform.values.firstName,
            lastName: Profileform.values.lastName,
            phoneNumber: Profileform.values.phoneNumber,
            alternameNumber: Profileform.values.alternameNumber,
            emailId: Profileform.values.emailId,
            companyName: Profileform.values.companyName,
            officeEmailId: Profileform.values.officeEmailId,
            officePhoneNumber: Profileform.values.officePhoneNumber,
            companyAddress: Profileform.values.companyAddress,
            clientId: Profileform.values.clientId,
            clientSecret: Profileform.values.clientSecret
        }
        setLoader(true);
        post_data("portal/private", convertToPayload('profileDetails', payload), {})
            .then((response) => {
                setLoader(false);
                if (response.data.status) {
                    setTokenData(response.data.userdata);
                    setShow(false);
                    success_swal_toast(response.data.message || "Updated successfully")
                    navigate('/user/profile')
                } else {
                    error_swal_toast(response.data.message || "something went wrong");
                }
            }).catch((error) => {
                setLoader(false);
                error_swal_toast(error.message || "something went wrong");
                console.error("Error during profile update:", error);
            })
    };

    const getUserData = () => {
        post_auth_data("portal/private", convertToPayload('get-user-by-id', { user_id: getJwtData().sub }), {})
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
                        companyAddress: response.data.data[0].companyAddress || "",
                        clientId: response.data.data[0].clientId || "",
                        clientSecret: response.data.data[0].clientSecret || ""
                    });
                } else {
                    error_swal_toast(response.data.message || "something went wrong");
                }
            }).catch((error) => {
                console.error("Error during signup:", error);
            })
    }

    const uploadProfileImage = (fileInput = {}) => {
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
    }

    useEffect(() => {
        getUserData()
    }, [])

    return (
        <>
            <div className="card-new p-4 mt-4">
                <div className="card-bg card-gradient">
                    <div className="row d-flex justify-content-between">
                        <div className="col-6 p-3 d-flex">
                            <img className="profileImage" src="/assets/img/userImage.png" />
                            <div className="d-flex flex-column justify-content-center ms-3">
                                <h5 className="profileHeaders">{fullName}</h5>
                                <span className="text-white">{emailId}</span>
                            </div>
                        </div>
                        <div className="col-3 d-flex justify-content-end align-items-center">
                            <input type="file" className="d-none" id="profileImageInput" onChange={(e) => uploadProfileImage(e.target.files[0])} />
                            <label htmlFor="profileImageInput" className="btn btn-upload ">
                                <i className="fa fa-upload"></i> Upload New Photo
                            </label>

                        </div>

                    </div>
                </div>

                <FormikProvider value={Profileform}>
                    <Form className="w-100 d-flex flex-column card-bg mt-3">
                        <p className=" color-blue mt-3 font-600">Personal Details</p>

                        <div className="row">
                            
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                {/* <FloatingInputLabel fieldName={`fullName`} formikFrom={Profileform} labelText={`Enter Full Name`} /> */}
                                    <input
                                    type="text"
                                    class="form-control p-3"
                                      id="fullName"
                                   name="fullName"
                                  placeholder="Enter Full Name"
                                    value={Profileform.values.fullName}
                                />
                                {/* <Form.Floating className="mb-3">
                                    <Form.Control
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter Full Name"
                                    />
                                    <label htmlFor="fullName">Enter Full Name</label>
                                </Form.Floating>
                                <input
                                    type="text"
                                    class="form-control p-3"
                                    id="fullName"
                                    name="fullName"
                                    placeholder="Enter Full Name"
                                    value={Profileform.values.fullName}
                                /> */}
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                {/* <FloatingInputLabel fieldName={`phoneNumber`} formikFrom={Profileform} labelText={`Enter Phone No.`} /> */}
                                <input
                                    type="text"
                                    class="form-control p-3"
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    placeholder="Enter Phone No."
                                    value={Profileform.values.phoneNumber}
                                />
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                {/* <FloatingInputLabel fieldName={`alternameNumber`} formikFrom={Profileform} labelText={`Alt. Phone No.`} /> */}
                                <input
                                    type="text"
                                    class="form-control p-3"
                                    id="alternameNumber"
                                    name="alternameNumber"
                                    placeholder="Alt. Phone No."
                                    value={Profileform.values.alternameNumber}
                                />
                            </div>
                            <div className="col-3 mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                {/* <FloatingInputLabel fieldName={`emailId`} formikFrom={Profileform} labelText={`Enter Email ID`} /> */}
                                <input
                                    type="text"
                                    class="form-control p-3"
                                    id="emailId"
                                    name="emailId"
                                    placeholder="Enter Email ID"
                                    value={Profileform.values.emailId}
                                />
                            </div>
                        </div>
                        <p className="color-blue font-600 mt-xl-5 mt-lg-4 mt-md-3 mt-sm-2 mt-1">Company Details</p>
                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                <input
                                    type="text"
                                    class="form-control p-3"
                                    id="companyName"
                                    name="companyName"
                                    placeholder="Enter Company Name"
                                    value={Profileform.values.companyName}
                                />
                                {/* <FloatingInputLabel fieldName={`companyName`} formikFrom={Profileform} labelText={`Enter Company Name`} /> */}
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                {/* <FloatingInputLabel fieldName={`officeEmailId`} formikFrom={Profileform} labelText={`Enter Company Mail ID`} /> */}
                                <input
                                    type="text"
                                    class="form-control p-3"
                                    id="officeEmailId"
                                    name="officeEmailId"
                                    placeholder="Enter Company Name"
                                    value={Profileform.values.officeEmailId}
                                />
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                <input
                                    type="text"
                                    class="form-control p-3"
                                    id="officePhoneNumber"
                                    name="officePhoneNumber"
                                    placeholder="Enter Official Phone No."
                                    value={Profileform.values.officePhoneNumber}
                                />
                                {/* <FloatingInputLabel fieldName={`officePhoneNumber`} formikFrom={Profileform} labelText={`Enter Official Phone No.`} /> */}
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                {/* <FloatingInputLabel fieldName={`altOfficePhoneNumber`} formikFrom={Profileform} labelText={`Alt. Official Phone No.`} /> */}
                                <input
                                    type="text"
                                    class="form-control p-3"
                                    id="altOfficePhoneNumber"
                                    name="altOfficePhoneNumber"
                                    placeholder="Alt. Official Phone No."
                                    value={Profileform.values.altOfficePhoneNumber}
                                />
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                {/* <FloatingInputLabel inputType={`textarea`} fieldName={`companyAddress`} formikFrom={Profileform} labelText={`Company Address`} /> */}
                                <input
                                    type="text"
                                    className="form-control p-3"
                                    id="companyAddress"
                                    name="companyAddress"
                                    placeholder="Enter Company Address"
                                    value={Profileform.values.companyAddress} />

                            </div>
                        </div>
                        <h5 className="font-600 mt-xl-5 mt-lg-4 mt-md-3 mt-sm-2 mt-1">Credentials</h5>

                        <div className="row">
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                <input
                                    type="text"
                                    className="form-control p-3"
                                    id="clientId"
                                    name="clientId"
                                    placeholder="Client ID"
                                    value={Profileform.values.clientId} />

                                {/* <FloatingInputLabel fieldName={`clientId`} formikFrom={Profileform} labelText={`Client ID`} /> */}
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                <input
                                    type="text"
                                    className="form-control p-3"
                                    id="clientSecret"
                                    name="clientSecret"
                                    placeholder="Client Secret"
                                    value={Profileform.values.clientSecret} />
                                {/* <FloatingInputLabel fieldName={`clientSecret`} formikFrom={Profileform} labelText={`Client Secret`} /> */}
                            </div>
                            <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12  mt-xl-3 mt-lg-2 mt-md-1 mt-sm-1 mt-1">
                                <button className="btn btn-outline-primary generate-token">Generate Token <i class="fa-solid fa-arrow-right"></i></button>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            <button className='btn btn-primary profilePageButton px-3'>Submit <i class="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </Form>
                </FormikProvider>


            </div>
        </>
    )
}

export default Profile
