import { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LangCurlExecuteComp from './LangCurlExecuteComp';
import SyntaxHighLighter from './SyntaxHighLighter';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { arrayIndex, convertToPayload, copyToClipboard, getTokenData, trucateString } from '../../Utils';
import GetStarted from './GetStarted';
import { error_swal_toast } from '../../SwalServices';
import { post_auth_data, post_data } from '../../ApiServices';
import { PageLoaderBackdrop } from '../../Loader';
function HomePageContent() {
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

    useEffect(() => {
        if (statusCode > 0) {
            let res = JSON.parse(apiData.responses.value || '[]');
            for (const item of res) {
                if (item.code == statusCode) {
                    setResponsData({ resbody: item.resbody, resschema: JSON.parse(item.resschema) });
                    break; // stop after first match
                }
            }
        }
    }, [statusCode])

    const checkAccess = () => {
        const payload = { api_id: api_id }
        post_auth_data("portal/private", convertToPayload('check-api-access', payload), {})
            .then(async (response) => {
                console.log(response)
            }).catch((error) => {
                console.log(error)
                error_swal_toast(error.message)

            })
    }

    useEffect(() => {
        if (category_id && !getTokenData()) {
            navigate('/');
        }
    }, [category_id])

    return (
        <div className="home-container">
            {/* <div className="bg-white my-2 p-2 text-end">
                <button className='btn btn-primary' onClick={checkAccess}>Try it</button>
            </div> */}
            <div className="home-content">
                <div className={`center-content ${!api_id ? 'center-content-condition' : ''}`}>
                    {(collection_id) &&
                        <div className="card-new mb-3">
                            <div className="card-body card-bg">
                                <div className='row align-items-center'>
                                    <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                                        <h5 className='mb-0'>{title || 'Get Started'}</h5>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{description}</ReactMarkdown>
                                    </div>
                                    <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                                        <button className="btn btn-outline-primary profilePageButton px-4" onClick={checkAccess}>Try it</button>

                                    </div>
                                </div>

                                {/* {(collection_id == 0 && getTokenData()?.role != 1) && <GetStarted />} */}
                            </div>
                        </div>}
                    {(collection_id == 0 || location.pathname.includes('get-started')) && <GetStarted />}
                    {api_id && apiData && <div className="card  mb-3">
                        <div className="card-body card-bg">
                            <div className="row d-flex justify-content-between align-items-start mb-3">
                                <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                                    <h5 className="mb-0" id='requestSample'>Request Sample :</h5>
                                </div>
                                <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                                    <button onClick={() => { copyToClipboard(JSON.parse(apiData.reqsample) || '{}') }} className='span-btn-cirlce'><img src="/assets/img/copy.png" alt="copy" /></button>
                                </div>

                            </div>
                            <SyntaxHighLighter jsonString={JSON.parse(apiData.reqsample) || '{}'} />
                        </div>
                    </div>}
                    {api_id && apiData && <div className="card mb-3">
                        <div className="card-body card-bg">
                            <div className="row d-flex justify-content-between align-items-start mb-3">
                                <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                                    <h5>Request Parameters Details :</h5>
                                </div>
                                <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                                    <button type="button" className="btn btn-outline-primary" onClick={() => { setModalData({ header: [], body: JSON.parse(apiData?.reqbody?.value || '[]') }); setShow(true) }}>View in detail</button>
                                </div>

                            </div>
                            <div className="table-responsive-custom">
                                <Table bordered responsive='lg'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Data Type</th>
                                            <th>Required/Optional</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            JSON.parse(apiData?.reqbody?.value || '[]').length > 0 ?
                                                JSON.parse(apiData?.reqbody?.value || '[]').map((li, i) => (
                                                    <tr key={arrayIndex('reqli', i)}>
                                                        <td>{li.key}</td>
                                                        <td>{typeof (li.value || '')}</td>
                                                        <td>{li.isrequired ? "Required" : "Optional"}</td>
                                                        <td>{trucateString(li.description, 25)}</td>
                                                    </tr>
                                                )) :
                                                <tr>
                                                    <td className='text-center' colSpan={4}>No Parameter available</td>
                                                </tr>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>}
                    {api_id && apiData && <div className="card  mb-3">
                        <div className="card-body card-bg">
                            <div className="row d-flex justify-content-between align-items-start mb-3">
                                <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                                    <h5>Request Headers :</h5>
                                </div>
                                <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                                    <button type="button" className="btn btn-outline-primary" onClick={() => { setModalData({ header: [], body: JSON.parse(apiData?.reqheader?.value || '[]') }); setShow(true) }}>View in detail</button>
                                </div>
                            </div>
                            <div className="table-responsive-custom">
                                <Table bordered responsive='lg'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Data Type</th>
                                            <th>Required/Optional</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            JSON.parse(apiData?.reqheader?.value || '[]').length > 0 ?
                                                JSON.parse(apiData?.reqheader?.value || '[]').map((li, i) => (
                                                    <tr key={arrayIndex('reqliheader', i)}>
                                                        <td>{li.key}</td>
                                                        <td>{typeof (li.value || '')}</td>
                                                        <td>{li.isrequired ? "Required" : "Optional"}</td>
                                                        <td>{trucateString(li.description, 25)}</td>
                                                    </tr>
                                                )) :
                                                <tr>
                                                    <td className='text-center' colSpan={4}>No header available</td>
                                                </tr>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>}
                    {api_id && apiData && <div className="card  mb-3">
                        <div className="card-body card-bg">
                            <div className="row d-flex justify-content-between align-items-start mb-3">
                                <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                                    <h5 className="mb-0">Response Sample :</h5>
                                </div>
                                <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                                    <button onClick={() => { copyToClipboard(responsData.resbody || '{}') }} className='span-btn'><img src="/assets/img/copy.png" alt="copy" /></button>
                                </div>
                            </div>
                            <SyntaxHighLighter jsonString={responsData.resbody || '{}'} />
                        </div>
                    </div>}
                    {api_id && apiData && <div className="card mb-3">
                        <div className="card-body card-bg">
                            <div className="row d-flex justify-content-between align-items-start mb-3">
                                <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                                    <h5 className="mb-0">Response Parameters Details :</h5>
                                </div>
                                <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                                    <button type="button" className="btn btn-outline-primary" onClick={() => { setShow1(true) }}>View in detail</button>
                                </div>
                            </div>

                            <div className="table-responsive-custom">
                                <Table bordered responsive='lg'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Data Type</th>
                                            <th>Required/Optional</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            Object.keys(responsData.resschema.properties || {}).length > 0 ?
                                                Object.keys(responsData.resschema?.properties || {}).map((li, i) => (
                                                    <tr key={arrayIndex('reqli', i)}>
                                                        <td>{li}</td>
                                                        <td>{responsData.resschema?.properties[li]?.type || "string"}</td>
                                                        <td>{responsData.resschema?.required?.includes(li) ? "Required" : "Optional"}</td>
                                                        <td>{trucateString(li?.description, 25)}</td>
                                                    </tr>
                                                )) :
                                                <tr>
                                                    <td colSpan={4} className='text-center'>No Parameter available</td>
                                                </tr>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>}
                    {api_id && apiData && <div className="card  mb-3">
                        <div className="card-body card-bg">
                            <div className="row d-flex justify-content-between align-items-start mb-3">
                                <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                                    <h5 className="mb-0">Response Headers :</h5>
                                </div>
                                <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                                    <button type="button" className="btn btn-outline-primary" onClick={() => { setModalData({ header: [], body: JSON.parse(apiData?.resheader?.value || '[]') }); setShow(true) }}>View in detail</button>
                                </div>
                            </div>

                            <div className="table-responsive-custom">
                                <Table bordered responsive='lg'>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Data Type</th>
                                            <th>Required/Optional</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            JSON.parse(apiData?.resheader?.value || '[]').length > 0 ?
                                                JSON.parse(apiData?.resheader?.value || '[]').map((li, i) => (
                                                    <tr key={arrayIndex('reqliheader', i)}>
                                                        <td>{li.key}</td>
                                                        <td>{li.type || "string"}</td>
                                                        <td>{"Required"}</td>
                                                        <td>{trucateString(li.description, 25)}</td>
                                                    </tr>
                                                )) :
                                                <tr>
                                                    <td colSpan={4} className='text-center'>No header available</td>
                                                </tr>
                                        }
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>}
                </div>
                {api_id && apiData && <div className="right-content">
                    <LangCurlExecuteComp apiData={apiData} setStatusCode={setStatusCode} />
                </div>}
            </div>
            <Modal size="xl" show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton className="border-bottom-0"><h4>Request Parameters Details :</h4></Modal.Header>
                <Modal.Body >
                    <div className="table-responsive-custom">
                        <Table bordered responsive='lg'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Data Type</th>
                                    <th>Required/Optional</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    modalData.body.length > 0 ?
                                        modalData.body.map((li, i) => (
                                            <tr key={arrayIndex('reqli', i)}>
                                                <td>{li.key}</td>
                                                <td>{typeof (li.value || '')}</td>
                                                <td>{li.isrequired ? "Required" : "Optional"}</td>
                                                <td>{li.description}</td>
                                            </tr>
                                        )) :
                                        <tr>
                                            <td className='text-center' colSpan={4}>No Parameter available</td>
                                        </tr>
                                }

                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal size="xl" show={show1} onHide={() => setShow1(false)} centered>
                <Modal.Header closeButton className="border-bottom-0"><h4>Response Parameters Details :</h4></Modal.Header>
                <Modal.Body >
                    <div className="table-responsive-custom">
                        <Table bordered responsive='lg'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Data Type</th>
                                    <th>Required/Optional</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    Object.keys(responsData.resschema.properties || {}).length > 0 ?
                                        Object.keys(responsData.resschema?.properties || {}).map((li, i) => (
                                            <tr key={arrayIndex('reqli', i)}>
                                                <td>{li}</td>
                                                <td>{responsData.resschema?.properties[li]?.type || "string"}</td>
                                                <td>{responsData.resschema?.required?.includes(li) ? "Required" : "Optional"}</td>
                                                <td>{responsData.resschema?.properties[li]?.description}</td>
                                            </tr>
                                        )) :
                                        <tr>
                                            <td colSpan={4} className='text-center'>No Parameter available</td>
                                        </tr>
                                }

                            </tbody>
                        </Table>
                    </div>
                </Modal.Body>
            </Modal>
            {
                loader && <PageLoaderBackdrop />
            }
        </div>
    );
}

export default HomePageContent;