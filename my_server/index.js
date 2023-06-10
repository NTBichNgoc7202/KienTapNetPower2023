const express = require("express");
const app = express();

const path = require("path");
global.appRoot = path.resolve(__dirname);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const bodyParser = require("body-parser");
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

const port = 3000;

// connect to db
const db = require("./config/db");
db.connect();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const { v4: uuidv4 } = require("uuid");

const oneDay = 1000 * 60 * 60 * 24;
const session = require("express-session");
app.use(
  session({
    secret: uuidv4(),
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: oneDay, httpOnly: true, secure: false },
    // rolling: true,
  })
);

const morgan = require("morgan");
app.use(morgan("combined"));

const cors = require("cors");
app.use(cors());

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

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

var server = app.listen(port, "127.0.0.1", () => {
  var host = server.address().address;
  var port = server.address().port;
  console.info(`listening on port ${port} at http://${host}:${port}`);
});
