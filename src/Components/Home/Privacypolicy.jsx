import {useEffect,useState} from 'react'
import FooterHome from './FooterHome'
import Header from '../user/layout/Header'
import { scrollToTop } from '../../Utils'
import { convertToPayload } from '../../Utils'
import { error_swal_toast } from '../../SwalServices'
import { post_data } from '../../ApiServices'
import { PageLoaderBackdrop } from '../../Loader'

function Privacypolicy() {
  const [loader, setLoader] = useState(false)
  const [policy, setPolicy] = useState([])

    useEffect(() => {
      scrollToTop()
      getPolicy()
    }, [])

  const getPolicy = () => {
    setLoader(true)
    let payload = {}
    post_data("portal/public", convertToPayload('get-policy', payload), {})
    .then((response) => {
        if (response.data.status) {
          const result = response.data.result;
          setPolicy(Array.isArray(result) ? result : [result]); // <-- always an array
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
          <div className="privacy">
            <h1 className='mt-3'>Privacy Policy</h1>
          </div>
                 <div className='card-bg '>
                <div className='container'>
                    <div className='card-Works margin-top-100px'>
                        {/* <p>At Bajaj we are committed to protecting the privacy of our users. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information.</p> */}
                         <h4 className="mt-3">Introduction</h4>
                         <p>At PrivacyGuard, we are committed to protecting the privacy of our users. This Privacy Policy outlines our practices regarding the collection, use, and disclosure of your information.</p>
                          {/* <h5 className="mt-3">Information We Collect</h5>
                          <p>We collect information you provide directly to us, such as when you create an account, update your profile, or use our services. This includes your name, email address, and any other details you choose to share.</p>
                           <h5 className="mt-3">How We Use Your Information</h5>
                           <p>PrivacyGuard uses your information to provide, maintain, and improve our services, communicate with you, and protect the security of our platform. We may also use your information for research and analytics purposes.</p>
                             <h5 className="mt-3">Sharing Your Information</h5>
                             <p>We do not share your personal information with third parties except as necessary to provide our services, comply with the law, or protect our rights. We may share aggregated or anonymized data with partners for research purposes.</p>
                               <h5 className="mt-3">Your Rights</h5>
                               <p>You have the right to access, update, or delete your personal information at any time. If you wish to exercise these rights, please contact us at <a href="" className='text-decoration-none'>support@privacyguard.com</a>.</p>
                                <h5 className="mt-3">Contact Us</h5>
                                <p>If you have any questions or concerns about our Privacy Policy or practices, please contact us at <a href="" className='text-decoration-none'>support@privacyguard.com</a>.</p> */}
                              {policy.length > 0 ? policy.map((pol, index) => (
                                <div key={pol.id}>
                                  <h5>{pol.title}</h5>
                                  <div dangerouslySetInnerHTML={{ __html: pol.description }} />
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

export default Privacypolicy