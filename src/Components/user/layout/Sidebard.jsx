import { Accordion, Badge, Modal } from "react-bootstrap";
import { arrayIndex, convertToPayload, getTokenData } from "../../../Utils";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../../auth/Login";
import ForgotPassword from "../../auth/ForgotPassword";
import ResetPassword from "../../auth/ResetPasswrd";
import SignupPage from "../../auth/SignupPage";
import { post_data } from "../../../ApiServices";
import { confirm_swal_with, error_swal_toast } from "../../../SwalServices";
import PropTypes from "prop-types";

function Sidebard() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalName, setModalName] = useState("login");
  const [activeKey, setActiveKey] = useState(null); // top-level active key
  const [subActiveKey, setSubActiveKey] = useState(""); // subcategory active key - empty string means none open
  const { api_id } = useParams();
  const [isClosed, setIsClosed] = useState(false); // sidebar toggle
  const [sidebarData, setSidebarData] = useState([]);

  const checkLogin = (collection_id, category_id, api_id) => {
    console.log(collection_id)
    if (!getTokenData()) {
      setShowModal(true);
      return;
    }
    if (api_id) {
      if (isClosed) {
        setActiveKey(null)
        setSubActiveKey("")
      }
      navigate("/collection-api/" + collection_id + "/" + category_id + "/" + api_id);
    } else {
      navigate("/api/" + collection_id + "/" + category_id);
    }
  };

  const returnClass = (isLast, isapiId) => {
    const baseClass = isLast ? "apiSidebar1" : "apiSidebar";
    const activeClass = isapiId ? " activeApi" : "";
    return baseClass + activeClass;
  };

  const confirm_swal_call = () => {
    const callback = (resolve, reject) => {
        resolve();
    }
    confirm_swal_with(callback, `To access the APIs your Account is in Approval Process`)
  } 

  const getSidebarlist = () => {
    post_data("portal/public", convertToPayload("get-sidebar-list", {}), {})
      .then(async (response) => {
        if (response.data.status) {
          let _a = (await response.data.data) || [];
          if (_a.length > 0) {
            _a = _a
              .filter((i) => !i.isdeleted && i.isenabled)
              .map((item) => {
                let subValue = item.subcategories?.value ?? "[]";
                let apis_category = item.apis_category?.value ?? "[]";
                try {
                  item.subcategories = JSON.parse(subValue);
                  item.apis_category = JSON.parse(apis_category);
                } catch (e) {
                  console.log(e);
                  item.subcategories = [];
                  item.apis_category = [];
                }
                return item;
              })
              .sort((a, b) => a.seq - b.seq);
          }
          setSidebarData(_a);
        } else {
          error_swal_toast(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        error_swal_toast(error.message);
      });
  };

  useEffect(() => {
    getSidebarlist();
  }, []);

  // Reset subActiveKey when parent accordion changes
  useEffect(() => {
    setSubActiveKey("");
  }, [activeKey]);

  const toggleSidebar = () => {
    setIsClosed(!isClosed);
    setActiveKey(null); // collapse main accordion
    setSubActiveKey(""); // collapse sub accordion
  };



  return (
    <>

      <div className={`sidebar_entity-user height-84vh main-layout ${isClosed ? "close" : ""}`}>
        <div className="sidebar-user ">
          <div className="row">
            <div className="col-xl-9 col-lg-9 col-md-9 col-sm-10 col-10">
              <h4 className="heading-hide heading-display text-white">Explore Api</h4>
            </div>
            <div
              className={`${isClosed
                ? "col-xl-12 col-lg-12 col-md-12 col-sm-2 col-2"
                : "col-xl-3 col-lg-3 col-md-3 col-sm-2 col-2"
                } d-flex justify-content-center`}
            >
              <div className="circle-arrow toggle d-none" onClick={toggleSidebar}>
                <i
                  className={`fa-solid ${isClosed ? "fa-arrow-right" : "fa-arrow-left"}`}
                  role="button"
                ></i>
              </div>
            </div>

            {/* Main Accordion */}
            <Accordion
              className="mt-2 explore"
              activeKey={activeKey}
              onSelect={(key) => setActiveKey(key)}
              alwaysOpen={false}
            >
              {sidebarData.map((item, i) => (
                <Accordion.Item
                  className="position-relative"
                  key={arrayIndex("acc", i)}
                  eventKey={i}
                >
                  <Accordion.Header
                    className={
                      item.subcategories.length <= 0 &&
                        item.apis_category.length <= 0
                        ? "disabled"
                        : ""
                    }
                    // onClick={() => {
                    //   navigate("/api/" + item.record_uuid);
                    // }}
                    onClick={() => {
                      if(getTokenData()?.approved_status === 1) {
                        navigate("/api/" + item.record_uuid);
                      } else {
                        confirm_swal_call()
                      }
                    }}
                    //  onClick={(e) => {
                    //   // STOP ACCORDION FROM OPENING
                    //   e.stopPropagation();
                    //   e.preventDefault();
                    //   // Also stop React-Bootstrap from detecting toggle event
                    //   e.nativeEvent.stopImmediatePropagation?.();
                    //   if (getTokenData()?.approved_status !== 1) {
                    //     confirm_swal_call();
                    //     return;
                    //   }
                    //   navigate("/api/" + item.record_uuid);
                    // }}
                  >
                    <img
                      src={`/assets/img/${i == activeKey ? "visualization.png" : "visualization-2.png"
                        }`}
                      alt="NA"
                      style={{ height: "15px", width: "15px" }}
                    />
                    <span className="link-name ms-2">{item.categoryname}</span>
                  </Accordion.Header>

                  {/* Single Accordion.Body containing both Subcategories and API Categories */}
                  {getTokenData()?.approved_status === 1 && (item.subcategories.length > 0 || item.apis_category.length > 0) && (
                    <Accordion.Body className="p-0">
                      {/* Subcategories */}
                      {item.subcategories.length > 0 && (
                        <Accordion
                          activeKey={subActiveKey}
                          onSelect={(key) => setSubActiveKey(key)}
                          alwaysOpen={false}
                        >
                          {item.subcategories.map((cItem, ci) => (cItem.isenabled && !cItem.isdeleted) ? ((
                            <Accordion.Item key={arrayIndex("acc_c", ci)} eventKey={`${i}-${ci}`} style={{ border: "none" }}>
                              <Accordion.Header
                                onClick={() => {
                                  checkLogin(item.record_uuid, cItem.record_uuid, 0);
                                }}
                              >
                                {cItem.subcategoryname}
                              </Accordion.Header>

                              {cItem.apis.length > 0 && subActiveKey === `${i}-${ci}` && (
                                <Accordion.Body className="p-0 ">
                                  {cItem.apis.map((sItem, si) => (sItem.isenabled && !sItem.isdeleted) ? (
                                    <ApiList
                                      key={arrayIndex("acc_Si", si)}
                                      si={si}
                                      cItem={cItem}
                                      item={item}
                                      sItem={sItem}
                                      returnClass={returnClass}
                                      setActiveKey={setActiveKey}
                                      setSubActiveKey={setSubActiveKey}
                                      isClosed={isClosed}
                                    />
                                  ) : null)}
                                </Accordion.Body>
                              )}
                            </Accordion.Item>
                          )) : null)}
                        </Accordion>
                      )}

                      {/* API Categories */}
                      {item.apis_category.length > 0 && (
                        <>
                          {item.apis_category.map((api, si) => (api.isenabled && !api.isdeleted) ? (
                            <div
                              key={arrayIndex("acc_Si", si)}
                              className={returnClass(
                                item.apis_category.length - 1 == si,
                                api_id && api.uniqueid == api_id
                              )}
                            >
                              <button
                                className="span-btn w-100 border-0 bg-none text-start" style={{ background: 'none' }}
                                onClick={() => {
                                  checkLogin(item.record_uuid, 0, api.uniqueid);
                                }}
                              >
                                <Badge
                                  pill
                                  bg=""
                                  className={`me-2 badge-${api.apimethod.toLowerCase()}`}
                                >
                                  {api.apimethod}
                                </Badge>
                                <small className=" text-start text-white">{api.apiname}</small>
                              </button>
                            </div>
                          ) : null)}
                        </>
                      )}
                    </Accordion.Body>
                  )}
                </Accordion.Item>
              ))}
            </Accordion>
          </div>

          {/* Modal */}
          <Modal
            size="lg"
            show={showModal}
            onHide={() => setShowModal(false)}
            centered
          >
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
                        Your one-stop destination for accessing, integrating, and
                        managing powerful APIs that drive seamless digital
                        experiences.
                      </p>
                    </div>
                  </div>
                  <div className="col-xl-7 col-lg-7 col-md-7 col-12 ps-4">
                    {modalName === "signup" && (
                      <SignupPage
                        setModalName={setModalName}
                        setShow={setShowModal}
                      />
                    )}
                    {modalName === "login" && (
                      <Login setModalName={setModalName} setShow={setShowModal} />
                    )}
                    {modalName === "forget-pass" && (
                      <ForgotPassword
                        setModalName={setModalName}
                        setShow={setShowModal}
                      />
                    )}
                    {modalName === "reset-pass" && (
                      <ResetPassword
                        setModalName={setModalName}
                        setShow={setShowModal}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
      <div>
        <div className='d-xl-none d-lg-none d-md-block d-sm-block d-block width-50'>
          <i className="fa-solid fa-bars btn-mobile-blue" data-bs-toggle="offcanvas" href="#offcanvasExampleside" role="button" aria-controls="offcanvasExampleside"></i>
        </div>
        <div className="offcanvas offcanvas-start d-xl-none d-lg-none d-md-block d-sm-block d-block" tabIndex="-1" id="offcanvasExampleside" aria-labelledby="offcanvasExampleLabelside">
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasExampleLabelside">
              <Link
                className="navbar-brand d-flex align-items-center justify-content-start"
                to="/"
              >
                <img
                  src="/assets/img/logo.png"
                  alt="Logo"
                  className="logo-img ms-4"
                />
              </Link>
            </h5>
            <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div className="offcanvas-body main-layout py-0">
            <div className="sidebar-user p-0 ">
              {/* Main Accordion */}
              <Accordion
                className="mt-2 explore"
                activeKey={activeKey}
                onSelect={(key) => {
                  setActiveKey(key);
                  setSubActiveKey("");
                }}
                alwaysOpen={false}
              >
                {sidebarData.map((item, i) => (
                  <Accordion.Item
                    className="position-relative"
                    key={arrayIndex("acc", i)}
                    eventKey={i}
                  >
                    <Accordion.Header
                      className={
                        item.subcategories.length <= 0 &&
                          item.apis_category.length <= 0
                          ? "disabled"
                          : ""
                      }
                      onClick={() => {
                        navigate("/api/" + item.record_uuid);
                      }}
                    >
                      <img
                        src={`/assets/img/${i == activeKey ? "visualization.png" : "visualization-2.png"
                          }`}
                        alt="NA"
                        style={{ height: "15px", width: "15px" }}
                      />
                      <span className="link-name ms-2">{item.categoryname}</span>
                    </Accordion.Header>

                    {/* Single Accordion.Body containing both Subcategories and API Categories */}
                    {(item.subcategories.length > 0 || item.apis_category.length > 0) && (
                      <Accordion.Body className="p-0">
                        {/* Subcategories */}
                        {item.subcategories.length > 0 && (
                          <Accordion
                            activeKey={subActiveKey}
                            onSelect={(key) => setSubActiveKey(key)}
                            alwaysOpen={false}
                          >
                            {item.subcategories.map((cItem, ci) => (cItem.isenabled && !cItem.isdeleted) ? ((
                              <Accordion.Item key={arrayIndex("acc_c", ci)} eventKey={`${i}-${ci}`} style={{ border: "none" }}>
                                <Accordion.Header
                                  onClick={() => {
                                    checkLogin(item.record_uuid, cItem.record_uuid, 0);
                                  }}
                                >
                                  {cItem.subcategoryname}
                                </Accordion.Header>

                                {cItem.apis.length > 0 && subActiveKey === `${i}-${ci}` && (
                                  <Accordion.Body className="p-0 ">
                                    {cItem.apis.map((sItem, si) => (sItem.isenabled && !sItem.isdeleted) ? (
                                      <ApiList
                                        key={arrayIndex("acc_Si", si)}
                                        si={si}
                                        cItem={cItem}
                                        item={item}
                                        sItem={sItem}
                                        returnClass={returnClass}
                                        setActiveKey={setActiveKey}
                                        setSubActiveKey={setSubActiveKey}
                                        isClosed={isClosed}
                                      />
                                    ) : null)}
                                  </Accordion.Body>
                                )}
                              </Accordion.Item>
                            )) : null)}
                          </Accordion>
                        )}

                        {/* API Categories */}
                        {item.apis_category.length > 0 && (
                          <>
                            {item.apis_category.map((api, si) => (api.isenabled && !api.isdeleted) ? (
                              <div
                                key={arrayIndex("acc_Si", si)}
                                className={returnClass(
                                  item.apis_category.length - 1 == si,
                                  api_id && api.uniqueid == api_id
                                )}
                              >
                                <button
                                  className="span-btn w-100 border-0 bg-none text-start" style={{ background: 'none' }}
                                  onClick={() => {
                                    checkLogin(item.record_uuid, 0, api.uniqueid);
                                  }}
                                >
                                  <Badge
                                    pill
                                    bg=""
                                    className={`me-2 badge-${api.apimethod.toLowerCase()}`}
                                  >
                                    {api.apimethod}
                                  </Badge>
                                  <small className=" text-start text-white">{api.apiname}</small>
                                </button>
                              </div>
                            ) : null)}
                          </>
                        )}
                      </Accordion.Body>
                    )}
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ApiList({ si, cItem, item, sItem, returnClass, setActiveKey, setSubActiveKey, isClosed }) {
  const { api_id } = useParams();
  const navigate = useNavigate()
  const checkPermission = (record_uuid, crecord_uuid, uniqueid) => {

    if (getTokenData()?.jwt_token) {
      if (isClosed) {
        setActiveKey(null)
        setSubActiveKey("")
      }
      navigate(`/api/${record_uuid}/${crecord_uuid}/${uniqueid}`)

    } else {
      error_swal_toast('Please login to access this page')
    }
  }
  return (
    <div className={returnClass(cItem.apis.length - 1 == si, api_id && sItem.uniqueid == api_id)} >
      <button className="span-btn w-100 border-0 bg-none"
        style={{ background: 'none' }} onClick={() => { checkPermission(item.record_uuid, cItem.record_uuid, sItem.uniqueid) }}>
        <div className="d-flex row align-items-center">
          <div className="col-4">
            <Badge
              pill
              bg=""
              className={`me-2 badge-${sItem.apimethod.toLowerCase()}`}
            >
              {sItem.apimethod}
            </Badge>
          </div>
          <div className="col-8 d-flex justify-content-start">
            <small className="text-start text-white">{sItem.apiname}</small>
          </div>
        </div>
      </button>
    </div>
  );
}

ApiList.propTypes = {
  si: PropTypes.any,
  cItem: PropTypes.any,
  item: PropTypes.any,
  sItem: PropTypes.any,
  returnClass: PropTypes.any,
  setActiveKey: PropTypes.any,
  setSubActiveKey: PropTypes.any,
  isClosed: PropTypes.boolean

};

export default Sidebard;
