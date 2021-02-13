# nodejs-shopping-application
This is a backend application written in Nodejs and mongoDB.
Hello, this is a backend application written in javascript (nodejs) and MongoDB. This application is about a product and order, the client 
can make an order of a product. The product has details and an image. The order is related to the product for sure.
In ordert to run this application, first of all you need to navigate inside the folder, then using CLI type 'npm install' (of course you should have nodejs installed on your
computer, the npm is a package manager). when you hit 'npm install' now you are going to donwload the used packages. 
After installing the packages you should create your DB from mongoDB and then add the connection string to it, for the password you can set it from the nodemon ,the reason 
I did thsi so that I prevent hardcoding, navigate to nodemon.json and set your password.
After that you can find under the API folder three subfolders one for the routes and one for the models and one for controller. In nodemon.json you will find 
the 'JWT KEY' (json web token key) is the key that I used to sign the JWT you can change it and set the one you want. Please add an 'uploads' folder under the this app.
You will find comments in each file and next to each line to tell you what does this do, So I assume that everything is clear and in case you didn't understand something
please reach me out and we can discuss it, I'm open to help everyone:) .
