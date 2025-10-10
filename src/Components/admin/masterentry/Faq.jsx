import { useEffect, useState } from "react";
import { arrayIndex, convertToPayload } from "../../../Utils";
import { post_auth_data } from "../../../ApiServices";
import { error_swal_toast, success_swal_toast } from "../../../SwalServices";
import { PageLoaderBackdrop } from "../../../Loader";
import { Modal, Button, Form } from "react-bootstrap";
import PaginateComponent from "../../common/Pagination";

function Faq() {
  const [getintouchList, setgetintouchList] = useState([]);
  const [loader, setLoader] = useState({ pageloader: false });
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [answer, setAnswer] = useState("");
  const [showModal, setShowModal] = useState(false);

  // 🔹 Category filter state
  const [category, setCategory] = useState("General");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ["General", "Service", "Sales", "O Auth"];

  const getFAQList = (page = 1, selectedCategory = category) => {
    let payload = {
      limit: String(20),
      page: String(page),
      category_name: selectedCategory,
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
        console.error("Error during fetching FAQs:", error);
      });
  };

  const handleOpenModal = (faq) => {
    setSelectedFaq(faq);
    setAnswer(faq.ans || "");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedFaq(null);
    setAnswer("");
    setShowModal(false);
  };

  const handleSubmitAnswer = () => {
    if (!answer.trim()) {
      error_swal_toast("Answer cannot be empty!");
      return;
    }

    const payload = {
      ans: answer,
      faq_id: selectedFaq?.record_uuid,
    };

    setLoader({ ...loader, pageloader: true });
    post_auth_data(
      "portal/private",
      convertToPayload("update-faq", payload),
      {}
    )
      .then((res) => {
        setLoader({ ...loader, pageloader: false });
        if (res.data.status) {
          getFAQList(1, category); // reload with filter applied
          setAnswer("");
          setSelectedFaq(null);
          handleCloseModal();
          success_swal_toast(res.data.message);
        } else {
          error_swal_toast(res.data.message || "Failed to update FAQ");
        }
      })
      .catch((err) => {
        setLoader({ ...loader, pageloader: false });
        console.error("Error submitting answer:", err);
      });
  };

  useEffect(() => {
    getFAQList(1, category);
  }, [category]);

  return (
    <div className="mx-2 card-admin-main">
          <div className="card-body card-bg">
          <div className="row justify-content-between">
         <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
              <h4 className="mb-2">FAQ List</h4>
            </div>
           <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 col-12 d-flex justify-content-xl-end justify-content-lg-end justify-content-md-center justify-content-sm-center justify-content-center">
               <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: "200px" }}
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </Form.Select>
            </div>
          </div>
        </div>


      {loader.pageloader && <PageLoaderBackdrop />}
      <div className="table-responsive mt-2">
        <table className="table table-bordered custom-table table-striped mt-3">
          <thead>
            <tr className="text-truncate">
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
                  <td>
                    <button
                      className="btn btn-white btn-sm"
                      onClick={() => handleOpenModal(user)}
                    >
                      <span className="color-blue">Write a Answer</span>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <td colSpan={8} className="text-center">
                No data found
              </td>
            )}
          </tbody>
        </table>
      </div>
      <PaginateComponent
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => getFAQList(page, category)}
      />

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Write Answer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                value={selectedFaq?.que || ""}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Answer</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Write your answer here..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmitAnswer}>
            Submit Answer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Faq;
