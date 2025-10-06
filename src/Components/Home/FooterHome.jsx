import { Link } from "react-router-dom"

function FooterHome() {
    return (

        <>
            <div className="modal fade" id="exampleModal" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-lg">
                    <div className="modal-content p-2 position-relative">
                        <div className="">
                            {/* <h5 className="modal-title " id="exampleModalLabel">Conatct us</h5> */}

                            <button type="button" className="btn-close close-absolute" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body contactus py-1">

                            <div className="row pt-1">
                                <div className="col-xl-5 col-lg-6 col-md-6 col-12 signUpsideBanner">
                                    <div className="">
                                        <img
                                            src="/assets/img/Bajaj Logo.png"
                                            alt="Bajaj Logo"
                                            className="mt-2"
                                        />
                                        <div className="authContent">
                                            <h1 className="title">Contact Us</h1>
                                            <p>
                                                We re here to help you get the most out of our APIs. Whether you need technical support, have questions about integration, or want to explore partnership opportunities, feel free to reach out.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-7 col-lg-6 col-md-6 col-12 ps-5">
                                    <ul className="nav nav-pills mb-3 d-flex justify-content-start mt-5" id="pills-tab" role="tablist">
                                        <li className="nav-item" role="presentation">
                                            <button className="nav-link active contact-tabs-border" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Get In Touch</button>
                                        </li>
                                        <li className="nav-item ms-3" role="presentation">
                                            <button className="nav-link contact-tabs-border" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Suggest an API</button>
                                        </li>
                                    </ul>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                            <form action=" ">
                                                <div className="mb-3 mt-4">
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
                                                <div className="d-flex justify-content-center pb-4">

                                                    <button type="button" className="btn btn-blue w-100">Submit </button>
                                                </div>
                                            </form>
                                        </div>
                                        <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                            <form action="">
                                                <div className="mb-3 mt-4">
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
                                                <div className="d-flex justify-content-center pb-4">

                                                    <button type="button" className="btn btn-blue w-100">Submit </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

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
                            <li><Link to={"/SupportCenter"}>Support Center</Link></li>
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
