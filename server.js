const { app, connect } = require('./app/app.js');
require('./app/logs/logger.js');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connect();
    app.listen(PORT, () => {
        // logger.log(`Server is running on port ${PORT}`);
        console.log(`Server is running on port ${PORT}.`);
    });
};

startServer().catch(error => {
    console.error('Error starting server:', error);
});
