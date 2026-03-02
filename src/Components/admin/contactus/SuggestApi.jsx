import { useEffect, useState } from "react";
import { error_swal_toast } from "../../../SwalServices";
import { post_auth_data } from "../../../ApiServices";
import { arrayIndex, convertToPayload, offsetPagination } from "../../../Utils";

import { PageLoaderBackdrop } from "../../../Loader";
import PaginateComponent from "../../common/Pagination";

function SuggestApi() {
  const LIMIT = 20;
  const [getSuggestList, setGetSuggestList] = useState([]);
  const [loader, setLoader] = useState({ pageloader: false });
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getSuggestedAPI = (page = 1, search = "") => {
    setLoader({ ...loader, pageloader: true });
    const payload = convertToPayload("get-all-suggest-api", {
      search_text: search,
      limit: offsetPagination.toString(),
      page: page.toString(),
    });
    post_auth_data("portal/private", payload, {})
      .then((resp) => {
        setLoader({ ...loader, pageloader: false });
        if (resp?.data?.status) {
          const data = resp.data.data || [];
          const totalRecords = resp.data.totalRecords || 0;
          setGetSuggestList(data);
          setCurrentPage(page);
          setTotalPages(Math.ceil(totalRecords / LIMIT));
        } else {
          error_swal_toast(resp.data.message || "something went wrong");
        }
      })
      .catch((err) => {
        setLoader({ ...loader, pageloader: false });
        console.error("Error during signup:", err);
      });
  };

  const refresh = () => {
    setSearchText("");
    setCurrentPage(1);
    getSuggestedAPI(1, "");
  };
  useEffect(() => {
    getSuggestedAPI(1, "");
  }, []);

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

      <div className="mt-4">
        <label className="form-label fw-semibold" htmlFor="exampleInputEmail1">
          Filters
        </label>
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-0">
          <div className="flex-grow-1" style={{ maxWidth: "400px" }}>
            <input
              type="text"
              name="search"
              className="form-control p-3"
              id="exampleInputEmail1"
              placeholder="Enter Text"
              value={searchText}
              onChange={(e) => {
                const value = e.target.value;
                setSearchText(value);
                // getSuggestedAPI(1, value);
              }}
            />
          </div>
          <div className="d-flex align-items-center gap-2 mt-3">
            <button
              className="btn btn-primary profilePageButton px-4"
              onClick={() => getSuggestedAPI(1, searchText)}
            >
              Search{" "}
            </button>
            <button
              className="btn btn-outline-primary profilePageButton px-4"
              onClick={() => refresh()}
            >
              <i className="fas fa-sync-alt"></i>{" "}
            </button>
          </div>
        </div>
      </div>

      <div className="table-responsive mt-2">
        <table className="table table-bordered custom-table table-striped mt-3">
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
            {getSuggestList.length > 0 ? (
              getSuggestList.map((userl, index) => (
                <tr key={arrayIndex("user", index)}>
                  <td>{userl.sr_no || index + 1}</td>
                  <td>{userl.fullname}</td>
                  <td>{userl.emailid}</td>
                  <td>{userl.mobileno}</td>
                  <td>{userl.description}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <PaginateComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => getSuggestList(page, search)}
        />
      </div>
    </div>
  );
}
export default SuggestApi;
