import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { error_swal_toast } from "../../SwalServices";
import { post_auth_data } from "../../ApiServices";

function RequestAccessList() {
    const [reqAccList, setReqAccList] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [loadingButtons, setLoadingButtons] = useState({}); // per-button loading

    // 🔹 Approve Swal
    const approve_swal_call = (user) => {
        Swal.fire({
            title: "Approve Access",
            html: `
                <input type="text" id="client_id" class="swal2-input" placeholder="Enter Client ID" />
                <input type="text" id="client_secret" class="swal2-input" placeholder="Enter Client Secret" />
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
                toggleStatus(user, 2);
            }
        });
    };

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
                client_id: status === 1 ? client_id : undefined,
                client_secret: status === 1 ? client_secret : undefined,
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
                Swal.fire(
                    "Success",
                    `User ${status === 1 ? "approved" : "rejected"} successfully ✅`,
                    "success"
                );

                setReqAccList(prevList =>
                    prevList.map(u =>
                        (u.request_id || u.id) === request_id ? { ...u, approved_status: status } : u
                    )
                );
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
    const fetchRequestList = async (page = 1) => {
        const payload = {
            apiType: "get-all-api-request",
            requestPayload: { application_name: "", limit: "20", page: page.toString() },
            requestHeaders: {},
            uriParams: {},
            additionalParam: "",
        };

        try {
            setLoadingList(true);
            const response = await post_auth_data("portal/private", payload, {});
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
            error_swal_toast(error.message || "API call failed");
        } finally {
            setLoadingList(false);
        }
    };

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

            {loadingList ? (
                <div className="text-center my-5">
                    <span className="spinner-border"></span> Loading...
                </div>
            ) : (
                 <div className="table-responsive mt-2">
                <table className="table table-bordered custom-table table-striped mt-3">
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
                        {reqAccList.length > 0 ? reqAccList.map((user, index) => (
                            <tr key={user.request_id || index}>
                                <td>{index + 1}</td>
                                <td>{user.fullname}</td>
                                <td>{user.apiname}</td>
                                <td>{user.application_name}</td>
                                <td>
                                    {user.approved_status === 0 ? "Pending" :
                                     user.approved_status === 1 ? "Approved" : "Rejected"}
                                </td>
                                <td>
                                    <div className="d-flex">
                                        <button
                                            className="btn btn-success btn-sm mx-2"
                                            title="Approve User"
                                            onClick={() => approve_swal_call(user)}
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
                                            title="Reject User"
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
                        )) : (
                            <tr>
                                <td colSpan={6} className="text-center">No data found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                </div>
            )}
        </div>
    );
}

export default RequestAccessList;
