import { Accordion, Badge, Modal } from "react-bootstrap"
import { arrayIndex, convertToPayload, getTokenData } from "../../../Utils"
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../../auth/Login";
import ForgotPassword from "../../auth/ForgotPassword";
import ResetPassword from "../../auth/ResetPasswrd";
import SignupPage from "../../auth/SignupPage";
import { post_data } from "../../../ApiServices";
import { error_swal_toast } from "../../../SwalServices";
import PropTypes from 'prop-types';
function Sidebard() {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalName, setModalName] = useState('login');
    const [activeKey, setActiveKey] = useState(-1);
    const { api_id } = useParams();
      const [showsidebar, setShowsidebar] = useState(true);
  const [isClosed, setIsClosed] = useState(false); // sidebar toggle

    const checkLogin = (collection_id, category_id, api_id) => {
        if (!getTokenData()) {
            setShowModal(true);
            return;
        }
        if (api_id) {
            navigate('/collection-api/' + collection_id + '/' + api_id);
        } else {
            navigate('/api/' + collection_id + '/' + category_id);
        }

    }
    const returnClass = (isLast, isapiId) => {
        const baseClass = isLast ? "apiSidebar1" : "apiSidebar";
        const activeClass = isapiId ? " activeApi" : "";
        return baseClass + activeClass;
    }

    const [sidebarData, setSidebarData] = useState([])
    const getSidebarlist = () => {
        post_data("portal/public", convertToPayload('get-sidebar-list', {}), {})
            .then(async (response) => {
                if (response.data.status) {
                    let _a = await response.data.data || [];
                    if (_a.length > 0) {
                        _a = _a.filter((i) => (!i.isdeleted && i.isenabled)).map((item) => {
                            let subValue = item.subcategories?.value ?? '[]'; // safe check
                            let apis_category = item.apis_category?.value ?? '[]'; // safe check
                            try {
                                item.subcategories = JSON.parse(subValue);
                                item.apis_category = JSON.parse(apis_category);
                            } catch (e) {
                                console.log(e)
                                item.subcategories = [];
                                item.apis_category = [];
                            }
                            return item
                        }).sort((a, b) => a.seq - b.seq)
                    }
                    setSidebarData(_a)
                } else {
                    error_swal_toast(response.data.message)
                }
            }).catch((error) => {
                console.log(error)
                error_swal_toast(error.message)

            })
    }

    useEffect(() => {
        getSidebarlist()
    }, [])

     const toggleSidebar = () => {
    setIsClosed(!isClosed);
  };
    return (
         <div className={`sidebar_entity-user ${isClosed ? "close" : ""}`}>
        <div className="sidebar bg-white">
             <div className="row">
                <div className="col-xl-9 col-lg-9 col-md-9 col-sm-10 col-10">
                    <h4 className="heading-hide heading-display">Explore Api</h4>
                </div>
                <div className={`${
    isClosed
      ? "col-xl-12 col-lg-12 col-md-12 col-sm-2 col-2"
      : "col-xl-3 col-lg-3 col-md-3 col-sm-2 col-2"
  } d-flex justify-content-center`}
>
                   <div className="circle-arrow toggle" onClick={toggleSidebar}>
                     <i class="fa-solid fa-arrow-left" role="button"></i>
                   </div>
                                  </div>
           
            <Accordion className="mt-2" onSelect={(key) => { setActiveKey(key) }}>
                {
                    sidebarData.map((item, i) =>
                    (
                        <Accordion.Item key={arrayIndex('acc', i)} eventKey={i}>
                            <Accordion.Header className={(item.subcategories.length <= 0 && item.apis_category.length <= 0) ? "disabled" : ""}
                                onClick={() => { navigate('/api/' + item.record_uuid) }}>
                                <img src={`/assets/img/${i == activeKey ? 'act_sidebar.png' : 'sidebaricon.png'}`} className="me-2" alt="NA" style={{ height: '24px', width: '24px' }}></img>
                              <span className="text">  {item.categoryname}</span>
                            </Accordion.Header>
                            {
                                item.subcategories.length > 0 && <Accordion.Body className="p-0">
                                    <Accordion>
                                        {
                                            item.subcategories.map((cItem, ci) => (
                                                <Accordion.Item key={arrayIndex('acc_c', ci)} eventKey={ci} style={{ border: 'none' }}>
                                                    <Accordion.Header onClick={() => { checkLogin(item.record_uuid, cItem.record_uuid, 0) }}>{cItem.subcategoryname}</Accordion.Header>
                                                    {cItem.apis.length > 0 && <Accordion.Body className="p-0">
                                                        {
                                                            cItem.apis.map((sItem, si) => (
                                                                // <div key={arrayIndex('acc_Si', si)} className={() => { returnClass(cItem.apis.length - 1 == si,) }}>
                                                                //     <Link style={{ textDecoration: 'none' }} onClick={handleScroll}
                                                                //         to={`/api/${item.record_uuid}/${cItem.record_uuid}/${sItem.uniqueid}`} >
                                                                //         <div className="d-flex align-items-center">
                                                                //             <Badge pill bg="" className={`me-2 badge-${sItem.apimethod.toLowerCase()}`}> {sItem.apimethod}</Badge>
                                                                //             <small className="text-dark">{`${sItem.apiname}`}</small>
                                                                //         </div>
                                                                //     </Link>
                                                                // </div>
                                                                <ApiList key={arrayIndex('acc_Si', si)} si={si} cItem={cItem} item={item} sItem={sItem} returnClass={returnClass} />
                                                            ))
                                                        }
                                                    </Accordion.Body>
                                                    }
                                                </Accordion.Item>
                                            ))
                                        }
                                    </Accordion>
                                </Accordion.Body>
                            }
                            {
                                item.apis_category.length > 0 && <Accordion.Body className="p-0">
                                    {
                                        item.apis_category.map((api, si) => (
                                            <div key={arrayIndex('acc_Si', si)} className={returnClass(item.apis_category.length - 1 == si, api_id && api.uniqueid == api_id)}>
                                                <button className="span-btn" onClick={() => { checkLogin(item.record_uuid, 0, api.uniqueid); }}>
                                                    <Badge pill bg="" className={`me-2 badge-${api.apimethod.toLowerCase()}`}> {api.apimethod}</Badge><small className="text-dark">{`${api.apiname}`}</small>
                                                </button>
                                            </div>
                                        ))
                                    }
                                </Accordion.Body>
                            }
                        </Accordion.Item>
                    ))
                }
            </Accordion>
 </div>

            <Modal size="lg" show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 py-0"></Modal.Header>
                <Modal.Body className="pt-0">
                    <div className="col-12 px-3">
                        <div className="row">
                            <div className="col-xl-5 col-lg-5 col-md-5 col-12 signUpsideBanner">
                                <img src="/assets/img/Bajaj Logo.png" alt="NA" className="mt-2" />
                                <div className="authContent">
                                    <h1 className="title">
                                        Welcome to Bajaj API Developer Portal.
                                    </h1>
                                    <p>
                                        Your one-stop destination for accessing, integrating, and managing powerful APIs that drive seamless digital experiences.
                                    </p>
                                </div>
                            </div>
                            <div className="col-xl-7 col-lg-7 col-md-7 col-12 ps-4">
                                {modalName == 'signup' && <SignupPage setModalName={setModalName} setShow={setShowModal} />}
                                {modalName == 'login' && <Login setModalName={setModalName} setShow={setShowModal} />}
                                {modalName == 'forget-pass' && <ForgotPassword setModalName={setModalName} setShow={setShowModal} />}
                                {modalName == 'reset-pass' && <ResetPassword setModalName={setModalName} setShow={setShowModal} />}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
        </div>
    )
}

function ApiList({ si, cItem, item, sItem, returnClass }) {
    const { api_id } = useParams();
    return <div className={returnClass(cItem.apis.length - 1 == si, api_id && sItem.uniqueid == api_id)}>
        <Link style={{ textDecoration: 'none' }}
            to={`/api/${item.record_uuid}/${cItem.record_uuid}/${sItem.uniqueid}`} >
            <div className="d-flex align-items-center">
                <Badge pill bg="" className={`me-2 badge-${sItem.apimethod.toLowerCase()}`}> {sItem.apimethod}</Badge>
                <small className="text-dark">{`${sItem.apiname}`}</small>
            </div>
        </Link>
    </div>
}
ApiList.propTypes = {
    si: PropTypes.any,
    cItem: PropTypes.any,
    item: PropTypes.any,
    sItem: PropTypes.any,
    returnClass: PropTypes.any,
}


export default Sidebard
