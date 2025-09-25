import { useEffect, useState } from "react";
import { error_swal_toast } from "../../../SwalServices";
import { post_auth_data } from "../../../ApiServices";
import { arrayIndex, convertToPayload } from "../../../Utils";
import moment from "moment";
import { Form } from "react-bootstrap";
import { PageLoaderBackdrop } from "../../../Loader";

function GetinTouch() {
  const [getintouchList, setgetintouchList] = useState([]);
  const [loader, setLoader] = useState({ pageloader: false });

  const getFAQList = (page = 1) => {
    let payload = {
      limit: String(20),
      page: String(page),
      category_name: "test",
    };
    setLoader({ ...loader, pageloader: true });
    post_auth_data(
      "portal/private",
      convertToPayload("get-faq-list-admin", payload),
      {}
    )
      .then((response) => {
        setLoader({ ...loader, pageloader: false });
        if (response.data.status) {
          setgetintouchList(response.data.data);
        } else {
          error_swal_toast(response.data.message || "something went wrong");
        }
      })
      .catch((error) => {
        setLoader({ ...loader, pageloader: false });
        console.error("Error during signup:", error);
      });
  };

  useEffect(() => {
    getFAQList();
  }, []);

  return (
    <div className="mx-2">
      <div className="d-flex justify-content-between my-2">
        <h1 className="">Get in Touch List</h1>
      </div>
      {loader.pageloader && <PageLoaderBackdrop />}
      <table className="table table-bordered ">
        <thead>
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
            getintouchList.map((user, index) => (
              <tr key={arrayIndex("user", index)}>
                <td>{user.sr_no || index + 1}</td>
                <td>{user.fullname}</td>
                <td>{user.emailid}</td>
                <td>{user.mobileno}</td>
                <td>{user.companyname}</td>
                <td>{user.que}</td>
                <td>{user.ans}</td>

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
  );
}
export default GetinTouch;
