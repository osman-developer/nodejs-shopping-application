const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        // cb(null, new Date().toISOString() + file.originalname); it didnt work
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        //stores a file
        cb(null, true);
    }
    else {
        //rejects a file ( all types other than jpeg and png )
        cb(null, false); //it just doesn't save the file it doesn't return an error
    }

}
//params to add for uploading(the storage,limits of file size, the file filter)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});
//this one it initialize the place to put files
//get all products
router.get('/', ProductController.products_get_all);

//add a new product
//the checkAuth middleware will be executed first if it succeeds it will continue(because i have next inside the check-auth.js)
router.post('/', checkAuth, upload.single('productImage'), ProductController.products_create_product);

//get a specific product
router.get('/:productId', ProductController.product_get_product);

//updating a specific product
router.patch('/:productId', checkAuth, ProductController.products_edit_product);

//delete a specific product
router.delete('/:productId', checkAuth, ProductController.product_delete_product);


module.exports = router;