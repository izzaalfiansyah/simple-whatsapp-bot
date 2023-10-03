const axios = require("axios");

const instance = axios.create({
  baseURL: "https://katanime.vercel.app/api",
});

module.exports = instance;
