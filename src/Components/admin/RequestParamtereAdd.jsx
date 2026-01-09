import { ErrorMessage, FieldArray, Form, FormikProvider, useFormik } from "formik"
import { arrayIndex } from "../../Utils"
import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
function RequestParamtereAdd({ modalvalue, setShow, modalType, apiForm }) {

    const [initialValues, setInitialValues] = useState(modalvalue || [])
    const parameterForm = useFormik({
        initialValues: {
            parameters: initialValues
        },
        validationSchema: "",
        onSubmit: (val) => {
            const updatedValues = { ...apiForm.values };
            const paramMap = {
                reqbody: 'reqbody',
                reqheader: 'reqheader',
                resheader: 'resheader',
                uri_params: 'uri_params',
                query_params: 'query_params',
            };

            if (paramMap[modalType]) {
                updatedValues[paramMap[modalType]] = val.parameters;
                apiForm.setValues(updatedValues);
            }

            setShow(false);
        }
    })
    const handleAddParam = (arrayHelper) => {
        let obj = { key: "", value: "", isrequired: false, description: "", }
        arrayHelper.push(obj)
    };
    return (
        <div>
            <FormikProvider value={parameterForm}>
                <Form className="api-form" autoComplete="off">
                    <FieldArray name='parameters' render={(arrayHelper) => (

                        <table className="table table-bordered ">
                            <thead>
                                <tr>
                                    <th colSpan={5}>
                                        <div className="text-end">
                                            <button className="btn btn-primary" type="button" onClick={() => { handleAddParam(arrayHelper) }}>Add Parameter</button>
                                        </div>
                                    </th>
                                </tr>
                                <tr>
                                    <th>Key</th>
                                    <th>Value</th>
                                    <th>Required</th>
                                    <th>description</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    parameterForm.values.parameters.map((param, index) => (
                                        <tr key={arrayIndex('param', index)}>
                                            <td className="">
                                                <input className='form-control' type="text" name={`parameters[${index}].key`}
                                                    value={parameterForm.values.parameters[index].key}
                                                    onChange={parameterForm.handleChange} onBlur={parameterForm.handleBlur}
                                                />
                                                <ErrorMessage name={`parameters[${index}].key`} component="small" className='text-danger' />
                                            </td>
                                            <td className="">
                                                <input type="text" className='form-control' name={`parameters[${index}].value`}
                                                    onChange={parameterForm.handleChange} onBlur={parameterForm.handleBlur}
                                                    value={parameterForm.values.parameters[index].value} />
                                                <ErrorMessage name={`parameters[${index}].value`} component="small" className='text-danger' />
                                            </td>
                                            <td className="d-flex align-items-center justify-content-center">
                                                <input style={{ height: "15px", width: "15px", margin: "5px 5px 8px 5px" }} type="checkbox" className='form-check' name={`parameters[${index}].isrequired`}
                                                    onChange={parameterForm.handleChange}
                                                    value={parameterForm.values.parameters[index].isrequired}
                                                    checked={parameterForm.values.parameters[index].isrequired} />
                                            </td>
                                            <td className="">
                                                <input type="text" className='form-control' name={`parameters[${index}].description`}
                                                    onChange={parameterForm.handleChange} onBlur={parameterForm.handleBlur}
                                                    value={parameterForm.values.parameters[index].description} />
                                                <ErrorMessage name={`parameters[${index}].description`} component="small" className='text-danger' />
                                            </td>
                                            <td className="d-flex align-items-center justify-content-center">
                                                <button type="button" className="btn btn-danger btn-sm" title="remove" onClick={() => { arrayHelper.remove(index) }}>
                                                    <i className="fa fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                    )} />
                    <div className="text-end">
                        <button type="button" className="btn btn-primary" onClick={parameterForm.handleSubmit}> Submit</button>
                    </div>
                </Form>
            </FormikProvider>
        </div>
    )
}

RequestParamtereAdd.propTypes = {
    modalvalue: PropTypes.string,
    setShow: PropTypes.func,
    modalType: PropTypes.string,
    apiForm: PropTypes.any
}

export default RequestParamtereAdd
