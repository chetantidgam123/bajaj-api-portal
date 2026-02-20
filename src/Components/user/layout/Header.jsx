import { useEffect, useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SignupPage from "../../auth/SignupPage";
import Login from "../../auth/Login";
import ForgotPassword from "../../auth/ForgotPassword";
import ResetPassword from "../../auth/ResetPasswrd";
import { getTokenData, getInitials, convertToPayload } from "../../../Utils";
import { confirm_swal_with, success_swal_toast, swall_logout_animate } from "../../../SwalServices";
import { post_data } from "../../../ApiServices";

function Header() {
  const [fullName, setFullName] = useState('');
  const [show, setShow] = useState(false);
  const [modalName, setModalName] = useState("");
  const token = getTokenData();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [queryList, setQueryList] = useState({});
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [isUserSelected, setIsUserSelected] = useState(false)
  const [searchComplete, setSearchComplete] = useState(false);

const searchFilter = async (searchTerm) => {
  if(!searchTerm) {
    setResults([]);
    setSearchComplete(false);
    return;
  }
  let payload = { search_text: searchTerm };
  setLoading(true);
  setSearchComplete(false);
  post_data("portal/public", convertToPayload('serach-api-by-name', payload), {})
    .then((response) => {
      if (response.data.status) {
        const apiList = response.data.result || [];
        setResults(apiList);
      }
    })
    .catch((error) => {
      console.error("API Error:", error);
    })
    .finally(() => {
      setLoading(false);
      setSearchComplete(true);
    });
};

  useEffect(() => {
    if (location.pathname.includes("reset")) {
      setShow(true);
      setModalName("reset-pass");
    }
    setFullName(token?.fullname || "");
  }, [location]);


  const logout = () => {
    swall_logout_animate(() => {
      try {
        localStorage.clear();
        success_swal_toast("You have been logged out!");
        navigate("/");
      } catch (err) {
        console.error("Logout error:", err);
      }
    });
  }

  const confirm_swal_call = () => {
    const callback = (resolve, reject) => {
      resolve();
    }
    confirm_swal_with(callback, `To access the APIs your account is in Approval Process`)
  }

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsUserSelected(false)
    if(timeoutId) clearTimeout(timeoutId);

    const newTimeout = setTimeout(() => {
      searchFilter(value);
    }, 500)

    setTimeoutId(newTimeout);      
  };

  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      navigate(`/api/${queryList.subcatgory_id}/${queryList.category_id}/${queryList.api_id}`)
    }
  }

