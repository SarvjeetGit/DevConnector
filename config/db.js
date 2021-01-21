const moongose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

//calling database using async await

const connectDB = async () => {
    try {
        await moongose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDb Connected..');
    } catch (err) {
        console.error(err.message);
        //exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;
