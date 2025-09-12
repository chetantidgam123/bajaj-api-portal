import { useState } from "react"
import { confirm_swal_with_text } from "../../SwalServices";

function RequestAccessList(){
    const[reqAccList, setReqAccList]= useState([]);
    
        const confirm_swal_call = (user, status) => {
            const callback = (resolve, reject) => {
                toggleStatus(user,status, resolve, reject)
            }
            confirm_swal_with_text(callback, `Are you sure <br/> you want to ${status == 'approve' ? 'approve' : 'reject'} Access?`)
        }
        const toggleStatus = (user,status, resolve, reject) => {
            // let payload = {
            //     "record_uuid": user.record_uuid,
            //     "approved_status": user.approved_status == 0 ? 1 : 0
            // }
            // post_data("portal/private", convertToPayload('approve-user', payload), { "jwt_token": getTokenData()?.jwt_token })
            //     .then((response) => {
            //         if (response.data.status) {
            //             getUserList();
            //             resolve();
            //         } else {
            //             reject();
            //             error_swal_toast(response.data.message || "something went wrong");
            //         }
            //     }).catch((error) => {
            //         reject();
            //         console.error("Error during signup:", error);
            //     })
            console.log("Approved or Rejected", status, user)
            resolve();
        }
    return(
 <div className="mx-2">
            <div className="d-flex justify-content-between my-2">
                <h1 className="">Request Access List</h1>
                
            </div>
            <table className="table table-bordered ">
                <thead>
                    <tr>
                        <th>Sr. No</th>
                        <th>Username</th>
                        <th>Api Name</th>
                        <th>App Name</th>
                        
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {
                        reqAccList.length > 0 ?( reqAccList.map((user, index) => (
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
                        ))):(<td colSpan={6} className="text-center">No data found</td>)
                    } */}
                    <tr>
                        <td>1</td>
                        <td>Ramesh Deshmukh</td>
                        <td>Generate Token</td>
                        <td>ABC App</td>
                         <td> </td>
                           <td> 
                            <div className='d-flex'>
                                <button className="btn btn-primary btn-sm mx-2" title="Approve Request" onClick={()=>confirm_swal_call('Ramesh','approve')}><i className="fa fa-check"></i></button>
                                <button className="btn btn-danger btn-sm" title="Reject Request" onClick={()=>confirm_swal_call('Ramesh','reject')}><i className="fa fa-xmark"></i></button>

                            </div>
                           </td>
                    </tr>

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
export default RequestAccessList