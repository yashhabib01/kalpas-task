const jwt = require("jwt-simple");
const router = require("express").Router();

router.get("/", (req, res) => {
  // dummy data
  const payload = {
    foo: "bar",
    date: new Date().getDate(),
  };

  const token = jwt.encode(payload, process.env.SECRET);

  res.json({ token });
});

module.exports = router;
