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
    const [bodyRequestSample, setBodyRequestSample] = useState('')
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
                <button className='btn btn-primary ms-2 px-3'>Send</button>
            </div>

            <ul class="nav nav-pills mb-3 mt-3" id="pills-tab" role="tablist">
                <li class="nav-item pe-3" role="presentation">
                    <button class="nav-link  try-api-tab active" id="pills-one-tab" data-bs-toggle="pill" data-bs-target="#pills-one" type="button" role="tab" aria-controls="pills-one" aria-selected="true">Params</button>
                </li>
               
                <li class="nav-item px-3" role="presentation">
                    <button class="nav-link try-api-tab " id="pills-two-tab" data-bs-toggle="pill" data-bs-target="#pills-two" type="button" role="tab" aria-controls="pills-two" aria-selected="false"> Headers (8)</button>
                </li>
                <li class="nav-item px-3" role="presentation">
                    <button class="nav-link try-api-tab body-dot" id="pills-three-tab" data-bs-toggle="pill" data-bs-target="#pills-three" type="button" role="tab" aria-controls="pills-three" aria-selected="false">
                        Body
                    </button>
                </li>


            </ul>
            <div class="tab-content" id="pills-tabContent">
                <div class="tab-pane fade show active" id="pills-one" role="tabpanel" aria-labelledby="pills-one-tab">
                <div className='table-responsive'>
                    <table className='table table-bordered'>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Key</th>
                                <th>Value</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th></th>
                                <th>Key</th>
                                <th>Value</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                </div>
                <div class="tab-pane fade" id="pills-two" role="tabpanel" aria-labelledby="pills-two-tab">.2..</div>
                <div class="tab-pane fade" id="pills-three" role="tabpanel" aria-labelledby="pills-three-tab">.3..</div>
               
            </div>
            <div className='d-flex'>
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                    <label class="form-check-label" for="flexRadioDefault1">
                        form-data
                    </label>
                </div>
                <div class="form-check ms-4">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                    <label class="form-check-label" for="flexRadioDefault2">
                        x-www-form-urlencoded
                    </label>
                </div>
                <div class="form-check ms-4">
                    <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked />
                    <label class="form-check-label" for="flexRadioDefault2">
                        raw
                    </label>
                </div>
            </div>
            <div className='box-apiplay'>
                <p className='text-center'>This request does not have a body</p>
            </div>
            <div className='border-top'></div>
            <div className='row d-flex justify-content-between'>
                <div className='col-xl-3 col-lg-3 col-md-3 col-sm-4 col-4'>
                    <ul class="nav nav-pills my-1" id="pills-tab" role="tablist">
                        <li class="nav-item pe-3" role="presentation">
                            <button class="nav-link  try-api-tab active" id="pills-onenew-tab" data-bs-toggle="pill" data-bs-target="#pills-onenew" type="button" role="tab" aria-controls="pills-onenew" aria-selected="true">Body</button>
                        </li>
                        <li class="nav-item px-3" role="presentation">
                            <button class="nav-link try-api-tab " id="pills-new-tab" data-bs-toggle="pill" data-bs-target="#pills-new" type="button" role="tab" aria-controls="pills-new" aria-selected="false">Header (8)</button>
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
                <div class="tab-content" id="pills-tabContent">
                    <div class="tab-pane fade show active" id="pills-onenew" role="tabpanel" aria-labelledby="pills-onenew-tab">
                        <span class="badge bg-secondary mb-2"> { } JSON  <i class="fa-solid fa-angle-down"></i></span>

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
                    <div class="tab-pane fade" id="pills-twonew" role="tabpanel" aria-labelledby="pills-twonew-tab">.2..</div>

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
                                <span className='me-2 mb-0'>All Logs <i class="fa-solid fa-angle-down"></i></span>
                                <span class="badge bg-light text-dark">Clear</span>
                                <i class="fa-solid fa-copy me-2 text-secondary"></i>
                                <img src={dots} className='ms-2' alt="" style={{ width: '20px', height: '20px' }} />
                                <img src={uparrow} className='ms-2' alt="" style={{ width: '20px', height: '20px' }} />
                                <i class="fa-solid fa-xmark text-secondary" data-bs-dismiss="offcanvas" aria-label="Close"></i>
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