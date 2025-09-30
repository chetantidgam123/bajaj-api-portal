import { Accordion, Form, Modal } from "react-bootstrap";
import Header from "../user/layout/Header";
import FooterHome from "./FooterHome";
import { arrayIndex, convertToPayload } from "../../Utils";
import { useEffect, useState } from "react";
import { LoaderWight, PageLoaderBackdrop } from "../../Loader";
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel";
import { FormikProvider, useFormik } from "formik";
import { error_swal_toast, success_swal_toast } from "../../SwalServices";
import { post_data } from "../../ApiServices";
import { faqSchema } from "../../Schema";

function FaqList() {
  const [loader, setLoader] = useState({ pageloader: false });
  const [showModal, setShowModal] = useState(false);
  const [faqList, setFaqList] = useState([]);

  const faqForm = useFormik({
    initialValues: {
      fullname: "",
      companyname: "",
      mobileno: "",
      emailid: "",
      que: "",
      ans: "",
      category_name: "",
    },
    validationSchema: faqSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log("Form submitted:", values);
      setLoader(true);
      try {
        const payload = { ...values };

        console.log("Payload for profile update:", payload);

        setLoader(true);
        post_data("portal/public", convertToPayload("addfaq", payload), {})
          .then((response) => {
            setLoader(false);
            if (response.data.status) {
              success_swal_toast(response.data.message);
              resetForm();
              setShowModal(false);
            } else {
              error_swal_toast(response.data.message || "Something went wrong");
            }
          })
          .catch((error) => {
            setLoader(false);
            error_swal_toast(error.message || "Something went wrong");
            console.error("Error during profile update:", error);
          });
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong!");
      } finally {
        setLoader(false);
      }
    },
  });

  const getFAQList = (page = 1) => {
    let payload = {
      limit: String(20),
      page: String(page),
      category_name: "",
    };
    setLoader({ ...loader, pageloader: true });
    post_data("portal/public", convertToPayload("get-faq-list", payload), {})
      .then((response) => {
        setLoader({ ...loader, pageloader: false });
        console.log("FAQ List Response:", response);
        if (response.data.status) {
          setFaqList(response.data.data);
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

  const faq = [
    {
      que: "How do I get an API key?",
      ans: "You can sign up or log in to your account on the developer portal and generate an API key from the dashboard.",
    },
    {
      que: "How do I authenticate my API requests?",
      ans: "Include your API key in the request header as 'Authorization: Bearer {{YOUR_API_KEY}}'.",
    },
    {
      que: "What formats does the API support?",
      ans: "Our API returns responses in JSON format by default.",
    },
    {
      que: "Can I use the API in a commercial project?",
      ans: "Yes, but you need to subscribe to a commercial or enterprise plan depending on your usage.",
    },
    {
      que: "How do I handle errors from the API?",
      ans: "The API returns appropriate HTTP status codes (like 400, 401, 404, 500) with descriptive error messages.",
    },
    {
      que: "Is there documentation for each endpoint?",
      ans: "Yes, each API endpoint is fully documented in the API reference section with example requests and responses.",
    },
    {
      que: "Can I request a new feature or endpoint?",
      ans: "Absolutely! You can send feature requests through the support form or email us directly.",
    },
  ];

  return (
    <div className="bg-white">
      <Header />
      <div className="faqs">
        <h1 className="mt-3">Frequently Asked Questions</h1>
      </div>
      <div className="card-bg faq">
        <div className="container">
          {loader.pageloader && <PageLoaderBackdrop />}
          <div className="card-Works margin-top-100px">
            <Accordion>
              {faqList.length > 0 ? (
                faqList.map((faqItem, fi) => (
                  <Accordion.Item
                    key={arrayIndex("faq", fi)}
                    className="mb-3"
                    eventKey={String(fi)}
                  >
                    <Accordion.Header>{faqItem.que}</Accordion.Header>
                    <Accordion.Body>{faqItem.ans}</Accordion.Body>
                  </Accordion.Item>
                ))
              ) : (
                <div className="text-center text-muted py-5">No FAQ found!</div>
              )}
            </Accordion>

            <div className="addFaq">
              <div className="text">
                <h5 className="text-dark text-center">Still have questions?</h5>
                <p className="text-dark text-center">
                  If you have any other questions or need further information,
                  don’t hesitate to contact us. We are here to help you!
                </p>
              </div>
              <div className="d-flex justify-content-center">
                <button
                  className="btn btn-blue"
                  onClick={() => setShowModal(true)}
                >
                 Post a Question
                 {/* <i className="fa-solid fa-arrow-right"></i> */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterHome />

      {/* Modal */}
      <Modal
        size="md"
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
      >
        <Modal.Header closeButton className="border-bottom-0">
          <h4 className="mb-0">Post a Question</h4>
        </Modal.Header>
        <Modal.Body className="pt-0">
          <FormikProvider value={faqForm}>
            <Form autoComplete="off" onSubmit={faqForm.handleSubmit}>
              <FloatingInputLabel
                fieldName="fullname"
                formikFrom={faqForm}
                labelText="Full Name"
              />
              <FloatingInputLabel
                fieldName="companyname"
                formikFrom={faqForm}
                labelText="Company Name"
              />
              <FloatingInputLabel
                fieldName="emailid"
                formikFrom={faqForm}
                labelText="Email Address"
              />
              <FloatingInputLabel
                fieldName="mobileno"
                formikFrom={faqForm}
                labelText="Phone Number"
              />
              <FloatingInputLabel
                fieldName="category_name"
                formikFrom={faqForm}
                inputType="select"
                options={["General", "Service", "Sales", "O Auth"]}
              />
              <FloatingInputLabel
                fieldName="que"
                formikFrom={faqForm}
                labelText="Enter Question"
              />
              {/* <FloatingInputLabel
                fieldName="ans"
                formikFrom={faqForm}
                labelText="Answer"
              /> */}

              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loader}
                >
                  Submit{" "}
                  {loader ? (
                    <LoaderWight />
                  ) : (
                    <i className="fa-solid fa-arrow-right"></i>
                  )}
                </button>
              </div>
            </Form>
          </FormikProvider>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default FaqList;
