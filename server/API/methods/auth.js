const auth = require("express").Router();
const pool = require("../pool");
const fs = require('fs')

auth.post("/users/auth", (req, res) => {
  const userName = req.body.userName;
  const password = req.body.password;

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  function generateString(length) {
    let result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  const sessionId = generateString(20);

  pool.getConnection((err, connection) => {
    connection.query(
      `SELECT * FROM auth WHERE username='${userName}'`,
      (err, rows) => {
        connection.release();

        if (err) {
          console.log(err);
          res.status(500).json({
            error: 10,
            message: "Database error",
            body: err,
          });

          return res.end();
        }

        let data = JSON.stringify(rows);
        data = JSON.parse(data);

        if (data.length > 0) {
          if (data[0].password == password) {

            res.status(200).json({
              error: 0,
              access: "ok",
              sessionId: sessionId,
            });
          } else {
            res.status(403).json({
              error: 403,
              message: "პაროლი არასწორია",
              access: "danied",
            });
          }
        } else {
          res.status(403).json({
            error: 403,
            message: "მომხმარებლის სახელი არასწორია",
            access: "danied",
          });
        }
      }
    );
  });
});

module.exports = auth;
