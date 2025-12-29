import { useEffect, useState } from "react";
import { error_swal_toast } from "../../../SwalServices";
import { post_auth_data } from "../../../ApiServices";
import { arrayIndex, convertToPayload } from "../../../Utils";

import { PageLoaderBackdrop } from "../../../Loader";

function SuggestApi() {
  const [getintouchList, setgetintouchList] = useState([]);
  const [loader, setLoader] = useState({ pageloader: false });

  const getFAQList = (page = 1) => {
    let payload = {
      limit: String(20),
      page: String(page),
      category_name: "test",
    };
    setLoader({ ...loader, pageloader: true });
    post_auth_data("portal/private", convertToPayload("get-faq-list-admin", payload), {})
      .then((resp) => {
        setLoader({ ...loader, pageloader: false });
        if (resp.data.status) {
          setgetintouchList(resp.data.data);
        } else {
          error_swal_toast(resp.data.message || "something went wrong");
        }
      })
      .catch((err) => {
        setLoader({ ...loader, pageloader: false });
        console.error("Error during signup:", err);
      });
  };

  return (
         <div className="mx-2 card-admin-main">
      <div className="card-body card-bg">
        <div className="row justify-content-between align-items-center">
          <div className="col-12">
            <h4 className="">Suggested Api List</h4>
          </div>
        </div>
      </div>
      {loader.pageloader && <PageLoaderBackdrop />}
    <div className="table-responsive mt-2">
        <table className="table table-bordered custom-table table-striped mt-3">
        <thead className="text-truncate">
            <tr>
              <th>Sr. No</th>
              <th>Full Name</th>
              <th>Email Id</th>
              <th>Mobile Number</th>
              <th>Company Name</th>
              <th>Question</th>
              <th>Answer</th>
              <th>Action</th>
            </tr>
        </thead>
        <tbody>
          {getintouchList.length > 0 ? (
            getintouchList.map((userl, index) => (
              <tr key={arrayIndex("user", index)}>
                <td>{userl.sr_no || index + 1}</td>
                <td>{userl.fullname}</td>
                <td>{userl.emailid}</td>
                <td>{userl.mobileno}</td>
                <td>{userl.companyname}</td>
                <td>{userl.que}</td>
                <td>{userl.ans}</td>

                {/* <td>
                  <div className="d-flex">
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
                    <button
                      className="btn btn-danger btn-sm"
                      title="Delete User"
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </td> */}
                <td>Write Answer</td>
              </tr>
            ))
          ) : (
            <td colSpan={7} className="text-center">
              No data found
            </td>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}
export default SuggestApi;