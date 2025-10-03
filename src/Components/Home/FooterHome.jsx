import { Link } from "react-router-dom"

function FooterHome() {
    return (

        <>
            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content p-2 position-relative">
                        <div className="">
                            {/* <h5 className="modal-title" id="exampleModalLabel">Modal title</h5> */}
                            <h3 className='text-center mb-0 mt-3'>Contact Us</h3>
                            <button type="button" className="btn-close close-absolute" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body contactus">
                            <p className="text-center">We re here to help you get the most out of our APIs. Whether you need technical support, have questions about integration, or want to explore partnership opportunities, feel free to reach out.</p>
                            <ul className="nav nav-pills mb-3 d-flex justify-content-center" id="pills-tab" role="tablist">
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Get In Touch</button>
                                </li>
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Suggest an API</button>
                                </li>
                            </ul>
                            <div className="tab-content" id="pills-tabContent">
                                <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                    <form action="">
                                        <div className="mb-3">
                                            <input type="text" className="form-control p-3" id="footerfullname" placeholder="Enter Full Name" />
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" className="form-control p-3" id="footeremail" placeholder="Enter Email ID" />
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" className="form-control p-3" id="footerphone" placeholder="Phone Number" />
                                        </div>
                                        <div className="mb-3">
                                            <textarea className="form-control p-3" id="exampleFormControlTextarea1" rows="3" placeholder="Type here"></textarea>
                                        </div>
                                    </form>
                                </div>
                                <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                    <form action="">
                                        <div className="mb-3">
                                            <input type="text" className="form-control p-3" id="contactname" placeholder="Enter Full Name" />
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" className="form-control p-3" id="contactemail" placeholder="Enter Email ID" />
                                        </div>
                                        <div className="mb-3">
                                            <input type="text" className="form-control p-3" id="contactphone" placeholder="Phone Number" />
                                        </div>
                                        <div className="mb-3">
                                            <textarea className="form-control p-3" id="exampleFormControlTextarea2" rows="3" placeholder="Type here"></textarea>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center">
                            {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                            <button type="button" className="btn btn-blue">Submit <i className="fa-solid fa-arrow-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-2 d-flex justify-content-center mb-3">
                            {/* <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s" alt="" /> */}
                            <img src="/assets/img/Bajaj-new-campaign.png" alt="" width={'300px'} />
                        </div>
                    </div>

                </div>
                <div className="border-top border-bottom">
                    <div className="container my-3">
                        <ul className="">
                            {/* <li><Link to={"/user/profile"}>Documentation</Link></li> */}
                            <li><Link to={"/api/0"}>Documentation</Link></li>
                            <li><Link to={"/Contactus"} data-bs-toggle="modal" data-bs-target="#exampleModal">Contact Us</Link></li>
                            <li><Link to={""}>Support Center</Link></li>
                            <li><Link to={""}>About Us</Link></li>
                            {/* <li><Link to={"/user/profile"}>Careers</Link></li> */}
                            <li><Link to={"/TermsofServices"}>Terms of Service</Link></li>
                            <li><Link to={"/Privacypolicy"}>Privacy Policy</Link></li>
                        </ul>

                    </div>
                </div>
                <div className="container">
                    <p className="text-center text-white mt-3 mb-0">Copyright © 2025. All rights reserved</p>
                </div>
            </div>

     
        </>
    )
}

export default FooterHome
