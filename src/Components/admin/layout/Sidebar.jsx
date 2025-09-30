import React, { useState } from "react";
import { Accordion } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const [isClosed, setIsClosed] = useState(false);

  const getDefaultActiveKey = () => {
    if (currentPath.startsWith("/master/user-list")) return "0";
    if (
      currentPath.startsWith("/master/api-list") ||
      currentPath.startsWith("/master/category-list") ||
      currentPath.startsWith("/master/sub-category-list")
    )
      return "1";
    if (
      currentPath.startsWith("/master/term-and-condition") ||
      currentPath.startsWith("/master/privacy-policy") ||
      currentPath.startsWith("/master/faq")
    )
      return "2";
    if (
      currentPath.startsWith("/master/suggest-an-api") ||
      currentPath.startsWith("/master/get-in-touch")
    )
      return "3";
    if (currentPath.startsWith("/master/request-access-list")) return "4";
    return null;
  };

  const defaultActiveKey = getDefaultActiveKey();

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

      <div className="pt-2 px-2 linear min-height">
        <div className="row align-items-center px-3 mt-3">
          {/* ✅ React toggle button (no querySelector) */}
          <div className="col-xl-9 col-lg-9 col-md-9 col-sm-10 col-10">
            <h4 class="heading-hide heading-display mb-0">
              <Link className="text-white text-decoration-none" to="/master">
                Dashboard 
              </Link>
            </h4>
          </div>
         <div
  className={`${
    isClosed
      ? "col-xl-12 col-lg-12 col-md-12 col-sm-2 col-2"
      : "col-xl-3 col-lg-3 col-md-3 col-sm-2 col-2"
  } d-flex justify-content-center`}
>
  <div
    className="circle-arrow toggle"
    onClick={() => setIsClosed(!isClosed)}
  >
    {isClosed ? (
      <i className="fa-solid fa-arrow-right" role="button"></i>
    ) : (
      <i className="fa-solid fa-arrow-left" role="button"></i>
    )}
  </div>
</div>

        </div>

        <Accordion
          className="mt-3 admin-sidebar"
          defaultActiveKey={defaultActiveKey}
        >
          {/* User Management */}
          <Accordion.Item eventKey="0" className="my-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">User Management</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
              <ul className="admin-sidebar-ul mb-0 px-3 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/user-list" ? "active-tab" : ""
                    }`}
                    to="/master/user-list"
                  >
                    User List
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* API Management */}
          <Accordion.Item eventKey="1" className="mb-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">Api Management</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
              <ul className="admin-sidebar-ul mb-0 px-3 py-1">
               <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/api-list" ? "active-tab" : ""
                    }`}
                    to="/master/api-list"
                  >
                    Api List
                  </Link>
                </li>
               <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/category-list"
                        ? "active-tab"
                        : ""
                    }`}
                    to="/master/category-list"
                  >
                    Category List
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/sub-category-list"
                        ? "active-tab"
                        : ""
                    }`}
                    to="/master/sub-category-list"
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
              <ul className="admin-sidebar-ul mb-0 px-3 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/term-and-condition"
                        ? "active-tab"
                        : ""
                    }`}
                    to="/master/term-and-condition"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/privacy-policy"
                        ? "active-tab"
                        : ""
                    }`}
                    to="/master/privacy-policy"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/faq" ? "active-tab" : ""
                    }`}
                    to="/master/faq"
                  >
                    FAQ
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
              <ul className="admin-sidebar-ul mb-0 px-3 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/suggest-an-api"
                        ? "active-tab"
                        : ""
                    }`}
                    to="/master/suggest-an-api"
                  >
                    Suggest an API
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/get-in-touch" ? "active-tab" : ""
                    }`}
                    to="/master/get-in-touch"
                  >
                    Get in Touch
                  </Link>
                </li>
              </ul>
            </Accordion.Body>
          </Accordion.Item>

          {/* Request Access */}
          <Accordion.Item eventKey="4" className="mb-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">Request Access Management</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
             <ul className="admin-sidebar-ul mb-0 px-3 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/request-access-list"
                        ? "active-tab"
                        : ""
                    }`}
                    to="/master/request-access-list"
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
              <ul className="admin-sidebar-ul">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li ${
                      currentPath === "/master/reports" ? "active-tab" : ""
                    }`}
                    to="/master/reports"
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
