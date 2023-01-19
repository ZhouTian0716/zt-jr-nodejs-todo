const express = require("express");
const bodyParser = require("body-parser");
const app = express();
// const cors = require('cors');
const { logger } = require("./middleware/logEvents");

// 匠人前端 对接的是3000后端
const PORT = process.env.PORT || 3000;
// const corsOptions = require("./config/corsOptions");

const cors = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  next();
};

app.use(cors);



// MIDDLE WARES
// cors option to be set
// app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(logger);


app.use("/tasks", require("./routes/tasksRoutes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
