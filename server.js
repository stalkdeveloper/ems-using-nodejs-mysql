const { app, connect } = require('./app/app.js');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    await connect();
    app.listen(PORT, () => {
        // console.log(require('crypto').randomBytes(256).toString('base64'))
        // logger.log(`Server is running on port ${PORT}`);
        console.log(`Server is running on port ${PORT}.`);
    });
};

startServer().catch(error => {
    console.error('Error starting server:', error);
});
