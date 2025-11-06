import React, { useEffect } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from "react";
import { getTokenData, getInitials } from "../../../Utils";
import { confirm_swal_with_text, success_swal_toast } from '../../../SwalServices';
const Sidebar = React.lazy(() => import('./Sidebar'));

function Header() {
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
                        <i class="fa-solid fa-bars btn-mobile-blue" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample"></i>
                    </div>



                  

                </div>
                
            </nav>
              <div class="offcanvas offcanvas-start d-xl-none d-lg-none d-md-block d-sm-block d-block" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasExampleLabel">
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
                            <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                          
                        </div>
                    </div>
        </div>
        
    )
}

export default Header
