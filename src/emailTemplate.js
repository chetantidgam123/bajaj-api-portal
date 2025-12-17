const loginOtpEmail = (data) => {
  return `<!doctype html><html lang='en-US'><head><meta content='text/html; charset=utf-8' http-equiv='Content-Type'/><meta name='description' content='Reset Password.'><style type='text/css'>a:hover{text-decoration:underline!important;}</style></head><body marginheight='0' topmargin='0' marginwidth='0' leftmargin='0' style='margin:0;background-color:#f2f3f8;'><table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8'><tr><td><table style='background-color:#f2f3f8;max-width:670px;margin:0 auto;' width='100%' border='0' align='center' cellpadding='0' cellspacing='0'><tr><td style='height:35px;'>&nbsp;</td></tr><tr><td style='text-align:center;'></td></tr><tr><td style='height:20px;'>&nbsp;</td></tr><tr><td><table width='95%' border='0' align='center' cellpadding='0' cellspacing='0' style='max-width:670px;background:#fff;border-radius:3px;text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'><tr><td style='height:40px;'>&nbsp;</td></tr><tr><td style='padding:0 35px 30px 35px;'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s' width='200px' style='margin-bottom:20px;'/><h1 style='color:#1e1e2d;font-weight:500;margin:0;font-size:25px;font-family:Poppins-Regular;'></h1><span style='display:inline-block;vertical-align:middle;margin:29px 0 26px;border-bottom:1px solid #cecece;width:100px;'></span><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>Dear ${data.firstName},<br/>We received a sign-in request for your account on the Bajaj API Developer Portal.</p><br><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>To verify your credentials and complete the login, please use the One-Time Password (OTP) below:<br><b>${data.otp}</b></p><br><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>Thanks & Regards,<br>Mulesoft Support<br>Digital & Analytics | Bajaj Auto Limited</p><p style='color:#ffffff;font-size:15px;text-align:left;background:linear-gradient(180deg,#0087FF 0%,#0052A4 100%);padding:20px;'>For any Production issue, please send an email to: <a href='' style='color:white;'>apigwsupport@bajajauto.co.in</a></p></td></tr></table></td></tr></table></td></tr></table></body></html>`
}
const signUpOtpEmail = (data) => {
  return `<!doctype html><html lang='en-US'><head><meta content='text/html; charset=utf-8' http-equiv='Content-Type'/><meta name='description' content='Reset Password.'><style type='text/css'>a:hover{text-decoration:underline!important;}</style></head><body marginheight='0' topmargin='0' marginwidth='0' leftmargin='0' style='margin:0;background-color:#f2f3f8;'><table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8'><tr><td><table style='background-color:#f2f3f8;max-width:670px;margin:0 auto;' width='100%' border='0' align='center' cellpadding='0' cellspacing='0'><tr><td style='height:35px;'>&nbsp;</td></tr><tr><td style='text-align:center;'></td></tr><tr><td style='height:20px;'>&nbsp;</td></tr><tr><td><table width='95%' border='0' align='center' cellpadding='0' cellspacing='0' style='max-width:670px;background:#fff;border-radius:3px;text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'><tr><td style='height:40px;'>&nbsp;</td></tr><tr><td style='padding:0 35px 30px 35px;'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s' width='200px' style='margin-bottom:20px;'/><h1 style='color:#1e1e2d;font-weight:500;margin:0;font-size:25px;font-family:Poppins-Regular;'></h1><span style='display:inline-block;vertical-align:middle;margin:29px 0 26px;border-bottom:1px solid #cecece;width:100px;'></span><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>Dear ${data.firstName},<br/><br/>Thank you for registering on the Bajaj API Developer Portal.</p><br><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>To verify your email address and activate your account, please use the One-Time Password (OTP) below<br><b>${data.otp}</b></p><br><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>Thanks & Regards,<br>Mulesoft Support<br>Digital & Analytics | Bajaj Auto Limited</p><p style='color:#ffffff;font-size:15px;text-align:left;background:linear-gradient(180deg,#0087FF 0%,#0052A4 100%);padding:20px;'>For any Production issue, please send an email to: <a href='' style='color:white;'>apigwsupport@bajajauto.co.in</a></p></td></tr></table></td></tr></table></td></tr></table></body></html>`
}

