const jwt = require("jsonwebtoken");
const status = require("http-status");
// -------------------------------------------------

exports.userAuth = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token) {
      throw new Error("token not found");
    }

    token = token.replace("Bearer ", "");

    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
      if (err) {
        throw err;
      }
      req.userData = payload;
    });

    next();
  } catch (err) {
    res.status(status.UNAUTHORIZED).json({
      message: err.message,
    });
  }
};

// exports.userAuth = (req, res, next) => {
//   const authHeader = req.header("Authorization");
//   const token = authHeader && authHeader.split(" ")[1];
//   // check if user send token via Authorization header or not
//   if (!token) {
//     // rejected request and send response access denied
//     return res.status(401).send({ message: "Access denied!" });
//   }

//   try {
//     const verified = jwt.verify(token, process.env.SECRET_KEY); //verified token
//     req.user = verified;
//     next(); // if token valid go to the next request
//   } catch (error) {
//     res.status(status.UNAUTHORIZED).json({
//       message: err.message,
//     });
//   }
// };
