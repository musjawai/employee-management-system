const data = {};
data.employees = require("./data/employees.json");

const getAllEmployees = (res, req) => {
  res.json(data.employees);
};

const createNewEmployee = (req, res) => {
  res.json({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
  });
};
