import moment from "moment"
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { createUserSchema } from "../../Schema";
import { post_auth_data, post_data } from "../../ApiServices";
import { arrayIndex, convertToPayload, getTokenData, offsetPagination } from "../../Utils";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { confirm_swal_with_text, error_swal_toast, success_swal_toast } from "../../SwalServices";
import { PageLoaderBackdrop } from "../../Loader";
function UserList() {
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState({ pageloader: false })
    const [userList, setUserList] = useState([]);
    const handleClose = () => { setShow(false); categoryForm.resetForm(); };
    const handleShow = () => setShow(true);
    const UserForm = useFormik({
        initialValues: {
            fullName: "",
            mobileNo: "",
            emailId: "",
            userPassword: "",
            confirmPassword: "",
        },
        validationSchema: createUserSchema,
        onSubmit: (values) => {
            console.log("Form submitted:", values);
            createUser();
        },

    })

    const getUserList = (page = 1) => {
        let payload = {
            offSet: ((page - 1) * offsetPagination),
            limit: offsetPagination
        }
        setLoader({ ...loader, pageloader: true })
        post_auth_data("portal/private", convertToPayload('get-all-users', payload), {})
            .then((response) => {
                setLoader({ ...loader, pageloader: false })
                if (response.data.status) {
                    setUserList(response.data.data)
                } else {
                    error_swal_toast(response.data.message || "something went wrong");
                }
            }).catch((error) => {
                setLoader({ ...loader, pageloader: false })
                console.error("Error during signup:", error);
            })
    }

    const confirm_swal_call = (user) => {
        const callback = (resolve, reject) => {
            toggleStatus(user, resolve, reject)
        }
        confirm_swal_with_text(callback, `Are you sure <br/> you want to ${user.approved_status == 0 ? 'approve' : 'restrict'} user?`)
    }
    const toggleStatus = (user, resolve, reject) => {
        let payload = {
            "record_uuid": user.record_uuid,
            "approved_status": user.approved_status == 0 ? 1 : 0
        }
        post_data("portal/private", convertToPayload('approve-user', payload), { "jwt_token": getTokenData()?.jwt_token })
            .then((response) => {
                if (response.data.status) {
                    getUserList();
                    resolve();
                } else {
                    reject();
                    error_swal_toast(response.data.message || "something went wrong");
                }
            }).catch((error) => {
                reject();
                console.error("Error during signup:", error);
            })
    }
    const createUser = () => {
        let payload = {
            fullName: UserForm.values.fullName,
            mobileNo: UserForm.values.mobileNo,
            emailId: UserForm.values.emailId,
            userPassword: UserForm.values.userPassword,
        }
        post_data("portal/private", convertToPayload('add-user', payload), {})
            .then((response) => {
                if (response.data.status) {
                    success_swal_toast(response.data.message);
                    handleClose();
                    getUserList();
                } else {
                    error_swal_toast(response.data.message || "something went wrong");
                }
            }).catch((error) => {
                handleClose();
                error_swal_toast(error.message || "something went wrong");
                console.error("Error during signup:", error);
            })
    };

    useEffect(() => {
        getUserList();
    }, [])
    return (
        <div className="mx-2">
            <div className="d-flex justify-content-between my-2">
                <h1 className="">Users</h1>
                <button className="btn btn-primary py-1" onClick={handleShow}>Add User</button>
            </div>
            <table className="table table-bordered ">
                <thead>
                    <tr>
                        <th>Sr. No</th>
                        <th>Full Name</th>
                        <th>Email Id</th>
                        <th>Mobile Number</th>
                        <th>Approved Status</th>
                        <th>Created Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        userList.length > 0 && userList.map((user, index) => (
                            <tr key={arrayIndex('user', index)}>
                                <td>{user.sr_no || index + 1}</td>
                                <td>{user.fullname}</td>
                                <td>{user.emailid}</td>
                                <td>{user.mobileno}</td>
                                <td>{user.approved_status}</td>
                                <td>{moment().format('DD-MMM-yyyy')}</td>
                                <td>
                                    <div className="d-flex">
                                        <Form.Check // prettier-ignore
                                            type="switch"
                                            id="custom-switch"
                                            checked={user.approved_status == 1}
                                            onChange={() => { confirm_swal_call(user) }}
                                        />
                                        <button className="btn btn-primary btn-sm mx-2" title="Edit User">
                                            <i className="fa fa-pencil" ></i>
                                        </button>
                                        <button className="btn btn-danger btn-sm" title="Delete User">
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }

                </tbody>
            </table>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormikProvider value={UserForm}>
                        <Form className="login-form"  >
                            <div className="form-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input type="text" id="fullName" name="fullName" placeholder="Enter your full fullName"
                                    value={UserForm.values.fullName} onChange={UserForm.handleChange} onBlur={UserForm.handleBlur} />
                                <ErrorMessage name={`fullName`} component="small" className='text-danger' />
                            </div>

                            <div className="form-group">
                                <label htmlFor="emailId">Email Address</label>
                                <input
                                    type="text" id="emailId" name="emailId" placeholder="Enter your email"
                                    value={UserForm.values.emailId} onChange={UserForm.handleChange} onBlur={UserForm.handleBlur} />
                                <ErrorMessage name={`emailId`} component="small" className='text-danger' />
                            </div>

                            <div className="form-group">
                                <label htmlFor="mobileNo">Phone Number</label>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                    <span style={{ paddingRight: "5px" }}>+91</span>
                                    <input type="text" id="mobileNo" name="mobileNo" placeholder="Enter 10-digit number"
                                        value={UserForm.values.mobileNo} onChange={UserForm.handleChange} onBlur={UserForm.handleBlur} />
                                </div>
                                <ErrorMessage name={`mobileNo`} component="small" className='text-danger' />
                            </div>
                            <div className="form-group">
                                <label htmlFor="userPassword">Password</label>
                                <input type="password" id="userPassword" name="userPassword" placeholder="Enter your password"
                                    value={UserForm.values.userPassword} onChange={UserForm.handleChange} onBlur={UserForm.handleBlur} />
                                <ErrorMessage name={`userPassword`} component="small" className='text-danger' />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Enter your password"
                                    value={UserForm.values.confirmPassword} onChange={UserForm.handleChange} onBlur={UserForm.handleBlur} />
                                <ErrorMessage name={`confirmPassword`} component="small" className='text-danger' />
                            </div>
                        </Form>
                    </FormikProvider>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" type="button" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="button" onClick={UserForm.handleSubmit}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
            {loader.pageloader && <PageLoaderBackdrop />}
        </div>
    )
}

export default UserList
