const axios = require("axios");
// const URL = require("url");
const queryString = require("query-string");

const googleRedirect = async (req, res) => {
  // const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  // const urlObj = new URL(fullUrl);
  // const urlParams = queryString.parse(urlObj.search);
  const code = req.query.code;
  console.log(code);
  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${process.env.BASE_URL}/api/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });

  // console.log(tokenData);
  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: { Authorization: `Bearer ${tokenData.data.access_token}` },
  });
  console.log(userData.data.name);
  console.log(userData.data.email);
  res.json(userData.data);

  // return res.redirect(`${process.env.FRONTEND_URL}/google-redirect/accessToken=${accessToken}`)
  // return res.redirect(`${process.env.BASE_URL}/api/auth/google-redirect`);
};

module.exports = googleRedirect;
