const mongoose = require("mongoose");

const db = ()=>{
    mongoose.connect(process.env.MONGO_URI);
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected");
    });
}

module.exports = db;