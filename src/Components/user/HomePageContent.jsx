import { useEffect, useState } from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import LangCurlExecuteComp from './LangCurlExecuteComp';
import SyntaxHighLighter from './SyntaxHighLighter';
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import { arrayIndex, convertToPayload, copyToClipboard, getTokenData, scrollToTop, sendEmail, trucateString } from '../../Utils';
import GetStarted from './GetStarted';
import { error_swal_toast, success_swal_toast } from '../../SwalServices';
import { post_auth_data, post_data } from '../../ApiServices';
import { PageLoaderBackdrop, Loader, LoaderWight } from '../../Loader';
import { generateApiRequestEmail } from '../../emailTemplate';
import { apiRequestUser } from '../../emailTemplate';
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
    const [requestLoader, setRequestLoader] = useState(false);
    const [openTryitModal, setOpenTryitModal] = useState(false)
    const [tryitButton, setTryitButton] = useState('')
    const [tryitLoader, setTryitLoader] = useState(false);
    const [tryitModalDesc, setTryitModalDesc] = useState('')
    const [bodyRequestSample, setBodyRequestSample] = useState('')
    const [hasTriedApi, setHasTriedApi] = useState(false);
    const location = useLocation();
    useEffect(() => {
        chekParamParameter()
    }, [api_id, collection_id, category_id])

    useEffect(() => {
        scrollToTop()
    }, [])

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
                // error_swal_toast(error.message)

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
        if (!getTokenData()?.company_name) {
            error_swal_toast('Company details required Please Update the Profile.')
            return
        }
        setTryitLoader(true)
        post_auth_data("portal/private", convertToPayload('check-api-access', payload), {})
            .then(async (response) => {
                setTryitLoader(false)
                setHasTriedApi(true)
                // navigate(`/try-api/${collection_id}/${category_id}/${api_id}`)
                if (response.data.status) {
                    // navigate(`/try-api/${collection_id}/${category_id}/${api_id}`)
                    window.open(`/try-api/${collection_id}/${category_id}/${api_id}`, "_blank");

                }
                else {
                    setOpenTryitModal(true)
                    setTryitModalDesc(response.data.message)
                    if (response.data.error_code == 'CLIENT_CRED_UNAVAILABLE') {
                        setTryitButton('Generate Credentials')
                    }
                    else {
                        setTryitButton('Request Access')
                    }
                }
            }).catch((error) => {
                setTryitLoader(false)
                console.log(error)
                setHasTriedApi(true)
                if (!api_id) {
                    navigate('/')
                }
                // error_swal_toast(error.message)

            })
    }
    // const sendRequest = () => {
    //     const payload = {
    //         api_id: api_id,
    //         application_name: apiData.application_name
    //     }
    //     setRequestLoader(true);
    //     post_auth_data("portal/private", convertToPayload('send-api-access-request', payload), {})
    //         .then(async (response) => {
    //             setRequestLoader(false);
    //             if (response.data.status) {
    //                 setOpenTryitModal(false);
    //                 success_swal_toast(response.data.message);
    //             }
    //             else {
    //                 error_swal_toast(response.data.message);
    //             }
    //         }).catch((error) => {
    //             setRequestLoader(false);
    //             error_swal_toast(error.message)
    //         })
    // }

    const sendRequest = async () => {
        const tokendata = getTokenData()
        console.log(tokendata)
            const payload = {
                api_id: api_id,
                application_name: apiData.application_name
            };
            setRequestLoader(true);

            try {
                const response = await post_auth_data(
                    "portal/private",
                    convertToPayload('send-api-access-request', payload),
                    {}
                );

                setRequestLoader(false);

                if (response.data.status) {
                    console.log("inside status condition 1", tokendata.emailid)
                    setOpenTryitModal(false);
                    success_swal_toast(response.data.message);
                    const adminEmail = "ctidgam1997@gmail.com"
                    console.log("inside status condition 2", tokendata.emailid)
                    const emailBody = generateApiRequestEmail({
                        adminName: "Admin",
                        apiName: apiData.apiname,
                        userName: tokendata.fullname,
                        userEmail: tokendata.emailid,
                        requestDate: new Date().toLocaleString(),
                        loginLink: "https://apidocs.bajajauto.com/"
                    })
                    console.log("inside status condition 3", tokendata.emailid)
                    const subject= "Approval Required - User API Access Request"
                    await sendEmail({ body: emailBody, toRecepients: [adminEmail], subject: subject, contentType: 'text/html' });
                    const emailBody2 = apiRequestUser({
                        apiName: apiData.apiname,
                        userName: tokendata.fullname
                    })
                    console.log("inside status condition 4", tokendata.emailid);
                    const userMail = tokendata.emailid
                    // const userMail = "sagarmeshram532@gmail.com"
                    await sendEmail({ body: emailBody2, toRecepients: [userMail], subject: "Bajaj Developer API Usage Details - Your Request", contentType: 'text/html' })
                } else {
                    error_swal_toast(response.data.message);
                }
            } catch (error) {
                setRequestLoader(false);
                error_swal_toast(error.message);
            }
    };


    useEffect(() => {
        if (category_id && !getTokenData()) {
            navigate('/');
        }
    }, [category_id])

    return (
        <div className="home-container">
            <div className="home-content">
                <div className={`center-content ${!api_id ? 'center-content-condition' : ''}`}>
                    {(collection_id) &&
                        <div className="card-new mb-3">
                            <div className="card-body card-bg">
                                <div className='row align-items-center'>
                                    <div className={api_id ? 'col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12' : 'col-12'}>
                                        <h1 className='mb-0'>{title || 'Get Started'}</h1>
                                        <ReactMarkdown  
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                h1: ({node, ...props}) => <h5 {...props} />, // all h1 become h3
                                                h2: ({node, ...props}) => <h5 {...props} />, // all h2 become h4
                                                h3: ({node, ...props}) => <h5 {...props} />, // all h2 become h4
                                            }}
                                        >{description}
                                        </ReactMarkdown>
                                    </div>
                                    <div className={api_id ? 'col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12' : ''}>
                                        <div className="d-flex justify-content-end">
                                            {
                                                // Case 1: before try -> only Try it aligned right
                                                api_id && (<button
                                                    className="btn btn-outline-primary px-3"
                                                    onClick={checkAccess}
                                                    disabled={tryitLoader}>
                                                    {tryitLoader ? "Loading..." : "Try it"}
                                                </button>)
                                            }
                                        </div>
                                    </div>
                                </div>
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
                    {api_id && apiData && JSON.parse(apiData?.reqbody?.value || '[]').length > 0 &&
                        (<div className="card mb-3">
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
                        </div>)}
                    {api_id && apiData && JSON.parse(apiData?.reqheader?.value || '[]').length > 0 &&
                        (<div className="card  mb-3">
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
                        </div>)}
                    {api_id && apiData && <div className="card  mb-3">
                        <div className="card-body card-bg">
                            <div className="row d-flex justify-content-between align-items-start mb-3">
                                <div className='col-xl-8 col-lg-8 col-md-12 col-sm-12 col-12'>
                                    <h5 className="mb-0">Response Sample :</h5>
                                </div>
                                <div className='col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12 d-flex justify-content-end'>
                                    <button onClick={() => { copyToClipboard(responsData.resbody || '{}') }} className='span-btn-cirlce-btn'><img src="/assets/img/copy.png" alt="copy" /></button>
                                </div>
                            </div>
                            <SyntaxHighLighter wrapLongLines={true} lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }} jsonString={responsData.resbody || '{}'} />
                        </div>
                    </div>}
                    {api_id && apiData && Object.keys(responsData.resschema.properties || {}).length > 0 &&
                        (<div className="card mb-3">
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
                        </div>)}
                    {api_id && apiData && JSON.parse(apiData?.resheader?.value || '[]').length > 0 &&
                        (<div className="card  mb-3">
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
                        </div>)}
                </div>
                {api_id && apiData && <div className="right-content">
                    <LangCurlExecuteComp apiData={apiData} setStatusCode={setStatusCode} bodyReqSample={bodyRequestSample} />
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
            <Modal size='md' show={openTryitModal} onHide={() => setOpenTryitModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0">
                    <h3>{tryitButton}</h3>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div style={{ fontSize: '1.25rem' }}>{tryitModalDesc}</div> {/* Slightly larger font */}
                        <div className="d-flex justify-content-end mt-3">
                            <Button variant="primary" type="button" onClick={sendRequest} disabled={requestLoader}>
                                {tryitButton} <i className="fa fa-arrow-right"></i> {requestLoader && <LoaderWight />}
                            </Button>
                        </div>
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