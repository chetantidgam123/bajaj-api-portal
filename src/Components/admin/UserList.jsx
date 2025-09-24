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
        <div className="mx-2 card-admin-main">
            <div className="card-body card-bg">
                <div className="row justify-content-between">
                    <div className="col-3">
                        <h4 className="mb-2">Users</h4>
                    </div>
                    <div className="col-2 d-flex justify-content-end">
                        <button className="btn btn-primary px-3 py-2" onClick={handleShow}>
                            Add User</button>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <div className="row">
                     <label for="exampleInputEmail1">Filters</label>
                      <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                          <div class="form-group mt-2">
                            <input type="email" class="form-control p-3" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email/Phone Number" />
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                          <div class="form-group mt-2">
                          <select class="form-control p-3" id="exampleFormControlSelect1">
                            <option>Status</option>
                            <option>2</option>
                            <option>3</option>
                            <option>4</option>
                            <option>5</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
           <div className="table-responsive mt-4">
  <table className="table table-bordered custom-table table-striped">
    <thead>
      <tr>
        <th>Sr. No</th>
        <th>Full Name</th>
        <th>Email Id</th>
        <th>Mobile Number</th>
        <th>Approved Status</th>
        <th>dummy</th>
        <th>Created Date</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {userList.length > 0 &&
        userList.map((user, index) => (
          <tr key={index}>
            <td>{user.sr_no || index + 1}</td>
            <td>{user.fullname}</td>
            <td>{user.emailid}</td>
            <td>{user.mobileno}</td>
            <td><i class="fa-solid fa-circle-exclamation text-warning"></i> Pending{user.approved_status}</td>
            <td><i class="fa-solid fa-circle-check text-success"></i> Approved{user.approved_status}</td>
            <td>{moment().format("DD-MMM-yyyy")}</td>
            <td>
                <div className="d-flex justify-content-center">
                     <div className="dropdown">
            <button
                className="btn btn-secondary "
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <i className="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><a className="dropdown-item" href="#">Action</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
            </ul>
            </div>
                </div>
               


              {/* <div className="d-flex">
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  checked={user.approved_status == 1}
                  onChange={() => {
                    confirm_swal_call(user);
                  }}
                /> 
                <button
                  className="btn btn-primary btn-sm mx-2"
                  title="Edit User"
                >
                  <i className="fa fa-pencil"></i>
                </button>
                <button className="btn btn-danger btn-sm" title="Delete User">
                  <i className="fa fa-trash"></i>
                </button>
              </div>*/}
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>

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
