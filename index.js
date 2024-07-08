require("dotenv").config();
const cors = require("cors");
const mongoose = require("mongoose");
const MongoUrl = process.env.MONGO_URL;
const verifyToken = require("./middlewares/authMiddleware");
const { onlyAdminAccess } = require("./middlewares/adminMiddleware");
const { getAllRoutes } = require("./controllers/admin/routerController");

mongoose
  .connect(MongoUrl)
  .then(() => {
    console.log("mongodb atlas is connected");
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });

const express = require("express");
const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

//auth route
const authRoute = require("./routes/authRoute");
app.use("/api", authRoute);

//admin route
const adminRoute = require("./routes/adminRoute");
app.use("/api/admin", adminRoute);

//common route
const commonRoute = require("./routes/commonRoute");
app.use("/api", commonRoute);

//message route
const messageRoutes = require("./routes/messageRoutes");
app.use("/api/messages", messageRoutes);

//router route
app.get("/api/admin/all-routes", verifyToken, onlyAdminAccess, getAllRoutes);

const port = process.env.PORT || 3000;
const hostname = "127.0.0.1";

app.listen(port, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});
