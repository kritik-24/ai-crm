require("dotenv").config();

const sendEmail = require("./utils/sendEmail");

const testEmail = async () => {
  try {
    await sendEmail({
      to: process.env.EMAIL_FROM,
      subject: "AI CRM Email Test",
      html: `
        <h2>AI CRM Email Test Successful 🎉</h2>
        <p>Your Brevo SMTP configuration is working correctly.</p>
      `,
    });

    console.log("Test email sent successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Test email failed:", error);
    process.exit(1);
  }
};

testEmail();