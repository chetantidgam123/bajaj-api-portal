import { Modal } from 'react-bootstrap'
import Header from '../user/layout/Header'
import FooterHome from './FooterHome'
import SignupPage from '../auth/SignupPage';
import Login from '../auth/Login';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPasswrd';
import { useEffect, useState } from 'react';

import { arrayIndex, availableApi, getTokenData } from '../../Utils';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const [show, setShow] = useState(false);
    const [modalName, setModalName] = useState("");
    const navigate = useNavigate();
    return (
        <div>
            <Header />
            <div className="gifDiv">
                <div style={{ padding: '3em 6em', display: 'flex', justifyContent: "space-between" }}>
                    <div className="gif-content">
                        <p className='mb-0'>Welcome to</p>
                        <div >Bajaj API Developer Portal</div>
                        <small>— your one-stop destination for accessing, integrating, and managing powerful APIs that drive seamless digital experiences. Whether you're building customer journeys, or partner integrations, our APIs offer secure, scalable, and easy-to-use solutions to accelerate your development.</small>
                        <button className='btn btn-primary' onClick={() => { navigate('/get-started') }}>Get Started <i className="fa-solid fa-arrow-right"></i></button>
                    </div>
                    <div className="bannerImg">
                        <img src="/assets/img/baneerside.png" alt="Na" className='w-100' style={{ height: '500px' }} />
                    </div>
                </div>
                <div className='howItWorks'>
                    <div className='titleDiv'> How it Works?</div>
                    <p>Onboard your developers effortlessly. Discover how easy it is to integrate Bajaj APIs in just a few simple steps.</p>
                    <div className="card-section row g-0 mt-5 pb-5">
                        <div className="card col-3 m-auto">
                            <div className="card-body">
                                <div className='content-title'>Sign Up to Get Started</div>
                                <div className='content-data'>Create your account to explore and manage powerful APIs.</div>
                                <div className="">
                                    <img src="/assets/img/createaccount.png" alt="NA" className='w-100' />
                                </div>
                            </div>
                        </div>
                        <div className="col-1 d-flex align-items-center justify-content-center">
                            <img src="/assets/img/prime_forward.png" alt='Na' className='forword-icon' />
                        </div>
                        <div className="card col-3 m-auto">
                            <div className="card-body">
                                <div className='content-title'>Select Our Available API</div>
                                <div className='content-data'>Explore and select from our wide range of available APIs.</div>
                                <div className="">
                                    <img src="/assets/img/sidebar.png" alt="NA" className='w-100' />
                                </div>
                            </div>
                        </div>
                        <div className="col-1 d-flex align-items-center justify-content-center">
                            <img src="/assets/img/prime_forward.png" alt='Na' className='forword-icon' />
                        </div>
                        <div className="card col-3 m-auto">
                            <div className="card-body">
                                <div className='content-title'>Test it Out</div>
                                <div className='content-data'>Use our interactive mock API to test your integration.</div>
                                <div className="">
                                    <img src="/assets/img/commingsoon.png" alt="NA" className='w-100' />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="goLiveSection py-5">
                    <div className='titleDiv'> Go Live With Us</div>
                    <div className='section-details'>Onboard your developers effortlessly. Discover how easy it is to integrate Bajaj APIs in just a few simple steps.</div>
                    <div className="card-section row g-0 mt-5 pb-5">
                        <div className="card col-3 m-auto">
                            <div className="card-body p-4">
                                <div className='content-title'>Development </div>
                                <div className="">
                                    <img src="/assets/img/dev.png" alt="NA" className='w-100' />
                                </div>
                                <div className="content-details d-none">
                                    Lorem ipsum dolor sit amet consectetur. Facilisis consequat cursus enim sed. Sollicitudin et nullam pellentesque id diam sit mollis. Faucibus vehicula.
                                </div>
                            </div>
                        </div>
                        <div className="col-1 d-flex align-items-center justify-content-center">
                            <img src="/assets/img/prime_forward.png" alt='Na' className='forword-icon' />
                        </div>
                        <div className="card col-3 m-auto">
                            <div className="card-body p-4">
                                <div className='content-title'>UAT</div>
                                <div className="">
                                    <img src="/assets/img/uat.png" alt="NA" className='w-100' />
                                </div>
                                <div className="content-details d-none">
                                    Lorem ipsum dolor sit amet consectetur. Facilisis consequat cursus enim sed. Sollicitudin et nullam pellentesque id diam sit mollis. Faucibus vehicula.
                                </div>
                            </div>
                        </div>
                        <div className="col-1 d-flex align-items-center justify-content-center">
                            <img src="/assets/img/prime_forward.png" alt='Na' className='forword-icon' />
                        </div>
                        <div className="card col-3 m-auto">
                            <div className="card-body p-4">
                                <div className='content-title'>Production</div>
                                <div className="">
                                    <img src="/assets/img/prod.png" alt="NA" className='w-100' />
                                </div>
                                <div className="content-details d-none">
                                    Lorem ipsum dolor sit amet consectetur. Facilisis consequat cursus enim sed. Sollicitudin et nullam pellentesque id diam sit mollis. Faucibus vehicula.
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="availableApi py-5">
                    <div className='titleDiv'> Available API</div>
                    <div className='section-details'>Onboard your developers effortlessly. Discover how easy it is to integrate Bajaj APIs in just a few simple steps.</div>
                    <div className="card-section mt-5 pb-5">
                        {availableApi.map((card, index) => (
                            <div key={arrayIndex('card', index)} className="card" style={{ width: '308px' }}>
                                <div className="card-body p-4">
                                    <img src="/assets/img/bullet.png" alt="NA" className='' />
                                    <div className="content-title my-3">
                                        {card.title}
                                    </div>
                                    <div className="content-details">
                                        {card.details}
                                    </div>
                                </div>
                            </div>
                        ))
                        }
                    </div>
                </div>
                <FooterHome />
            </div>
            <Modal size="lg" show={show} onHide={() => setShow(false)} centered>
                <Modal.Header closeButton className="border-bottom-0 py-0"></Modal.Header>
                <Modal.Body className="pt-0">
                    <div className="col-12 px-3">
                        <div className="row">
                            <div className="col-xl-5 col-lg-5 col-md-5 col-12 signUpsideBanner">
                                <img src="/assets/img/Bajaj Logo.png" alt="NA" className="mt-2" />
                                <div className="authContent">
                                    <h1 className="title">
                                        Welcome to Bajaj API Developer Portal.
                                    </h1>
                                    <p>
                                        Your one-stop destination for accessing, integrating, and managing powerful APIs that drive seamless digital experiences.
                                    </p>
                                </div>
                            </div>
                            <div className="col-xl-7 col-lg-7 col-md-7 col-12 ps-4">
                                {modalName == 'signup' && <SignupPage setModalName={setModalName} setShow={setShow} />}
                                {modalName == 'login' && <Login setModalName={setModalName} setShow={setShow} />}
                                {modalName == 'forget-pass' && <ForgotPassword setModalName={setModalName} setShow={setShow} />}
                                {modalName == 'reset-pass' && <ResetPassword setModalName={setModalName} setShow={setShow} />}
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default LandingPage
