const otpHtml = (otp: string) => {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your OTP for [Your Service Name]</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    background-color: #f4f7fa;
    margin: 0;
    padding: 0;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
  .container {
    max-width: 600px;
    margin: 30px auto;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
  }
  .header {
    background-color: #007bff; /* A nice, vibrant blue */
    color: #ffffff;
    padding: 30px;
    text-align: center;
  }
  .header h1 {
    margin: 0;
    font-size: 28px;
    font-weight: 600;
  }
  .content {
    padding: 30px;
    color: #333333;
    line-height: 1.6;
    text-align: center;
  }
  .otp-box {
    background-color: #e9ecef; /* Light grey background for the OTP */
    color: #007bff;
    font-size: 38px;
    font-weight: 700;
    letter-spacing: 5px;
    padding: 20px 30px;
    margin: 25px auto;
    border-radius: 6px;
    display: inline-block; /* To center the block */
    max-width: fit-content;
  }
  .warning-text {
    color: #dc3545; /* Red for warnings */
    font-size: 14px;
    margin-top: 20px;
  }
  .footer {
    background-color: #f8f9fa;
    color: #6c757d;
    padding: 20px 30px;
    font-size: 12px;
    text-align: center;
    border-top: 1px solid #e9ecef;
  }
  .footer a {
    color: #007bff;
    text-decoration: none;
  }
  .logo {
      margin-bottom: 20px;
  }
  .logo img {
      max-width: 150px;
      height: auto;
  }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your One-Time Password (OTP)</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>You recently requested a One-Time Password (OTP) to complete an action on **[Your Service Name]**.</p>
      <p>Please use the following OTP to proceed:</p>
      <div class="otp-box">
        ${otp}
      </div>
      <p>This OTP is valid for **[5 minutes]** and can only be used once.</p>
      <p>If you did not request this OTP, please ignore this email. Do not share this OTP with anyone, even if they claim to be from [Your Service Name].</p>
      <p class="warning-text">For your security, never share this code.</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 [Your Company Name]. All rights reserved.</p>
      <p>If you have any questions, please contact our support team at <a href="mailto:support@[yourcompany.com]">support@[yourcompany.com]</a></p>
    </div>
  </div>
</body>
</html>`
}

export default otpHtml;