import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CategoryDescription = () => {
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState(""); // CKEditor content
  const [loading, setLoading] = useState(false); // loader for submit

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Form Submitted:", description);
      setLoading(false);
      setShow(false);
      setDescription("");
    }, 1000);
  };

  return (
    <>
      <div className="mx-2 card-admin-main">
        <div className="card-body card-bg">
          <div className="row justify-content-between">
            <div className="col-6">
              <h4 className="mb-2">API Category Description</h4>
            </div>
            <div className="col-2 d-flex justify-content-end">
              <button className="btn btn-primary py-1" onClick={handleShow}>
                Add Description
              </button>
            </div>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered custom-table table-striped mt-3">
            <thead className="text-truncate">
              <tr>
                <th style={{ width: "10%" }}>Sr. No</th>
                <th style={{ width: "60%" }}>Category Description</th>
                <th style={{ width: "10%" }}>Created Date</th>
                <th style={{ width: "20%" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1.</td>
                <td>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis tempore accusantium illum recusandae.
                </td>
                <td>07 Sep 2029</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <Form.Check
                      type="switch"
                      id="custom-switch"
                      // checked={cat.isenabled}
                      // onChange={() => confirm_swal_call(cat)}
                    />
                    <button
                      className="btn btn-primary btn-sm mx-2"
                      title="Edit User"
                      // onClick={() => openEditModal(cat)}
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
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <Modal show={show} onHide={handleClose} size="lg" centered>
          <Form onSubmit={handleSubmit}>
            <Modal.Header closeButton>
              <Modal.Title>Add Category Description</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CKEditor
                editor={ClassicEditor}
                data={description}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setDescription(data);
                }}
                config={{
                  toolbar: [
                    "heading",
                    "|",
                    "bold",
                    "italic",
                    "underline",
                    "strikethrough",
                    "link",
                    "|",
                    "bulletedList",
                    "numberedList",
                    "blockQuote",
                    "|",
                    "alignment",
                    "insertTable",
                    "imageUpload",
                    "|",
                    "undo",
                    "redo",
                    "removeFormat",
                  ],
                  heading: {
                    options: [
                      {
                        model: "paragraph",
                        title: "Paragraph",
                        class: "ck-heading_paragraph",
                      },
                      {
                        model: "heading1",
                        view: "h1",
                        title: "Heading 1",
                        class: "ck-heading_heading1",
                      },
                      {
                        model: "heading2",
                        view: "h2",
                        title: "Heading 2",
                        class: "ck-heading_heading2",
                      },
                      {
                        model: "heading3",
                        view: "h3",
                        title: "Heading 3",
                        class: "ck-heading_heading3",
                      },
                      {
                        model: "heading4",
                        view: "h4",
                        title: "Heading 4",
                        class: "ck-heading_heading4",
                      },
                      {
                        model: "heading5",
                        view: "h5",
                        title: "Heading 5",
                        class: "ck-heading_heading5",
                      },
                      {
                        model: "heading6",
                        view: "h6",
                        title: "Heading 6",
                        class: "ck-heading_heading6",
                      },
                    ],
                  },
                }}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </>
  );
};

export default CategoryDescription;
