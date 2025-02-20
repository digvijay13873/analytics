# URL-shortener-with-analytics
🚀 Overview

A scalable URL shortener API with Google Sign-In, analytics, rate limiting, and caching using Node.js, Express, PostgreSQL, and Redis.




📌 Features

Custom URL shortening with optional aliases

Redirect & analytics tracking (clicks, devices, OS, location)

Topic-based & overall analytics





🛠️ Tech Stack

Node.js, Express, PostgreSQL





🔥 API Endpoints
POST `/api/shorten` → Shorten URL

GET `/api/shorten/:alias` → Redirect

GET `/api/analytics/:alias` → URL analytics

GET `/api/analytics/topic/:topic` → Topic analytics

GET  `/api/analytics/overall` → Overall analytics






🏆 Challenges & Solutions
Unique short links → shortid package & alias validation

User analytics tracking → User-agent parser & IP geolocation





🤝 Contributing

Pull requests welcome! 🚀

