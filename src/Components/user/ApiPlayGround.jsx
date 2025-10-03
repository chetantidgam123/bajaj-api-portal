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

            {
                loader && <PageLoaderBackdrop />
            }
        </div>

    );
}

export default ApiPlayGround;