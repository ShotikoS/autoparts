const addNewRecord = require("express").Router();
const pool = require("../pool");
const fs = require("fs");

addNewRecord.post("/records", (req, res) => {
  const mark = req.body.mark;
  const model = req.body.model;
  const location = req.body.location;
  const phone = req.body.phone;
  const comments = req.body.comment;
  const clientId = Math.floor(10000000000 + Math.random() * 90000000000);
  const sessionId = req.cookies.sessionId;

  if (sessionId.length == 20) {
    pool.getConnection((err, connection) => {
      connection.query(
        `INSERT INTO clients(clientId, mark, model, location, phone, comment) values('${clientId}', '${mark}', '${model}', '${location}', '${phone}', '${comments}')`,
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

module.exports = addNewRecord;
