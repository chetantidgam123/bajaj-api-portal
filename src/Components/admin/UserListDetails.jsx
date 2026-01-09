import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import { Button, Row, Col, Card, Spinner } from "react-bootstrap";
 
import { useParams } from "react-router-dom";
import { post_auth_data } from "../../ApiServices";
import { convertToPayload } from "../../Utils";
import { error_swal_toast } from "../../SwalServices";
 
const UserDetails = () => {
  const { id } = useParams();
 
  const [loader, setLoader] = useState({ page: false });
  const [editMode, setEditMode] = useState(false);
  const [initialValues, setInitialValues] = useState({
    fullname: "",
    mobileno: "",
    mobileno2: "",
    emailid: "",
    company_name: "",
    company_email: "",
    company_mobile: "",
    company_office_mobile: "",
    company_address: "",
    clientId: "",
    clientSecret: "",
    profile_img: "",
  });
 
  const getUserData = () => {
    setLoader({ ...loader, page: true });
    post_auth_data(
      "portal/private",
      convertToPayload("get-user-by-id", { user_id: id }),
      {}
    )
      .then((response) => {
        setLoader({ ...loader, page: false });
        if (response.data.status) {
          const user = response.data.data[0];
          setInitialValues({
            fullname: user.fullname || "",
            mobileno: user.mobileno || "",
            mobileno2: user.mobileno2 || "",
            emailid: user.emailid || "",
            company_name: user.company_name || "",
            company_email: user.company_email || "",
            company_mobile: user.company_mobile || "",
            company_office_mobile: user.company_office_mobile || "",
            company_address: user.company_address || "",
            clientId: user.client_id || "",
            clientSecret: user.client_secret || "",
            profile_img: user.profile_img || "",
          });
        } else {
          error_swal_toast(response.data.message || "Something went wrong");
        }
      })
      .catch((error) => {
        setLoader({ ...loader, page: false });
        console.error("Error during fetch:", error);
      });
  };
 
  useEffect(() => {
    getUserData();
  }, []);
 
  const handleSave = (values) => {
    console.log("Saving data...", values);
 
    setEditMode(false);
  };
 
  return (
    <div className="mt-4">
      <Row className="">
        <Col md={12}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">User Details</h4>
            </Card.Header>
            <Card.Body>
              {loader.page ? (
                <div className="text-center">
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                </div>
              ) : (
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  onSubmit={handleSave}
                >
                  {({ values }) => (
                    <Form>
                      {/* Fullname */}
                      <div className="row">
                        <div className="mb-3 col-4">
                          <label className="form-label">Full Name</label>
                          <Field
                            name="fullname"
                            type="text"
                            className="form-control"
                            disabled={!editMode}
                          />
                        </div>
 
                        {/* Email */}
                        <div className="mb-3 col-4">
                          <label className="form-label">Email</label>
                          <Field
                            name="emailid"
                            type="email"
                            className="form-control"
                            disabled={!editMode}
                          />
                        </div>
 
                        {/* Mobile No */}
                        <div className="mb-3 col-4">
                          <label className="form-label">Mobile No</label>
                          <Field
                            name="mobileno"
                            type="text"
                            className="form-control"
                            disabled={!editMode}
                          />
                        </div>
 
                        {/* Alternate Mobile */}
                        <div className="mb-3 col-4">
                          <label className="form-label">Alternate Mobile</label>
                          <Field
                            name="mobileno2"
                            type="text"
                            className="form-control"
                            disabled={!editMode}
                          />
                        </div>
 
                        {/* Company Details */}
                        <div className="mb-3 col-4">
                          <label className="form-label">Company Name</label>
                          <Field
                            name="company_name"
                            type="text"
                            className="form-control"
                            disabled={!editMode}
                          />
                        </div>
 
                        <div className="mb-3 col-4">
                          <label className="form-label">Company Email</label>
                          <Field
                            name="company_email"
                            type="email"
                            className="form-control"
                            disabled={!editMode}
                          />
                        </div>
 
                        <div className="mb-3 col-4">
                          <label className="form-label">Company Mobile</label>
                          <Field
                            name="company_mobile"
                            type="text"
                            className="form-control"
                            disabled={!editMode}
                          />
                        </div>
 
                        <div className="mb-3 col-4">
                          <label className="form-label">
                            Company Office Mobile
                          </label>
                          <Field
                            name="company_office_mobile"
                            type="text"
                            className="form-control"
                            disabled={!editMode}
                          />
                        </div>
 
                        <div className="mb-3 col-4">
                          <label className="form-label">Company Address</label>
                          <Field
                            name="company_address"
                            type="text"
                            className="form-control"
                            disabled={!editMode}
                          />
                        </div>
                      </div>
 
                      {editMode && (
                        <div className="text-end">
                          <Button type="submit" variant="primary">
                            Submit
                          </Button>
                        </div>
                      )}
                    </Form>
                  )}
                </Formik>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
 
export default UserDetails;