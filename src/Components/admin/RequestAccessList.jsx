import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { post_auth_data } from "../../ApiServices";
import { PageLoaderBackdrop } from "../../Loader";
import { sendEmail } from "../../Utils";
import { generateApiApprovalEmail } from "../../emailTemplate";

function RequestAccessList() {
    const [reqAccList, setReqAccList] = useState([]);
    // const [loadingList, setLoadingList] = useState(false);
    const [loadingButtons, setLoadingButtons] = useState({}); // per-button loading
    const [search, SetSearch] = useState({ status: '', input: '' });
    const [loader, setLoader] = useState({ pageloader: false })
    // 🔹 Approve Swal
    const approve_swal_call = (user) => {
        Swal.fire({
            title: "Approve Access",
            html: `
                <input type="text" id="client_id" className="swal2-input" placeholder="Enter Client ID" />
                <input type="text" id="client_secret" className="swal2-input" placeholder="Enter Client Secret" />
            `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Approve",
            cancelButtonText: "Cancel",
            preConfirm: () => {
                const client_id = document.getElementById("client_id")?.value;
                const client_secret = document.getElementById("client_secret")?.value;
                if (!client_id || !client_secret) {
                    Swal.showValidationMessage("Both Client ID and Secret ID are required");
                    return false;
                }
                return { client_id, client_secret };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                toggleStatus(user, 1, result.value.client_id, result.value.client_secret);
            }
        });
    };

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
        if (user?.client_credentials_id > 0) {
            toggleStatus(user, 1, user.client_id, user.client_secret);
        } else {
            approve_swal_call(user)
        }
    }

    // 🔹 Toggle Status API
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
            },
            requestHeaders: {},
            uriParams: {},
            additionalParam: "",
        };

        try {
            const response = await post_auth_data("portal/private", payload, {});
            if (response.data.status) {
                console.log("inside status condition true or false 1")
                success_swal_toast(response.data.message)
                const subject= "Login Approval Granted for BAJAJ API Access"
                const userName = user.fullname
                const userEmail = "sagarmeshram532@gmail.com"
                const userId = user.id
                console.log("inside status condition true or false 2")
                const emailBody = generateApiApprovalEmail({
                    userName, userId,
                    loginLink: "https://apidocs.bajajauto.com/"
                })
                console.log("inside status condition true or false 3")
                await sendEmail({ body: emailBody, toRecepients: [userEmail], subject: subject, contentType: 'text/html' })
                fetchRequestList();
            } else {
                error_swal_toast(response.data.message || "Something went wrong");
            }
        } catch (error) {
            error_swal_toast(error.message || "API call failed");
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
        setLoader({ ...loader, pageloader: true });
        const payload = {
            apiType: "get-all-api-request",
            requestPayload: { application_name: "", limit: "20", page: page.toString(), status: filters.status, searchtxt: filters.input },
            requestHeaders: {},
            uriParams: {},
            additionalParam: "",
        };
        try {
            // setLoadingList(true);
            const response = await post_auth_data("portal/private", payload, {});
            setLoader({ ...loader, pageloader: false })
            if (response.data.status) {
                const dataWithReqId = response.data.data.map(item => ({
                    ...item,
                    request_id: item.request_id || item.id || ""
                }));
                setReqAccList(dataWithReqId);
            } else {
                error_swal_toast(response.data.message || "Failed to fetch list");
            }
        } catch (error) {
            setLoader({ ...loader, pageloader: false })
            error_swal_toast(error.message || "API call failed");
        } finally {
            setLoader({ ...loader, pageloader: false })
            // setLoadingList(false);
        }
    };

    const refresh = () => {
        const resetSearch = { input: "", status: "" };
        SetSearch(resetSearch)
        fetchRequestList(1, resetSearch);
    }

    useEffect(() => {
        fetchRequestList();
    }, []);

    return (
        <div className="mx-2 card-admin-main">
            <div className="card-body card-bg">
                <div className="row justify-content-between align-items-center">
                    <div className="col-4">
                        <h4 className="">Request Access List</h4>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <label for="exampleInputEmail1">Filters</label>
                <div className="row align-items-center">
                    <div className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                        <div class="form-group mt-2">
                            <input type="email" name="email" class="form-control p-3" id="exampleInputEmail1"
                                aria-describedby="emailHelp" placeholder="Search" value={search.input}
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
                        <button className="btn btn-primary profilePageButton px-3 search-btn" onClick={() => { fetchRequestList(1) }}>Search </button>
                        <button className="btn btn-outline-primary ms-2 profilePageButton px-3 search-btn" onClick={() => refresh()}><i class="fas fa-sync-alt"></i> </button>
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
                        <thead>
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
                                    <td>{index + 1}</td>
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
                                                onClick={() => { checkClientId(user) }}
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
                </div>
            {/* )} */}
            {loader.pageloader && <PageLoaderBackdrop />}
        </div>
    );
}

export default RequestAccessList;
