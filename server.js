const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const { logEvents, logger } = require("./middleware/logEvents");
const { errorHandler } = require("./middleware/errorHandler");
const PORT = process.env.PORT || 3500;
const corsOptions = require("./config/corsOptions");

// custom middleware logger
app.use(logger);
// cors middleware
app.use(cors(corsOptions));
// built-in middleware
app.use(express.urlencoded({ extended: false }));
// built-in middleware
app.use(express.json());

// serve static files
app.use(express.static(path.join(__dirname, "/public")));

// all routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "Not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// myEmitter.on("log", (msg) => logEvents(msg));

//   myEmitter.emit("log", "Log event emitted");
