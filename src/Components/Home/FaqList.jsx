import { Accordion, Form, Modal } from "react-bootstrap"
import Header from "../user/layout/Header"
import FooterHome from "./FooterHome"
import { arrayIndex } from "../../Utils"
import { useState } from "react"
import { LoaderWight } from "../../Loader"
import FloatingInputLabel from "../user/UtilComponent/FloatingInputLabel"
import { FormikProvider, useFormik } from "formik"

function FaqList() {
    const [loader, setLoader] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const faqForm = useFormik({
        initialValues: {
            fullName: "",
            companyName: "",
            mobileNo: "",
            emailId: "",
            category: "",
            que: "",
        },
        onSubmit: (values) => {
            console.log("Form submitted:", values);
        },

    })
    const faq = [
        {
            que: "How do I get an API key?",
            ans: "You can sign up or log in to your account on the developer portal and generate an API key from the dashboard."
        },
        // {
        //     que: "Is there a rate limit for API usage?",
        //     ans: "Yes, our API allows up to 1000 requests per hour on the free plan. Higher limits are available on premium plans."
        // },
        {
            que: "How do I authenticate my API requests?",
            ans: "Include your API key in the request header as 'Authorization: Bearer {{YOUR_API_KEY}}'."
        },
        {
            que: "What formats does the API support?",
            ans: "Our API returns responses in JSON format by default."
        },
        {
            que: "Can I use the API in a commercial project?",
            ans: "Yes, but you need to subscribe to a commercial or enterprise plan depending on your usage."
        },
        {
            que: "How do I handle errors from the API?",
            ans: "The API returns appropriate HTTP status codes (like 400, 401, 404, 500) with descriptive error messages."
        },
        {
            que: "Is there documentation for each endpoint?",
            ans: "Yes, each API endpoint is fully documented in the API reference section with example requests and responses."
        },
        {
            que: "Can I request a new feature or endpoint?",
            ans: "Absolutely! You can send feature requests through the support form or email us directly."
        }
    ]
    return (
        <div className="bg-white">
            <Header />
            <div className="faqs">
            <h1 className='mt-3'>Frequently Asked Questions</h1>
          </div>
                 <div className='card-bg faq'>
                <div className='container'>
                    <div className='card-Works margin-top-100px'>
            
                    <Accordion>
                        {
                            faq.map((faq, fi) => (
                                <Accordion.Item key={arrayIndex('faq', fi)} className="mb-3" eventKey={fi}>
                                    <Accordion.Header >{faq.que}</Accordion.Header>
                                    <Accordion.Body className="">{faq.ans}</Accordion.Body>
                                </Accordion.Item>
                            ))
                        }
                    </Accordion>

                    <div className="my-5 text-center d-none">
                        <button className="btn btn-outline-primary">Load More</button>
                    </div>

                        <div className="addFaq">
                            <div className="text">
                                <h5 className="text-dark text-center">Still have questions?</h5>
                                <p  className="text-dark text-center">If you have any other questions or need further information, don’t hesitate to contact us. We are here to help you!</p>
                            </div>
                            <div className="d-flex justify-content-center">
                                <button className="btn btn-blue" onClick={() => { setShowModal(true) }}>Get in Touch <i className="fa-solid fa-arrow-right"></i></button>
                            </div>
                        </div>
                </div>
                </div>
            </div>
            <FooterHome />
            <Modal size="md" show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0"><h4>
                    Your Question
                </h4></Modal.Header>
                <Modal.Body className="pt-0">
                    <FormikProvider value={faqForm}>
                        <Form className="" autoComplete="off">
                            <div className="">
                                <FloatingInputLabel fieldName={`fullName`} formikFrom={faqForm} labelText={`Full Name`} />
                            </div>
                            <div className="">
                                <FloatingInputLabel fieldName={`companyName`} formikFrom={faqForm} labelText={`Company Name`} />
                            </div>
                            <div className="">
                                <FloatingInputLabel fieldName={`emailId`} formikFrom={faqForm} labelText={`Email Address`} />
                            </div>
                            <div className="">
                                <FloatingInputLabel fieldName={`mobileNo`} formikFrom={faqForm} labelText={`Phone Number`} />
                            </div>
                            <div className="">
                                <FloatingInputLabel fieldName={`category`} formikFrom={faqForm} labelText={`Select category`} />
                            </div>
                            <div className="">
                                <FloatingInputLabel fieldName={`question`} formikFrom={faqForm} labelText={`Enter Question`} />
                            </div>
                            <div className="text-center">
                                <button type="button" className="btn btn-primary" onClick={faqForm.handleSubmit}>Submit {loader ? <LoaderWight /> : <i className="fa-solid fa-arrow-right"></i>}</button>
                            </div>

                        </Form>
                    </FormikProvider>

                </Modal.Body>
            </Modal>
        </div>
    )
}

export default FaqList
