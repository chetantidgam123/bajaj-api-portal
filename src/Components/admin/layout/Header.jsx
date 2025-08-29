import React, { useEffect } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from "react";
import { getTokenData } from "../../../Utils";
const Sidebar = React.lazy(() => import('./Sidebar'));

function Header() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.clear();
        navigate('/')
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
    return (
        <div>
            <div className='adminHeader'>
                <nav className="navbar navbar-expand-lg px-4">
                    <div className="container-fluid bg-white">
                        <button className="btn btn-primary toggle" type="button">
                            <i className="fa-solid fa-bars"></i>
                        </button>
                        {/* Toggle Button for mobile */}
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCenterContent" aria-controls="navbarCenterContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        {/* Collapsible Content */}
                        <div className="collapse navbar-collapse justify-content-end" id="navbarCenterContent">
                            {/* Center: Links */}
                            <ul className="navbar-nav mb-2 mb-lg-0">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/api/0">Explore API</Link>
                                </li>
                                <li className="nav-item mx-3">
                                    <Link className="nav-link" to="/faq">FAQ</Link>
                                </li>
                                <li className="nav-item" style={{ borderRadius: "22px", border: "1px solid gray" }}>
                                    <Dropdown style={{ bordeRadius: "22px" }}>
                                        <Dropdown.Toggle className="span-btn pb-0 pt-2" style={{ color: "rgba(0, 0, 0, 0.8)", borderRadius: "22px" }} id="dropdown-basic">
                                            {fullName} <i className="fa fa-user headerUserIcon"></i>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item >Profile</Dropdown.Item>
                                            <Dropdown.Item onClick={logout}>Logout</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Header
