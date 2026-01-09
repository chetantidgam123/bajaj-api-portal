import { useEffect, useState } from "react"
import { PageLoaderBackdrop } from "../../../Loader"
import { error_swal_toast } from "../../../SwalServices"
import { arrayIndex, offsetPagination } from "../../../Utils"
import { post_auth_data } from "../../../ApiServices"
import PaginateComponent from "../../common/Pagination"

function GetinTouch(){
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
            <h4 className="">Get in Touch List</h4>
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
                            </tr>
                        ))):(<tr><td colSpan={6} className="text-center">No data found</td></tr>)
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
        </div>
    )
}
export default GetinTouch 