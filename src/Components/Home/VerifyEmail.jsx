import React, {useState, useEffect} from 'react';
import logo from '../../../public/assets/img/logo.png'
import { post_data } from '../../ApiServices';
import { convertToPayload, decrypt } from '../../Utils';
import { error_swal_toast } from '../../SwalServices';
import { useParams } from 'react-router-dom';

function VerifyEmail() {

   const [verifyMail, setVerifyMail] = useState(false)
   const { emailid } = useParams();
   const email = decrypt(decodeURIComponent(emailid));

   const getVerifyMail = async () => {
        post_data("portal/public", convertToPayload('verify-signup-link', { "emailid": email }), {})
            .then((response) => {
               if(response.data.status) {
                    setVerifyMail(true)
               } else {
                    setVerifyMail(false)
               }
            }).catch((error) => {
                console.log(error.message)
                setVerifyMail(false);
                error_swal_toast(error.message || error);
            })
    }

useEffect(() => {
    getVerifyMail()
}, [])
    
  return (
    <div className="d-flex flex-column align-items-center justify-content-center text-center" style={{ height: '100vh' }}>
      <img src={logo} alt="Company Logo" width="120" className="mb-3" />
      {
        verifyMail ? 
        <h3>Email is verified successfully</h3> :
        <h3>Email verification Failed</h3>
      }
    </div>
  );
}

export default VerifyEmail;