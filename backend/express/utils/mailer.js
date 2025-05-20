require("dotenv").config({ path: "../.env" });
const nodemailer = require("nodemailer");

const generateVerificationEmail = (code) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #333;">Your FoodLens Verification Code</h2>
    <p>Hi there,</p>
    <p>Use the following code to complete your login:</p>
    <div style="margin: 20px 0; padding: 15px; background: #f4f4f4; text-align: center; font-size: 24px; letter-spacing: 4px; font-weight: bold; border-radius: 5px; user-select: all;">
      ${code}
    </div>
    <p>If you didn’t request this, you can safely ignore this email.</p>
    <p>Thanks,<br />The FoodLens Dev</p>
  </div>
`;

const generateResetEmail = (resetLink) => `
  <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background-color: #fafafa;
    ">
    <h2 style="color: #333; text-align: center;">Reset Your FoodLens Password</h2>
    <p>Hi there,</p>
    <p>We received a request to reset the password for your FoodLens account. Click the button below to choose a new password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a
        href="${resetLink}"
        style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #28a745;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
        "
      >
        Reset Password
      </a>
    </div>
    <p>If the button doesn’t work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all;">
      <a href="${resetLink}">${resetLink}</a>
    </p>
    <hr style="border: none; height: 1px; background: #eee; margin: 30px 0;" />
    <p style="font-size: 12px; color: #666;">
      If you didn’t request a password reset, you can safely ignore this email. This link will expire in one hour.
    </p>
    <p>Thanks,<br />The FoodLens Dev</p>
  </div>
`;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendLoginCode(email, code) {
  const mailOptions = {
    from: `"FoodLens" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Login Code for FoodLens",
    html: generateVerificationEmail(code),
  };

  return transporter.sendMail(mailOptions);
}

async function sendPasswordReset(email, resetLink) {
  const mailOptions = {
    from: `"FoodLens" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset Your FoodLens Password",
    html: generateResetEmail(resetLink),
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { transporter, sendLoginCode, sendPasswordReset };
