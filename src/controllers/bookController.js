
const valid = require('../validation/validation')
const mongoose = require('mongoose');
const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const reviewModel = require('../models/reviewModel');

const createBook = async function (req, res) {

    try {
        const bookData = req.body
        let { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = bookData


        if (Object.keys(bookData).length == 0) {
            return res.status(400).send({ status: false, message: "Please provide some data to create book" })
        }
//================================================================ title
        if (!title){
            return res.status(400).send({ status: false, message: "Please provide title" })
        }

        if (typeof (title) != "string"){
            return res.status(400).send({ status: false, message: "Please provide title in string" })
        }

     if(title) {
        title = bookData.title = title.trim()
        title = bookData.title = title.toLowerCase()
        const findBook = await bookModel.findOne({ title: title })
        if (findBook)
            return res.status(400).send({ status: false, message: "This book already exists" })
     }

//==================================================== excerpt=====
        if (!excerpt){
            return res.status(400).send({ status: false, message: "Please provide the excerpt" })
        }
        if( typeof (excerpt) != "string")
        {return res.status(400).send({ status: false, message: "Please provide the excerpt in string" })}
        excerpt = bookData.excerpt = excerpt.trim()


//==================================================== ISBN

        if (!ISBN){
            return res.status(400).send({ status: false, message: "Please provide the ISBN" })
        }
        if( typeof (ISBN) != "string")

        { return res.status(400).send({ status: false, message: "Please provide the ISBN in string" })}

        ISBN = bookData.ISBN = ISBN.trim()
        if (!valid.isbnValid(ISBN))
            return res.status(400).send({ status: false, message: "Please provide valid ISBN, e.g: 978-1861978709 " })

        const findISBN = await bookModel.findOne({ ISBN: ISBN })
        if (findISBN)
            return res.status(400).send({ status: false, message: "This ISBN number already exists" })


//====================================================== Category 

        if (!category ){
            return res.status(400).send({ status: false, message: "Please provide category " })
        }
            if ( typeof (category) != 'string'){
            return res.status(400).send({ status: false, message: "Please provide category in string" })
            }
        category = bookData.category = category.trim()
//=============================================Subcategory
        if (!subcategory){
            return res.status(400).send({ status: false, message: "Please provide subcategory" })
        }
            if ( typeof (subcategory) != 'string'){
            return res.status(400).send({ status: false, message: "Please provide subcategory in string" })
            }
        subcategory = bookData.subcategory = subcategory.trim()
//=====================================================================ReleasedAT
        if (!releasedAt){
            return res.status(400).send({ status: false, message: "Please provide the releasedAt" })
        }
            if ( typeof (releasedAt) != 'string'){
            return res.status(400).send({ status: false, message: "Please provide the releasedAt in string" })
            }
        releasedAt = bookData.releasedAt = releasedAt.trim()

        if (!valid.dateReg(releasedAt)) {
            return res.status(400).send({ status: false, message: "Please provide valid date e.g. YYYY-MM-DD" })

        }
//========================================================================

        const createdBook = await bookModel.create(bookData)
        return res.status(201).send({ status: true, message: "Success", data: createdBook })

    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}


const getBook = async function (req, res) {
    try {
        const data = req.query
        let { userId, category, subcategory } = data
        //==================================
        if (userId) {
            userId = data.userId = userId.trim()
        }
        if (category) {
            category = data.category = category.trim()
        }
        if (subcategory) {
            subcategory = data.subcategory = subcategory.trim()
        }
//====================================================
        if (Object.keys(data).length == 0) {
            
            const fetchData = await bookModel.find({ isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })
          

            //==========================

            if(fetchData.length == 0){
                return res.status(404).send({ status: false, message: "book not found" })
            }
            return res.status(200).send({ status: true, message: 'Books list', data: fetchData })
        }
//==============================================
        if (userId || subcategory || category) {
            const filterData = await bookModel.find({ ...data, isDeleted: false }).select({ _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, reviews: 1, releasedAt: 1 }).sort({ title: 1 })

            if (filterData.length == 0) { return res.status(404).send({ status: false, message: "book not found" }) }

            return res.status(200).send({ status: true, message: 'Books list', data: filterData })
        }
        else return res.status(400).send({ status: false, message: "Please provide valid key-value pair" })
//===================================================

    } catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
}


const getBookParams = async function (req, res) {
    try {
        let bookId = req.params.bookId

        if (!mongoose.isValidObjectId(bookId))
            return res.status(400).send({ status: false, message: "Please provide valid bookId" })
//=====================================
        let data = await bookModel.findById(bookId)

        if (!data) { return res.status(404).send({ status: false, message: "Book not found" }) }
        if (data.isDeleted === true) { return res.status(404).send({ status: false, message: "Book is already deleted" }) }

        const bookreviews = await reviewModel.find({ bookId: bookId, isDeleted: false }).select({ isDeleted: 0 })

        const resdata = data.toObject() // here converting json formet to javaScript object 
        resdata.reviewedData = bookreviews

        return res.status(200).send({ status: true, message: "Success", data: resdata })
//=================================================

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}
// title
// excerpt
// release date
// ISBN
const updateBook = async function (req, res) {

    try {
        const bookId = req.params.bookId
        let bookBody = req.body
        let { title, excerpt, releasedAt, ISBN } = bookBody


        if (Object.keys(bookBody).length == 0){
            return res.status(400).send({ status: false, message: "Please provide some keys to update book" })
        }

        //===============================================
       
        if (title) {

            if (typeof (title) != "string")
                return res.status(400).send({ status: false, message: "Please provide title in string" })


            title = bookBody.title = title.trim()
             title = bookBody.title = title.toLowerCase()
            const bookTitle = await bookModel.findOne({ title: title })
            if (bookTitle)
                return res.status(400).send({ status: false, message: "Book title  already exists" })
        }
//===============================================

         if(releasedAt){

          if(typeof(releasedAt) !="string")
          {return res.status(400).send({ status: false, message: "Please provide releaseAt in string to update book" })}
          releasedAt = bookBody.releasedAt = releasedAt.trim()
         }
//==============================

            if(excerpt){

            if(typeof(excerpt) !="string")
            {return res.status(400).send({ status: false, message: "Please provide excerpt in string to update book" })}
            excerpt = bookBody.excerpt = excerpt.trim()
  
            }
            //==============================================================

  
            
        if (ISBN) {
            if (typeof (ISBN) != "string")
                return res.status(400).send({ status: false, message: "Please provide the ISBN in string" })

            ISBN = bookBody.ISBN = ISBN.trim()

            if (!valid.isbnValid(ISBN))
                return res.status(400).send({ status: false, message: "Please provide valid ISBN, e.g: 978-1861978709 " })


            const bookISBN = await bookModel.findOne({ ISBN: ISBN })
            if (bookISBN)
                return res.status(400).send({ status: false, message: "Book ISBN  already exists" })

        }
       //==============================================================

        const updatedBook = await bookModel.findByIdAndUpdate({ _id: bookId },
            {
                $set: { title: title, excerpt: excerpt, releasedAt: Date.now(), ISBN: ISBN },
            }, { new: true });

        return res.status(200).send({ status: true, message: "Successfully updated", data: updatedBook })
    }
    catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
}





const deletBook = async function (req, res) {
    try {

        let data = req.params.bookId;

        await bookModel.findOneAndUpdate({ _id: data }, { $set: { isDeleted: true, deletedAt: new Date() } });

        return res.status(200).send({ status: true, message: "succesfully deleted" })

    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

}

module.exports = { createBook, getBook, getBookParams, updateBook, deletBook }