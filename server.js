require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const http = require("http").Server(app);
const cors = require("cors");
const routes = require("./routes");
const bodyParser = require('body-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');

// Apply rate limiting middleware (e.g., 5 requests per minute)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minute
    max: 10000, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
});

app.use(limiter);

const cache = new NodeCache({ stdTTL: 30 });

app.get('/data', (req, res) => {
    const cachedData = cache.get('myKey');

    if (cachedData) {
        return res.send({ fromCache: true, data: cachedData });
    }

    // Simulate data fetching (e.g., from database or API)
    const fetchedData = { time: new Date().toISOString() };

    // Store in cache
    cache.set('myKey', fetchedData);

    res.send({ fromCache: false, data: fetchedData });
});

app.use(bodyParser.json());
app.use(cors(({
    origin: "http://localhost:3000",  
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})));


app.use(routes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req, res) => {
    res.send("API is running....");
});
const database = process.env.DEFAULT_DB_URI;
mongoose
    .connect(database)
    .then(() => console.log('Database Connected'))
    .then(() => {
        const PORT = process.env.PORT || 5001;
        http.listen(PORT, () => {
            console.log(`Server running on port: http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.log("Error connecting to database:", err));
