const express = require("express");
const morganColor = require("./middlewares/morganColor");

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");

const app = express();

app.use(morganColor);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () => {
  console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});

