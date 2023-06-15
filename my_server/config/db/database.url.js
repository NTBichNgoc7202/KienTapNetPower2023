require("dotenv/config");
let databaseUrl = "";
if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  databaseUrl = "mongodb://127.0.0.1:27017/GlowyBeauty";
} else {
  databaseUrl = process.env.DB_URL;
}

module.exports = databaseUrl;
