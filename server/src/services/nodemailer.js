import nodemailer from "nodemailer";

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io", // Replace with your SMTP server
  port: 587, // Commonly used port for SMTP
  secure: false, // Use true for 465, false for other ports
  auth: {
    user: "your-email@example.com", // Replace with your email
    pass: "your-email-password", // Replace with your email password
  },
});

// Function to send an email
export const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: '"Your Name" <your-email@example.com>', // Sender address
    to, // List of recipients
    subject, // Subject line
    text, // Plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Could not send email");
  }
};
