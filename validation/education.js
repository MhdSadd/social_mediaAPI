const validator = require("validator");
const isEmpty = require("../validation/is-empty");

module.exports = function validateEducationInput(data) {
  let errors = {};
  data.school = !isEmpty(data.school) ? data.school : ''
  data.degree = !isEmpty(data.degree) ? data.degree : ''
  data.field_of_study = !isEmpty(data.field_of_study) ? data.field_of_study : ''
  data.from = !isEmpty(data.from) ? data.from : ''

  if (validator.isEmpty(data.school)){
    errors.school = "School field is required"
  }
  if (validator.isEmpty(data.degree)){
    errors.degree = "Degree field is required"
  }
  if (validator.isEmpty(data.field_of_study)){
    errors.field_of_study = "Field of study field is required"
  }
  if (validator.isEmpty(data.from)){
    errors.from = "From field is required"
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
