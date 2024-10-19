const sequelize = require('../app/config/db');

async function connect() {
    try {
        await sequelize.authenticate();
        console.log('Connected to MySQL');
        await sequelize.sync();
        console.log('Tables created if not exist');
    } catch (error) {
        console.error('Error connecting to MySQL', error);
        process.exit(1);
    }
}

module.exports = connect;
