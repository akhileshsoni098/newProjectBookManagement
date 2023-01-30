
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel")

const authentication = function (req, res, next) {
    try {
        const token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, message: "Header token is required !" });
        }
        jwt.verify(token, 'secretKeyProject4', function (err, decoded) {
            if (err) {
                return res.status(401).send({ message: err.message })
            }
            else {
                req.decodedToken = decoded
                next()
            }
        });
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

const authorization = async function (req, res, next) {
    try {
        const bookId = req.params.bookId
        const userId = req.decodedToken.userId
       
        if (!mongoose.isValidObjectId(bookId)) {
            return res.status(400).send({ status: false, message: "please provide valid book id" });
        }

        const checkId = await bookModel.findOne({ _id: bookId, isDeleted: false }) // updated  (findOne())
        if (!checkId) {
            return res.status(404).send({ status: false, message: "Book id doesn't exist" });
        }
        if (checkId.userId != userId) {
            return res.status(403).send({ status: false, message: "Unauthorised access" });

        }

        next()
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

const createBookAuth = async function (req, res, next) {
    try {
        const tokenUserId = req.decodedToken.userId

        let userId = req.body.userId
//===============================
        if (!userId){
            return res.status(400).send({ status: false, message: "Please provide the userID" })
        }
        
        if ( typeof (userId) != "string"){
            return res.status(400).send({ status: false, message: "Please provide the userID in string" })
        }
        
        userId = req.body.userId = userId.trim()

        if (!mongoose.isValidObjectId(userId))
            return res.status(400).send({ status: false, message: "Please provide the valid userID" })

        const findUser = await userModel.findOne({ _id: userId, isDeleted: false })
        if (!findUser)
            return res.status(404).send({ status: false, message: "user not found" })
//===============================================
        if (tokenUserId != userId) {
            return res.status(403).send({ status: false, message: "user Unauthorised access" });
        }
        next()
        //========================================
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports = { authentication, authorization, createBookAuth }