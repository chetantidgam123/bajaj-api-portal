import { Accordion } from "react-bootstrap"
import { Link } from "react-router-dom"

function Sidebar() {
    return (
        <nav className='sidebar_entity'>
            <header className='border-bottom-dash logo-header'>
                <div className="image-text">
                    <span className='image'>
                        <Link className="navbar-brand d-flex align-items-center" to="/">
                            <img src="/assets/img/logo.png" alt="Logo" className="logo-img me-2" />
                        </Link>
                    </span>
                </div>
            </header>
            <div className="mt-2 px-2">
                <Accordion>
                    <Accordion.Item eventKey="0" className="my-2 position-relative">
                        <Accordion.Header>
                            <i className="fa-brands fa-microsoft"></i>
                            <span className="link-name ms-2">User Management</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ul className="admin-sidebar-ul">
                                <li>
                                    <Link className="admin-sidebar-li" to={'/master/user-list'}>User List</Link>
                                </li>
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="mb-2 position-relative">
                        <Accordion.Header>
                            <i className="fa-brands fa-microsoft"></i>
                            <span className="link-name ms-2">Api Management</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ul className="admin-sidebar-ul">
                                <li>
                                    <Link className="admin-sidebar-li" to={'/master/api-list'}>Api List</Link>
                                </li>
                                <li>
                                    <Link className="admin-sidebar-li" to={'/master/category-list'}>Category List</Link>
                                </li>
                                <li>
                                    <Link className="admin-sidebar-li" to={'/master/sub-category-list'}>Subcategory List</Link>
                                </li>
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="mb-2 position-relative">
                        <Accordion.Header>
                            <i className="fa-brands fa-microsoft"></i>
                            <span className="link-name ms-2">Master</span>
                        </Accordion.Header>
                        <Accordion.Body>
                            <ul className="admin-sidebar-ul">
                                <li>
                                    <Link className="admin-sidebar-li" to={'/master/term-and-condition'}>Terms and Conditions</Link>
                                </li>
                                <li>
                                    <Link className="admin-sidebar-li" to={'/master/privacy-policy'}>Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link className="admin-sidebar-li" to={'/master/suggest-an-api'}>Suggest an API</Link>
                                </li>
                                 <li>
                                    <Link className="admin-sidebar-li" to={'/master/get-in-touch'}>Get in Touch</Link>
                                </li>
                            </ul>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        </nav>
    )
}

export default Sidebar