const signUpVerifyEmail = (data) => {
  return `<!doctype html>
<html lang='en-US'>
<head>
  <meta content='text/html; charset=utf-8' http-equiv='Content-Type'/>
  <meta name='description' content='Verify Email'>
  <style type='text/css'>
    a:hover { text-decoration: underline !important; }
  </style>
</head>
<body marginheight='0' topmargin='0' marginwidth='0' leftmargin='0' style='margin:0;background-color:#f2f3f8;'>
  <table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8'>
    <tr>
      <td>
        <table style='background-color:#f2f3f8;max-width:670px;margin:0 auto;' width='100%' border='0' align='center' cellpadding='0' cellspacing='0'>
          <tr><td style='height:35px;'>&nbsp;</td></tr>
          <tr><td style='text-align:center;'></td></tr>
          <tr><td style='height:20px;'>&nbsp;</td></tr>
          <tr>
            <td>
              <table width='95%' border='0' align='center' cellpadding='0' cellspacing='0' style='max-width:670px;background:#fff;border-radius:3px;text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'>
                <tr><td style='height:40px;'>&nbsp;</td></tr>
                <tr>
                  <td style='padding:0 35px 30px 35px;'>
                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s' width='200px' style='margin-bottom:20px;'/>
                    <h1 style='color:#1e1e2d;font-weight:500;margin:0;font-size:25px;font-family:Poppins, Arial, sans-serif;'>
                      Verify Your Email Address
                    </h1>
                    <span style='display:inline-block;vertical-align:middle;margin:29px 0 26px;border-bottom:1px solid #cecece;width:100px;'></span>
                    <p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>
                      Dear ${data.firstName},
                      <br/><br/>
                      Thank you for registering on the <b>Bajaj API Developer Portal</b>.
                    </p>
                    <br/>
                    <p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>
                      Please verify your email address by clicking the button below.
                    </p>
                    <br/>
                    <a href='${data.verifyLink}' target='_blank' style='background:linear-gradient(180deg,#0087FF 0%,#0052A4 100%);text-decoration:none!important;font-weight:500;margin-top:10px;color:#fff;text-transform:uppercase;font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;'>
                      Verify Email
                    </a>
                    <br/><br/>
                    <p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>
                      Thanks & Regards,<br/>
                      Mulesoft Support<br/>
                      Digital & Analytics | Bajaj Auto Limited
                    </p>
                    <p style='color:#ffffff;font-size:15px;text-align:left;background:linear-gradient(180deg,#0087FF 0%,#0052A4 100%);padding:20px;margin-top:30px;border-radius:0 0 3px 3px;'>
                      For any Production issue, please send an email to:
                      <a href='mailto:apigwsupport@bajajauto.co.in' style='color:white;'>apigwsupport@bajajauto.co.in</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr><td style='height:40px;'>&nbsp;</td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

const accessGrantedEmail = (data) => {
  return `<!doctype html><html lang='en-US'><head><meta content='text/html; charset=utf-8' http-equiv='Content-Type'/><meta name='description' content='BAJAJ Developer Portal Access Granted'><style type='text/css'>a:hover{text-decoration:underline!important;}</style></head><body marginheight='0' topmargin='0' marginwidth='0' leftmargin='0' style='margin:0;background-color:#f2f3f8;'><table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8'><tr><td><table style='background-color:#f2f3f8;max-width:670px;margin:0 auto;' width='100%' border='0' align='center' cellpadding='0' cellspacing='0'><tr><td style='height:35px;'>&nbsp;</td></tr><tr><td style='text-align:center;'></td></tr><tr><td style='height:20px;'>&nbsp;</td></tr><tr><td><table width='95%' border='0' align='center' cellpadding='0' cellspacing='0' style='max-width:670px;background:#fff;border-radius:3px;text-align:left;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'><tr><td style='height:40px;'>&nbsp;</td></tr><tr><td style='padding:0 35px 30px 35px;'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s' width='200px' style='margin-bottom:20px;margin: 0 auto;'/><div style="display:flex;justify-content:center;"><span style='display:inline-block;vertical-align:middle;margin:29px 0 26px;border-bottom:1px solid #cecece;width:100px;'></span></div><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>Dear ${data.userName},</p><br><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>Welcome aboard! Your access to the BAJAJ API Portal has been successfully created. You can now log in and explore the available APIs and resources.</p><br><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'><strong>Access Details:</strong><br>Portal URL: <a href='${data.portalURL}' target='_blank'>${data.portalURL}</a><br>User ID / Registered Email: ${data.userEmail}</p><br><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>👉 Login Here: <a href='${data.LoginURL}' target='_blank'>${data.LoginURL}</a></p><br><p style='color:#455056;font-size:15px;margin:0;text-align:left!important;'>If you face any issues while accessing the portal, feel free to contact our support team at ${data.supportContact || 'admin'}</p><p style='color:#ffffff;font-size:15px;text-align:left;background:linear-gradient(180deg,#0087FF 0%,#0052A4 100%);padding:20px;'>For any Production issue, please send an email to: <a href='mailto:apigwsupport@bajajauto.co.in' style='color:white;'>apigwsupport@bajajauto.co.in</a></p></td></tr></table></td></tr></table></td></tr></table></body></html>`
}

