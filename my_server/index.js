/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const express = require("express");
const app = express();

const path = require("path");
global.appRoot = path.resolve(__dirname);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

const port = 3000 || 8080;

// connect to db
const db = require("./config/db");
db.connect();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { v4: uuidv4 } = require("uuid");
let token = uuidv4();
app.use((req, res, next) => {
  // const allowedOrigins = [
  //   "https://glowy.web.app",
  //   "http://localhost:4300",
  //   "http://192.168.56.1:8080",
  // ];
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //   res.setHeader("Access-Control-Allow-Origin", origin);
  // }

  // The below 2 headers are for cookies
  // Website you wish to allow to connect
  res.header("Access-Control-Allow-Origin", req.headers.origin);

  // Set to true if you need the website to include cookies in the requests sent to the API (e.g. in case you use sessions
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-XSRF-TOKEN, X-CSRF-Token, Client-Security-Token, Accept-Encoding, X-Auth-Token, Access-Control-Request-Method, Access-Control-Request-Headers, ngrok-skip-browser-warning"
  );

  res.setHeader(
    "Access-Control-Expose-Headers",
    "Set-Cookie, Content-Encoding, Kuma-Revision, Authorization, X-XSRF-TOKEN, X-CSRF-TOKEN"
  );

  res.setHeader("Access-Control-Max-Age", 86400);

  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

  res.setHeader("Allow-Origin-With-Credentials", true);

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD"
  );
  res.setHeader(
    "Set-Cookie",
    `XSRF-TOKEN=${token}; Path=/; HttpOnly=false; SameSite=None; Secure=true`
  );
  // Pass to next layer of middleware
  next();
});

const oneDay = 1000 * 60 * 60 * 24;
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const databaseUrl = require("./config/db/database.url");
const store = new MongoDBStore({
  uri: databaseUrl,
  databaseName: "GlowyBeauty",
  collection: "mySessions",
  expires: oneDay,
  // By default, sessions expire after 2 weeks. The `expires` option lets
  // you overwrite that by setting the expiration in milliseconds
  // expires: 1000 * 60 * 60 * 24 * 1, // 1 days in milliseconds,
  // connectionOptions: {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  //   serverSelectionTimeoutMS: 10000,
  // },
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: oneDay,
      httpOnly: false, // dont let browser javascript access cookie ever
      secure: true, // true if only use cookie over https
      sameSite: "none",
      path: "/",
      // Enable domain and everything will fuck up
      // domain:'glowy.web.app'
    },
    store: store,
    // rolling: true,
  })
);

const morgan = require("morgan");
app.use(morgan("combined"));

// const cors = require("cors");
// app.use(
//   cors({
//     origin: [
//       "http://localhost:3000",
//       "https://glowy.web.app",
//       "http://localhost:4300",
//       "http://192.168.56.1:8080",
//       "*",
//     ],
//     // origin: true,
//     methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE", "PATCH"],
//     credentials: true,
//     allowedHeaders: [
//       "Origin",
//       "X-Requested-With",
//       "Content-Type",
//       "Accept",
//       "Authorization",
//     ],
//   })
// );

const glowyRoutes = require("./routes/glowy.router");
const productRoutes = require("./routes/product.router");
const cartRoutes = require("./routes/cart.router");
const favoriteRoutes = require("./routes/favorite.router");
const orderRouters = require("./routes/order.router");
const userRouters = require("./routes/user.router");
const regisEmailRouters = require("./routes/regisEmail.router");
const feedbackRouters = require("./routes/feedback.router");
const blogRouters = require("./routes/blog.router");
app.use("/", glowyRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/favorite", favoriteRoutes);
app.use("/orders", orderRouters);
app.use("/users", userRouters);
app.use("/regisEmail", regisEmailRouters);
app.use("/feedback", feedbackRouters);
app.use("/blogs", blogRouters);

const https = require("https");
const fs = require("fs");
const certificate = {
  key: fs.readFileSync("../localhost-key.pem"),
  cert: fs.readFileSync("../localhost.pem"),
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  // app.listen(port, "127.0.0.1", () => {
  //   var host = server.address().address;
  //   var port = server.address().port;
  //   console.info(`listening on port ${port} at https://${host}:${port}`);
  // });
  https.createServer(certificate, app).listen(port, function () {
    console.log("localhost started on", port, `at https://localhost:${port}`);
  });
}

// const cors = require("cors");
// app.use(
//   cors({
//     origin: [
//       "https://glowy.web.app",
//       "http://localhost:3000",
//       "https://localhost:4300",
//       "http://localhost:4300",
//     ],
//     credentials: true,
//     preflightContinue: true,
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//     allowedHeaders: "*",
//   })
// );

const functions = require("firebase-functions");
exports.app = functions.https.onRequest(app);
