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
    <p>Thanks,<br />The FoodLens Team</p>
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

module.exports = { transporter, sendLoginCode };
