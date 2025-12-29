import { Accordion, Badge, Modal } from "react-bootstrap"
import { arrayIndex, getTokenData, scrollToElement } from "../../../Utils"
// import { sidebardata } from "../../../sideBar"
import PropTypes from 'prop-types';
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Login from "../../auth/Login";
import ForgotPassword from "../../auth/ForgotPassword";
import ResetPassword from "../../auth/ResetPasswrd";
import SignupPage from "../../auth/SignupPage";
function Sidebar({ setPageData }) {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [modalName, setModalName] = useState('login');
    const [activeKey, setActiveKey] = useState(-1);

    const checkLogin = (collection_id, category_id, api_id) => {
        if (!getTokenData()) {
            setShowModal(true);
            return;
        }
        if (api_id) {
            navigate('/collection-api/' + collection_id + '/' + category_id + '/' + api_id);
        } else {
            navigate('/api/' + collection_id + '/' + category_id);
        }
        handleScroll();

    }
    const handleScroll = () => {
        setTimeout(() => {
            scrollToElement('requestSample')
        }, 200);
    }
    return (
        <div className="sidebar bg-white">
           
            <Accordion className="m-3" onSelect={(key) => { setActiveKey(key) }}>
                {
                    sidebardata.map((item, i) =>
                    (<Accordion.Item key={arrayIndex('acc', i)} eventKey={i} onClick={() => { setPageData(item) }}>
                        <Accordion.Header className={(item.category.length <= 0 && item.collection_api.length <= 0) ? "disabled" : ""}
                            onClick={() => { navigate('/api/' + item.collection_id) }}>
                            <img src={`/assets/img/${i == activeKey ? 'act_sidebar.png' : 'sidebaricon.png'}`} className="me-2" alt="NA" style={{ height: '24px', width: '24px' }}></img>
                            {item.collection_name}
                        </Accordion.Header>
                        {
                            item.category.length > 0 && <Accordion.Body className="p-0">
                                <Accordion>
                                    {
                                        item.category.map((cItem, ci) => (
                                            <Accordion.Item key={arrayIndex('acc_c', ci)} eventKey={ci} style={{ border: 'none' }}>
                                                <Accordion.Header onClick={() => { checkLogin(item.collection_id, cItem.category_id, 0) }}>{cItem.category_name}</Accordion.Header>
                                                {cItem.subcategory.length > 0 && <Accordion.Body className="p-0">
                                                    {
                                                        cItem.subcategory.map((sItem, si) => (
                                                            <div key={arrayIndex('acc_Si', si)} className={cItem.subcategory.length - 1 == si ? "apiSidebar1" : "apiSidebar"}>
                                                                <Link style={{ textDecoration: 'none' }} onClick={handleScroll}
                                                                    to={`/api/${item.collection_id}/${cItem.category_id}/${sItem.api_id}`} >
                                                                    <div className="d-flex align-items-center">
                                                                        <Badge pill bg="" className={`me-2 badge-${sItem.method.toLowerCase()}`}> {sItem.method}</Badge>
                                                                        <small className="text-dark">{`${sItem.api_name}`}</small>
                                                                    </div>
                                                                </Link>
                                                            </div>
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
                            item.collection_api.length > 0 && <Accordion.Body className="p-0">
                                {
                                    item.collection_api.map((api, si) => (
                                        <div key={arrayIndex('acc_Si', si)} className={item.collection_api.length - 1 == si ? "apiSidebar1" : "apiSidebar"}>
                                            <button className="span-btn" onClick={() => { checkLogin(item.collection_id, 0, api.api_id); }}>
                                                <Badge pill bg="" className={`me-2 badge-${api.method.toLowerCase()}`}> {api.method}</Badge><small className="text-dark">{`${api.api_name}`}</small>
                                            </button>
                                        </div>
                                    ))
                                }
                            </Accordion.Body>
                        }
                    </Accordion.Item>)
                    )
                }
            </Accordion>


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
    )
}
Sidebar.propTypes = {
    setPageData: PropTypes.func
}


export default Sidebar
