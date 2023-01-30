
const moment = require('moment')

const emailValid = function(email){
    re = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/;
    return re.test(email)
}

const passwordValid = function(password){
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,15}$/;
    return re.test(password)
}

const phoneValid = function(phone){
    const re = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;
    return re.test(phone)
}

const isbnValid = function(ISBN){
    const re = /^\+?([1-9]{3})\)?[-. ]?([0-9]{10})$/
     return re.test(ISBN)
}

const dateReg = function isValidDate(date) {
  if (!moment(date, 'YYYY-MM-DD', true).isValid()) {
    return false;
  }
  return true;
}

const textReg = function(val){
  const name = /^[a-zA-Z]{3,30}$/
  return name.test(val)
}

const pinReg = function(pincode){
  const re = /^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/
  return re.test(pincode)
}


module.exports = {emailValid, passwordValid, phoneValid, isbnValid, dateReg, textReg, pinReg}