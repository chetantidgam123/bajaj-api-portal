import { useLocation } from "react-router-dom"

function GetStarted() {
    const location = useLocation();
    return (
        <>
            {/* Only show this when URL is /get-started */}
            {location.pathname === "/get-started" && (
                <div className="card-body card-bg">
                <h4 className="mb-2">Get Started</h4>
                </div>
            )}
            <div className="card-body card-bg mt-3">
                <h5 >Step 1</h5>
                <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
                        <ul className="ps-3">
                            <li> <p className="mb-0">Go to our sign-up page.</p></li>
                            <li> <p> Complete all necessary fields to register your account.</p></li>
                        </ul>
                    </div>
                    <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                <img src="/assets/img/image 1.png" alt="NA" className='w-100 height-250' />
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                <img src="/assets/img/image 2.png" alt="NA" className='w-100 height-250' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-body card-bg mt-3">
                <h5>Step 2</h5>
                <div className="row">
                    <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
                        <ul>
                            <li> <p className="mb-0">To select an API, use the left-side tree in Documentation.</p></li>
                            <li> <p>Clicking an API displays its request, response, and headers data.</p></li>
                        </ul>
                    </div>
                    <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                <img src="/assets/img/image 3.png" alt="NA" className='w-100 height-250'  />
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                <img src="/assets/img/image 4.png" alt="NA" className='w-100 height-250' />
                            </div>
                        </div>
                    </div>
                </div>
                 </div>
                <div className="card-body card-bg mt-3">
                    <h5>Step 3</h5>
                    <div className="row">
                        <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
                            <ul>
                                <li> <p className="mb-0">Clicking the Test API button opens a pop-up with a sample request and content type selection.</p></li>
                                <li> <p>Once the sample request packet is loaded, on clicking Test button at the bottom right of the pop-up, the response packet is returned as shown in the image.</p></li>
                            </ul>
                        </div>
                        <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
                        <div className="row">
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                <img src="/assets/img/image 5.png" alt="NA" className='w-100 height-250' />
                            </div>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                                <img src="/assets/img/image 6.png" alt="NA" className='w-100 height-250' />
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
           
        </>
    )
}

export default GetStarted
