const express = require("express");
const Url = require("../models/Url");

const router = express.Router();

// 3. Get overall analytics for all URLs
router.get("/overall", async (req, res) => {
    try {
        const urls = await Url.find({});
        if (!urls.length) return res.status(404).json({ message: "No URLs found" });

        const totalUrls = urls.length;
        const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
        const uniqueUsers = new Set(urls.flatMap(url => url.uniqueUsers));

        res.json({
            totalUrls,
            totalClicks,
            uniqueUsers: uniqueUsers.size,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Get analytics for all URLs under a specific topic
router.get("/topic/:topic", async (req, res) => {
    try {
        const urls = await Url.find({ topic: req.params.topic });
        if (!urls.length) return res.status(404).json({ message: "No URLs found for this topic" });

        const totalClicks = urls.reduce((sum, url) => sum + url.clicks, 0);
        const uniqueUsers = new Set(urls.flatMap(url => url.uniqueUsers));

        res.json({
            topic: req.params.topic,
            totalClicks,
            uniqueUsers: uniqueUsers.size,
            urls: urls.map(url => ({
                shortUrl: url.shortUrl,
                totalClicks: url.clicks,
                uniqueUsers: url.uniqueUsers.length
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Get the top 10 most clicked URLs
router.get("/top-clicked", async (req, res) => {
    try {
        const topUrls = await Url.find().sort({ clicks: -1 }).limit(10);
        res.json(topUrls.map(url => ({
            shortUrl: url.shortUrl,
            totalClicks: url.clicks,
            uniqueUsers: url.uniqueUsers.length
        })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 5. Get device statistics across all URLs
router.get("/top-devices", async (req, res) => {
    try {
        const urls = await Url.find({});
        const deviceStats = {};

        urls.forEach(url => {
            url.deviceType.forEach((clicks, device) => {
                deviceStats[device] = (deviceStats[device] || 0) + clicks;
            });
        });

        res.json(Object.entries(deviceStats).map(([device, clicks]) => ({ device, clicks })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 6. Get OS statistics across all URLs
router.get("/top-os", async (req, res) => {
    try {
        const urls = await Url.find({});
        const osStats = {};

        urls.forEach(url => {
            url.osType.forEach((clicks, os) => {
                osStats[os] = (osStats[os] || 0) + clicks;
            });
        });

        res.json(Object.entries(osStats).map(([os, clicks]) => ({ os, clicks })));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 1. Get analytics for a specific short URL (Move this last)
router.get("/:shortUrl", async (req, res) => {
    try {
        const url = await Url.findOne({ shortUrl: req.params.shortUrl });
        if (!url) return res.status(404).json({ message: "URL not found" });

        res.json({
            shortUrl: url.shortUrl,
            totalClicks: url.clicks,
            uniqueUsers: url.uniqueUsers.length,
            clicksByDate: Array.from(url.clicksByDate.entries()).slice(-7), // Last 7 days
            osType: Array.from(url.osType.entries()).map(([os, clicks]) => ({ os, clicks })),
            deviceType: Array.from(url.deviceType.entries()).map(([device, clicks]) => ({ device, clicks })),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
