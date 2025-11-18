import React, { useEffect } from 'react'
import { Accordion, Dropdown } from 'react-bootstrap'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from "react";
import { getTokenData, getInitials } from "../../../Utils";
import { confirm_swal_with_text, success_swal_toast } from '../../../SwalServices';
const Sidebar = React.lazy(() => import('./Sidebar'));

function Header() {

  const location = useLocation();
  const currentPath = location.pathname;

  const [isClosed, setIsClosed] = useState(false);

    const navigate = useNavigate();
    // const logout = () => {
    //     localStorage.clear();
    //     navigate('/')
    // }
    const logout = () => {
        confirm_swal_with_text(async (resolve) => {
            try {
                // Clear local storage or token
                localStorage.clear();

                // Optional: show success message
                success_swal_toast("You have been logged out!");

                // Navigate to homepage or login
                navigate("/");

                resolve(true);
            } catch (err) {
                console.error("Logout error:", err);
            }
        }, "Are you sure you want to logout?");
    }
    const [fullName, setFullName] = useState('');

    useEffect(() => {
        const sidebar = document.querySelector('.sidebar_entity')
        const toggle = document.querySelector('.toggle')
        toggle.addEventListener('click', () => {
            sidebar.classList.toggle("close")
        })
        let token = getTokenData();
        setFullName(token?.fullname || "");

    }, []);

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
  const handleUserListClick = (e) => {
    if (isClosed) {
      setActiveKey(null);
    
    }
    // If sidebar is open, the normal Link behavior will work
  };


    return (
        <div className='adminHeader'>
            <nav className="navbar navbar-expand-lg px-4">
                <div className="container-fluid bg-white">
                    {/* <button className="btn btn-primary toggle" type="button">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCenterContent" aria-controls="navbarCenterContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button> */}

                    {/* Collapsible Content */}
                    <div className="collapse navbar-collapse justify-content-center" id="navbarCenterContent">
                        {/* Center: Links */}
                        {/* <ul className="navbar-nav mb-2 mb-lg-0 d-flex justify-content-center">

                                <li className="nav-item">
                                    <Link className="nav-link" to="/api/0">
                                        Explore API
                                    </Link>
                                </li>
                                <li className="nav-item mx-3">
                                    <Link className="nav-link" to="/faq">
                                        FAQ
                                    </Link>
                                </li>
                                 </ul> */}
                    </div>
                    <div className="d-flex justify-content-center align-items-center">
                        <Dropdown className="p-0">
                            <Dropdown.Toggle
                                className="d-flex justify-content-center align-items-center btn-white p-0"
                            >
                                <div className="circle-profile" style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
                                    {fullName ? getInitials(fullName) : <i className="fa fa-user"></i>}
                                </div>
                                <div className="ms-2 text-start color-blue">
                                    Welcome <br></br>
                                    {fullName}
                                </div>

                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Link
                                    style={{ textDecoration: "none", color: "#212529" }}
                                    to={"/user/profile"}
                                >
                                    <Dropdown.Item as={"span"}>Profile</Dropdown.Item>
                                </Link>
                                <Dropdown.Item
                                    as={"button"}
                                    // className="span-btn"
                                    onClick={logout}
                                >
                                    Logout
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <div className='d-xl-none d-lg-none d-md-block d-sm-block d-block'>
                        <i className="fa-solid fa-bars btn-mobile-blue" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" role="button" aria-controls="offcanvasExample"></i>
                    </div>



                  

                </div>
                
            </nav>
              <div className="offcanvas offcanvas-start d-xl-none d-lg-none d-md-block d-sm-block d-block" tabIndex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                        <div className="offcanvas-header">
                            <h5 className="offcanvas-title" id="offcanvasExampleLabel">
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
                        <div className="offcanvas-body">
      <div className="pt-2 px-2 linear min-height">
        <div className="row align-items-center px-3 mt-3">
          {/* ✅ React toggle button (no querySelector) */}
          <div className="col-xl-9 col-lg-9 col-md-9 col-sm-8 col-8">
            <h4 className="heading-hide heading-display mb-0">
              <Link className="text-white text-decoration-none" to="/master">
                Dashboard
              </Link>
            </h4>
          </div>
          <div
            className={`${isClosed
              ? "col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
              : "col-xl-3 col-lg-3 col-md-3 col-sm-4 col-4"
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
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/user-list" ? "active-tab" : ""
                      }`}
                    to="/master/user-list"
                     onClick={handleUserListClick}
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
              <span className="link-name ms-2">API Management</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/api-list" ? "active-tab" : ""
                      }`}
                    to="/master/api-list"
                  >
                    API List
                  </Link>
                </li>
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/category-list"
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
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/sub-category-list"
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
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/term-and-condition"
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
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/privacy-policy"
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
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/faq" ? "active-tab" : ""
                      }`}
                    to="/master/faq"
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
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/api-usage-analytics" ? "active-tab" : ""
                      }`}
                    to="/master/api-usage-analytics"
                     onClick={handleUserListClick}
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
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/suggest-an-api"
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
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/get-in-touch" ? "active-tab" : ""
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
          <Accordion.Item eventKey="6" className="mb-2 position-relative">
            <Accordion.Header>
              <i className="fa-brands fa-microsoft"></i>
              <span className="link-name ms-2">Request Access Management</span>
            </Accordion.Header>
            <Accordion.Body className="px-4 py-2">
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/request-access-list"
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
              <ul className="admin-sidebar-ul mb-0 px-0 py-1">
                <li className="list-style-none">
                  <Link
                    className={`admin-sidebar-li mb-2 ${currentPath === "/master/reports" ? "active-tab" : ""
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
                        </div>
                    </div>
        </div>
        
    )
}

export default Header