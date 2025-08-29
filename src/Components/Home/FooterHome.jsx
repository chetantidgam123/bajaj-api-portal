import { Link, useLocation } from "react-router-dom"

function FooterHome() {
    const location = useLocation();
    return (
        <div className={`${location.pathname == '/' ? 'footerDiv' : 'otherFooterDiv'}  col-12 m4-5`}>
            <div className="row g-0 mb-5 pt-5" style={{ borderTop: "1px solid white" }}>
                <div className="col-1"></div>
                <div className="col-5">
                    <img src="/assets/img/white_logo.png" alt="" />
                </div>
                <div className="col-6">
                    <div className="row g-0">
                        <div className="col-3"></div>
                        <div className="col-3">
                            <h6>Get Started</h6>
                            <Link to={'/get-started'} style={{ textDecoration: 'none' }}>
                                <p>Documentation</p>
                            </Link>
                        </div>
                        <div className="col-3">
                            <h6>Support</h6>
                            <p>Contact Us</p>
                            <p>Support Center</p>
                        </div>
                        <div className="col-3">
                            <h6>Company</h6>
                            <p>About Us</p>
                            <p>Careers</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row g-0">
                <div className="col-1"></div>
                <div className="col-5"><p>Copyright © 2025.  All rights reserved</p></div>
                <div className="col-6">
                    <div className="row g-0">
                        <div className="col-3"></div>
                        <div className="col-3"></div>
                        <div className="col-3"><p>Terms of Service</p></div>
                        <div className="col-3"><p>Privacy Policy</p></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FooterHome
