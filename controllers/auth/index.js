const register = require("./register");
const login = require("./login");
const logout = require("./logout");
const getCurrent = require("./getCurrent");
const googleAuth = require("./googleAuth");
const googleRedirect = require("./googleRedirect");

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  googleAuth,
  googleRedirect,
};
