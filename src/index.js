const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');

const app = express();

dotenv.config();

// parse JSON data in incoming requests
// allows to access the JSON data sent in the request body within route handlers using req.body
app.use(bodyParser.json());
app.use(cors()); // to enable cross-origin resource sharing

mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("DBconnection is successful!"))
    .catch((err) => {
        console.log(err);
    });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRoutes);

app.listen(process.env.PORT || 4000, () => {
    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
});