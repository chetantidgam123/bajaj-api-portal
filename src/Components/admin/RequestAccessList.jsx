import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { confirm_swal_with_text, error_swal_toast, success_swal_toast } from "../../SwalServices";
import { post_auth_data, post_data } from "../../ApiServices";
import { PageLoaderBackdrop } from "../../Loader";
import { arrayIndex, convertToPayload, offsetPagination, sendEmail } from "../../Utils";
import { generateApiApprovalEmail } from "../../emailTemplate";
import PaginateComponent from "../common/Pagination";

function RequestAccessList() {
    const [reqAccList, setReqAccList] = useState([]);
    const [loadingButtons, setLoadingButtons] = useState({}); // per-button loading
    const [search, setSearch] = useState({ status: -1, input: '' });
    const [loader, setLoader] = useState({ pageloader: false })
    const [totalPages, setTotalPages] = useState(1)
    const [currentPage, setCurrentPage] = useState(1)

    // 🔹 Reject Swal
    const reject_swal_call = (user) => {
        Swal.fire({
            title: "Reject Access",
            text: "Are you sure you want to reject this request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Reject",
            cancelButtonText: "Cancel",
        }).then((result) => {
            if (result.isConfirmed) {
                toggleStatus(user, 2, user.client_id, user.client_secret);
            }
        });
    };
    const checkClientId = (user) => {
        
        toggleStatus(user, 1, user.client_id, user.client_secret);
    }

    const confirm_approve_swal_call = (user) => {
        const callback = (resolve, reject) => {
            checkClientId(user);
            resolve();
        }
        confirm_swal_with_text(callback, `Are you sure <br/> you want to approve this ${user.apiname} request?`)
    }

    const toggleStatus = async (user, status, client_id = "", client_secret = "") => {
        const request_id = user?.request_id || user?.id;
        if (!request_id) {
            return error_swal_toast("Request ID not found! Cannot process this request.");
        }

        // 🔹 Set loading for clicked button only
        setLoadingButtons(prev => ({
            ...prev,
            [request_id]: {
                approve: status === 1,
                reject: status === 2
            }
        }));

        const payload = {
            apiType: "toggle-api-access-request",
            requestPayload: {
                api_id: user?.api_id || "",
                client_id: client_id || "",
                client_secret: client_secret || "",
                user_id: user?.user_id?.toString() || "",
                status: status.toString(),
                request_id: request_id.toString(),
                "appInstanceId": applicationList.find(item => item.name == user.application_name)?.id || '00000000',
                "company_name": user.company_name || 'portal' + new Date().toString()
            },
            requestHeaders: {},
            uriParams: {},
            additionalParam: "",
        };
        try {
            const response = await post_auth_data("portal/private", payload, {});
            console.log(response,"109");
            if (response.data && (response.data.status === true || response.data.status === "true")) {
                console.log("response111",response.data.message)
                success_swal_toast(response?.data?.message || "Request processed successfully")
                setReqAccList(prev =>
                    prev.map(item =>
                        item.request_id === request_id
                            ? { ...item, approved_status: status }
                            : item
                    )
                );

                const userName = user.fullname
                const userEmail = user?.emailid || ""
                const userId = user.id
                console.log("userEmail:", user ,status );
                if (status === 1) {
                    // ✅ APPROVED
                    const subject = "Approval Granted for BAJAJ API Access";
                    const emailBody = generateApiApprovalEmail({
                        status: "Approved",
                        userName,
                        userId,
                        loginLink: "https://apidocs.bajajauto.com/",
                        apiName: user.apiname
                    });
                    await sendEmail({
                        body: emailBody,
                        toRecepients: [userEmail],
                        subject,
                        contentType: "text/html"
                    });
                } else if (status === 2) {
                    // ❌ REJECTED
                    const subject = "BAJAJ API Access Request Rejected";
                    const emailBody = generateApiApprovalEmail({
                        status: "Rejected",
                        userName,
                        userId,
                        apiName: user.apiname
                    })
                    await sendEmail({
                        body: emailBody,
                        toRecepients: [userEmail],
                        subject,
                        contentType: "text/html"
                    });
                }
                fetchRequestList();
            } else {
                error_swal_toast(response?.message || "Something went wrong");
            }
        } catch (error) {
            console.log("toggleStatus Error:", error);
            console.log("toggleStatus Error Response:", error?.response?.data);
            const errorMsg = error?.response?.data?.message || error?.message || "API call failed";
            error_swal_toast("Approve Error: " + errorMsg);
        } finally {
            // 🔹 Reset loading only for clicked button
            setLoadingButtons(prev => ({
                ...prev,
                [request_id]: { approve: false, reject: false }
            }));
        }
    };

    // 🔹 Fetch Request List
    const fetchRequestList = async (page = 1, filters = search) => {
        setCurrentPage(page)
        setLoader({ ...loader, pageloader: true });
        const payload = {
            apiType: "get-all-api-request",
            requestPayload: {
                application_name: filters.input,
                limit: "20",
                page: page.toString(),
                approved_status: filters.status,
            },
            requestHeaders: {},
            uriParams: {},
            additionalParam: "",
        };
        try {
            const response = await post_auth_data("portal/private", payload, {});
            setLoader({ ...loader, pageloader: false })
            if (response?.data?.status) {
                if (response.data.data && Array.isArray(response.data.data)) {
                    const dataWithReqId = response.data.data.map(item => ({
                    ...item,
                    request_id: item.request_id || item.id || ""
                }));
                setReqAccList(dataWithReqId);
                setTotalPages(Math.ceil(response.data.totalRecords / offsetPagination))
                } else {
                    success_swal_toast(response?.data?.message || "Request processed successfully");
                }
            } else {
                error_swal_toast(response?.data?.message || "Failed to fetch list");
            }
        } catch (error) {
            setLoader({ ...loader, pageloader: false })
            console.log("fetchRequestList Error:", error);
            console.log("fetchRequestList Error Response:", error?.response?.data);
            const errorMsg = error?.response?.data?.message || error?.message || "API call failed";
            error_swal_toast("Fetch Error: " + errorMsg);
        } finally {
            setLoader({ ...loader, pageloader: false })
        }
    };

    const refresh = () => {
        const resetSearch = { input: "", status: "-1" };
        setSearch(resetSearch)
        fetchRequestList(1, resetSearch);
    }
    const [applicationList, setApplicationList] = useState([]);
    const getApplicationList = () => {
        post_data("portal/public", convertToPayload('getPlatformApps', { "env_id": "f79233ef-d46b-4d66-83e4-e7b0c7b7c442" }), {})
            .then((response) => {
                console.log(response)
                setLoader({ ...loader, pageloader: false })
                let _a = response.data.instances || []
                _a = _a.map((app) => {
                    let obj = {
                        id: app.id,
                        name: app.assetId,
                    }
                    return obj
                })
                setApplicationList(_a)
            }).catch((error) => {
                setLoader({ ...loader, pageloader: false })
                setApplicationList([])
                error_swal_toast(error.message || error);
            })
    }

    useEffect(() => {
        fetchRequestList();
        getApplicationList()
    }, []);

    return (
        <div className="mx-2 card-admin-main">
            <div className="card-body card-bg">
                <div className="row justify-content-between align-items-center">
                    <div className="col-12">
                        <h4 className="">Request Access List</h4>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <label htmlFor="exampleInputEmail1">Filters</label>
                <div className="row align-items-center">
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-0">
                        <select className="form-select position-relative" id="application_name" name="application_name"
                            value={search.input}
                            onChange={(e) => { setSearch({ ...search, input: (e.target.value) }) }}>
                            <option value="">Select app</option>
                            {
                                applicationList.map((m, i) => (
                                    <option key={arrayIndex('application_name', i)} value={m.name}>{m.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-2">
                        <div className="form-group mt-2">
                            <select
                                className="form-control p-3"
                                name="status"
                                id="exampleFormControlSelect1"
                                value={search.status}
                                onChange={(e) => {
                                    const value = e.target.value === "" ? "" : Number(e.target.value);
                                    setSearch({ ...search, status: value })
                                }}
                            >
                                <option value="">Select Status</option>
                                <option value={0}>Pending</option>
                                <option value={1}>Approved</option>
                                <option value={2}>Rejected</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-1">
                        <button className="btn btn-primary profilePageButton px-3 search-btn" onClick={() => { fetchRequestList(1) }}>Search </button>
                        <button className="btn btn-outline-primary ms-2 profilePageButton px-3 search-btn" onClick={() => refresh()}><i className="fas fa-sync-alt"></i> </button>
                    </div>
                </div>
            </div>

            {/* {loadingList ? (
                <div className="text-center my-5">
                    <span className="spinner-border"></span> Loading...
                </div>
            ) : ( */}
            <div className="table-responsive mt-2">
                <table className="table table-bordered custom-table table-striped mt-3">
                    <thead className="text-truncate">
                        <tr>
                            <th>Sr. No</th>
                            <th>Username</th>
                            <th>Api Name</th>
                            <th>App Name</th>
                            <th>Client Id</th>
                            <th>Client Secret</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reqAccList.length > 0 && reqAccList.map((user, index) => (
                            <tr key={user.request_id || index}>
                                <td>{user.sr_no}</td>
                                <td>{user.fullname}</td>
                                <td>{user.apiname}</td>
                                <td>{user.application_name}</td>
                                <td>{user.client_id}</td>
                                <td>{user.client_secret}</td>
                                {/* <td>
                                        {user.approved_status === 0 ? "Pending" :
                                            user.approved_status === 1 ? "Approved" : "Rejected"}
                                    </td> */}
                                <td>
                                    {user.approved_status === 0 && (
                                        <div className="d-flex align-items-center">
                                            <i className="fa-solid fa-circle-exclamation text-warning me-2"></i>
                                            <span>Pending</span>
                                        </div>
                                    )}
                                    {user.approved_status === 1 && (
                                        <div className="d-flex align-items-center">
                                            <i className="fa-solid fa-circle-check text-success me-2"></i>
                                            <span>Approved</span>
                                        </div>
                                    )}
                                    {user.approved_status === 2 && (
                                        <div className="d-flex align-items-center">
                                            <i className="fas fa-times-circle text-danger me-2"></i>
                                            <span>Rejected</span>
                                        </div>
                                    )}
                                </td>
                                <td className="text-center">
                                    <div className="d-flex justify-content-center">
                                        <button
                                            className="btn btn-success btn-sm mx-2"
                                            title="Approve request"
                                            onClick={() => { confirm_approve_swal_call(user) }}
                                            disabled={loadingButtons[user.request_id]?.approve || user.approved_status === 1}
                                        >
                                            {loadingButtons[user.request_id]?.approve ? (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            ) : (
                                                <i className="fa fa-check"></i>
                                            )}
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            title="Reject request"
                                            onClick={() => reject_swal_call(user)}
                                            disabled={loadingButtons[user.request_id]?.reject || user.approved_status === 2}
                                        >
                                            {loadingButtons[user.request_id]?.reject ? (
                                                <span className="spinner-border spinner-border-sm"></span>
                                            ) : (
                                                <i className="fa fa-times"></i>
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                            // : (
                            //     <tr>
                            //         <td colSpan={6} className="text-center">No data found</td>
                            //     </tr>
                            // )
                        }
                    </tbody>
                </table>
                <PaginateComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => fetchRequestList(page)}
                />
            </div>
            {/* )} */}
            {loader.pageloader && <PageLoaderBackdrop />}
        </div>
    );
}

export default RequestAccessList;
