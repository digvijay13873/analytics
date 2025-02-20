const express = require('express');
const router = express.Router();
const useragent = require("useragent");
const Url = require('../models/Url');

// Generate a random short URL
const generateShortUrl = () => Math.random().toString(36).substr(2, 6);

// Shorten a URL
router.post('/shorten', async (req, res) => {
    const { longUrl, topic } = req.body;

    if (!longUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const shortUrl = generateShortUrl();
        const newUrl = new Url({ longUrl, shortUrl, topic }); // Include topic
        await newUrl.save();

        res.json({ shortUrl: `http://localhost:5000/api/url/${shortUrl}` });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


// // Redirect from short URL to original URL
// router.get('/:shortUrl', async (req, res) => {
//     try {
//         const url = await Url.findOne({ shortUrl: req.params.shortUrl });

//         if (url) {
//             url.clicks++;
//             await url.save();
//             return res.redirect(url.longUrl);
//         } else {
//             return res.status(404).json({ error: 'URL not found' });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });



router.get('/:shortUrl', async (req, res) => {
    try {
        const { shortUrl } = req.params;
        const userIP = req.ip;
        const agent = useragent.parse(req.headers["user-agent"]);
        const osName = agent.os.family || "Unknown OS";
        const deviceName = agent.device.family || "Unknown Device";

        let url = await Url.findOne({ shortUrl });
        if (!url) return res.status(404).json({ message: "URL not found" });

        // Update click count
        url.clicks += 1;

        // Update unique users
        if (!url.uniqueUsers.includes(userIP)) {
            url.uniqueUsers.push(userIP);
        }

        // Update clicks by date
        const today = new Date().toISOString().split("T")[0];
        url.clicksByDate.set(today, (url.clicksByDate.get(today) || 0) + 1);

        // Update OS type clicks
        url.osType.set(osName, (url.osType.get(osName) || 0) + 1);

        // Update device type clicks
        url.deviceType.set(deviceName, (url.deviceType.get(deviceName) || 0) + 1);

        await url.save();

        res.redirect(url.longUrl);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;


