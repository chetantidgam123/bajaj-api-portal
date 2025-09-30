import { useEffect, useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import SignupPage from "../../auth/SignupPage";
import Login from "../../auth/Login";
import ForgotPassword from "../../auth/ForgotPassword";
import ResetPassword from "../../auth/ResetPasswrd";
import { getTokenData, getInitials } from "../../../Utils";

function Header() {
  const [fullName, setFullName] = useState('');
  const [show, setShow] = useState(false);
  const [modalName, setModalName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.includes("reset")) {
      setShow(true);
      setModalName("reset-pass");
    }
     const token = getTokenData();
     setFullName(token?.fullname || "");
  }, [location]);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="header">
      <nav className="navbar navbar-expand-lg py-0">
        <div className="container-fluid bg-white">
          {/* Logo */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src="/assets/img/logo.png"
              alt="Logo"
              className="logo-img me-4 mt-2"
            />
          </Link>

          {/* Toggle Button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCenterContent"
            aria-controls="navbarCenterContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible Content */}
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarCenterContent"
          >
            {/* Center: Links */}
            <ul className="navbar-nav mb-2 mb-lg-0">
              {getTokenData()?.role == 1 && (
                <li className="nav-item">
                  <Link className="nav-link" to="/master">
                    Admin
                  </Link>
                </li>
              )}
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
            </ul>

            {/* Sign Up / Sign In (Hidden when logged in) */}
            <div className="d-flex gap-2 d-none">
              <Link
                className="btn btn-primary"
                onClick={() => {
                  setModalName("signup");
                  setShow(true);
                }}
              >
                Sign Up
              </Link>
              <Link
                className="btn btn-outline-primary"
                onClick={() => {
                  setModalName("login");
                  setShow(true);
                }}
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Right Section (Login / Profile / Notifications) */}
          <div className="d-flex justify-content-center align-items-center">
            {/* Sign In button (when no user is logged in) */}
            {!getTokenData() && (
              <button
                className="btn btn-blue me-3"
                onClick={() => {
                  setModalName("login");
                  setShow(true);
                }}
                style={{
                  background: "#006AD0",
                  color: "#ffffff",
                }}
              >
                Sign In <i className="fa-solid fa-arrow-right"></i>
              </button>
            )}

            {/* Profile Dropdown (when user is logged in) */}
            {getTokenData() && (
              <Dropdown className="p-0 me-3">
                <Dropdown.Toggle
                  className="d-flex justify-content-center align-items-center btn-white p-0 border-0"
                  style={{ background: "transparent" }}
                >
                  <div className="circle-profile" style={{ backgroundColor: '#007bff', color: '#ffeb3b' }}>
                    {fullName ? getInitials(getTokenData().fullname.split(" ")[0]) : <i className="fa fa-user"></i>}
                  </div>
                  <div className="ms-2 text-start color-blue">
                    Welcome <br />
                    {getTokenData()?.fullname
                      ? `${getTokenData().fullname.split(" ")[0]}`
                      : "User"}
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu className="custom-dropdown-menu py-0 with-caret">
                  {getTokenData()?.role == 1 && (
                    <Link
                      style={{ textDecoration: "none", color: "#212529" }}
                      to="/master"
                    >
                      <Dropdown.Item as="span" active>
                        Dashboard
                      </Dropdown.Item>
                    </Link>
                  )}

                  <Link
                    style={{ textDecoration: "none", color: "#212529" }}
                    to="/user/profile"
                  >
                    <Dropdown.Item as="span">Profile</Dropdown.Item>
                  </Link>

                  <Dropdown.Item
                    as="button"
                    // className="span-btn"
                    onClick={logout}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* Notification Dropdown */}
            {/* <Dropdown align="end">
              <Dropdown.Toggle
                id="dropdown-basic"
                style={{
                  background: "transparent",
                  border: "none",
                  padding: "0px",
                  borderRadius: "50%",
                  position: "relative",
                }}
              >
                <i
                  className="fa fa-bell"
                  style={{ fontSize: "20px", color: "#333" }}
                ></i>
                <span
                  style={{
                    position: "absolute",
                    top: "-13px",
                    right: "4px",
                    background: "#0052A4",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "10px",
                    fontWeight: "bold",
                  }}
                >
                  3
                </span>
              </Dropdown.Toggle>

              
              <Dropdown.Menu style={{ minWidth: "250px" }}>
                <Dropdown.Header>Notifications</Dropdown.Header>
                <Dropdown.Item>
                  <strong>New Message</strong>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    You have received a new message.
                  </div>
                </Dropdown.Item>
                <Dropdown.Item>
                  <strong>System Update</strong>
                  <div style={{ fontSize: "12px", color: "#777" }}>
                    Your profile has been updated successfully.
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item as="button" className="text-center">
                  View All
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <Modal size="lg" show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton className="border-bottom-0 py-0"></Modal.Header>
        <Modal.Body className="pt-0">
          <div className="col-12 px-3">
            <div className="row">
              <div className="col-xl-5 col-lg-5 col-md-5 col-12 signUpsideBanner">
                <img
                  src="/assets/img/Bajaj Logo.png"
                  alt="NA"
                  className="mt-2"
                />
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
                {modalName == "signup" && (
                  <SignupPage setModalName={setModalName} setShow={setShow} />
                )}
                {modalName == "login" && (
                  <Login setModalName={setModalName} setShow={setShow} />
                )}
                {modalName == "forget-pass" && (
                  <ForgotPassword setModalName={setModalName} setShow={setShow} />
                )}
                {modalName == "reset-pass" && (
                  <ResetPassword setModalName={setModalName} setShow={setShow} />
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Header;
