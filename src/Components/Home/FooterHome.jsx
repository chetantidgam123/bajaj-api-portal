import { Link, useLocation } from "react-router-dom"

function FooterHome() {
    const location = useLocation();
    return (

        <>
        <div className="modal fade" id="exampleModal"  aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div className="modal-dialog modal-dialog-centered">
    <div className="modal-content p-2 position-relative">
      <div className="">
        {/* <h5 className="modal-title" id="exampleModalLabel">Modal title</h5> */}
        <h3 className='text-center mb-0 mt-3'>Contact Us</h3>
        <button type="button" className="btn-close close-absolute" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body contactus">
        <p className="text-center">We’re here to help you get the most out of our APIs. Whether you need technical support, have questions about integration, or want to explore partnership opportunities, feel free to reach out.</p>
        <ul className="nav nav-pills mb-3 d-flex justify-content-center" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
                <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Get In Touch</button>
            </li>
            <li className="nav-item" role="presentation">
                <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Suggest a API</button>
            </li>
            </ul>
            <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                <form action="">
                    <div className="mb-3">
                        <input type="text" className="form-control p-3" id="exampleInputEmail1" placeholder="Enter Full Name"  />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control p-3" id="exampleInputEmail1" placeholder="Enter Email ID"  />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control p-3" id="exampleInputEmail1" placeholder="Phone Number"  />
                    </div>
                    <div className="mb-3">
                         <textarea className="form-control p-3" id="exampleFormControlTextarea1" rows="3" placeholder="Type here"></textarea>
                    </div>
                </form>
            </div>
            <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                 <form action="">
                    <div className="mb-3">
                        <input type="text" className="form-control p-3" id="exampleInputEmail1" placeholder="Enter Full Name"  />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control p-3" id="exampleInputEmail1" placeholder="Enter Email ID"  />
                    </div>
                    <div className="mb-3">
                        <input type="text" className="form-control p-3" id="exampleInputEmail1" placeholder="Phone Number"  />
                    </div>
                    <div className="mb-3">
                         <textarea className="form-control p-3" id="exampleFormControlTextarea1" rows="3" placeholder="Type here"></textarea>
                    </div>
                </form>
            </div>
            </div>
      </div>
      <div className="d-flex justify-content-end">
        {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
        <button type="button" className="btn btn-blue">Submit <i class="fa-solid fa-arrow-right"></i></button>
      </div>
    </div>
  </div>
</div>
       <div className="footer">
        <div className="container border-white">
            <div className="row p-3 align-items-center">
                <div className="col-2">
                      <img src="/assets/img/white_logo.png" alt="" />
                </div>
                <div className="col-10">
                      <ul>
                    <li><Link  to={"/user/profile"}>Documentation</Link></li>
                    <li><Link  to={"/Contactus"} data-bs-toggle="modal" data-bs-target="#exampleModal">Contact Us</Link></li>
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
