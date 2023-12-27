const express = require("express");
const mongoose = require("mongoose");
const errorHandler  = require('./middleware/errorMiddleware');
require("dotenv").config({path:".env"});
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());
// app.use(cors({
//     origin: process.env.FRONTEND_DOMAIN, // Update with your frontend domain
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//     optionsSuccessStatus: 204,
// }));

app.use("/", require("./routes/userRoutes"));
app.use("/api/jobs", require("./routes/jobsRoutes"));


app.use(errorHandler);

app.listen(process.env.PORT, () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then(() => console.log(`Server running successfully on http://localhost:${process.env.PORT}`))
        .catch(error => console.log(error));
});