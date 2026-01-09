import { useEffect, useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { arrayIndex, convertToPayload, getTokenData, } from '../../Utils';
import { error_swal_toast } from '../../SwalServices';
import dots from '/assets/img/dots.png';
import uparrow from '/assets/img/arrow-right-solid-full 1.png';
import { post_auth_data, post_data } from '../../ApiServices';
import { PageLoaderBackdrop } from '../../Loader';
import EditableBody from '../user/UtilComponent/EditableBody'
import { ErrorMessage, FieldArray, Form, FormikProvider, useFormik } from 'formik';
import { api_decrypt, api_encrypt, encKey } from '../../enc_dec';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
const env = import.meta.env
function ApiPlayGround() {
    const { collection_id, category_id, api_id } = useParams();
    const [apiData, setApiData] = useState(null);
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [clientCreds, setClientCreds] = useState({});
    const [responsData, setResponsData] = useState({ resbody: {}, resschema: {} });
    const [loader, setLoader] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const [respCode, setRespCode] = useState([])
    const [selectedCode, setSelectedCode] = useState("");

    const [isEncrypted, setIsEncrypted] = useState(false);
    const [isEncryptedRes, setIsEncryptedRes] = useState(true);
    useEffect(() => {
        chekParamParameter()
    }, [api_id, collection_id, category_id])

    useEffect(() => {
        if (Array.isArray(respCode) && respCode.length > 0 && !selectedCode) {
            setSelectedCode(respCode[0].code);
        }
    }, [respCode, selectedCode]);

    const getClientCredentials = (headArray = []) => {
        const payload = {
            "query": "SELECT client_id,client_secret FROM user_api_cred WHERE user_id = (SELECT id from usermaster WHERE emailid ='" + getTokenData().emailid + "')",
            "message": "Get user credentials"
        }
        post_data(env.VITE_POSTGRE_ENDPOINT, payload, {})
            .then(async (response) => {
                setClientCreds(response.data.data[0]);
                let a = headArray.map((item) => {
                    if (item.key == 'client_id') {
                        item.value = response.data.data[0].client_id || ''
                    }
                    if (item.key == 'client_secret') {
                        item.value = response.data.data[0].client_secret || ''
                    }
                    if (item.key == 'grant_type') {
                        item.value = "CLIENT_CEDENTIALS"
                    }
                    return item
                })
                headersForm.setValues({ parameters: a })
            }).catch((error) => {
                console.log(error)
            })
    }

    const chekParamParameter = () => {
        let obj = {
            "record_uuid": "",
            "uniqueid": ""
        }
        if (api_id) {
            obj.uniqueid = api_id
            getAuthDataById('get-api-by-id', obj)
        }
    }

    const getAuthDataById = (url, payload = {}) => {
        setLoader(true);
        post_auth_data("portal/private", convertToPayload(url, payload), {})
            .then(async (response) => {
                setLoader(false);
                if (response.data.status) {
                    const respArr = JSON.parse(response.data.data.responses.value);
                    setRespCode(respArr);
                    setDescription(response.data.data.description || '');
                    setTitle(response.data.data.subcategoryname || response.data.data.apiname || '');
                    if (api_id) {
                        setApiData(response.data.data);
                        let reqSample = JSON.parse(response.data.data.reqsample)
                        setBodyRequestSample(reqSample)
                        headersForm.setValues({ parameters: JSON.parse(response.data.data.reqheader?.value || '[]') })
                        parameterForm.setValues({ parameters: JSON.parse(response.data.data.query_params?.value || '[]') })
                        uriparameterForm.setValues({ parameters: JSON.parse(response.data.data.uri_params?.value || '[]') })
                        let res = JSON.parse(response.data.data.responses.value || '[]');
                        for (const item of res) {
                            if (item.code == 200) {
                                setResponsData({ resbody: item.resbody, resschema: JSON.parse(item.resschema) });
                                break; // stop after first match
                            }
                        }
                        getClientCredentials(JSON.parse(response.data.data.reqheader?.value || '[]'));

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
    const uriparameterForm = useFormik({
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
    const [bodyResSample, setBodyResSample] = useState('')
    const handleResChange = (language) => {
        setBodyResSample(language);
    }
    const handleBodyChange = (language) => {
        setBodyRequestSample(language);
    }
    const createApiRqe = () => {
        let responces = JSON.parse(apiData.responses?.value || []);
        for (let key of responces) {
            if (key.code == selectedCode) {
                setBodyResSample(JSON.stringify({ "encData": api_encrypt(key.resbody, encKey) }, null, 2))
            }
        }
    }

    // Mock encrypt/decrypt logic
    const handleEncryptDecrypt = () => {
        if (!bodyRequestSample) {
            error_swal_toast("No body content to process");
            return;
        }

        try {
            if (isEncrypted) {
                setBodyRequestSample((api_decrypt(JSON.parse(bodyRequestSample)?.encData, encKey)))
                setIsEncrypted(false);
            } else {
                setBodyRequestSample(JSON.stringify({ "encData": api_encrypt(bodyRequestSample, encKey) }, null, 2))
                setIsEncrypted(true);
                // Simulate decryption
            }
        } catch (error) {
            console.log(error)
            error_swal_toast("Failed to decrypt: Invalid data");
        }
    };
    const handleEncryptDecryptRes = () => {
        if (!bodyResSample) {
            error_swal_toast("No body content to process");
            return;
        }

        try {
            if (isEncryptedRes) {
                setBodyResSample((api_decrypt(JSON.parse(bodyResSample)?.encData, encKey)))
                setIsEncryptedRes(false);
            } else {
                setBodyResSample(JSON.stringify({ "encData": api_encrypt(bodyResSample, encKey) }, null, 2))
                setIsEncryptedRes(true);
            }
        } catch (error) {
            console.log(error)
            error_swal_toast("Failed to decrypt: Invalid data");
        }
    };

    return (
        <div className="home-container bg-white p-3">
            <div><h3>{title || 'Try it'}</h3></div>
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
                    <button className="nav-link try-api-tab " id="pills-two-tab" data-bs-toggle="pill" data-bs-target="#pills-two" type="button" role="tab" aria-controls="pills-two" aria-selected="false"> Headers </button>
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
                                                <th colSpan={4}>
                                                    <p>Query params</p>
                                                    <div className="text-end d-none">
                                                        <button className="btn btn-primary" type="button" onClick={() => { handleAddParam(arrayHelper) }}>Add Parameter</button>
                                                    </div>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>Key</th>
                                                <th>Value</th>
                                                <th>description</th>
                                                {/* <th></th> */}
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
                                                        <td className="d-flex align-items-center justify-content-center d-none">
                                                            <button type="button" className="btn btn-danger btn-sm" onClick={() => { arrayHelper.remove(index) }} title="remove">
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
                    <div className='table-responsive'>
                        <FormikProvider value={uriparameterForm}>
                            <Form className="api-form" autoComplete="off">
                                <FieldArray name='uriparameters' render={(arrayHelper) => (
                                    <table className="table table-bordered ">
                                        <thead>
                                            <tr>
                                                <th colSpan={4}>
                                                    <p>Path Variables</p>
                                                    <div className="text-end d-none">
                                                        <button className="btn btn-primary" type="button" onClick={() => { handleAddParam(arrayHelper) }}>Add Parameter</button>
                                                    </div>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>Key</th>
                                                <th>Value</th>
                                                <th>description</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            { uriparameterForm.values.parameters.map((param, index) => (
                                                <tr key={arrayIndex('uriparams', index)}>
                                                    <td className="">
                                                        <input type="text" className='form-control' name={`parameters[${index}].key`}
                                                            onChange={uriparameterForm.handleChange} onBlur={uriparameterForm.handleBlur}
                                                            value={uriparameterForm.values.parameters[index].key} />
                                                        <ErrorMessage name={`parameters[${index}].key`} component="small" className='text-danger' />
                                                    </td>
                                                    <td className="">
                                                        <input type="text" className='form-control' name={`parameters[${index}].value`}
                                                            onChange={uriparameterForm.handleChange} onBlur={uriparameterForm.handleBlur}
                                                            value={uriparameterForm.values.parameters[index].value} />
                                                        <ErrorMessage name={`parameters[${index}].value`} component="small" className='text-danger' />
                                                    </td>
                                                    <td className="">
                                                        <input type="text" className='form-control' name={`parameters[${index}].description`}
                                                            onChange={uriparameterForm.handleChange} onBlur={uriparameterForm.handleBlur}
                                                            value={uriparameterForm.values.parameters[index].description} />
                                                        <ErrorMessage className='text-danger' name={`parameters[${index}].description`} component="small" />
                                                    </td>
                                                    <td className="d-flex align-items-center justify-content-center d-none">
                                                        <button title="remove" type="button" className="btn btn-danger btn-sm" onClick={() => { arrayHelper.remove(index) }}>
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
                                                <div className="text-end d-none">
                                                  <button type="button" className="btn btn-primary" onClick={() => { handleAddParam(arrayHelper) }}>Add Parameter</button>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>Key</th>
                                            <th>Value</th>
                                            <th>description</th>
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
                                                    <td className="d-flex align-items-center justify-content-center d-none">
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
                        </Form>
                    </FormikProvider>
                </div>
                <div className="tab-pane fade" id="pills-three" role="tabpanel" aria-labelledby="pills-three-tab">
                    <div className='w-full d-flex justify-content-between'>
                        <div className='d-flex mb-2'>
                            <div className="form-check">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" checked={bodyType == 'form_data'} id="form_data" onChange={(e) => { handleBody(e, 'form_data') }} />
                                <label className="form-check-label" role='button' htmlFor="form_data">
                                    form-data
                                </label>
                            </div>
                            <div className="form-check ms-4">
                                <input className="form-check-input" type="radio" name="flexRadioDefault" checked={bodyType == 'urlencoded'} id="urlencoded" onChange={(e) => { handleBody(e, 'urlencoded') }} />
                                <label className="form-check-label" role='button' htmlFor="urlencoded">
                                    x-www-form-urlencoded
                                </label>
                            </div>
                            <div className="form-check ms-4">
                                <input className="form-check-input" type="radio" checked={bodyType == 'raw'} name="flexRadioDefault" id="raw" onChange={(e) => { handleBody(e, 'raw') }} />
                                <label className="form-check-label" role='button' htmlFor="raw">
                                    raw
                                </label>
                            </div>
                        </div>
                        <div>
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm ms-3 mb-1"
                                onClick={handleEncryptDecrypt}
                            >
                                {isEncrypted ? "Decrypt" : "Encrypt"}
                            </button>
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
                                                    <div className="text-end d-none">
                                                        <button type="button" className="btn btn-primary" onClick={() => {handleAddParam(arrayHelper)}}>Add Parameter</button>
                                                    </div>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th>Key</th>
                                                <th>Value</th>
                                                <th>description</th>
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
                                                        <td className="d-flex align-items-center justify-content-center d-none">
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
                            <button className="nav-link try-api-tab " id="pills-new-tab" data-bs-toggle="pill" data-bs-target="#pills-new" type="button" role="tab" aria-controls="pills-new" aria-selected="false">Header </button>
                        </li>
                    </ul>
                </div>
                <div className='col-xl-4 col-lg-4 col-md-9 col-sm-8 col-8 d-flex align-items-center justify-content-end'>
                    <div className='text-end d-flex align-items-center"'>
                        <div className='me-3 mt-1'>
                            <span className="badge bg-success">200 OK</span>
                        </div>
                        <DropdownButton id="dropdown-basic-button" variant="light" size="sm" align="end" title={selectedCode || "Responses"} className="no-border-dropdown">
                            {respCode.length > 0 && respCode.map((item, index) => (
                                <Dropdown.Item key={index} onClick={() => setSelectedCode(item.code)}>{item.code}</Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm ms-3"
                        onClick={handleEncryptDecryptRes}>
                        {isEncryptedRes ? "Decrypt" : "Encrypt"}
                    </button>
                </div>

                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-onenew" role="tabpanel" aria-labelledby="pills-onenew-tab">
                        <EditableBody curl={bodyResSample} onChange={handleResChange} />
                    </div>
                </div>
            </div>
            <div className='border-top'></div>
            <div>
                <div className="offcanvas offcanvas-bottom bottom-backdrop" tabIndex="-1" id="offcanvasBottom" aria-labelledby="offcanvasBottomLabel">
                    <div className="offcanvas-header ">
                        <div className=" row d-flex w-100 align-items-center justify-content-between mb-2">
                            <div className='col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12'>
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