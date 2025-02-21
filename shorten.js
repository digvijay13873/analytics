const shortid = require("shortid");
const { saveUrl } = require("../db");

const shortenHandler = async (req, res) => {
  const { url, alias } = req.body;

  // Generate short alias if not provided
  const shortUrl = alias || shortid.generate();

  // Save the URL to Redis
  await saveUrl(shortUrl, url);

  res.json({ shortUrl });
};

module.exports = { shortenHandler };
