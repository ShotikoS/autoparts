const deleteRecord = require("express").Router();
const pool = require("../pool");

deleteRecord.delete("/records/:id", (req, res) => {
  const id = req.params.id;
  const sessionId = req.cookies.sessionId;

  if (sessionId.length == 20) {
    pool.getConnection((err, connection) => {
      connection.query(
        `DELETE FROM clients WHERE clientId='${id}'`,
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

          res.status(200).json({
            error: 0,
            message: "Record deleted successfully",
            status: "success",
          });

          return res.end();
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

module.exports = deleteRecord;
