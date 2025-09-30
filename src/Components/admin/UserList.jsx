import moment from "moment"
import { useEffect, useState } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import { createUserSchema } from "../../Schema";
import { post_auth_data, post_data } from "../../ApiServices";
import { arrayIndex, convertToPayload, getTokenData, offsetPagination } from "../../Utils";
import { ErrorMessage, FormikProvider, useFormik } from "formik";
import { confirm_swal_with_text, error_swal_toast, success_swal_toast } from "../../SwalServices";
import { PageLoaderBackdrop } from "../../Loader";
import PaginateComponent from "../common/Pagination";
import { Link } from "react-router-dom";

function UserList() {
    const [show, setShow] = useState(false);
    const [loader, setLoader] = useState({ pageloader: false })
    const [userList, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, SetSearch] = useState({ status: '', input: '' });
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

    const getUserList = (page = 1, filters = search) => {
        setCurrentPage(page);
        setLoader({ ...loader, pageloader: true });
        let payload = {
            page: page,
            limit: offsetPagination,
            emailOrMobile: filters.input,
            status: filters.status,
        }
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

    const refresh = () => {
        const resetSearch = { input: "", status: "" };
        SetSearch(resetSearch)
        getUserList(1, resetSearch);
    }

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
                    <div className="col-2 d-flex justify-content-end d-none">
                        <button className="btn btn-primary px-3 py-2" onClick={handleShow}>
                            Add User</button>
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <label for="exampleInputEmail1">Filters</label>
                <div className="row align-items-center">
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div class="form-group mt-2">
                            <input type="email" name="email" class="form-control p-3" id="exampleInputEmail1"
                                aria-describedby="emailHelp" placeholder="Enter email/Phone Number"
                                onChange={(e) => { SetSearch({ ...search, input: (e.target.value).trim() }) }} />
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div class="form-group mt-2">
                            <select 
                                class="form-control p-3" 
                                name="status" 
                                id="exampleFormControlSelect1"
                                value={search.status}
                                onChange={(e) => {
                                    // SetSearch({ ...search, status: e.target.value }) }
                                    const value = e.target.value === "" ? "" : Number(e.target.value);
                                    SetSearch({ ...search, status: value })
                                }}
                            >
                                <option value="" disabled hidden>Select Status</option>
                                <option value={0}>Pending</option>
                                <option value={1}>Approved</option>
                                <option value={2}>Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12">
                        <button className="btn btn-primary profilePageButton px-3 search-btn" onClick={() => { getUserList(1) }}>Search </button>
                        <button className="btn btn-outline-primary ms-2 profilePageButton px-3 search-btn" onClick={() => refresh()}><i class="fas fa-sync-alt"></i> </button>
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
                            <th> Status</th>
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
                                    <td>
                                        {user.approved_status == 0 && <span><i class="fa-solid fa-circle-exclamation text-warning"></i> Pending</span>}
                                        {user.approved_status == 1 && <span><i class="fa-solid fa-circle-check text-success"></i>  Approved</span>}
                                        {user.approved_status == 2 && <span><i class="fas fa-times-circle text-danger"></i> Rejected</span>}
                                    </td>
                                    <td>{moment(user.createddate).format("DD-MMM-yyyy")}</td>
                                    <td>
                                        <div className="d-flex justify-content-center">
                                            <div className="dropdown">
                                                {/* <Dropdown className="drop" >
                                                    <Dropdown.Toggle as="button" variant="link" id="dropdown-basic" bsPrefix="p-0 border-0 bg-transparent">
                                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu className="with-action">
                                                        <Dropdown.Item href="#" onClick={() => { confirm_swal_call(user) }}><i class="fa-regular fa-thumbs-up"></i> {user.approved_status == 1 ? 'Reject' : 'Approve'} User</Dropdown.Item>
                                                        <Dropdown.Item href="#"><i class="fa-solid fa-pen"></i> Edit User</Dropdown.Item>
                                                        <Dropdown.Item href="#"><i class="fa-solid fa-trash"></i> Delete User</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown> */}
                                                <Dropdown
                                                    align="end"
                                                    popperConfig={{
                                                        strategy: 'fixed',
                                                        modifiers: [
                                                        { name: 'flip', options: { fallbackPlacements: ['top', 'bottom'] } },
                                                        { name: 'arrow', options: { element: '[data-popper-arrow]' } }
                                                        ]
                                                    }}
                                                    >
                                                    <Dropdown.Toggle
                                                        as="button"
                                                        variant="link"
                                                        bsPrefix="p-0 border-0 bg-transparent"
                                                        id="dropdown-basic"
                                                    >
                                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu className="dropdown-menu-end">
                                                        {/* Bootstrap’s built-in Popper arrow */}
                                                        <div data-popper-arrow className="dropdown-arrow"></div>
                                                        <Dropdown.Item onClick={() => confirm_swal_call(user)}>
                                                            <i className="fa-regular fa-thumbs-up"></i>{" "}
                                                            {user.approved_status === 1 ? "Reject" : "Approve"} User
                                                        </Dropdown.Item>
                                                        {/* <Dropdown.Item><i className="fa-solid fa-pen"></i> Edit User</Dropdown.Item> */}
                                                        <Dropdown.Item><i className="fa-solid fa-trash"></i> Delete User</Dropdown.Item>
                                                        <Dropdown.Item as={Link} to={`/master/user-list/details/${user.id}`} state={{ userData: user }}><i class="fa-solid fa-eye"></i> View Details</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
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
                <PaginateComponent 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => getUserList(page)}
                />
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
