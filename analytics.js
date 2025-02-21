const { getAnalytics } = require("../db");

const analyticsHandler = async (req, res) => {
  const { alias } = req.params;

  // Get analytics data from Redis
  const analytics = await getAnalytics(alias);

  if (!analytics) {
    return res.status(404).send("Analytics not found.");
  }

  res.json(analytics);
};

module.exports = { analyticsHandler };
