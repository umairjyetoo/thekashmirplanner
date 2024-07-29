const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Use dotenv to manage environment variables

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure Nodemailer with environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Email from environment variable
    pass: process.env.EMAIL_PASS  // Password from environment variable
  }
});

// Email sending endpoint
app.post('/send-email', (req, res) => {
  console.log("Request Body:", req.body);
  
  const { name, phone, email, message } = req.body;

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'Contact Form Submission',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333; margin: 0; padding: 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                  <tr>
                    <td align="center" style="padding: 20px; border-bottom: 2px solid #3498db;">
                      <h1 style="margin: 0; color: #3498db;">Contact Form Submission</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px;">
                      <p><strong>Name:</strong> ${name}</p>
                      <p><strong>Phone:</strong> ${phone}</p>
                      <p><strong>Email:</strong> ${email}</p>
                      <p><strong>Message:</strong></p>
                      <p style="background-color: #f9f9f9; padding: 10px; border-left: 3px solid #3498db; border-radius: 4px;">
                        ${message}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding: 20px; border-top: 2px solid #3498db;">
                      <p style="margin: 0; font-size: 14px; color: #999;">Disclaimer: This email is intended for internal use only and contains information from the contact form submission. Please handle with care.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).send('Failed to send email');
    }
    console.log('Email sent:', info.response);
    res.status(200).send('Email sent successfully!');
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