const generateApiRequestEmail = (data) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">
<title>API Access Request</title>
<style>
    body {
    font-family: 'Poppins', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
        margin: 0;
        padding: 0;
    }
    .container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #ffffff;
        padding: 20px 30px;
        border-radius: 8px;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    h2 {
        color: #007BFF;
        margin-bottom: 20px;
    }
    p {
        margin: 10px 0;
    }
    .details {
        background-color: #f1f1f1;
        padding: 15px;
        border-radius: 5px;
        margin-top: 10px;
    }
    .details p {
        margin: 5px 0;
    }
    .footer {
        margin-top: 30px;
        font-size: 0.9em;
        color: #555;
    }
</style>
</head>
<body>
<div class="container">
    <div><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s' width='200px' style='margin-bottom:20px;' /></div>
    <p>Dear ${data.adminName},</p>
    <p>A new API access request has been submitted and requires your approval. Please review the details below:</p>
    <div class="details">
        <p><strong>Requested By (User):</strong> ${data.userName}</p>
        <p><strong>API Name:</strong> BAJAJ API</p>
        <p><strong>Request Date:</strong> ${data.requestDate}</p>
    </div>
    <p style='color:#ffffff;font-size:13px;text-align:left;background:linear-gradient(180deg,#0087FF 0%,#0052A4 100%);padding:20px;'>For any Production issue, please send an email to: <a href='mailto:apigwsupport@bajajauto.co.in' style='color:white;'>apigwsupport@bajajauto.co.in</a></p>
