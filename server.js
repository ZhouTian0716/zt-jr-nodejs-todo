const express = require("express");
const app = express();

const cors = require('cors');
const { logger } = require('./middleware/logEvents');
const PORT = process.env.PORT || 3500;

// MIDDLE WARES
// cors option to be set
app.use(cors());
app.use(express.json());
app.use(logger);



app.use("/tasks", require("./routes/tasksRoutes"));





app.listen(PORT, () => console.log(`Server running on port ${PORT}`));