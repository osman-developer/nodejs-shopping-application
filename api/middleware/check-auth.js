const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  //the method will return the decoded token if it succeeds
  //the verify method will verify and then returns the decoded value
  //we will take the attached token if there is a token is continues if not it will fail
  //this method if it fails it will throw an error so i surround it with try catch
  try {
    const token =req.headers.authorization.split(" ")[1];//this one is so you don't get the bearer so bearer token
    //you get only the token
   
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    //we call next if we successfully authenticate, the next will continue to execute the other functions
    //from left to right so example we put it in post of product in the beginning if it succeeds
    //it will continue to upload image
    //we could extract the decoded user data on that field (userdata)
    req.userData =decoded;
    next();
  }
  catch (error) {
    return res.status(401).json({
      message: 'Authentication Failed'
    });
  }

};