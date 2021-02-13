const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');

exports.products_get_all = (req, res, next) => {
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
}

exports.products_create_product = (req, res, next) => {
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


}

exports.product_get_product = (req, res, next) => {
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

}

exports.products_edit_product = (req, res, next) => {
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
}

exports.product_delete_product = (req, res, next) => {
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
}