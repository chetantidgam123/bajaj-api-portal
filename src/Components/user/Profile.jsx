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
        <div className="card">
            <div className="card-body">
                <div className="row">
                    <div className="col-6 p-3 d-flex">
                        <img className="profileImage" src="/assets/img/userImage.png" />
                        <div className="d-flex flex-column justify-content-center ms-3">
                            <h5 className="profileHeaders">{fullName}</h5>
                            <span className="">{emailId}</span>
                        </div>
                    </div>
                    <div className="col-6 d-flex justify-content-end align-items-center">
                        <input type="file" className="d-none" id="profileImageInput" onChange={(e) => uploadProfileImage(e.target.files[0])} />
                        <label htmlFor="profileImageInput" className="btn btn-primary profilePageButton float-end me-2">
                            <i className="fa fa-upload"></i> Upload New Photo
                        </label>

                    </div>
                </div>
            </div>
            <div className="card-body">
                <FormikProvider value={Profileform}>
                    <Form className="w-100 d-flex flex-column">
                        <h5 className="profileHeaders mt-3">Personal Details</h5>
                        <hr className="profileHRTag" />
                        <div className="row">
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`fullName`} formikFrom={Profileform} labelText={`Enter Full Name`} />
                            </div>
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`phoneNumber`} formikFrom={Profileform} labelText={`Enter Phone No.`} />
                            </div>
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`alternameNumber`} formikFrom={Profileform} labelText={`Alt. Phone No.`} />
                            </div>
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`emailId`} formikFrom={Profileform} labelText={`Enter Email ID`} />
                            </div>
                        </div>
                        <h5 className="profileHeaders mt-3">Company Details</h5>
                        <hr className="profileHRTag" />
                        <div className="row">
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`companyName`} formikFrom={Profileform} labelText={`Enter Company Name`} />
                            </div>
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`officeEmailId`} formikFrom={Profileform} labelText={`Enter Company Mail ID`} />
                            </div>
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`officePhoneNumber`} formikFrom={Profileform} labelText={`Enter Official Phone No.`} />
                            </div>
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`altOfficePhoneNumber`} formikFrom={Profileform} labelText={`Alt. Official Phone No.`} />
                            </div>
                            <div className="col-4">
                                <FloatingInputLabel inputType={`textarea`} fieldName={`companyAddress`} formikFrom={Profileform} labelText={`Company Address`} />
                            </div>
                        </div>
                        <h5 className="profileHeaders mt-3">Credentials</h5>
                        <hr className="profileHRTag" />
                        <div className="row">
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`clientId`} formikFrom={Profileform} labelText={`Client ID`} />
                            </div>
                            <div className="col-3">
                                <FloatingInputLabel fieldName={`clientSecret`} formikFrom={Profileform} labelText={`Client Secret`} />
                            </div>
                            <div className="col-3">
                                <button className="btn btn-outline-primary profilePageButton">Generate</button>
                            </div>
                        </div>
                    </Form>
                </FormikProvider>
                <button className='btn btn-primary profilePageButton float-end'>Submit</button>
        </div>
        </div>
       </>
    )
}

export default Profile
