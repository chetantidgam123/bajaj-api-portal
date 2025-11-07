import React, { useEffect, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { PageLoaderBackdrop } from "../../../Loader";
import { offsetPagination, convertToPayload } from "../../../Utils";
import { post_auth_data } from "../../../ApiServices";
import { error_swal_toast, success_swal_toast, confirm_swal_with_text } from "../../../SwalServices";
import PaginateComponent from "../../common/Pagination";
import moment from "moment";
function TermCond() {
  const [openModalTC, setOpenModalTC] = useState(false);
  const [loader, setLoader] = useState({ pageloader: false })
  const [selectedTerms, setSelectedTerms] = useState(null);
  const [termsCon, setTermsCon] = useState([]);
  const [modalMode, setModalMode] = useState("add");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    getAllTermCon()
  }, [])

  const getAllTermCon = (page = 1) => {
    setCurrentPage(page)
    const payload = {
      limit: String(offsetPagination),
      page: String(page),
      title: "",
    }
    setLoader({ pageloader: true });
    post_auth_data("portal/private", convertToPayload("get-all-term-and-condition", payload), {})
      .then(async (response) => {
        setLoader({ pageloader: false });
        if (response.data.status) {
          setTermsCon(response.data.data || []);
          setTotalPages(Math.ceil(response.data.totalRecords / offsetPagination))
        } else {
          error_swal_toast(response.data.message)
        }
      }).catch((error) => {
        setLoader({ pageloader: false });
        console.log(error)
        error_swal_toast(error.message)
      })
  }

  const apiHtml = `<div>
  <h2>Terms and Conditions</h2>
  <p>
    By accessing or using our services, you agree to comply with and be bound by the following terms and conditions.
  </p>

  <h4>1. Acceptance of Terms</h4>
  <p>
    These Terms govern your use of our website and services. If you do not agree, you must discontinue using our services immediately.
  </p>

  <h4>2. User Responsibilities</h4>
  <p>
    You agree to provide accurate information, maintain the confidentiality of your account, and use our services only for lawful purposes.
  </p>

  <h4>3. Intellectual Property</h4>
  <p>
    All content, trademarks, and materials available on this website are owned by us or our licensors and are protected by applicable intellectual property laws.
  </p>

  <h4>4. Limitation of Liability</h4>
  <p>
    We are not responsible for any direct, indirect, or incidental damages that may occur from using our services.
  </p>

  <h4>5. Changes to Terms</h4>
  <p>
    We may update these Terms at any time without prior notice. Continued use of the services constitutes acceptance of the revised Terms.
  </p>

  <h4>6. Contact Us</h4>
  <p>
    If you have any questions about these Terms and Conditions, please contact us at.
  </p>
</div>

`;

  const addTermCon = () => {
    const payload = {
      description: exportedHTML,
      title: exportedTitle,
    }
    setLoader({ pageloader: true });
    post_auth_data("portal/private", convertToPayload("add-term-and-condition", payload), {})
      .then(async (response) => {
        setLoader({ pageloader: false });
        if (response.data.status) {
          success_swal_toast("term & Condition added successfully!");
          getAllTermCon();
        } else {
          error_swal_toast(response.data.message)
        }
      }).catch((error) => {
        setLoader({ pageloader: false });
        console.error(error);
        error_swal_toast("Error adding tems & Condition.");
      })
  }

  const [exportedHTML, setExportedHTML] = useState(apiHtml);
  const [exportedTitle, setExportedTitle] = useState("");

  const editTermsCon = () => {
    if (!selectedTerms?.record_uuid) {
      return error_swal_toast("terms ID missing for update.");
    }
    const payload = {
      terms_id: selectedTerms?.record_uuid,
      description: exportedHTML,
      title: exportedTitle,
    }
    setLoader({ pageloader: true });
    post_auth_data("portal/private", convertToPayload("update-term-and-condition", payload), {})
      .then(async (response) => {
        setLoader({ pageloader: false });
        if (response.data.status) {
          success_swal_toast(response.data.message || "term & condition updated successfully!");
          getAllTermCon(currentPage);
        } else {
          error_swal_toast(response.data.message)
        }
      }).catch((error) => {
        setLoader({ pageloader: false });
        console.error(error);
        error_swal_toast("Error updating terms & condition.");
      })
  }

  const confirm_swal_call = (term) => {
    const callback = () => { togglePolicies(term); }
    confirm_swal_with_text(callback, `Are you sure <br/> you want to ${term.isenabled ? 'disable' : 'enable'}?`)
  }

  const togglePolicies = (term) => {
    const payload = {
      terms_id: term.record_uuid,
      isenabled: !term.isenabled, // toggle
    }
    setLoader({ pageloader: true });
    post_auth_data("portal/private", convertToPayload("toggle-term-and-condition", payload), {})
      .then(async (response) => {
        setLoader({ pageloader: false });
        if (response.data.status) {
          success_swal_toast(`Terms & Condition ${term.isenabled ? "disabled" : "enabled"} successfully.`);
          getAllTermCon(currentPage);
        } else {
          error_swal_toast(response.data.message)
        }
      }).catch((error) => {
        setLoader({ pageloader: false });
        console.error(error);
        error_swal_toast("Failed to toggle policy status.");
      })
  }

  const handleSave = () => {
    setOpenModalTC(false);
    if (modalMode === "add") addTermCon();
    else editTermsCon();
  };

  const handleAdd = () => {
    setModalMode("add");
    setSelectedTerms(null);
    setExportedHTML(""); // start blank
    setExportedTitle("");
    setOpenModalTC(true);
  };

  const handleEdit = (terms) => {
    setModalMode("edit");
    setSelectedTerms(terms);
    setExportedTitle(terms.title || "");
    setExportedHTML(terms.description || "");
    setOpenModalTC(true);
  };

  return (
    <>
      <style>
        {`
        .modal-dialog {
          overflow: visible !important;
        }

        .modal-body {
          overflow: visible !important;
        }

        .ck.ck-balloon-panel,
        .ck.ck-tooltip {
          z-index: 1060 !important;
        }
      `}
      </style>
      <div className="mx-2 card-admin-main">
        <div className="card-body card-bg">
          <div className="row justify-content-between">
            <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 col-12">
              <h4 className="mb-2">Terms And Condition</h4>
            </div>
            <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 col-12 d-flex justify-content-xl-end justify-content-lg-end justify-content-md-center justify-content-sm-center justify-content-center">
              <button className="btn btn-primary btn-sm mx-2 px-4" title="Edit Content" onClick={handleAdd}>
                Add
              </button>
            </div>
          </div>
        </div>

        {/* <div className="card-body card-bg">
                 <div className="d-flex justify-content-between my-2">
                    <h4>Terms and Conditions</h4>
                    <button
                        className="btn btn-primary btn-sm mx-2"
                        title="Edit Content"
                        onClick={() => setOpenModalTC(true)}
                    >
                        Edit &nbsp;<i className="fa fa-pencil"></i>
                    </button>
                </div>

               </div> */}

        <div className="table-responsive">
          <table className="table table-bordered custom-table table-striped mt-3">
            <thead className="text-truncate">
              <tr>
                <th style={{ width: "10%" }}>Sr. No</th>
                <th style={{ width: "60%" }}> Description</th>
                <th style={{ width: "10%" }}>Created Date</th>
                <th style={{ width: "20%" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {termsCon.length > 0 ? (
                termsCon.map((terms, index) => (
                  <tr key={terms.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div
                        className="p-2 height-box-term"
                        dangerouslySetInnerHTML={{ __html: `<h5>${terms.title}</h5>${terms.description}` }}
                      />
                    </td>
                    <td>{moment(terms.createddate).format('DD-MMM-yyyy')}</td>
                    <td>
                      <div className="d-flex justify-content-center">
                        <Form.Check
                          type="switch"
                          id={`switch-${index}`}
                          checked={terms.isenabled}
                          onChange={() => confirm_swal_call(terms)}
                        />
                        <button
                          className="btn btn-primary btn-sm mx-2"
                          title="Edit"
                          onClick={() => handleEdit(terms)}
                        >
                          <i className="fa fa-pencil"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" className="text-center">No terms found</td></tr>
              )}
            </tbody>

          </table>

          <PaginateComponent
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={(page) => getAllTermCon(page)}
          />

        </div>


        {/* <div className="mt-4">
                <h5>JSON Stringified HTML</h5>
                <pre className="bg-light p-2 border rounded" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {JSON.stringify(exportedHTML)}
                </pre>
            </div> */}

        <Modal
          show={openModalTC}
          size="xl"
          centered
          enforceFocus={false}
          onHide={() => setOpenModalTC(false)}
        >
          <Modal.Header closeButton>
            {modalMode === "add" ? <Modal.Title>Add Terms & Conditions</Modal.Title> : <Modal.Title>Edit Terms & Conditions</Modal.Title>}
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter policy title"
                value={exportedTitle}
                onChange={(e) => setExportedTitle(e.target.value)}
              />
            </Form.Group>
            <CKEditor
              editor={ClassicEditor}
              data={exportedHTML}
              // onChange={(event, editor) => {
              //     const data = editor.getData();
              //     setExportedHTML(data);
              // }}
              onChange={(event, editor) => setExportedHTML(editor.getData())}
              config={{
                toolbar: [
                  "heading",              // Heading (H1, H2, H3...)
                  "|",
                  "bold", "italic", "underline", "strikethrough",
                  "link",
                  "|",
                  "bulletedList", "numberedList", "blockQuote",
                  "|",
                  "alignment",           // left, center, right, justify
                  "insertTable",         // table insert
                  "imageUpload",         // image upload
                  "|",
                  "undo", "redo",
                  "removeFormat",
                ],
                heading: {
                  options: [
                    { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
                    { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
                    { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
                    { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
                    { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
                    { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
                    { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
                  ]
                }

              }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setOpenModalTC(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              {modalMode === "add" ? "Add" : "Update"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {loader.pageloader && <PageLoaderBackdrop />}
    </>

  );
}

export default TermCond;