const handleSelect = (item) => {
  console.log(item)
  setQueryList(item);
  setQuery(item.apiname);
  setResults([]);
  setIsUserSelected(true);
  setSearchComplete(false);
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
            className="navbar-toggler d-none"
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
            className="collapse navbar-collapse justify-content-center d-xl-block d-lg-block d-md-block d-sm-none d-none gap-4"
            id="navbarCenterContent"
          >
            {/* Center: Links */}
            <ul className="navbar-nav header-nav mb-2 mb-lg-0">
              {token?.role == 1 && (
                <li className="nav-item">
                  <Link className="nav-link" to="/master">
                    Admin
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <NavLink className="nav-link" to="/api/0" >
                  Explore API
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/faq">
                  FAQ
                </NavLink>
              </li>
            </ul>
          
            {/* Search Input Field */}
          <div className="position-relative" style={{width: "340px"}}>
            <i className="fa-solid fa-search position-absolute top-50 translate-middle-y ms-2 text-muted pointer-events-none"></i>
            <input 
              type="text" 
              value={query} 
              onChange={handleChange} 
              placeholder="Search API's" 
              onKeyDown={handleKeyDown}
              className="form-control rounded-pill new-input bg-white pe-4"
            />
            {
              loading && (
                <div className="position-absolute top-50 translate-middle-y" style={{ right: "12px" }}>
                  <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
                </div>
              )
            }
            {results.length > 0 && (
              <div 
                className="position-absolute w-100 mt-1 bg-white border border-gray-300 rounded shadow-lg"
                style={{ 
                  zIndex: 9999,  // High z-index to overlap other sections
                  maxHeight: '240px',  // Fixed height for scrollbar
                  overflowY: 'auto',   // Vertical scrollbar only when needed
                  top: '100%'          // Position directly below input
                }}
              >
                {results.map((item, index) => (
                  <div
                    key={item.api_id || index}
                    onClick={() => handleSelect(item)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-bottom border-gray-100 d-flex align-items-center"
                    style={{ borderBottom: index < results.length - 1 ? '1px solid #f3f4f6' : 'none' }}
                  >
                    {item.apiname}
                  </div>
                ))}
              </div>
            )}
            {searchComplete &&!loading && query && results.length === 0 && !isUserSelected && (
              <div 
                className="position-absolute w-100 mt-1 bg-white border border-gray-300 rounded shadow-lg p-3 text-gray-500"
                style={{ zIndex: 9999, top: '100%' }}
              >
                No APIs found
              </div>
            )}
          </div>

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
            <div className='d-xl-none d-lg-none d-md-block d-sm-block d-block me-2'>
              <i className="fa-solid fa-bars btn-mobile-blue" data-bs-toggle="offcanvas" href="#offcanvasExample" role="button" aria-controls="offcanvasExample"></i>
            </div>

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
                Sign In
              </button>
            )}

            {/* Profile Dropdown (when user is logged in) */}
            {getTokenData() && (
              <Dropdown className="p-0 me-3">
                <Dropdown.Toggle
                  className="d-flex justify-content-center align-items-center btn-white p-0 border-0"
                  style={{ background: "transparent" }}
                >
                  <div className="circle-profile" style={{ backgroundColor: '#007bff', color: '#ffffff' }}>
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

                  {getTokenData()?.approved_status === 1 && <Link
                    style={{ textDecoration: "none", color: "#212529" }}
                    to="/user/profile"
                  >
                    <Dropdown.Item as="span">Profile</Dropdown.Item>
                  </Link>}

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

          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Header closeButton className="border-bottom-0 py-0"></Modal.Header>
        <Modal.Body className="pt-0">
          <div className="col-12 px-3">
            <div className="row">
              <div className="col-xl-5 col-lg-5 col-md-5 col-12 signUpsideBanner">
                <img src="/assets/img/Bajaj Logo.png" alt="NA" className="mt-2"/>
                <div className="authContent">
                  <h1 className="title">Welcome to Bajaj API Developer Portal.</h1>
                  <p>
                    Your one-stop destination for accessing, integrating, and
                    managing powerful APIs that drive seamless digital
                    experiences.
                  </p>
                </div>
              </div>
              <div className="ps-4 col-xl-7 col-lg-7 col-md-7 col-12">
                {modalName == "signup" && 
                (
                  <SignupPage setModalName={setModalName} setShow={setShow} />
                )}
                {modalName == "login" && 
                (
                  <Login setModalName={setModalName} setShow={setShow} />
                )}
                {modalName == "forget-pass" && 
                (
                  <ForgotPassword setModalName={setModalName} setShow={setShow} />
                )}
                {modalName == "reset-pass" && 
                (
                  <ResetPassword setModalName={setModalName} setShow={setShow} />
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>

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
          <ul className="navbar-nav mb-2 mb-lg-0">
            {getTokenData()?.role == 1 && (
              <li className="nav-item">
                <Link className="nav-link" to="/master">
                  Admin
                </Link>
              </li>
            )}
            <li className="nav-item">
              {!getTokenData() ? (
                <span className="nav-link" style={{ cursor: "pointer" }} data-bs-dismiss="offcanvas" onClick={() => {
                  setModalName("signup");
                  setShow(true);
                }}>
                  Explore API
                </span>
              ) : getTokenData()?.approved_status === 1 ? (
                <Link className="nav-link" to="/api/0">Explore API</Link>
              ) : (
                <span className="nav-link" style={{ cursor: "pointer" }} data-bs-dismiss="offcanvas" onClick={() => confirm_swal_call()}>
                  Explore API
                </span>
              )}
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/faq">
                FAQ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Header;
