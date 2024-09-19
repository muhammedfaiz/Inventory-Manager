const express = require("express");
const db = require("./db/db");
const app = express();
const userRoute = require("./routes/userRoute");
const cors = require("cors");

const dotenv = require("dotenv");
dotenv.config();
db();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:"http://localhost:5173"
}));
app.options("*",cors());
app.use("/api/user",userRoute);

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port "+process.env.PORT);
});
