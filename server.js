const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const urlRoutes = require("./routes/urlRoutes.js");
const analyticsRoutes = require("./routes/analyticsRoutes.js");
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Use Routes
app.use('/api/url', urlRoutes);
app.use('/api/analytics', analyticsRoutes); 

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
