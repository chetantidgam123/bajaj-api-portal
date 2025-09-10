
import {ErrorMessage, useFormik } from 'formik';
import React, { useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import Markdown from 'react-markdown'
import { Button, Form } from "react-bootstrap";
import {termscondFormSchema} from '../../'
function TermCond() {
    const [openModalTC, setOpenModalTC] = useState(false)
    const termForm = useFormik({
        initialValues: {
            text: '',
            
        },
        onSubmit: (() => {

        })

    })


    return (
        <div className="mx-2">
            <div className="d-flex justify-content-between my-2">
                <h1 className="">Terms and Condition</h1>
                <button className="btn btn-primary btn-sm mx-2" title="Edit User" onClick={() => setOpenModalTC(true)}>
                    <i className="fa fa-pencil" ></i>
                </button>

            </div>
            <div>
                <Markdown>{termForm.values.text}</Markdown>
            </div>


            <Modal show={openModalTC} size={'md'} centered>
                <Modal.Header>
                    Page Content
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="form-group">
                            <label htmlFor="text">Page Content</label>
                            <textarea
                                type='text'
                                name='text'
                                value={termForm.values.text}
                                onChange={termForm.handleChange}
                            />
                            <ErrorMessage name={`text`} component="small" className='text-danger' />
                        </div>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="button" onClick={termForm.handleSubmit}>Submit</Button>
                </Modal.Footer>

            </Modal>
        </div>

    )
}
export default TermCond