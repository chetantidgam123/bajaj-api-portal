import Header from "../user/layout/Header"
import FooterHome from "./FooterHome"

function TermsofServices() {
  return (
    <div>
          <Header />
          <div className="terms">
            <h1 className='mt-3'>Terms of Service</h1>
          </div>
            <div className='card-bg '>
                <div className='container'>
                    <div className='card-Works'>
                <p>Welcome to the Bajaj API Portal. These Terms of Service govern your access to and use of the Portal, APIs, documentation, SDKs, and related services provided by Bajaj.</p>
                <h4 className="mt-3">Eligibility</h4>
                <ol>
                    <li>You must be at least 18 years old and authorized to bind your organization to these Terms.</li>
                    <li>You represent that you have all rights, licenses, and authority necessary to use the Services.</li>
                </ol>
                <h4 className="mt-3">Account Registration</h4>
                <ol>
                    <li>You must create an account to access the Portal.</li>
                    <li>You are responsible for maintaining the confidentiality of your credentials and all activity under your account.</li>
                    <li>Notify us immediately of any unauthorized use of your account.</li>
                </ol>
                   <h4 className="mt-3">License to Use APIs</h4>
                   <ol>
                    <li>Subject to these Terms, Bajaj grants you a limited, revocable, non-exclusive, non-transferable license to access and use the APIs and documentation solely for developing, testing, and integrating your applications (“Apps”).</li>
                    <li>You may not sublicense, sell, or redistribute the APIs without prior written consent.</li>
                   </ol>
                   <h4 className="mt-3">Usage Restrictions</h4>
                   <p>You agree not to:</p>
                   <ol>
                    <li>Reverse engineer, decompile, or modify the APIs.</li>
                    <li>Use the Services to violate any applicable laws, including data protection, financial regulations, or intellectual property rights.</li>
                    <li>Access or attempt to access the Services in an unauthorized manner.</li>
                    <li>Use the APIs in any application that is unlawful, harmful, or may damage Bajaj’s reputation.</li>
                    <li>Exceed the rate limits, quotas, or usage thresholds defined by Bajaj.</li>
                   </ol>
                    <h4 className="mt-3">Data & Privacy</h4>
                    <ol>
                        <li>Your use of the Services may involve access to Bajaj’s data, customer data, or confidential information.</li>
                        <li>You must handle all data securely and comply with applicable data protection laws (e.g., GDPR, DPDP Act 2023, etc.).</li>
                        <li>You may only use Bajaj’s data for the permitted purpose of integrating your Apps.</li>
                    </ol>
                    <h4>Intellectual Property</h4>
                    <ol  className="mt-3">
                        <li>All rights, title, and interest in the Portal, APIs, trademarks, and content remain the property of Bajaj or its licensors.</li>
                        <li>You retain ownership of your Apps, subject to Bajaj’s rights in the APIs.</li>
                    </ol>
             </div>
             </div>
             </div>
          <FooterHome />
    </div>
  )
}

export default TermsofServices