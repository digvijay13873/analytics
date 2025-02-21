const { getUrl, trackClick } = require("../db");

const redirectHandler = async (req, res) => {
  const { alias } = req.params;
  
  // Get the original URL from Redis
  const url = await getUrl(alias);
  if (!url) {
    return res.status(404).send("URL not found.");
  }

  // Track the click event
  await trackClick(alias, req.headers["user-agent"], req.ip);

  // Redirect the user to the original URL
  res.redirect(url);
};

module.exports = { redirectHandler };
