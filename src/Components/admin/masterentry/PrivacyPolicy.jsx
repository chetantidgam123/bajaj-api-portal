import React, { useEffect, useState } from "react";
import { Button, Modal,Form } from "react-bootstrap";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { PageLoaderBackdrop } from "../../../Loader";
import { post_auth_data } from "../../../ApiServices";
import { convertToPayload, offsetPagination } from "../../../Utils";
import { success_swal_toast, error_swal_toast, confirm_swal_with_text } from "../../../SwalServices";
import PaginateComponent from "../../common/Pagination";
function PrivacyPolicy() {
    const [openModalTC, setOpenModalTC] = useState(false);
    const [loader, setLoader] = useState({ pageloader: false })
    const [modalMode, setModalMode] = useState("add");
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

useEffect(()=>{
    // console.log(ClassicEditor.builtinPlugins.map(p => p.pluginName),'editor');
    getAllPolicies()
},[])

const getAllPolicies = (page=1) => {
  setCurrentPage(page)
const payload = {
  limit: String(offsetPagination),
  page: String(page),
  title: "",
}
setLoader({ pageloader: true });
post_auth_data("portal/private", convertToPayload("get-all-policy", payload), {})
    .then(async (response) => {
        setLoader({ pageloader: false });
        if (response.data.status) {
          setPolicies(response.data.data || []);
          setTotalPages(Math.ceil(response.data.totalrecords / offsetPagination))
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

const addPolicies = (page=1) => {
const payload = {
  title: exportedTitle,
  description: exportedHTML,
};
setLoader({ pageloader: true });
post_auth_data("portal/private", convertToPayload("add-policy", payload), {})
    .then(async (response) => {
        setLoader({ pageloader: false });
        if (response.data.status) {
          success_swal_toast("Privacy policy added successfully!");
          setOpenModalTC(false);
          getAllPolicies();
        } else {
            error_swal_toast(response.data.message)
        }
    }).catch((error) => {
        setLoader({ pageloader: false });
        console.error(error);
        error_swal_toast("Error adding policy.");
    })
}

const editPolicies = (page=1) => {
  if (!selectedPolicy?.record_uuid) {
    return error_swal_toast("Policy ID missing for update.");
  }
  const payload = {
    policy_id: selectedPolicy.record_uuid,
    description: exportedHTML,
    title: exportedTitle,
  }
 setLoader({ pageloader: true });
post_auth_data("portal/private", convertToPayload("update-policy", payload), {})
    .then(async (response) => {
        setLoader({ pageloader: false });
        if (response.data.status) {
          success_swal_toast(response.data.message || "Privacy policy updated successfully!");
          getAllPolicies();
        } else {
            error_swal_toast(response.data.message)
        }
    }).catch((error) => {
        setLoader({ pageloader: false });
        console.error(error);
        error_swal_toast("Error updating policy.");
    })
}

    const confirm_swal_call = (policy) => {
        const callback = () => { togglePolicies(policy); }
        confirm_swal_with_text(callback, `Are you sure <br/> you want to ${policy.isenabled ? 'disable' : 'enable'} ?`)
    }

const togglePolicies = (policy) => {
const payload = {
  policy_id: policy.record_uuid,
  isenabled: !policy.isenabled
}
setLoader({ pageloader: true });
post_auth_data("portal/private", convertToPayload("toggle-policy", payload), {})
    .then(async (response) => {
        setLoader({ pageloader: false });
        if (response.data.status) {
          console.log(response)
          success_swal_toast(`Policy ${policy.isenabled ? "disabled" : "enabled"} successfully.`);
          getAllPolicies();
        } else {
            error_swal_toast(response.data.message)
        }
    }).catch((error) => {
        setLoader({ pageloader: false });
        console.error(error);
        error_swal_toast("Failed to toggle policy status.");
    })
}

    const [exportedHTML, setExportedHTML] = useState(apiHtml);
    const [exportedTitle, setExportedTitle] = useState("");

  const handleSave = () => {
    setOpenModalTC(false);
    if (modalMode === "add") addPolicies();
    else editPolicies();
  };

    const handleAdd = () => {
      setModalMode("add");
      setSelectedPolicy(null);
      setExportedHTML("");
      setExportedTitle("");
      setOpenModalTC(true);
    };

    const handleEdit = (policy) => {
      setModalMode("edit");
      setSelectedPolicy(policy);
      setExportedTitle(policy.title || "");
      setExportedHTML(policy.description || "")
      setOpenModalTC(true);
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
              <button  className="btn btn-primary btn-sm mx-2 px-4" title="Edit Content" onClick={handleAdd}>
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
                <th style={{ width: "60%" }}>Description</th>
                <th style={{ width: "10%" }}>Created Date</th>
                <th style={{ width: "20%" }} className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            {/* <tbody>
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
                        // onClick={() => setOpenModalTC(true)}
                      onClick={handleEdit}
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
            </tbody> */}
                        <tbody>
  {policies.length > 0 ? (
    policies.map((policy, index) => (
      <tr key={policy.id}>
        <td>{index + 1}</td>
        <td>
          <div
            className="p-2 height-box-term"
            dangerouslySetInnerHTML={{ __html: `<h5>${policy.title}</h5>${policy.description}` }}
          />
        </td>
        <td>13-10-2025</td>
        <td>
          <div className="d-flex justify-content-center">
            <Form.Check
              type="switch"
              id={`switch-${index}`}
              checked={policy.isenabled}
              onChange={() => confirm_swal_call(policy)}
            />
            <button
              className="btn btn-primary btn-sm mx-2"
              title="Edit"
              onClick={() => handleEdit(policy)}
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
                  onChange={(page) => { getAllPolicies(page); }}  // Fetch policies for the selected page
                />
        </div>
          

            
            <Modal
                show={openModalTC}
                size="xl"
                centered
                enforceFocus={false}
                onHide={() => setOpenModalTC(false)}
            >
                <Modal.Header closeButton >
                  {modalMode === "add" ? <Modal.Title>Add Privacy Policy</Modal.Title> : <Modal.Title>Edit Privacy Policy</Modal.Title>}
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

export default PrivacyPolicy;