</div>
</body>
</html>
`};

const apiRequestUser = (data) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">

<title>API Access Acknowledgement</title>
<style>
  body {
      font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
  }
  .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 25px 30px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
  h2 {
      color: #007BFF;
      margin-bottom: 20px;
  }
  p {
      margin: 12px 0;
  }
  .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #555;
  }
</style>
</head>
<body>
  <div class="container">
      <div><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s' width='200px' style='margin-bottom:20px;' /></div>
      <p>Dear ${data.userName},</p>
      <p>Thank you for reaching out to us with your request regarding API usage "<strong>BAJAJ API</strong>". We have received your query and our team is currently reviewing the details.</p>
      <p>We will share the necessary credentials and usage instructions to help you get started soon.</p>
      <p class="footer">Best Regards,<br/>The API Support Team</p>
       <p style='color:#ffffff;font-size:13px;text-align:left;background:linear-gradient(180deg,#0087FF 0%,#0052A4 100%);padding:20px;'>For any Production issue, please send an email to: <a href='mailto:apigwsupport@bajajauto.co.in' style='color:white;'>apigwsupport@bajajauto.co.in</a></p>
  </div>
</body>
</html>
`
}
const adminNotificationEmail = (data) => {
  return `
  <!doctype html>
  <html lang='en-US'>
  <head>
    <meta content='text/html; charset=utf-8' http-equiv='Content-Type'/>
    <meta name='description' content='New User Login Request Notification'/>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">

    <style type='text/css'>
      a:hover {text-decoration: underline!important;}
    </style>
  </head>
  <body marginheight='0' topmargin='0' marginwidth='0' leftmargin='0' style='margin:0;background-color:#f2f3f8;   font-family: 'Poppins', sans-serif;'>
    <table cellspacing='0' border='0' cellpadding='0' width='100%' bgcolor='#f2f3f8'>
      <tr>
        <td>
          <table style='background-color:#f2f3f8;max-width:670px;margin:0 auto;' width='100%' border='0' align='center' cellpadding='0' cellspacing='0'>
            <tr><td style='height:35px;'>&nbsp;</td></tr>
            <tr><td style='text-align:center;'></td></tr>
            <tr><td style='height:20px;'>&nbsp;</td></tr>
            <tr>
              <td>
                <table width='95%' border='0' align='center' cellpadding='0' cellspacing='0' style='max-width:670px;background:#fff;border-radius:3px;text-align:left;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);'>
                  <tr><td style='height:40px;'>&nbsp;</td></tr>
                  <tr><td style='padding:0 35px 30px 35px;'><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s' width='200px' style='margin-bottom:20px;' />
                    <p style='color:#455056;font-size:15px;margin:0 0 15px 0;'>
                      Dear ${data.adminName},<br/><br/>
                      A new user has requested login access to the BAJAJ API Portal. The request requires your review and approval.
                    </p>
                    <h3 style='color:#1e1e2d;font-weight:500;margin-bottom:10px;'>Request Details:</h3>
                    <p style='color:#455056;font-size:15px;margin:0 0 10px 0;'>
                      <strong>User Name:</strong> ${data.userName}<br/>
                      <strong>Email ID:</strong> ${data.userEmail}<br/>
                      <strong>Mobile No:</strong> ${data.mobileNo}<br/>
                      <strong>Requested On:</strong> ${data.requestedOn}
                    </p>
                    <br/>
                    <p style='color:#455056;font-size:15px;margin:0;'>
                      Thanks & Regards,<br/>
                      BAJAJ API Developer Portal Team
                    </p>
                    <p style='color:#ffffff;font-size:13px;text-align:left;background:linear-gradient(180deg,#0087FF 0%,#0052A4 100%);padding:20px;'>For any Production issue, please send an email to: <a href='mailto:apigwsupport@bajajauto.co.in' style='color:white;'>apigwsupport@bajajauto.co.in</a></p>
                  </td></tr>
                </table>
              </td>
            </tr>
            <tr><td style='height:35px;'>&nbsp;</td></tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

const generateApiApprovalEmail = ({ userName, userId, loginLink, status }) => {
  const isApproved = status?.toLowerCase() === "approved";
  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap" rel="stylesheet">

<title>BAJAJ API Access Approved</title>
<style>
  body {
   font-family: 'Poppins', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f9f9f9;
      margin: 0;
      padding: 0;
  }
  .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      padding: 25px 30px;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  }
  h2 {
      color: #007BFF;
      margin-bottom: 20px;
  }
  p {
      margin: 12px 0;
  }
  .details {
      background-color: #f1f1f1;
      padding: 15px;
      border-radius: 6px;
      margin-top: 10px;
  }
  .details p {
      margin: 6px 0;
  }
  a.login-button {
      display: inline-block;
      margin-top: 15px;
      background-color: #007BFF;
      color: #fff !important;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: bold;
  }
  .footer {
      margin-top: 30px;
      font-size: 0.9em;
      color: #555;
  }
</style>
</head>
<body>
  <div class="container">
      <div><img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG4lo39vSLS1FaLIpr1XKrjiebmWX-3fRErA&s' width='200px' style='margin-bottom:20px;' /></div>
      <p>Dear ${userName},</p>
      <p>Your login request for accessing the <strong>BAJAJ API</strong> has been ${isApproved ? `successfully approved. You can now use your registered credentials to log in and start accessing the API services` : `rejected`}.</p>
      
      <div class="details">
          <p><strong>API Name:</strong> BAJAJ API</p>
          <p><strong>Access Status:</strong> ${status}</p>
      </div>

      ${isApproved
      ? `<p>👉 <a href="${loginLink}" class="login-button" target="_blank">Login Here</a></p>`
      : `<p>Your access request is <strong>${status}</strong>.</p>`
    }

      ${isApproved ? `<p>Please ensure you keep your login credentials secure and do not share them with others. For usage guidelines, rate limits, and integration instructions, kindly refer to the provided API documentation.</p>` : ""}
      
      <p>If you encounter any issues while logging in or using the API, feel free to contact our support team for assistance.</p>
      
      <p class="footer">Best Regards,<br/>The BAJAJ API Support Team</p>
      <p style='color:#ffffff;font-size:13px;text-align:left;background:linear-gradient(180deg,#0087FF 0%,#0052A4 100%);padding:20px;'>For any Production issue, please send an email to: <a href='mailto:apigwsupport@bajajauto.co.in' style='color:white;'>apigwsupport@bajajauto.co.in</a></p>

  </div>
</body>
</html>
`};

const ApiListRequestEmail = ({ status, selectedAPIs }) => {
  if (!selectedAPIs || selectedAPIs.length === 0) return "No APIs selected.";

  const rows = selectedAPIs
    .map(
      (api, index) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${api.apiname}</td>
        <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${status}</td>
      </tr>
    `
    )
    .join("");

  return `
    <html>
      <body style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
        <p>Hello,</p>
        <p>Your request for the following APIs is in process:</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Sr. No</th>
              <th style="padding: 8px; border: 1px solid #ddd;">API Name</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Status</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <p>Thank you!</p>
      </body>
    </html>
  `;
};

export {
  loginOtpEmail,
  signUpOtpEmail,
  adminNotificationEmail,
  accessGrantedEmail,
  generateApiRequestEmail,
  apiRequestUser,
  generateApiApprovalEmail,
  ApiListRequestEmail,
  signUpVerifyEmail
}