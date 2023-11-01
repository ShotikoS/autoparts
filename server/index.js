const path = require("path");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { dirname } = require("path");
const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const api = require('./API/api');
const session = require('express-session');

const PORT = process.env.PORT || 5000;

const app = express();

// app.use(session({
//   secret: 'keyboard cat',
//   resave: true,
//   saveUninitialized: true,
//   cookie: { secure: true }
// }))

app.use(cors());
app.use(cookieParser());
app.use(jsonParser);
app.use(urlencodedParser);

app.use(api.addNewRecord);
app.use(api.deleteRecord);
app.use(api.editRecord);
app.use(api.getRecords);
app.use(api.auth);
app.use(api.changePass);
app.use(api.select);

app.use(express.static(path.resolve(__dirname, "../client/build")));
app.use("/static", express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
