const Validator = require("validatorjs");
const validator = async (body, rules, customMessages, callback) => {
  const validation = new Validator(body, rules, customMessages);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]/;

  Validator.register(
    "password",
    (value) => passwordRegex.test(value),
    "Password must contain at least one uppercase letter, one lowercase letter and one number"
  );

  const phoneRegex = /^\+?[1-9]\d{1,14}$/;

  Validator.register(
    "phone",
    (value) => phoneRegex.test(value),
    "Phone Number can't starts with 0, contain letters, and contain non-numeric characters."
  );

  validation.passes(() => callback(null, true));
  validation.fails(() => callback(validation.errors, false));
};

module.exports = validator;
