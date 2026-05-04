// src/utils/inviteAdminHtml.ts

const inviteAdminHtml = (inviteLink: string) => {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Admin Invitation - COBIANS</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
    background-color: #007bff;
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
  .invite-btn {
    display: inline-block;
    background-color: #007bff;
    color: #ffffff !important;
    text-decoration: none;
    font-size: 16px;
    font-weight: 600;
    padding: 14px 36px;
    border-radius: 6px;
    margin: 25px auto;
    letter-spacing: 0.5px;
  }
  .expiry-box {
    background-color: #e9ecef;
    color: #495057;
    font-size: 14px;
    padding: 12px 20px;
    border-radius: 6px;
    display: inline-block;
    margin: 10px auto;
  }
  .warning-text {
    color: #dc3545;
    font-size: 14px;
    margin-top: 20px;
  }
  .fallback-link {
    word-break: break-all;
    color: #007bff;
    font-size: 13px;
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
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>You're Invited to Join COBIANS</h1>
    </div>
    <div class="content">
      <p>Hi there,</p>
      <p>You have been invited by a system administrator to join <strong>COBIANS</strong> as an Admin.</p>
      <p>Click the button below to complete your registration:</p>

      <a href="${inviteLink}" class="invite-btn">Complete Registration</a>

      <br />

      <div class="expiry-box">
        ⏳ This invite link expires in <strong>24 hours</strong>
      </div>

      <p style="margin-top: 24px; font-size: 14px; color: #6c757d;">
        If the button doesn't work, copy and paste this link into your browser:
      </p>
      <a href="${inviteLink}" class="fallback-link">${inviteLink}</a>

      <p class="warning-text">
        If you did not expect this invitation, please ignore this email.
      </p>
    </div>
    <div class="footer">
      <p>&copy; 2025 COBIANS. All rights reserved.</p>
      <p>
        If you have any questions, contact us at
        <a href="mailto:cobians@gmail.com">cobians@gmail.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;
};

export default inviteAdminHtml;