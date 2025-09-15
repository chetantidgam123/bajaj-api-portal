import React from "react";
import { Accordion } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
    const location = useLocation();
    const currentPath = location.pathname;

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
            currentPath.startsWith("/master/privacy-policy")
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
        <nav className="sidebar_entity">
            <header className="border-bottom-dash logo-header">
                <div className="image-text">
                    <span className="image">
                        <Link className="navbar-brand d-flex align-items-center" to="/">
                            <img src="/assets/img/logo.png" alt="Logo" className="logo-img me-2" />
                        </Link>
                    </span>
                </div>
            </header>
            <div className="mt-2 px-2">
                <Accordion defaultActiveKey={defaultActiveKey}>
                    {/* User Management */}
                    <Accordion.Item eventKey="0" className="my-2 position-relative">
                        <Accordion.Header>
                            <i className="fa-brands fa-microsoft"></i>
                            <span className="link-name ms-2">User Management</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ul className="admin-sidebar-ul">
                                <li>
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
                        <Accordion.Body>
                            <ul className="admin-sidebar-ul">
                                <li>
                                    <Link
                                        className={`admin-sidebar-li ${
                                            currentPath === "/master/api-list" ? "active-tab" : ""
                                        }`}
                                        to="/master/api-list"
                                    >
                                        Api List
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`admin-sidebar-li ${
                                            currentPath === "/master/category-list" ? "active-tab" : ""
                                        }`}
                                        to="/master/category-list"
                                    >
                                        Category List
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`admin-sidebar-li ${
                                            currentPath === "/master/sub-category-list" ? "active-tab" : ""
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
                        <Accordion.Body>
                            <ul className="admin-sidebar-ul">
                                <li>
                                    <Link
                                        className={`admin-sidebar-li ${
                                            currentPath === "/master/term-and-condition" ? "active-tab" : ""
                                        }`}
                                        to="/master/term-and-condition"
                                    >
                                        Terms and Conditions
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className={`admin-sidebar-li ${
                                            currentPath === "/master/privacy-policy" ? "active-tab" : ""
                                        }`}
                                        to="/master/privacy-policy"
                                    >
                                        Privacy Policy
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
                        <Accordion.Body>
                            <ul className="admin-sidebar-ul">
                                <li>
                                    <Link
                                        className={`admin-sidebar-li ${
                                            currentPath === "/master/suggest-an-api" ? "active-tab" : ""
                                        }`}
                                        to="/master/suggest-an-api"
                                    >
                                        Suggest an API
                                    </Link>
                                </li>
                                <li>
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
                        <Accordion.Body>
                            <ul className="admin-sidebar-ul">
                                <li>
                                    <Link
                                        className={`admin-sidebar-li ${
                                            currentPath === "/master/request-access-list" ? "active-tab" : ""
                                        }`}
                                        to="/master/request-access-list"
                                    >
                                        Request Access List
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
