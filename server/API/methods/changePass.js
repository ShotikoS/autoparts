const changePass = require("express").Router();
const pool = require("../pool");

changePass.put("/password", (req, res) => {
  const oldPass = req.body.oldPass;
  const newPass = req.body.newPass;
  const secret = req.body.secret;
  const sessionId = req.cookies.sessionId;
  const secretKey = "hmZlDHFro7tw8LdzHDDg0O3UM3z9oCzP"

  if(secret !== secretKey){
    res.status(200).json({
      error: 11,
      message: "Secret key is not correct",
    })

    return res.end()
  }

  if (sessionId.length == 20) {
    pool.getConnection((err, connection) => {
      connection.query(
        `UPDATE auth SET password='${newPass}' WHERE password='${oldPass}'`,
        (err, result) => {
          connection.release();

          if (err) {
            res.status(500).json({
              error: 10,
              message: "Database error",
              body: err,
            });

            return res.end();
          }

          if ((result.affectedRows == 1)) {
            res.status(200).json({
              error: 0,
              message: "Password Updated",
            });

            return res.end();
          } else {
            res.status(400).json({
              error: 0,
              message: "Old password is not correct",
            });

            return res.end();
          }
        }
      );
    });
  } else {
    res.status(403).json({
      error: 403,
      access: "danied",
    });
  }
});

module.exports = changePass;
