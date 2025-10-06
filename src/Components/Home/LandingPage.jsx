import { Modal } from 'react-bootstrap'
import Header from '../user/layout/Header'
import FooterHome from './FooterHome'
import SignupPage from '../auth/SignupPage';
import Login from '../auth/Login';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPasswrd';
import { useEffect, useState } from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../../../src/new.css'
import { post_data } from '../../ApiServices';
import { arrayIndex, availableApi, convertToPayload, scrollToTop } from '../../Utils';
import { useNavigate, Link } from 'react-router-dom';
import { error_swal_toast } from '../../SwalServices';

import AOS from "aos";
import "aos/dist/aos.css";

function NextArrow({ onClick, isActive }) {
    return (
        <div
            className={`custom-arrow next ${isActive ? "active" : "disabled"}`}
            onClick={isActive ? onClick : null}
        >
            <i className="fa-solid fa-arrow-right"></i>
        </div>
    );
}

function PrevArrow({ onClick, isActive }) {
    return (
        <div
            className={`custom-arrow prev ${isActive ? "active" : "disabled"}`}
            onClick={isActive ? onClick : null}
        >
            <i className="fa-solid fa-arrow-left"></i>
        </div>
    );
}

function LandingPage() {
  const [show, setShow] = useState(false);
  const [modalName, setModalName] = useState("");
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const slidesToShow = 3;
  const [sidebarItem, setSidebarItem] = useState([])

    useEffect(() => {
        AOS.init({ duration: 1000, once: true }); // initialize AOS
    }, []);

    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow,
        slidesToScroll: 1,
        initialSlide: 0,
        onInit: () => setCurrent(0),
        beforeChange: (_, next) => setCurrent(next),
        nextArrow: (
            <NextArrow isActive={current < availableApi.length - slidesToShow} />
        ),
        prevArrow: <PrevArrow isActive={current > 0} />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } }
        ]
    };
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true
        });

        AOS.refresh();
    }, []);

const getURLIds = async() => {
    try {
        const res = await post_data("portal/public", convertToPayload("get-sidebar-list", {}), {})
        if(res.data.status) {
           setSidebarItem(res.data.data)
           console.log(res.data.data)
        }
    } catch(error) {
        error_swal_toast(response.data.message);
    }

}

