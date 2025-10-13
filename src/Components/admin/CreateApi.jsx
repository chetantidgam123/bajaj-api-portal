import { ErrorMessage, FormikProvider, useFormik } from 'formik';
// import { createApiSchema } from '../../Schema';
import { Form, Modal } from 'react-bootstrap';
import { apiMethods, arrayIndex, convertToPayload, offsetPagination, statusCodes } from '../../Utils';
import { useEffect, useState } from 'react';
import RequestParamtereAdd from './RequestParamtereAdd';
import moment from 'moment';
import { post_auth_data, post_data } from '../../ApiServices';
import { confirm_swal_with_text, error_swal_toast, success_swal_toast } from '../../SwalServices';
import { LoaderWight, PageLoaderBackdrop } from '../../Loader';
import generateSchema from "generate-schema";
import { useNavigate, useParams } from 'react-router-dom';

function CreateApi() {
    const { api_id } = useParams();
    const [loader, setLoader] = useState({ submit: false, pageloader: false });
    const [show, setShow] = useState(false);
    const [showSampleModal, setShowSampleModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [modalvalue, setModalvalue] = useState(false);
    const [applicationList, setApplicationList] = useState([]);
    const [sampleIndex, setSampleIndex] = useState(-1);
    const [categoryList, setCategoryList] = useState([])
    const [subCategoryList, setSubCategoryList] = useState([])

    const navigate = useNavigate();
    const apiForm = useFormik({
        initialValues: {
            "categoryid": 0,
            "subcategoryid": 0,
            "apiname": "",
            "apiurl": "",
            "apimethod": "",
            "application_name": "",
            "reqbody": [],
            "query_params": [],
            "uri_params": [],
            "reqheader": [],
            "resheader": [],
            "reqsample": {},
            "reqschema": {},
            "responses": [],
            "description": ""
        },
        // validationSchema: createApiSchema,
        onSubmit: (values) => {
            let obj = values;
            obj.categoryid = Number(obj.categoryid)
            if (api_id) {
                obj.uniqueid = api_id
            }
            obj.subcategoryid = Number(obj.subcategoryid)
            obj.responses = obj.responses.map((e) => {
                let _o = {
                    ...e,
                    reqbody: e.reqbody,
                    reqschema: e.reqschema,
                    resbody: e.resbody,
                    resschema: e.resschema
                }
                if (e.code == 200) {
                    obj.reqsample = e.reqbody
                    obj.reqschema = e.reqschema
                }
                return _o
            });
            // 🔹 Ensure these two are strings
            if (typeof obj.reqsample === "object") {
                obj.reqsample = JSON.stringify(obj.reqsample, null, 2);
            }
            if (typeof obj.reqschema === "object") {
                obj.reqschema = JSON.stringify(obj.reqschema, null, 2);
            }
            if (api_id) {
                createApi(obj, 'update-api');
            } else {
                createApi(obj);
            }
        },

    })
    const sampelForm = useFormik({
        initialValues: {
            "code": 200,
            "reqbody": JSON.stringify({}, null, 2),
            "reqschema": JSON.stringify({}, null, 2),
            "resbody": JSON.stringify({}, null, 2),
            "resschema": JSON.stringify({}, null, 2),
            "createdat": moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            "updatedat": moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
        },
        // validationSchema: createApiSchema,
        onSubmit: (values) => {
            console.log(values)
            let obj = {
                ...values,
                code: Number(values.code),
                reqbody: values.reqbody,
                reqschema: values.reqschema,
                resbody: values.resbody,
                resschema: values.resschema,
            }
            let res_Arr = apiForm.values.responses || [];
            if (sampleIndex >= 0) {
                res_Arr[sampleIndex] = obj;
            } else {
                res_Arr.push(obj);
            }
            apiForm.setValues({
                ...apiForm.values,
                responses: res_Arr
            })
            setShowSampleModal(false);

        },

    })
    const createApi = (payload, type = 'create-api') => {
        setLoader({ ...loader, submit: true });
        post_auth_data("portal/private", convertToPayload(type, payload), {})
            .then((response) => {
                setLoader({ ...loader, submit: false });
                if (response.data.status) {
                    success_swal_toast(response.data.message);
                    navigate('/master/api-list')
                } else {
                    error_swal_toast(response.data.message)
                }
            }).catch((error) => {
                setLoader({ ...loader, submit: false });
                error_swal_toast(error.message || error);
            })
    };
    const handleModal = (modalType) => {
        if (modalType == 'reqbody') {
            setModalvalue(apiForm.values.reqbody || [])
        }
        else if (modalType == 'reqheader') {
            setModalvalue(apiForm.values.reqheader || [])
        }
        else if (modalType == 'resheader') {
            setModalvalue(apiForm.values.resheader || [])
        }
        else if (modalType == 'query_params') {
            setModalvalue(apiForm.values.query_params || [])
        }
        else if (modalType == 'uri_params') {
            setModalvalue(apiForm.values.uri_params || [])
        }
        setModalType(modalType);
        setShow(true);
    }
    const viewSample = (item, index = 0) => {
        sampelForm.setValues({
            ...sampelForm.values,
            ...item,
            reqbody: jsonback(item.reqbody || {}),
            reqschema: jsonback(item.reqschema || {}),
            resbody: jsonback(item.resbody || {}),
            resschema: jsonback(item.resschema || {}),
        });
        setSampleIndex(index);
        setShowSampleModal(true);
    }
    const jsonback = (val) => {
        let obj = {};
        try { obj = JSON.parse(val) } catch (e) { obj = val; console.log(e) }
        return (JSON.stringify(obj, null, 2));
    }

    const getCategoryList = () => {
        post_auth_data("portal/private", convertToPayload('get-all-categories', {}), {})
            .then((response) => {
                setLoader({ ...loader, pageloader: false })
                if (response.data.status) {
                    setCategoryList(response.data.data || [])
                } else {
                    error_swal_toast(response.data.message);
                    setCategoryList([]);
                }
            }).catch((error) => {
                setLoader({ ...loader, pageloader: false })
                setCategoryList([])
                error_swal_toast(error.message || error);
            })
    }
    const getSubCategoryList = (page = 1) => {
        let payload = {
            category_id: apiForm.values.categoryid,
            offset: ((page - 1) * offsetPagination),
            limit: offsetPagination
        }
        post_auth_data("portal/private", convertToPayload('get-all-sub-categories', payload), {})
            .then((response) => {
                if (response.data.status) {
                    setSubCategoryList(response.data.data || [])
                } else {
                    setSubCategoryList([]);
                }
            }).catch((error) => {
                setSubCategoryList([])
            })
    }
    const getApiById = () => {
        setLoader({ ...loader, pageloader: true });
        post_auth_data("portal/private", convertToPayload('get-api-by-id', { uniqueid: api_id }), {})
            .then((response) => {
                setLoader({ ...loader, pageloader: false });
                if (response.data.status) {
                    apiForm.setValues({
                        ...apiForm.values,
                        "application_name": response.data.data.application_name,
                        "categoryid": response.data.data.categoryid,
                        "subcategoryid": response.data.data.subcategoryid,
                        "apiname": response.data.data.apiname,
                        "apiurl": response.data.data.apiurl,
                        "apimethod": response.data.data.apimethod,
                        "reqbody": JSON.parse(response.data.data.reqbody.value || '[]'),
                        "query_params": JSON.parse(response.data.data.query_params?.value || '[]'),
                        "uri_params": JSON.parse(response.data.data.uri_params?.value || '[]'),
                        "reqheader": JSON.parse(response.data.data.reqheader.value || '[]'),
                        "resheader": JSON.parse(response.data.data.resheader.value || '[]'),
                        "reqsample": response.data.data.reqsample,
                        "reqschema": response.data.data.reqschema,
                        "responses": JSON.parse(response.data.data.responses.value || '[]'),
                        "description": response.data.data.description,
                    })
                } else {
                    error_swal_toast(response.data.message);
                }
            }).catch((error) => {
                console.log(error)
                setLoader({ ...loader, pageloader: false });
                error_swal_toast(error.message);
            })
    }
    const confirm_swal_call = (index) => {
        const callback = (resolve, reject) => {
            let res_Arr = apiForm.values.responses || [];
            res_Arr.splice(index, 1)
            apiForm.setValues({
                ...apiForm.values,
                responses: res_Arr
            })
            resolve();
        }
        confirm_swal_with_text(callback, `Are you sure <br/> you want to remove sample?`)
    }
    const handleAddSampleModal = () => {
        sampelForm.resetForm();
        setShowSampleModal(true);
        setSampleIndex(-1)
    }
    const handleGenerate = (value, type) => {
        try {
            const parsed = JSON.parse(value);
            const rawSchema = generateSchema.json("GeneratedSchema", parsed);
            rawSchema.required = Object.keys(rawSchema.properties);
            if (type == 'req') {
                sampelForm.setValues({ ...sampelForm.values, reqschema: JSON.stringify(rawSchema, null, 2) })
            } else {
                sampelForm.setValues({ ...sampelForm.values, resschema: JSON.stringify(rawSchema, null, 2) })
            }
        } catch (err) {
            console.error("Invalid JSON", err);
            error_swal_toast('Invalid JSON')
        }
    };
    const getApplicationList = () => {
        post_data("portal/public", convertToPayload('getPlatformApps', { "env_id": "f79233ef-d46b-4d66-83e4-e7b0c7b7c442" }), {})
            .then((response) => {
                console.log(response)
                setLoader({ ...loader, pageloader: false })
                let _a = response.data.instances || []
                _a = _a.map((app) => {
                    let obj = {
                        id: app.id,
                        name: app.assetId,
                    }
                    return obj
                })
                setApplicationList(_a)
            }).catch((error) => {
                setLoader({ ...loader, pageloader: false })
                setApplicationList([])
                error_swal_toast(error.message || error);
            })
    }

    useEffect(() => {
        if (apiForm.values.categoryid) {
            getSubCategoryList();
        } else {
            setSubCategoryList([])
        }
    }, [apiForm.values.categoryid])

    useEffect(() => {
        getCategoryList();
        getApplicationList();
        if (api_id?.length > 0) {
            getApiById()
        }
    }, [])
    return (
        <div>
            <FormikProvider value={apiForm}>
                <Form className="api-form" autoComplete="off">
                    <div className="card">
                        <h3 className="card-header">Basic Details</h3>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                                    <label className="form-label" htmlFor="categoryid">Category</label>
                                    <select className="form-select" id="categoryid" name="categoryid"
                                        value={apiForm.values.categoryid}
                                        onChange={apiForm.handleChange}>
                                        <option value="">Select Category</option>
                                        {
                                            categoryList.map((m, i) => (
                                                <option key={arrayIndex('category', i)} value={m?.id}>{m.categoryname}</option>
                                            ))
                                        }
                                    </select>
                                    <ErrorMessage name={"categoryid"} component="small" className='text-danger' />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                                    <label className="form-label" htmlFor="subcategoryid">Sub Category</label>
                                    <select className="form-select" id="subcategoryid" name="subcategoryid"
                                        value={apiForm.values.subcategoryid}
                                        onChange={apiForm.handleChange}>
                                        <option value="">Select Subcategory</option>
                                        {
                                            subCategoryList.map((m, i) => (
                                                <option key={arrayIndex('sub-category', i)} value={m?.id}>{m.subcategoryname}</option>
                                            ))
                                        }
                                    </select>
                                    <ErrorMessage name={"subcategoryid"} component="small" className='text-danger' />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                                    <label htmlFor="apiname" className="form-label" >Api Name</label>
                                    <input type="text" className='form-control' name='apiname'
                                        onChange={apiForm.handleChange} onBlur={apiForm.handleBlur}
                                        value={apiForm.values.apiname} />
                                    <ErrorMessage name="apiname" component="small" className='text-danger' />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                                    <label htmlFor="apiurl" className="form-label" >Api Url</label>
                                    <input type="text" className='form-control' name='apiurl'
                                        onChange={apiForm.handleChange} onBlur={apiForm.handleBlur}
                                        value={apiForm.values.apiurl} />
                                    <ErrorMessage name="apiurl" component="small" className='text-danger' />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                                    <label className="form-label" htmlFor="apimethod">Api Method</label>
                                    <select className="form-select" id="apimethod" name="apimethod"
                                        value={apiForm.values.apimethod}
                                        onChange={apiForm.handleChange}>
                                        <option value="">Select Method</option>
                                        {
                                            apiMethods.map((m, i) => (
                                                <option key={arrayIndex('api-method', i)} value={m.id}>{m.name}</option>
                                            ))
                                        }
                                    </select>
                                    <ErrorMessage name={"apimethod"} component="small" className='text-danger' />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                                    <label className="form-label" htmlFor="application_name">Application Name</label>
                                    <select className="form-select position-relative" id="application_name" name="application_name"
                                        value={apiForm.values.application_name}
                                        onChange={apiForm.handleChange}>
                                        <option value="">Select app</option>
                                        {
                                            applicationList.map((m, i) => (
                                                <option key={arrayIndex('application_name', i)} value={m.name}>{m.name}</option>
                                            ))
                                        }
                                    </select>
                                    <ErrorMessage name={"apimethod"} component="small" className='text-danger' />
                                </div>
                                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12 mb-3">
                                    <label htmlFor="apiurl" className="form-label" >Api Endpoint</label>
                                    <input type="text" className='form-control' name='apiurl'
                                    // onChange={apiForm.handleChange}
                                    //  onBlur={apiForm.handleBlur}
                                    // value={apiForm.values.apiurl} 
                                    />
                                    <ErrorMessage name="apiurl" component="small" className='text-danger' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card my-3">
                        <div className=" card-header d-flex justify-content-between">
                            <h5 className="my-2">Query Parameters</h5>
                            <button className='btn btn-primary' type='button' onClick={() => { handleModal('query_params') }}>Add Parameter</button>
                        </div>
                        <div className="card-body">
                            <div className='table-responsive'>
                                <table className="table table-bordered ">
                                    <thead>
                                        <tr>
                                            <th>Key</th>
                                            <th>Value</th>
                                            <th>Required</th>
                                            <th>description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            apiForm.values.query_params.map((item, i) => (
                                                <tr key={arrayIndex('table-req-header', i)}>
                                                    <td>{item.key}</td>
                                                    <td>{item.value}</td>
                                                    <td className="d-flex align-items-center justify-content-center">
                                                        <input style={{ height: "15px", width: "15px", margin: "5px 5px 8px 5px" }} checked={item.isrequired} type="checkbox" className='form-check' readOnly />
                                                    </td>
                                                    <td>{item.description}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="card my-3">
                        <div className=" card-header d-flex justify-content-between">
                            <h5 className="my-2">Uri Parameters</h5>
                            <button className='btn btn-primary' type='button' onClick={() => { handleModal('uri_params') }}>Add Parameter</button>
                        </div>
                        <div className="card-body">
                            <div className='table-responsive'>
                                <table className="table table-bordered ">
                                    <thead>
                                        <tr>
                                            <th>Key</th>
                                            <th>Value</th>
                                            <th>Required</th>
                                            <th>description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            apiForm.values.uri_params.map((item, i) => (
                                                <tr key={arrayIndex('table-req-header', i)}>
                                                    <td>{item.key}</td>
                                                    <td>{item.value}</td>
                                                    <td className="d-flex align-items-center justify-content-center">
                                                        <input style={{ height: "15px", width: "15px", margin: "5px 5px 8px 5px" }} checked={item.isrequired} type="checkbox" className='form-check' readOnly />
                                                    </td>
                                                    <td>{item.description}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="card my-3">
                        <div className=" card-header d-flex justify-content-between">
                            <h5 className="my-2">Request Parameter</h5>
                            <button className='btn btn-primary' type='button' onClick={() => { handleModal('reqbody') }}>Add Parameter</button>
                        </div>
                        <div className="card-body">
                            <div className='table-responsive'>
                                <table className="table table-bordered ">
                                    <thead className='text-truncate'>
                                        <tr>
                                            <th>Key</th>
                                            <th>Value</th>
                                            <th>Required</th>
                                            <th>description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            apiForm.values.reqbody.map((item, i) => (
                                                <tr key={arrayIndex('table-req-body', i)}>
                                                    <td>{item.key}</td>
                                                    <td>{item.value}</td>
                                                    <td className="d-flex align-items-center justify-content-center">
                                                        <input style={{ height: "15px", width: "15px", margin: "5px 5px 8px 5px" }} checked={item.isrequired} type="checkbox" className='form-check' readOnly />
                                                    </td>
                                                    <td>{item.description}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="card my-3">
                        <div className=" card-header d-flex justify-content-between">

                            <h5 className="my-2">Request Headers</h5>
                            <button className='btn btn-primary' type='button' onClick={() => { handleModal('reqheader') }}>Add Parameter</button>
                        </div>
                        <div className="card-body">
                            <div className='table-responsive'>
                                <table className="table table-bordered ">
                                    <thead>
                                        <tr>
                                            <th>Key</th>
                                            <th>Value</th>
                                            <th>Required</th>
                                            <th>description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            apiForm.values.reqheader.map((item, i) => (
                                                <tr key={arrayIndex('table-req-header', i)}>
                                                    <td>{item.key}</td>
                                                    <td>{item.value}</td>
                                                    <td className="d-flex align-items-center justify-content-center">
                                                        <input style={{ height: "15px", width: "15px", margin: "5px 5px 8px 5px" }} checked={item.isrequired} type="checkbox" className='form-check' readOnly />
                                                    </td>
                                                    <td>{item.description}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="card my-3">
                        <div className=" card-header d-flex justify-content-between">
                            <h5 className="my-2">Response Headers</h5>
                            <button className='btn btn-primary' type='button' onClick={() => { handleModal('resheader') }}>Add Parameter</button>
                        </div>
                        <div className="card-body">
                            <div className='table-responsive'>
                                <table className="table table-bordered ">
                                    <thead className='text-truncate'>
                                        <tr>
                                            <th>Key</th>
                                            <th>Value</th>
                                            <th>Required</th>
                                            <th>description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            apiForm.values.resheader.map((item, i) => (
                                                <tr key={arrayIndex('table-req-header', i)}>
                                                    <td>{item.key}</td>
                                                    <td>{item.value}</td>
                                                    <td className="d-flex align-items-center justify-content-center">
                                                        <input style={{ height: "15px", width: "15px", margin: "5px 5px 8px 5px" }} checked={item.isrequired} type="checkbox" className='form-check' readOnly />
                                                    </td>
                                                    <td>{item.description}</td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="card my-3">
                        <div className=" card-header d-flex justify-content-between">
                            <h5 className="my-2">Request Sample</h5>
                            <button className='btn btn-primary' type='button' onClick={handleAddSampleModal}>Add Parameter</button>
                        </div>
                        <div className="card-body">
                            <div className='table-responsive'>
                                <table className="table table-bordered ">
                                    <thead className='text-truncate'>
                                        <tr>
                                            <th>Sr. No.</th>
                                            <th>Status Code</th>
                                            <th>Created at</th>
                                            <th>Updated at</th>
                                            <th>action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            apiForm.values.responses.map((item, i) => (
                                                <tr key={arrayIndex('table-req-header', i)}>
                                                    <td>{i + 1}</td>
                                                    <td>{item.code}</td>
                                                    <td>{moment(item.createdat).format('DD-MMM-YY')}</td>
                                                    <td>{moment(item.updatedat).format('DD-MMM-YY')}</td>
                                                    <td className='text-truncate'>
                                                        <button type='button' className='btn btn-primary btn-sm mx-2' onClick={() => { viewSample(item, i) }}><i className='fa fa-pencil'></i></button>
                                                        <button type='button' className='btn btn-danger btn-sm' onClick={() => { confirm_swal_call(i) }}><i className='fa fa-trash'></i></button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className='text-end'>
                        <button className='btn btn-primary' onClick={apiForm.handleSubmit} type='button' disabled={loader.submit}>Submit {loader.submit && <LoaderWight />}</button>
                    </div>
                </Form>
            </FormikProvider>

            <Modal size="xl" show={showSampleModal} onHide={() => setShowSampleModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0">
                    <h3>Add Sample</h3>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    <FormikProvider value={apiForm}>
                        <Form className="api-form" autoComplete="off">
                            <div className='mb-3 col-xl-4 col-lg-4 col-md-4 col-sm-12 col-xs-12'>
                                <label className="form-label" htmlFor="code">Status Code</label>
                                <select className="form-select" id="code" name="code"
                                    value={sampelForm.values.code}
                                    onChange={sampelForm.handleChange}>
                                    <option value="">Select Code</option>
                                    {
                                        statusCodes.map((m, i) => (
                                            <option key={arrayIndex('code-method', i)} value={m.id}>{m.name}</option>
                                        ))
                                    }
                                </select>
                                <ErrorMessage name="code" component="small" className='text-danger' />
                            </div>
                            <div className="row">
                                <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12">
                                    <label htmlFor="reqbody" className="form-label" > Request json:</label>
                                    <textarea rows={8} className='w-100 p-3' name='reqbody'
                                        onChange={sampelForm.handleChange} onBlur={sampelForm.handleBlur}
                                        value={sampelForm.values.reqbody} />
                                    <ErrorMessage name="reqbody" component="small" className='text-danger' />
                                </div>
                                <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12 d-flex justify-content-center align-items-center">
                                    <button type='button' className='btn btn-primary' onClick={() => { handleGenerate(sampelForm.values.reqbody, 'req') }}>Generate Schema</button>
                                </div>
                                <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12">
                                    <label htmlFor="reqschema" className="form-label" >Request Schema:</label>
                                    <textarea rows={8} className='w-100 p-3' name='reqschema'
                                        onChange={sampelForm.handleChange} onBlur={sampelForm.handleBlur}
                                        value={sampelForm.values.reqschema} />
                                    <ErrorMessage name="reqschema" component="small" className='text-danger' />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12">
                                    <label htmlFor="resbody" className="form-label" > Response json:</label>
                                    <textarea rows={8} className='w-100 p-3' name='resbody'
                                        onChange={sampelForm.handleChange} onBlur={sampelForm.handleBlur}
                                        value={sampelForm.values.resbody} />
                                    <ErrorMessage name="resbody" component="small" className='text-danger' />
                                </div>

                                <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 col-xs-12  d-flex justify-content-center align-items-center">
                                    <button type='button' className='btn btn-primary' onClick={() => { handleGenerate(sampelForm.values.resbody, 'res') }}>Generate Schema</button>
                                </div>
                                <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12 col-xs-12">
                                    <label htmlFor="resschema" className="form-label" >Response Schema:</label>
                                    <textarea rows={8} className='w-100 p-3' name='resschema'
                                        onChange={sampelForm.handleChange} onBlur={sampelForm.handleBlur}
                                        value={sampelForm.values.resschema} />
                                    <ErrorMessage name="resschema" component="small" className='text-danger' />
                                </div>
                            </div>
                            <div className='text-end'>
                                <button className='btn btn-primary' onClick={sampelForm.handleSubmit} type='button'>Submit</button>
                            </div>
                        </Form>
                    </FormikProvider>
                </Modal.Body>
            </Modal>

            <Modal size="xl" show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton className="border-bottom-0">
                    <h3>Request Parameter</h3>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    {modalvalue && <RequestParamtereAdd modalvalue={modalvalue} setShow={setShow} modalType={modalType} apiForm={apiForm} />}
                </Modal.Body>
            </Modal>
            {loader.pageloader && <PageLoaderBackdrop />}
        </div>
    )
}

export default CreateApi
