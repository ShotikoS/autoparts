const editRecord = require("express").Router();
const pool = require("../pool");

editRecord.put("/records/:id", (req, res) => {
  const mark = req.body.mark;
  const model = req.body.model;
  const location = req.body.location;
  const phone = req.body.phone;
  const comments = req.body.comment;
  const clientId = req.params.id;
  const sessionId = req.cookies.sessionId;

  if (sessionId.length == 20) {
    pool.getConnection((err, connection) => {
      connection.query(
        `UPDATE clients set mark='${mark}', location='${location}', phone='${phone}', model='${model}', comment='${comments}' WHERE clientId='${clientId}'`,
        (err, result) => {
          connection.release();

          if (err) {
            res.status(500).json({
              error: 10,
              message: "Database error",
              body: err,
            });
            console.log(err);
            return res.end();
          }

          res.status(200).json({
            error: 0,
            message: "Record added successfully",
            data: {
              clientId,
              mark,
              model,
              location,
              phone,
              comment: comments,
            },
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

module.exports = editRecord;
