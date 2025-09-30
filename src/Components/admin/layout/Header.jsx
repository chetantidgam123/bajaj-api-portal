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
                                        <div className="circle-profile">
                                            <i className="fa fa-user"></i>
                                        </div>
                                        <div className="ms-2 text-start color-blue">
                                            Welcome <br></br>
                                            {fullName}
                                        </div>

                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Link
                                            style={{ textDecoration: "none", color: "#212529" }}
                                        // to={"/user/profile"}
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

                             


                          
                        
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default Header
