const bcrypt = require('bcryptjs');
const run = async () => {
    try {
        const hash = await bcrypt.hash('password123', 12);
        console.log('Hash:', hash);
        const match = await bcrypt.compare('password123', hash);
        console.log('Match:', match);
    } catch (err) {
        console.error('Bcrypt error:', err);
    }
};
run();
