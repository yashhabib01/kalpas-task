const jwt = require("jwt-simple");

exports.protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decode = jwt.decode(token, process.env.SECRET);
      console.log(decode);
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Token not found" });
  }
};
