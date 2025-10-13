import { useEffect,useState } from "react"
import Header from "../user/layout/Header"
import FooterHome from "./FooterHome"
import { scrollToTop,convertToPayload } from "../../Utils"
import { error_swal_toast } from "../../SwalServices"
import { post_data } from "../../ApiServices"
import { PageLoaderBackdrop } from "../../Loader"

function TermsofServices() {
  const [loader, setLoader] = useState(false)
  const [termCon, setTermCon] = useState([])

  useEffect(() => {
    scrollToTop()
    getTermandCon()
  }, [])

  const getTermandCon = () => {
    setLoader(true)
    let payload = {}
    post_data("portal/public", convertToPayload('get-term-and-condition', payload), {})
    .then((response) => {
        if (response.data.status) {
          const result = response.data.result;
          setTermCon(Array.isArray(result) ? result : [result]);
          setLoader(false)
        } else {
            error_swal_toast(response.data.message || "something went wrong");
        }
    }).catch((error) => {
        setLoader(false)
        error_swal_toast(error.message || "something went wrong");
        console.error("Error during signup:", error);
    })
  };

  return (
    <div>
          <Header />
          <div className="terms">
            <h1 className='mt-3'>Terms of Service</h1>
          </div>
            <div className='card-bg '>
                <div className='container'>
                    <div className='card-Works margin-top-100px'>
                <p>Welcome to the Bajaj API Portal. These Terms of Service govern your access to and use of the Portal, APIs, documentation, SDKs, and related services provided by Bajaj.</p>
                {/* <h5 className="mt-3">Eligibility</h5>
                <ol>
                    <li>You must be at least 18 years old and authorized to bind your organization to these Terms.</li>
                    <li>You represent that you have all rights, licenses, and authority necessary to use the Services.</li>
                </ol>
                <h5 className="mt-3">Account Registration</h5>
                <ol>
                    <li>You must create an account to access the Portal.</li>
                    <li>You are responsible for maintaining the confidentiality of your credentials and all activity under your account.</li>
                    <li>Notify us immediately of any unauthorized use of your account.</li>
                </ol>
                   <h5 className="mt-3">License to Use APIs</h5>
                   <ol>
                    <li>Subject to these Terms, Bajaj grants you a limited, revocable, non-exclusive, non-transferable license to access and use the APIs and documentation solely for developing, testing, and integrating your applications (“Apps”).</li>
                    <li>You may not sublicense, sell, or redistribute the APIs without prior written consent.</li>
                   </ol>
                   <h5 className="mt-3">Usage Restrictions</h5>
                   <p>You agree not to:</p>
                   <ol>
                    <li>Reverse engineer, decompile, or modify the APIs.</li>
                    <li>Use the Services to violate any applicable laws, including data protection, financial regulations, or intellectual property rights.</li>
                    <li>Access or attempt to access the Services in an unauthorized manner.</li>
                    <li>Use the APIs in any application that is unlawful, harmful, or may damage Bajaj’s reputation.</li>
                    <li>Exceed the rate limits, quotas, or usage thresholds defined by Bajaj.</li>
                   </ol>
                    <h5 className="mt-3">Data & Privacy</h5>
                    <ol>
                        <li>Your use of the Services may involve access to Bajaj’s data, customer data, or confidential information.</li>
                        <li>You must handle all data securely and comply with applicable data protection laws (e.g., GDPR, DPDP Act 2023, etc.).</li>
                        <li>You may only use Bajaj’s data for the permitted purpose of integrating your Apps.</li>
                    </ol>
                    <h5>Intellectual Property</h5>
                    <ol  className="mt-3">
                        <li>All rights, title, and interest in the Portal, APIs, trademarks, and content remain the property of Bajaj or its licensors.</li>
                        <li>You retain ownership of your Apps, subject to Bajaj’s rights in the APIs.</li>
                    </ol> */}
                    {termCon.length > 0 ? termCon.map((tem, index) => (
                      <div key={tem.id}>
                        <h5>{tem.title}</h5>
                        <div dangerouslySetInnerHTML={{ __html: tem.description }} />
                      </div>
                    )) : (
                      <div>{""}</div>
                    )}
             </div>
             </div>
             </div>
          <FooterHome />
          {loader && <PageLoaderBackdrop />}
    </div>
  )
}

export default TermsofServices