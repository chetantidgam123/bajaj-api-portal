function SuggestApi(){
    return(
 <div className="mx-2">
            <div className="d-flex justify-content-between my-2">
                <h1 className="">Suggested Api List</h1>
                
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
                    {/* {
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
                    } */}

                </tbody>
            </table>
            {/* <Modal show={show} onHide={handleClose}>
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
            </Modal> */}
            {/* {loader.pageloader && <PageLoaderBackdrop />} */}
        </div>
    )
}
export default SuggestApi