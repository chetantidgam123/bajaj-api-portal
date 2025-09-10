import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function TermCond() {
    const [openModalTC, setOpenModalTC] = useState(false);


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
    If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:support@example.com">support@example.com</a>.
  </p>
</div>

`;


    const [exportedHTML, setExportedHTML] = useState(apiHtml);


    const handleSave = () => {
        setOpenModalTC(false);
    };

    return (
        <div className="mx-2">
            <div className="d-flex justify-content-between my-2">
                <h1>Terms and Conditions</h1>
                <button
                    className="btn btn-primary btn-sm mx-2"
                    title="Edit Content"
                    onClick={() => setOpenModalTC(true)}
                >
                    <i className="fa fa-pencil"></i>
                </button>
            </div>

           
            <div className="mt-4">
                <h5>Page Content</h5>
                <div
                    className="border p-2"
                    dangerouslySetInnerHTML={{ __html: exportedHTML }}
                />
            </div>

            
            <Modal
                show={openModalTC}
                size="xl"
                centered
                onHide={() => setOpenModalTC(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Terms & Conditions</Modal.Title>
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
                                //   "link",
                                "|",
                                "bulletedList", "numberedList", "blockQuote",
                                "|",
                                "alignment",           // left, center, right, justify
                                "insertTable",         // table insert
                                "imageUpload",         // image upload
                                "|",
                                "undo", "redo",
                                "removeFormat"
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
    );
}

export default TermCond;