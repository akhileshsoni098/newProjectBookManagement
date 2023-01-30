
const valid = require("../validation/validation")
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken')


const userRegister = async function (req, res) {
    try {
        const userData = req.body;
        
        let { name, phone, title, password, email, address } = userData;
        
        if (Object.keys(userData).length == 0) {
            return res
                .status(400)
                .send({ status: false, message: "Please provide some data to create user" });
        }

        if (!title || typeof (title) != "string") {
            return res
                .status(400)
                .send({ status: false, message: "please provide title in string" });
        }

        title = userData.title = title.trim()

        if (!["Mr", "Mrs", "Miss"].includes(title)) {
            return res
                .status(400)
                .send({ status: false, message: "please provide valid title" });
        }

        if (!name || typeof (name) != "string") {
            return res
                .status(400)
                .send({ status: false, message: "Please provide valid name in string" });
        }
        name = userData.name = name.trim()

        if(!valid.textReg(name)){
            return res
                .status(400)
                .send({ status: false, message: "enter valid name" });
        }

    

        if (!phone || typeof (phone) != "string") {
            return res
                .status(400)
                .send({ status: false, message: "Please provide valid phone in string" });
        }
 
        phone = userData.phone = phone.trim()

        if (!valid.phoneValid(phone)) {
            return res
                .status(400)
                .send({ status: false, message: "enter valid phone number" });
        }
        const phoneExist = await userModel.findOne({ phone: phone });
        if (phoneExist) {
            return res
                .status(400)
                .send({ status: false, message: "phone is already exist" });
        }
        if (!email || typeof(email) != "string") {
            return res
                .status(400)
                .send({ status: false, message: "email must be in string"});
        }

        email = userData.email = email.trim()

        if (!valid.emailValid(email)) {
            return res
                .status(400)
                .send({ status: false, message: "enter valid email id" });
        }
        const emailExist = await userModel.findOne({ email: email });
        if (emailExist) {
            return res
                .status(400)
                .send({ status: false, message: "email is already exist" });
        }

        if (!password || typeof(password) != "string") {
            return res
                .status(400)
                .send({ status: false, message: "password is must be in string" });
        }

        password = userData.password = password.trim()

        if (!valid.passwordValid(password)) {
            return res
                .status(400)
                .send({ status: false, message: "Password should contain atleast 1 lowercase, 1 uppercase, 1 numeric ,1 special character, range between 8-12" });
        }

        if(address){
            if (!address.street || typeof (address.street) != "string") {
                return res
                    .status(400)
                    .send({ status: false, message: "Please provide street name in address" });
            }
            address.street = userData.address.street = address.street.trim()
            
            if (!address.city || typeof (address.city) != "string") {
                return res
                    .status(400)
                    .send({ status: false, message: "Please provide city name in address" });
            }
            address.city = userData.address.city = address.city.trim()


            if (!address.pincode || typeof (address.pincode) != "string") {
                return res
                    .status(400)
                    .send({ status: false, message: "Please provide pincode in address" });
            }
            address.pincode = userData.address.pincode = address.pincode.trim()

            if(!valid.pinReg(address.pincode)){
                return res
                    .status(400)
                    .send({ status: false, message: "Please provide valid pincode in following format, e.g: ** or * *" })
            }
        }
        const registeredData = await userModel.create(userData);
        res
            .status(201)
            .send({ status: true, message: "Success", data: registeredData });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
}



const userLogin = async function(req,res){
    try {
        let data = req.body
        let {email, password} = data
        if(Object.keys(data).length==0){
            return res.status(400).send({status: false, message: "Please provide mandatory details"})
        }
        if(!email || typeof(email) != "string"){
            return res.status(400).send({status: false, message: "Please provide email-id instring"})
        }
        email = data.email = email.trim()
        if (!valid.emailValid(email)) {
            return res
              .status(400)
              .send({ status: false, message: "please provide valid email id" });
          }
        if(!password || typeof(password) != "string"){
            return res.status(400).send({status: false, message: "Please provide password in string"})
        }
        password = data.password = password.trim()

        if (!valid.passwordValid(password)) {
            return res
              .status(400)
              .send({ status: false, message: "Please provide valid password" });
          }
        
        const userDetail = await userModel.findOne({email:email, password: password})
        if(!userDetail){
            return res.status(401).send({status: false, message: " email or password not matched"})
        }

        let payLoad = {userId : userDetail._id}

        let token = jwt.sign(
            payLoad ,
        "secretKeyProject4", {expiresIn : "1h" })

        res.status(200).send({status: true, message:"successfully login", data: token})

    } catch (error) {
        res.status(500).send({status: false, message: error.message})
    }
}



module.exports = { userRegister, userLogin }