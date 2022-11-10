const express = require("express");;
const authRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const cors = require("cors")



const app = express();
app.use(cors())
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/blog", blogRoutes);

app.post("/health", (req, res) => {
  res.send("heyyy");
});



module.exports = app;
