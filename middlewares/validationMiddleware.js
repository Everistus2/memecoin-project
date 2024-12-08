const validator = require("../utils/validator");

const registerValidator = async (req, res, next) => {
  const validationRule = {
    email: "required|string|email",
    username: "required|string",
    phone: "required|string|phone",
    password: "required|string|min:8|confirmed|password",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const loginValidator = async (req, res, next) => {
  const validationRule = {
    email: "required|string|email",
    password: "required|string|min:8|password",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

const updateValidator = async (req, res, next) => {
  const validationRule = {
    password: "required|string|min:8|password",
  };

  await validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(412).send({
        success: false,
        message: "Validation failed",
        data: err,
      });
    } else {
      next();
    }
  }).catch((err) => console.log(err));
};

module.exports = {
  registerValidator,
  loginValidator,
  updateValidator
};
