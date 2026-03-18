const nodemailer = require('nodemailer');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('SMTP server is ready to take our messages');
    }
});

/**
 * Send an email
 * @param {Object} options - { email: recipient, subject: string, message: string }
 */
const sendEmail = async (options) => {
    console.log('--- Email function triggered ---');
    console.log('Request payload:', JSON.stringify(options, null, 2));

    try {
        // Validation
        if (!options.email) {
            console.error('Email sending failed: Recipient email (to) is undefined.');
            throw new Error('Recipient email is required');
        }

        console.log(`Sending email to: ${options.email}`);
        console.log(`Subject: ${options.subject}`);

        const mailOptions = {
            from: `RevUp Bike Service <${process.env.EMAIL_FROM}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            // html: options.html
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        console.log('Message ID: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('--- Email Sending Error Stack ---');
        console.error(error.stack);
        console.error('--------------------------------');
        throw error;
    } finally {
        console.log('--- Email function finished ---');
    }
};

/**
 * Send a test email to the configured EMAIL_USER
 */
const sendTestEmail = async () => {
    return await sendEmail({
        email: process.env.EMAIL_USER,
        subject: 'Test Email',
        message: 'This is a test email from RevUp Bike Service backend. If you see this, email sending is working!',
    });
};

module.exports = {
    sendEmail,
    sendTestEmail,
};
