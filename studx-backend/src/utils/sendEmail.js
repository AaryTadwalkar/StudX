import nodemailer from "nodemailer";

const sendEmail = async (email, otp, subject = "Email Verification") => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const isPasswordReset = subject.includes("Password Reset");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `StudX - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { font-size: 32px; font-weight: bold; color: #6366F1; }
            .otp-box { background: #F0F9FF; border-left: 4px solid #6366F1; padding: 20px; margin: 20px 0; text-align: center; }
            .otp { font-size: 36px; font-weight: bold; color: #6366F1; letter-spacing: 8px; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">StudX</div>
              <p style="color: #666;">Campus Marketplace & Networking</p>
            </div>
            
            <h2 style="color: #333;">${isPasswordReset ? 'Password Reset Request' : 'Verify Your Email'}</h2>
            
            <p style="color: #666; line-height: 1.6;">
              ${isPasswordReset 
                ? 'We received a request to reset your password. Use the OTP below to complete the process:' 
                : 'Thank you for signing up! Use the OTP below to verify your email and complete your registration:'}
            </p>
            
            <div class="otp-box">
              <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
              <div class="otp">${otp}</div>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 12px;">Valid for 5 minutes</p>
            </div>
            
            <p style="color: #666; line-height: 1.6;">
              ${isPasswordReset 
                ? 'If you did not request a password reset, please ignore this email or contact support if you have concerns.' 
                : 'If you did not create an account, please ignore this email.'}
            </p>
            
            <div class="footer">
              <p>This is an automated email from StudX. Please do not reply.</p>
              <p>&copy; 2024 StudX - VIT Campus</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error("❌ Email send error:", error);
    throw error;
  }
};

export default sendEmail;