useEffect(() => {
    scrollToTop()
    getURLIds()
}, [])

    return (
        <div className='all'>
            <Header />
            <div className='banner' data-aos="fade-up">
                <div className='container'>
                    <div className='row align-items-center'>
                        <div className='col-xl-7 col-lg-8 col-md-12 col-sm-12 col-12' data-aos="fade-right">
                            <p className='text-start welcome'>Welcome to</p>
                            <h1 className='text-start mt-3'>Bajaj API Developer Portal</h1>
                            <div className='row d-flex justify-content-start mt-3'>
                                <div className='col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12'>
                                    <p className='text-start text-white'>— your one-stop destination for accessing, integrating, and managing powerful APIs that drive seamless digital experiences. Whether you're building customer journeys, or partner integrations, our APIs offer secure, scalable, and easy-to-use solutions to accelerate your development.</p>
                                </div>
                                <div className='d-flex justify-content-start mt-3'>
                                    <button className='btn btn-blue p-3' onClick={() => { navigate('/get-started') }}>Get Started </button>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-5 col-lg-4 col-md-12 col-sm-12 col-12 top_image_bounce' data-aos="fade-left">
                            <img src="/assets/img/right-side.png" className='w-100' alt='' />
                        </div>
                    </div>

                </div>
            </div>
            <div className='card-bg' data-aos="zoom-in">
                <div className='container'>
                    <h1 className='text-center'>How it Works?</h1>
                    <div className="bar"></div>
                    <div className='row justify-content-center'>
                        <div className='col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12'>
                            <p className='text-center'>Onboard your developers effortlessly. Discover how easy it is to integrate Bajaj APIs in just a few simple steps.</p>
                        </div>
                    </div>

                    <div className='row mt-4 border-relative' data-aos="fade-up">
                        <div className='col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4 d-flex justify-content-center'>
                            <button className='btn btn-outline-primary px-3 bg-white'>Step 1</button>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4 d-flex justify-content-center'>
                            <button className='btn btn-primary px-3'>Step 2</button>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-4 col-sm-4 col-4 d-flex justify-content-center'>
                            <button className='btn btn-outline-primary px-3 bg-white'>Step 3</button>
                        </div>
                    </div>
                    <div className='border-dashed'></div>
                    <div className='row mt-5'>
                        <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-3'>
                            <div className='card-ava'>
                                <div className='row'>
                                    <div className='col-6'>
                                        <img src="/assets/img/Works-1.png" alt="" className="w-100" />
                                    </div>
                                    <div className='col-6'>
                                        <div className='circle-work'>
                                            <img src="/assets/img/sign-up 1.png" alt="" className="w-75 d-flex justify-content-center align-items-center" />
                                        </div>
                                        <h5 className='mt-2'>Sign Up to
                                            Get Started</h5>
                                        <p>Create your account to explore and manage powerful APIs.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-3'>
                            <div className='card-ava'>
                                <div className='row'>
                                    <div className='col-6'>
                                        <img src="/assets/img/Works-2.png" alt="" className="w-100" />
                                    </div>
                                    <div className='col-6'>
                                        <div className='circle-work'>
                                            <img src="/assets/img/sign-up 2.png" alt="" className="w-75 d-flex justify-content-center align-items-center" />
                                        </div>
                                        <h5 className='mt-2'>Select Our Available API</h5>
                                        <p>Explore and select from our wide range of available APIs.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 mb-3'>
                            <div className='card-ava'>
                                <div className='row'>
                                    <div className='col-6'>
                                        <img src="/assets/img/Works-3.png" alt="" className="w-100" />
                                    </div>
                                    <div className='col-6'>
                                        <div className='circle-work'>
                                            <img src="/assets/img/sign-up 3.png" alt="" className="w-75 d-flex justify-content-center align-items-center" />
                                        </div>
                                        <h5 className='mt-2'>Test it
                                            Out</h5>
                                        <p>Use our interactive mock API to test your integration.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='Golive ' data-aos="fade-up">
                <div className='container'>
                    <h1 className='text-center text-white'>Go Live With Us</h1>
                    <div className="bar-white"></div>
                    <div className='row justify-content-center'>
                        <div className='col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12'>
                            <p className='text-center text-white'>Onboard your developers effortlessly. Discover how easy it is to integrate Bajaj APIs in just a few simple steps.</p>
                        </div>
                    </div>

                    <div className='row d-flex justify-content-center my-5'>
                        <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-3' data-aos="flip-left">
                            <div className='position-relative mt-3'>
                                <h1 className='step-1'>01</h1>
                                <h3 className='text-white position-go-subheading mb-0'>Development</h3>
                            </div>
                            <div className='row'>
                                <div className='col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12'>
                                    <p className='mt-4 text-white'>Build and test APIs in a controlled developer environment.</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-3' data-aos="flip-up">
                            <div className='position-relative mt-3'>
                                <h1 className='step-1'>02</h1>
                                <h3 className='text-white position-go-subheading mb-0'>UAT</h3>
                            </div>
                            <div className='row'>
                                <div className='col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12'>
                                    <p className='mt-4 text-white'>Validate APIs in a staging environment before going live.</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-xl-4 col-lg-4 col-md-4 col-sm-12 col-12 mb-3' data-aos="flip-right">
                            <div className='position-relative mt-3'>
                                <h1 className='step-1'>03</h1>
                                <h3 className='text-white position-go-subheading mb-0'>Production</h3>
                            </div>
                            <div className='row'>
                                <div className='col-xl-10 col-lg-10 col-md-12 col-sm-12 col-12'>
                                    <p className='mt-4 text-white'>Access live, secure, and fully
                                        operational APIs.</p>
                                </div>
                            </div>

                        </div>


                    </div>
                </div>
            </div>
            <div className='container'>
                <div className='img-up '>
                    <img src="/assets/img/Go-live-with-us.png" alt="" className='w-100' />
                </div>
            </div>
            <div className='availableApi' data-aos="fade-up">
                <div className='container'>
                    <h1>Available API</h1>
                    <div className="bar"></div>
                    <div className='row justify-content-center'>
                        <div className='col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12'>
                            <p className='text-center'>Onboard your developers effortlessly. Discover how easy it is to integrate Bajaj APIs in just a few simple steps.</p>
                        </div>
                    </div>

                    <Slider {...settings}>
                        {availableApi.map((card, index) => (
                            <div role='button' onClick={() => { navigate(card.routePath) }} key={arrayIndex("card", index)} className="p-3" data-aos="zoom-in">
                                <div className='card-ava'>
                                    <div className="circle-ava">
                                        <img
                                            src="/assets/img/bullet.png"
                                            alt="NA"
                                            className='w-100 d-flex justify-content-start align-items-center'
                                        />
                                    </div>
                                    <div className="content-title my-3">
                                        {card.title}
                                    </div>
                                    <div className="content-details four-lines">
                                        {card.details}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>

                    <div className='d-flex justify-content-center mt-4'>
                        <button className='btn btn-blue p-3' onClick={() => { navigate('api/f054d44c-65cf-49d5-9a68-eef138cd5453') }}>
                            View All APIs
                        </button>
                    </div>
                </div>
            </div>
            <FooterHome />

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