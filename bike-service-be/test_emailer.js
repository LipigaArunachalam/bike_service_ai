require('dotenv').config();
const { sendTestEmail } = require('./src/modules/notification/email.service');

async function test() {
    console.log('Starting independent email test...');
    try {
        await sendTestEmail();
        console.log('Test email sent successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Test email failed:', error);
        process.exit(1);
    }
}

test();
