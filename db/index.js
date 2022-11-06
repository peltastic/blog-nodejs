const mongoose = require("mongoose");

const connectDB = () => {
  mongoose.connect(process.env.DB_URI);

  mongoose.connection.on("connected", () => {
    console.log("Connected to MongoDB Successfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("An error occurred while connecting to MongoDB");
    console.log(err);
  });
};

module.exports = { connectDB };
