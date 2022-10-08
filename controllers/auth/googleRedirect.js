const axios = require("axios");
const { User } = require("../../models");
const jwt = require("jsonwebtoken");

const googleRedirect = async (req, res) => {
  const code = req.query.code;
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

  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: { Authorization: `Bearer ${tokenData.data.access_token}` },
  });
  const { id: googleId, name, email } = userData.data;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      password: "",
    });
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1h" });
  await User.findByIdAndUpdate(user._id, { token, googleId });
  user = await User.findOne({ email });

  return res.redirect(
    `${process.env.FRONTEND_URL}/google-redirect/?token=${token}&name=${user.name}&email=${user.email}`
  );
};

module.exports = googleRedirect;
