import { useEffect } from "react";
import Header from "../user/layout/Header";
import FooterHome from "./FooterHome";
import { scrollToTop } from "../../Utils";

function AboutUs() {
  useEffect(() => {
    scrollToTop();
  }, []);

  return (
    <div>
      <Header />

      {/* Hero Section */}
      <section className="aboutus-bg">
        <div className="container">
          <div className="row justify-content-center support-center">
            <h1 className="text-white text-center">About Us</h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="card-bg">
        <div className="container px-2 px-sm-3 px-md-4 margin-top-100px">
          {/* Introduction */}
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="card-Works">
                <p className="mb-3 mb-md-4">
                  Welcome to the Bajaj API Developer Portal — a unified platform
                  designed to empower developers, partners, and businesses to
                  build innovative digital solutions using Bajaj's secure and
                  scalable APIs.
                </p>
                <p className="">
                  We are committed to enabling seamless integration, faster
                  development, and reliable connectivity across our digital
                  ecosystem.
                </p>
                {/* Mission & Vision */}
                <div className="row justify-content-center margin-top-24px margin-bottom-24px g-3 g-md-4">
                  <div className="col-12 col-md-6 mb-3 mb-md-4">
                    <div className="card-Works-bg p-3 p-md-4 h-100">
                      <div className="mb-2 mb-md-3">
                        <div className="about-icon-box-left">
                          <img
                            src="/assets/img/about/Our Mission.png"
                            alt="Mission"
                            className="about-icon"
                          />
                        </div>
                      </div>
                      <h4 className="mb-2 mb-md-3">Our Mission</h4>
                      <p>
                        Our mission is to simplify digital transformation by
                        providing easy-to-use, well-documented, and highly
                        reliable APIs that help developers create impactful
                        applications and services.
                      </p>
                      <p className="mb-0">
                        We aim to foster innovation by offering a
                        developer-first environment that supports growth,
                        collaboration, and technological excellence.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-3 mb-md-4">
                    <div className="card-Works-bg p-3 p-md-4 h-100">
                      <div className="mb-2 mb-md-3">
                        <div className="about-icon-box-left">
                          <img
                            src="/assets/img/about/Our Vision.png"
                            alt="Vision"
                            className="about-icon"
                          />
                        </div>
                      </div>
                      <h4 className="mb-2 mb-md-3">Our Vision</h4>
                      <p>
                        We envision a connected digital ecosystem where
                        developers and enterprises can collaborate effortlessly
                        to build and generate financial and business solutions.
                      </p>
                      <p className="mb-0">
                        By enabling open, secure, and scalable integrations, we
                        strive to be a trusted technology partner in your
                        digital journey.
                      </p>
                    </div>
                  </div>
                </div>
                {/* What We Offer */}
                <h3 className="text-start whtoffer">What We Offer</h3>
                <p className="text-start para-offer">
                  The Bajaj API Developer Portal provides:
                </p>
                <div className="row g-3 g-md-4">
                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card-Works-bg p-3 p-md-4 h-100">
                      <div className="mb-2 mb-md-3">
                        <div className="about-icon-box-left-below">
                          <img
                            src="/assets/img/about/Comprehensive API Access.png"
                            alt="Comprehensive API Access"
                            className="about-icon-other"
                          />
                        </div>
                      </div>
                      <h5 className="mb-2 mb-md-3 offer-heading">
                        Comprehensive API Access
                      </h5>
                      <p className="mb-0 offer-description">
                        Secure access to a wide range of business and financial
                        services APIs.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card-Works-bg p-3 p-md-4 h-100">
                      <div className="mb-2 mb-md-3">
                        <div className="about-icon-box-left-below">
                          <img
                            src="/assets/img/about/Detailed Documentation.png"
                            alt="Detailed Documentation"
                            className="about-icon-other"
                          />
                        </div>
                      </div>
                      <h5 className="mb-2 mb-md-3 offer-heading">
                        Detailed Documentation
                      </h5>
                      <p className="mb-0 offer-description">
                        Clear guides, references, and examples to accelerate
                        development.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card-Works-bg p-3 p-md-4 h-100">
                      <div className="mb-2 mb-md-3">
                        <div className="about-icon-box-left-below">
                          <img
                            src="/assets/img/about/Robust Security.png"
                            alt="Robust Security"
                            className="about-icon-other"
                          />
                        </div>
                      </div>
                      <h5 className="mb-2 mb-md-3 offer-heading">Robust Security</h5>
                      <p className="mb-0 offer-description">
                        Industry-standard authentication and authorization
                        mechanisms.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card-Works-bg p-3 p-md-4 h-100">
                      <div className="mb-2 mb-md-3">
                        <div className="about-icon-box-left-below">
                          <img
                            src="/assets/img/about/Sandbox Environment.png"
                            alt="Sandbox Environment"
                            className="about-icon-other"
                          />
                        </div>
                      </div>
                      <h5 className="mb-2 mb-md-3 offer-heading">
                        Sandbox Environment
                      </h5>
                      <p className="mb-0 offer-description">
                        Test and validate your integrations before going live.
                      </p>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6 col-lg-4">
                    <div className="card-Works-bg p-3 p-md-4 h-100">
                      <div className="mb-2 mb-md-3">
                        <div className="about-icon-box-left-below">
                          <img
                            src="/assets/img/about/Developer Support.png"
                            alt="Developer Support"
                            className="about-icon-other"
                          />
                        </div>
                      </div>
                      <h5 className="mb-2 mb-md-3 offer-heading">Developer Support</h5>
                      <p className="mb-0 offer-description">
                        Dedicated resources and support for seamless onboarding.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Why Choose Bajaj APIs */}
                <div className="row justify-content-center margin-top-24px margin-bottom-24px">
                  <div className="col-12">
                    <h3 className="text-start whtoffer">
                      Why Choose Bajaj APIs?
                    </h3>
                    <p className="mb-2 mb-md-3 para-offer">
                      Our APIs are built to meet the evolving needs of modern
                      businesses and developers:
                    </p>
                    <ol className="ps-3 ps-md-4">
                      <li className="mb-2 api-list-item">
                        Trusted enterprise-grade infrastructure
                      </li>
                      <li className="mb-2 api-list-item">
                        High availability and performance
                      </li>
                      <li className="mb-2 api-list-item">
                        Compliance with regulatory standards
                      </li>
                      <li className="mb-2 api-list-item">
                        Continuous innovation and upgrades
                      </li>
                      <li className="mb-0 api-list-item">
                        Strong partner ecosystem
                      </li>
                    </ol>
                  </div>
                </div>
                <div className="row justify-content-center margin-top-24px">
                  <div className="col-12">
                    <h3 className="text-start whtoffer">
                      Join Our Developer Community
                    </h3>
                    <p className="mb-0 para-offer">
                      Become a part of our growing developer network and unlock
                      new possibilities with Bajaj APIs.
                    </p>
                    <p className="mb-0 para-offer mt-2 mt-md-3">
                      Whether you are building fintech solutions, enterprise
                      applications, or customer engagement platforms, our portal
                      provides the tools and support you need to succeed.
                    </p>
                    <p className="mb-0 para-offer mt-2 mt-md-3">
                      Get Started, Sign up, explore our APIs, and start building
                      today. Let's create the future of digital innovation — together.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <FooterHome />
    </div>
  );
}

export default AboutUs;
