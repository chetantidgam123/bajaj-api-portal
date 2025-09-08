import { Link, useLocation } from "react-router-dom"

function FooterHome() {
    const location = useLocation();
    return (

        <>
       <div className="footer">
        <div className="container border-white">
            <div className="row p-3 align-items-center">
                <div className="col-2">
                      <img src="/assets/img/white_logo.png" alt="" />
                </div>
                <div className="col-10">
                      <ul>
                    <li><Link  to={"/user/profile"}>Documentation</Link></li>
                    <li><Link  to={"/user/profile"}>Contact Us</Link></li>
                    <li><Link  to={"/user/profile"}>Support Center</Link></li>
                    <li><Link  to={"/user/profile"}>About Us</Link></li>
                    <li><Link  to={"/user/profile"}>Careers</Link></li>
                    <li><Link  to={"/TermsofServices"}>Terms of Service</Link></li>
                    <li><Link  to={"/Privacypolicy"}>Privacy Policy</Link></li>
                    </ul>
                </div>
            </div>
        </div>
       </div>
       <div className="footer-bottom">
        <p className="text-center text-white mb-0">Copyright © 2025.  All rights reserved</p>
       </div>
        {/* <div className={`${location.pathname == '/' ? 'footerDiv' : 'otherFooterDiv'}  col-12 m4-5`}>
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
        </div> */}
         </>
    )
}

export default FooterHome
