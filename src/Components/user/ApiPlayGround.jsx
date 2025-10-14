import { useEffect, useState } from 'react';
import { Button, Dropdown, InputGroup, Modal, Table } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LangCurlExecuteComp from './LangCurlExecuteComp';
import SyntaxHighLighter from './SyntaxHighLighter';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { arrayIndex, convertToPayload, copyToClipboard, getTokenData, trucateString } from '../../Utils';
import GetStarted from './GetStarted';
import { error_swal_toast } from '../../SwalServices';
import accesscontrol from '/assets/img/access-control.png';
import dots from '/assets/img/dots.png';
import egypt from '/assets/img/egypt.png';
import uparrow from '/assets/img/arrow-right-solid-full 1.png';
// import { FaAngleDown, FaAngleRight } from "react-icons/fa";
import { post_auth_data, post_data } from '../../ApiServices';
import { PageLoaderBackdrop, Loader } from '../../Loader';
import EditableBody from '../user/UtilComponent/EditableBody'
import { ErrorMessage, FieldArray, Form, FormikProvider, useFormik } from 'formik';
function ApiPlayGround() {
    const navigate = useNavigate();
    const { collection_id, category_id, api_id } = useParams();
    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)
    const [apiData, setApiData] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [responsData, setResponsData] = useState({ resbody: {}, resschema: {} });
    const [statusCode, setStatusCode] = useState(0);
    const [modalData, setModalData] = useState({ header: [], body: {}, resbody: {} })
    const [loader, setLoader] = useState(false);
    const [isOpen, setIsOpen] = useState(true);

    const location = useLocation();
    useEffect(() => {
        chekParamParameter()
    }, [api_id, collection_id, category_id])

    const chekParamParameter = () => {
        let obj = {
            "record_uuid": "",
            "uniqueid": ""
        }
        if (api_id) {
            obj.uniqueid = api_id
            getAuthDataById('get-api-by-id', obj)
            return
        }
        if (category_id) {
            obj.record_uuid = category_id
            getAuthDataById('get-sub-category-by-id', obj)
            return
        }
        if (collection_id && collection_id != 0) {
            obj.record_uuid = collection_id
            getDataById('get-category-by-id', obj)
        }
    }
    const getDataById = (url, payload = {}) => {
        setLoader(true)
        post_data("portal/public", convertToPayload(url, payload), {})
            .then(async (response) => {
                setLoader(false)
                if (response.data.status) {
                    setDescription(response.data.data.description || '');
                    setTitle(response.data.data.categoryname || '');
                } else {
                    error_swal_toast(response.data.message)
                }
            }).catch((error) => {
                setLoader(false);
                console.log(error)
                error_swal_toast(error.message)

            })
    }
    const getAuthDataById = (url, payload = {}) => {
        setLoader(true);
        post_auth_data("portal/private", convertToPayload(url, payload), {})
            .then(async (response) => {
                setLoader(false);
                if (response.data.status) {
                    setDescription(response.data.data.description || '');
                    setTitle(response.data.data.subcategoryname || response.data.data.apiname || '');
                    if (api_id) {
                        setApiData(response.data.data);
                        setBodyRequestSample(JSON.parse(response.data.data.reqsample))
                        headersForm.setValues({ parameters: JSON.parse(response.data.data.reqheader?.value || '[]') })
                        parameterForm.setValues({ parameters: JSON.parse(response.data.data.query_params?.value || '[]') })
                        let res = JSON.parse(response.data.data.responses.value || '[]');
                        for (const item of res) {
                            if (item.code == 200) {
                                setResponsData({ resbody: item.resbody, resschema: JSON.parse(item.resschema) });
                                break; // stop after first match
                            }
                        }

                    }
                } else {
                    error_swal_toast(response.data.message)
                }
            }).catch((error) => {
                setLoader(false);
                console.log(error)
                error_swal_toast(error.message)

            })
    }
    const parameterForm = useFormik({
        initialValues: {
            parameters: []
        },
        validationSchema: "",
        onSubmit: (val) => {
            console.log(val)
        }
    })
    const headersForm = useFormik({
        initialValues: {
            parameters: []
        },
        validationSchema: "",
        onSubmit: (val) => {
            console.log(val)
        }
    })
    const urlencodedForm = useFormik({
        initialValues: {
            parameters: []
        },
        validationSchema: "",
        onSubmit: (val) => {
            console.log(val)
        }
    })

    const handleAddParam = (arrayHelper) => {
        let obj = { key: "", value: "", description: "", }
        arrayHelper.push(obj)
    };
    const [bodyType, setBodyType] = useState('raw')
    const handleBody = (e, type) => {
        if (e.target.checked) {
            setBodyType(type)
        }
    }

    const [bodyRequestSample, setBodyRequestSample] = useState('')
    const handleBodyChange = (language) => {
        setBodyRequestSample(language);
    }
    const createApiRqe = () => {
        console.log(urlencodedForm.values.parameters)
        console.log(headersForm.values.parameters)
        console.log(parameterForm.values.parameters)
        if (bodyType == 'raw') {
            try {
                JSON.parse(bodyRequestSample)
            } catch (error) {
                error_swal_toast('Invalid json data')
            }
        }
    }
    return (
        <div className="home-container bg-white p-3">
            <div className="card-new mb-3">
                <div className="card-body card-bg">
                    <h5>{title || 'Try it'}</h5>
                </div>
            </div>

            <p><img src="/assets/img/http.png" alt="NA" srcset="" className='me-2 my-2' />{apiData?.apiurl || 'url'}</p>
            <div className="d-flex">
                <div className="input-group">
                    <InputGroup.Text id="basic-addon1">{apiData?.apimethod || 'GET'}</InputGroup.Text>
                    <input type="text" className="form-control" aria-label="Text input with dropdown button" value={apiData?.apiurl || 'url'} readOnly />
                </div>
                <button className='btn btn-primary ms-2 px-3' onClick={createApiRqe}>Send</button>
            </div>

            <ul className="nav nav-pills mb-3 mt-3" id="pills-tab" role="tablist">
                <li className="nav-item pe-3" rzole="presentation">
                    <button className="nav-link  try-api-tab active" id="pills-one-tab" data-bs-toggle="pill" data-bs-target="#pills-one" type="button" role="tab" aria-controls="pills-one" aria-selected="true">Params</button>
                </li>

                <li className="nav-item px-3" role="presentation">
                    <button className="nav-link try-api-tab " id="pills-two-tab" data-bs-toggle="pill" data-bs-target="#pills-two" type="button" role="tab" aria-controls="pills-two" aria-selected="false"> Headers (8)</button>
                </li>
                <li className="nav-item px-3" role="presentation">
                    <button className="nav-link try-api-tab body-dot" id="pills-three-tab" data-bs-toggle="pill" data-bs-target="#pills-three" type="button" role="tab" aria-controls="pills-three" aria-selected="false">
                        Body
                    </button>
                </li>


            </ul>
            <div className="tab-content" id="pills-tabContent">
                <div className="tab-pane fade show active" id="pills-one" role="tabpanel" aria-labelledby="pills-one-tab">
                    <div className='table-responsive'>
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
                                                <th>description</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                parameterForm.values.parameters.map((param, index) => (
                                                    <tr key={arrayIndex('queryparam', index)}>
                                                        <td className="">
                                                            <input type="text" className='form-control' name={`parameters[${index}].key`}
                                                                onChange={parameterForm.handleChange} onBlur={parameterForm.handleBlur}
                                                                value={parameterForm.values.parameters[index].key} />
                                                            <ErrorMessage name={`parameters[${index}].key`} component="small" className='text-danger' />
                                                        </td>
                                                        <td className="">
                                                            <input type="text" className='form-control' name={`parameters[${index}].value`}
                                                                onChange={parameterForm.handleChange} onBlur={parameterForm.handleBlur}
                                                                value={parameterForm.values.parameters[index].value} />
                                                            <ErrorMessage name={`parameters[${index}].value`} component="small" className='text-danger' />
                                                        </td>
                                                        <td className="">
                                                            <input type="text" className='form-control' name={`parameters[${index}].description`}
                                                                onChange={parameterForm.handleChange} onBlur={parameterForm.handleBlur}
                                                                value={parameterForm.values.parameters[index].description} />
                                                            <ErrorMessage name={`parameters[${index}].description`} component="small" className='text-danger' />
                                                        </td>
                                                        <td className="d-flex align-items-center justify-content-center">
                                                            <button type="buttn" className="btn btn-danger btn-sm" title="remove" onClick={() => { arrayHelper.remove(index) }}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                )} />
                            </Form>
                        </FormikProvider>
                    </div>
                </div>
                <div className="tab-pane fade" id="pills-two" role="tabpanel" aria-labelledby="pills-two-tab">
                    <FormikProvider value={headersForm}>
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
                                            <th>description</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            headersForm.values.parameters.map((param, index) => (
                                                <tr key={arrayIndex('queryparam', index)}>
                                                    <td className="">
                                                        <input type="text" className='form-control' name={`parameters[${index}].key`}
                                                            onChange={headersForm.handleChange} onBlur={headersForm.handleBlur}
                                                            value={headersForm.values.parameters[index].key} />
                                                        <ErrorMessage name={`parameters[${index}].key`} component="small" className='text-danger' />
                                                    </td>
                                                    <td className="">
                                                        <input type="text" className='form-control' name={`parameters[${index}].value`}
                                                            onChange={headersForm.handleChange} onBlur={headersForm.handleBlur}
                                                            value={headersForm.values.parameters[index].value} />
                                                        <ErrorMessage name={`parameters[${index}].value`} component="small" className='text-danger' />
                                                    </td>
                                                    <td className="">
                                                        <input type="text" className='form-control' name={`parameters[${index}].description`}
                                                            onChange={headersForm.handleChange} onBlur={headersForm.handleBlur}
                                                            value={headersForm.values.parameters[index].description} />
                                                        <ErrorMessage name={`parameters[${index}].description`} component="small" className='text-danger' />
                                                    </td>
                                                    <td className="d-flex align-items-center justify-content-center">
                                                        <button type="buttn" className="btn btn-danger btn-sm" title="remove" onClick={() => { arrayHelper.remove(index) }}>
                                                            <i className="fa fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            )} />
                        </Form>
                    </FormikProvider>
                </div>
                <div className="tab-pane fade" id="pills-three" role="tabpanel" aria-labelledby="pills-three-tab">
                    <div className='d-flex mb-2'>
                        <div className="form-check">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" checked={bodyType == 'form_data'} id="form_data" onChange={(e) => { handleBody(e, 'form_data') }} />
                            <label className="form-check-label" role='button' for="form_data">
                                form-data
                            </label>
                        </div>
                        <div className="form-check ms-4">
                            <input className="form-check-input" type="radio" name="flexRadioDefault" checked={bodyType == 'urlencoded'} id="urlencoded" onChange={(e) => { handleBody(e, 'urlencoded') }} />
                            <label className="form-check-label" role='button' for="urlencoded">
                                x-www-form-urlencoded
                            </label>
                        </div>
                        <div className="form-check ms-4">
                            <input className="form-check-input" type="radio" checked={bodyType == 'raw'} name="flexRadioDefault" id="raw" onChange={(e) => { handleBody(e, 'raw') }} />
                            <label className="form-check-label" role='button' for="raw">
                                raw
                            </label>
                        </div>
                    </div>
                    {bodyType == 'form_data' && <div className="bodybox">Cooming soon</div>}
                    {bodyType == 'urlencoded' && <div className="bodybox">
                        <FormikProvider value={urlencodedForm}>
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
                                                <th>description</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                urlencodedForm.values.parameters.map((param, index) => (
                                                    <tr key={arrayIndex('urlencoded', index)}>
                                                        <td className="">
                                                            <input type="text" className='form-control' name={`parameters[${index}].key`}
                                                                onChange={urlencodedForm.handleChange} onBlur={urlencodedForm.handleBlur}
                                                                value={urlencodedForm.values.parameters[index].key} />
                                                            <ErrorMessage name={`parameters[${index}].key`} component="small" className='text-danger' />
                                                        </td>
                                                        <td className="">
                                                            <input type="text" className='form-control' name={`parameters[${index}].value`}
                                                                onChange={urlencodedForm.handleChange} onBlur={urlencodedForm.handleBlur}
                                                                value={urlencodedForm.values.parameters[index].value} />
                                                            <ErrorMessage name={`parameters[${index}].value`} component="small" className='text-danger' />
                                                        </td>
                                                        <td className="">
                                                            <input type="text" className='form-control' name={`parameters[${index}].description`}
                                                                onChange={urlencodedForm.handleChange} onBlur={urlencodedForm.handleBlur}
                                                                value={urlencodedForm.values.parameters[index].description} />
                                                            <ErrorMessage name={`parameters[${index}].description`} component="small" className='text-danger' />
                                                        </td>
                                                        <td className="d-flex align-items-center justify-content-center">
                                                            <button type="buttn" className="btn btn-danger btn-sm" title="remove" onClick={() => { arrayHelper.remove(index) }}>
                                                                <i className="fa fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </table>
                                )} />
                            </Form>
                        </FormikProvider>
                    </div>}
                    {bodyType == 'raw' && <div className="bodybox">
                        <EditableBody curl={bodyRequestSample} onChange={handleBodyChange} />
                    </div>}
                </div>

            </div>
            <div className='border-top'></div>
            <div className='row d-flex justify-content-between'>
                <div className='col-xl-3 col-lg-3 col-md-3 col-sm-4 col-4'>
                    <ul className="nav nav-pills my-1" id="pills-tab" role="tablist">
                        <li className="nav-item pe-3" role="presentation">
                            <button className="nav-link  try-api-tab active" id="pills-onenew-tab" data-bs-toggle="pill" data-bs-target="#pills-onenew" type="button" role="tab" aria-controls="pills-onenew" aria-selected="true">Body</button>
                        </li>
                        <li className="nav-item px-3" role="presentation">
                            <button className="nav-link try-api-tab " id="pills-new-tab" data-bs-toggle="pill" data-bs-target="#pills-new" type="button" role="tab" aria-controls="pills-new" aria-selected="false">Header (8)</button>
                        </li>



                    </ul>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-9 col-sm-8 col-8 d-flex align-items-center'>
                    <span className="badge bg-success">200 OK</span>
                    <div className='grey-dot ms-2'></div>
                    <span className='ms-2'>1.16 KB</span>
                    <div className='grey-dot ms-2'></div>
                    <img src={accesscontrol} className='ms-2' alt="" style={{ width: '20px', height: '20px' }} />
                    <div className='ms-2'>|</div>
                    <img src={egypt} className='ms-2' alt="" style={{ width: '20px', height: '20px' }} />
                    <span className='ms-2'>Save Response</span>
                    <img src={dots} className='ms-2' alt="" style={{ width: '20px', height: '20px' }} />
                </div>
                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-onenew" role="tabpanel" aria-labelledby="pills-onenew-tab">
                        <span className="badge bg-secondary mb-2"> { } JSON  <i className="fa-solid fa-angle-down"></i></span>

                        <p>
                            [

                            'id' - '1',<br></br>
                            'name' - 'Google Pixel 6 Pro',<br></br>
                            'name' - 'Google Pixel 6 Pro',<br></br>
                            'name' - 'Google Pixel 6 Pro',<br></br>
                            'name' - 'Google Pixel 6 Pro',<br></br>
                            'name' - 'Google Pixel 6 Pro',<br></br>
                            'name' - 'Google Pixel 6 Pro',

                            ]
                        </p>
                    </div>
                    <div className="tab-pane fade" id="pills-twonew" role="tabpanel" aria-labelledby="pills-twonew-tab">.2..</div>

                </div>
            </div>
            <div className='border-top'></div>
            <div>
                {/* Console Header */}
                <span className=' pb-1' style={{ cursor: 'pointer' }} data-bs-toggle="offcanvas" data-bs-target="#offcanvasBottom" aria-controls="offcanvasBottom">
                    <i className="fa-solid fa-code me-2 text-secondary"></i>
                    <span className=''>Console</span>
                </span>
                <div className="offcanvas offcanvas-bottom bottom-backdrop" tabindex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
                    <div className="offcanvas-header ">
                        <div className=" row d-flex w-100 align-items-center justify-content-between mb-2">
                            <div className='col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12'>
                                <span className='border-bottom-blue pb-1'>
                                    <i className="fa-solid fa-code me-2 text-secondary"></i>
                                    <span className=''>Console</span>
                                </span>
                            </div>
                            <div className='col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12 d-flex align-items-center justify-content-end'>
                                <span className='me-2 mb-0'>All Logs <i className="fa-solid fa-angle-down"></i></span>
                                <span className="badge bg-light text-dark">Clear</span>
                                <i className="fa-solid fa-copy me-2 text-secondary"></i>
                                <img src={dots} className='ms-2' alt="" style={{ width: '20px', height: '20px' }} />
                                <img src={uparrow} className='ms-2' alt="" style={{ width: '20px', height: '20px' }} />
                                <i className="fa-solid fa-xmark text-secondary" data-bs-dismiss="offcanvas" aria-label="Close"></i>
                            </div>
                        </div>
                        {/* <h5 className="offcanvas-title" id="offcanvasBottomLabel">Offcanvas bottom</h5> */}
                        {/* <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button> */}
                    </div>
                    <div className="offcanvas-body small">
                        <div className="border-top pt-2">
                            <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <div className="d-flex align-items-center">
                                    {isOpen ? (
                                        <i className="fa-solid fa-angle-down me-2 text-secondary"></i>
                                    ) : (
                                        <i className="fa-solid fa-angle-right me-2 text-secondary"></i>
                                    )}
                                    <span className="text-primary fw-semibold">GET</span>
                                    <span className="text-secondary ms-2">
                                        https://api.restful-api.dev/objects
                                    </span>
                                </div>
                                <div>
                                    <span className="text-success me-2">200</span>
                                    <span className="text-secondary">862 ms</span>
                                </div>
                            </div>

                            {/* Collapsible details */}
                            {isOpen && (
                                <div className="ms-4 mt-2">
                                    <div className="text-secondary small">▶ Network</div>
                                    <div className="text-secondary small">▶ Request Headers</div>
                                    <div className="text-secondary small">▶ Request Body</div>
                                    <div className="text-secondary small">▶ Response Headers</div>
                                    <div className="text-secondary small">▶ Response Body</div>
                                </div>
                            )}
                        </div>
                        <div className="border-top pt-2 mt-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <i className="fa-solid fa-angle-right me-2 text-secondary"></i>
                                    <span className="text-primary fw-semibold">GET</span>
                                    <span className="text-secondary ms-2">
                                        https://api.restful-api.dev/objects
                                    </span>
                                </div>
                                <div>
                                    <span className="text-success me-2">200</span>
                                    <span className="text-secondary">862 ms</span>
                                </div>
                            </div>
                        </div>
                        <div className="border-top pt-2 mt-1">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center">
                                    <i className="fa-solid fa-angle-right me-2 text-secondary"></i>
                                    <span className="text-primary fw-semibold">GET</span>
                                    <span className="text-secondary ms-2">
                                        https://api.restful-api.dev/objects
                                    </span>
                                </div>
                                <div>
                                    <span className="text-success me-2">200</span>
                                    <span className="text-secondary">862 ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                loader && <PageLoaderBackdrop />
            }
        </div>

    );
}

export default ApiPlayGround;