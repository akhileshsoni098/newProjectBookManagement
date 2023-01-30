const express = require('express')
const router = express.Router()
const userController = require("../controllers/userController")
const bookController = require("../controllers/bookController")
const reviewController = require("../controllers/reviewController")
const auth = require("../middleware/middleware")


router.post('/register',userController.userRegister)
router.post('/login',userController.userLogin)
router.post('/books', auth.authentication,auth.createBookAuth,bookController.createBook)
router.get('/books',auth.authentication,bookController.getBook)
router.get('/books/:bookId', auth.authentication,bookController.getBookParams)
router.put('/books/:bookId',auth.authentication,auth.authorization,bookController.updateBook )
router.delete('/books/:bookId',auth.authentication,auth.authorization, bookController.deletBook)
router.post('/books/:bookId/review', reviewController.reviewCreate)
router.put('/books/:bookId/review/:reviewId', reviewController.updateReview)
router.delete('/books/:bookId/review/:reviewId', reviewController.reviewDeletion)



router.all("/*", function(req,res){
    res.status(400).send({status : false, message:"invalid http request"})
})

module.exports = router