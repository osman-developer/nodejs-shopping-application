const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');

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
router.get('/', (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        productImage: doc.productImage,
                        _id: doc._id,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//add a new product
router.post('/', upload.single('productImage'), (req, res, next) => {
    //making a product of type Product to store data in it, the objectid() generates a unique id
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
        //also need to store in the db the path of the image that is located on my pc in order to retreive them
        //was reading from body
    });
    //saving the product into the db
    product
        .save()
        .then(result => {
            //here i'm logging the successful result and returning the product
            console.log(result);
            res.status(201).json({
                message: "Created product Successfully",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    request: {
                        type: "GET",
                        url: 'http://localhost:3000/products/' + result._id
                    }
                }
            });
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                error: err
            })
        });


});

//get a specific product
router.get('/:productId', (req, res, next) => {
    //reading the id from the url and seacrhing for it
    const id = req.params.productId;
    Product.findById(id)
        .select("name price _id productImage")
        .exec()
        .then(doc => {
            //here it checks if the doc is found else it pops up an err message
            console.log("from database", doc);
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products"
                    }
                })
            }
            else {
                res.status(404).json({ message: 'no valid data for provided id ' });[]
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

});

//updating a specific product
router.patch('/:productId', (req, res, next) => {
    //reading the id from url
    const id = req.params.productId;

    //in case you want to update both of them
    // Product.update({ _id: id },{ $set : {name : req.body.newName, price: req.body.newPrice}})

    //in case you want to update any so you read from body n times
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    //here you can update the whole array ( passed from body to be updated)
    Product.update({ _id: id }, { $set: updateOps })
        .exec()
        .then(result => {

            res.status(200).json({
                message: 'product updated',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/products/' + id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//delete a specific product
router.delete('/:productId', (req, res, next) => {
    //get the id from url
    const id = req.params.productId;
    Product.remove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                request: {
                    type: "POST",
                    url: "http://localhost:3000/products",
                    body: { name: 'String', price: 'Number' }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


module.exports = router;