import { useEffect, useState } from "react"
import { PageLoaderBackdrop } from "../../../Loader"
import { error_swal_toast } from "../../../SwalServices"
import { arrayIndex, offsetPagination } from "../../../Utils"
import { post_auth_data } from "../../../ApiServices"
import PaginateComponent from "../../common/Pagination"

function SuggestApi(){
    const[suggApiList, setSuggApiList]= useState([])
    const [loader, setLoader] = useState({ pageloader: false })
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");

    const contactList = async (page = 1, searchText = search) => {
        setCurrentPage(page);
        setLoader({ ...loader, pageloader: true })
        const payload = {
            apiType: "get-all-contact-us",
            requestPayload: {
                search_text: searchText,
                limit: offsetPagination.toString(),
                page: page.toString(),
            },
            requestHeaders: {},
            uriParams: {},
            additionalParam: "",
        };
        try {
            // setLoadingList(true);
            const response = await post_auth_data("portal/private", payload, {});
            if (response.data.status) {
                setLoader({ ...loader, pageloader: false })
                setSuggApiList(response.data.data)
                setTotalPages(Math.ceil(response.data.totalRecords / offsetPagination))
            } else {
                setLoader({ ...loader, pageloader: false })
                setSuggApiList([])
                error_swal_toast(response.data.message || "Failed to fetch list");
            }
        } catch (error) {
            setLoader({ ...loader, pageloader: false })
            error_swal_toast(error.message || "API call failed");
        } finally {
           setLoader(false);
        }
    };

    const refresh = () => {
        const resetSearch = "";
        setSearch(resetSearch)
        contactList(1, resetSearch);
    }

    useEffect(() => {
        contactList();
    }, [])

    return(
 <div className="mx-2 card-admin-main">
    <div className="card-body card-bg">
        <div className="d-flex justify-content-between my-2">
            <h4 className="">Suggested Api List</h4>   
        </div>
    </div>
         <div className="mt-4">
                <label className="form-label fw-semibold" htmlFor="exampleInputEmail1">Filters</label>
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-0">
                    <div className="flex-grow-1" style={{ maxWidth: "400px" }}>
                         <input type="text" name="search" className="form-control p-3" id="exampleInputEmail1"
                            placeholder="Enter Name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value.trim())}
                        />
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-3">
                        <button className="btn btn-primary profilePageButton px-4" onClick={() => { contactList(1) }}>Search </button>
                        <button className="btn btn-outline-primary profilePageButton px-4" onClick={() => refresh()}><i className="fas fa-sync-alt"></i> </button>
                    </div>
                </div>
            </div>
           <div className="table-responsive">
            <table className="table table-bordered custom-table table-striped mt-3 ">
                <thead className="text-truncate">
                    <tr>
                        <th>Sr. No</th>
                        <th>Full Name</th>
                        <th>Email Id</th>
                        <th>Mobile Number</th>
                        <th>Description</th>
                        {/* <th>Action</th> */}
                    </tr>
                </thead>
                <tbody>
                    {
                       suggApiList && suggApiList.length > 0 ?( suggApiList.map((user, index) => (
                            <tr key={arrayIndex('user', index)}>
                                <td>{user.sr_no || index + 1}</td>
                                <td>{user.fullname}</td>
                                <td>{user.emailid}</td>
                                <td>{user.mobileno}</td>
                                <td>{user.description}</td>
                                {/* <td>{user.approved_status}</td>
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
                                </td> */}
                            </tr>
                        ))):(<td colSpan={6} className="text-center">No data found</td>)
                    }

                </tbody>
            </table>
            
            <PaginateComponent 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => contactList(page)}
            />
            {loader.pageloader && <PageLoaderBackdrop />}
            </div>
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