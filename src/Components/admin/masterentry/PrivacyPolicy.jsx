import React, { useEffect, useState } from "react";
import { Button, Modal,Form } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { PageLoaderBackdrop } from "../../../Loader";
function PrivacyPolicy() {
    const [openModalTC, setOpenModalTC] = useState(false);
    const [loader, setLoader] = useState({ pageloader: false })
useEffect(()=>{
    console.log(ClassicEditor.builtinPlugins.map(p => p.pluginName),'editor');

},[])

    const apiHtml = `<div>
  <h2>Privacy Policy</h2>
  <p>
    Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information when you use our services.
  </p>

  <h4>1. Information We Collect</h4>
  <p>
    We may collect personal information such as your name, email address, phone number, and usage data when you interact with our services.
  </p>

  <h4>2. How We Use Your Information</h4>
  <p>
    The information collected is used to provide and improve our services, personalize user experience, send important updates, and ensure security.
  </p>

  <h4>3. Data Sharing</h4>
  <p>
    We do not sell or rent your personal information to third parties. We may share data only with trusted partners or as required by law.
  </p>

  <h4>4. Data Security</h4>
  <p>
    We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
  </p>

  <h4>5. Cookies</h4>
  <p>
    Our website may use cookies to enhance user experience. You can choose to disable cookies through your browser settings.
  </p>

  <h4>6. Your Rights</h4>
  <p>
    You have the right to access, update, or delete your personal information. Please contact us to exercise these rights.
  </p>

  <h4>7. Changes to Privacy Policy</h4>
  <p>
    We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.
  </p>

  <h4>8. Contact Us</h4>
  <p>
    If you have any questions about this Privacy Policy, please contact us at .
  </p>
</div>

`;


    const [exportedHTML, setExportedHTML] = useState(apiHtml);


    const handleSave = () => {
        setOpenModalTC(false);
    };

    return (<>
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
              <h4 className="mb-2">Privacy Policy</h4>
            </div>
           <div className="col-xl-2 col-lg-3 col-md-6 col-sm-12 col-12 d-flex justify-content-xl-end justify-content-lg-end justify-content-md-center justify-content-sm-center justify-content-center">
              <button  className="btn btn-primary btn-sm mx-2 px-4"    title="Edit Content">
                Add
              </button>
            </div>
          </div>
        </div>

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
              <tr>
                <td>1.</td>
                <td>
                    <div
                    className=" p-2 height-box-term"
                    dangerouslySetInnerHTML={{ __html: exportedHTML }}
                />
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
                        onClick={() => setOpenModalTC(true)}
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
          

            
            <Modal
                show={openModalTC}
                size="xl"
                centered
                enforceFocus={false}
                onHide={() => setOpenModalTC(false)}
            >
                <Modal.Header closeButton >
                    <Modal.Title>Edit Privacy Policy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CKEditor
                        editor={ClassicEditor}
                        data={exportedHTML}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setExportedHTML(data);
                        }}
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
                        }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setOpenModalTC(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
        {loader.pageloader && <PageLoaderBackdrop />}
    </>
     
    );
}

export default PrivacyPolicy;