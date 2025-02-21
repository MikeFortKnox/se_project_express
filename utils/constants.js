const { JWT_SECRET = "some-secret-key" } = process.env;

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.wtwr.b33r.us"
    : "http://localhost:3001";

module.exports = { JWT_SECRET, baseUrl };
