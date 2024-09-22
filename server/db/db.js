const mongoose = require("mongoose");

const db = ()=>{
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });
    mongoose.connection.on("error", (err) => {
        console.error(`Error connecting to MongoDB: ${err.message}`);
        process.exit(1);
    });
}

module.exports = db;