import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isClosed, setIsClosed] = useState(false);

  const getDefaultActivKey = () => {
    if (currentPath.startsWith("/master/user-list")) return "0";
    if (
      currentPath.startsWith("/master/api-list") || currentPath.startsWith("/master/category-list") ||
      currentPath.startsWith("/master/sub-category-list")
    )
      return "1";
    if (
      currentPath.startsWith("/master/term-and-condition") || currentPath.startsWith("/master/privacy-policy") ||
      currentPath.startsWith("/master/faq")
    )
      return "2";
    if (
      currentPath.startsWith("/master/suggest-an-api") || currentPath.startsWith("/master/get-in-touch")
    )
      return "3";
    if (currentPath.startsWith("/master/request-access-list")) return "4";
    return null;
  };

  const defaultActiveKey = getDefaultActivKey();
  const handlUserListClick = (e) => {
    if (isClosed) {
          setActiveKey(null);
    
    }
    // If sidebar is open, the normal Link behavior will work
  };

  return (
    <nav className={`sidebar_entity ${isClosed ? "close" : ""}`}>
      <header className="border-bottom-dash logo-header">
        <div className="image-text">
          <span className="image">
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
          </span>
        </div>
      </header>
      <div className="linear min-height pt-2 px-2">
        <div className="row align-items-center px-3 mt-3">
          {/* ✅ React toggle button (no querySelector) */}
          <div className="col-xl-9 col-lg-9 col-md-9 col-sm-8 col-8">
            <h4 className="mb-0 heading-hide heading-display">
              <Link to="/master" className="text-white text-decoration-none" >Dashboard</Link>
            </h4>
          </div>
          <div
            className={`${isClosed
              ? "col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
              : "col-xl-3 col-lg-3 col-md-3 col-sm-4 col-4"
              } d-flex justify-content-center`}
          >
            <div className="circle-arrow toggle" onClick={() => setIsClosed(!isClosed)}>
              {isClosed ? (
                <i className="fa-solid fa-arrow-right" role="button"></i>
              ) : (
                <i className="fa-solid fa-arrow-left" role="button"></i>
              )}
            </div>
          </div>
        </div>

        <Accordion defaultActiveKey={defaultActiveKey} className="mt-3 admin-sidebar">
          {/* User Management */}
          <Accordion.Item eventKey="0" className="my-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">User Management</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    to="/master/user-list"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/user-list" ? "active-tab" : ""
                      }`}
                    onClick={handlUserListClick}
                  >
                    User List
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* API Management */}
          <Accordion.Item eventKey="1" className="position-relative mb-2">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">API Management</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
              <ul className="px-0 py-1 mb-0 admin-sidebar-ul">
                <li className="list-style-none">
                  <Link
                    to="/master/api-list"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/api-list" ? "active-tab" : ""
                      }`}
                  >
                    API List
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    to="/master/category-list"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/category-list"
                      ? "active-tab" : ""
                      }`}
                  >
                    Category List
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    to="/master/sub-category-list"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/sub-category-list"
                      ? "active-tab" : ""
                      }`}
                  >
                    Subcategory List
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* CMS */}
          <Accordion.Item eventKey="2" className="mb-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">CMS</span>
            </Accordion.Header>
            <Accordion.Body className="px-3 py-2">
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    to="/master/term-and-condition"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/term-and-condition"
                      ? "active-tab" : ""
                      }`}
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    to="/master/privacy-policy"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/privacy-policy"
                      ? "active-tab" : ""
                      }`}
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    to="/master/faq"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/faq" ? "active-tab" : ""
                      }`}
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
          
          {/* API Usage Analytics */}
          <Accordion.Item eventKey="4" className="my-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">API Usage Analytics</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
              <ul className="mb-0 px-0 py-1 admin-sidebar-ul">
                <li className="list-style-none">
                  <Link
                    to="/master/api-usage-analytics"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/api-usage-analytics" ? "active-tab" : ""
                      }`}
                    onClick={handlUserListClick}
                  >
                    API Usage Analytics
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* Contact Us */}
          <Accordion.Item eventKey="3" className="mb-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">Contact Us</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
              <ul className="mb-0 px-0 py-1 admin-sidebar-ul">
                <li className="list-style-none">
                  <Link
                    to="/master/suggest-an-api"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/suggest-an-api" ? "active-tab" : ""
                    }`}
                  >
                    Suggest an API
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    to="/master/get-in-touch"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/get-in-touch" ? "active-tab" : "" }`}
                  >
                    Get in Touch
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* Request Access */}
          <Accordion.Item eventKey="6" className="mb-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">Request Access Management</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    to="/master/request-access-list"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/request-access-list" ? "active-tab" : ""}`}
                  >
                    Request Access List
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* Reports */}
          <Accordion.Item eventKey="5" className="my-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">Reports</span>
            </Accordion.Header>
            <Accordion.Body className="px-2 py-2">
              <ul className="admin-sidebar-ul px-0 py-1 mb-0">
                <li className="list-style-none">
                  <Link
                    to="/master/reports"
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/reports" ? "active-tab" : ""}`}
                  >
                    Reports
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
    </nav>
  );
}

export default Sidebar;
