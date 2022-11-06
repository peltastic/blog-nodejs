const { connectDB } = require("./db");
const dotenv = require("dotenv");

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = require("./app");
connectDB();

app.listen(PORT, () => {
  console.log("Listening on port, ", PORT);
});
