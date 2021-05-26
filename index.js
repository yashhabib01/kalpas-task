const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();
const app = express();

const connect = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    console.log(`Connect To ${conn.connection.host} Connected To Db`);
  } catch (err) {
    console.log(`Error: ${err}`);
    process.exit(1);
  }
};

connect();
app.use(express.json());

app.use("/api/v1/books", require("./routes/book"));
app.use("/api/v1/gen-token", require("./routes/genToken"));

const port = 5000;
app.listen(port, (req, res) => {
  console.log(`Server running at port ${port}`);
});
