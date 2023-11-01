const select = require("express").Router();
const pool = require("../pool");

select.put("/select/:id", (req, res) => {
  const id = req.params.id;
  const date = +new Date() + 3600000;
  const sessionId = req.cookies.sessionId

  if (sessionId.length == 20) {
    pool.getConnection((err, connection) => {
      connection.query(
        `UPDATE clients SET selected='${date}' WHERE clientId='${id}'`,
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
              message: "selected",
            });

            return res.end();
          } else {
            res.status(400).json({
              error: 0,
              message: "Wrong client ID",
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

module.exports = select;
