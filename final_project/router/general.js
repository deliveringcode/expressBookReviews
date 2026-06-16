const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
//const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});

});

function getAllBooks() {
    return new Promise((resolve, reject) => {
        if (books) {
            resolve(books);
        } else {
            reject("Books not found");
        }
    });
}
// Get the book list available in the shop
public_users.get('/',  function (req, res) {
    getAllBooks()
            .then((books) => {
                return res.send(JSON.stringify(books, null, 4));
            })
            .catch((error) => {
                res.status(500).json({ message: error });
            });
          
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn; 
    getAllBooks()
    .then((books) => {
        const book = books[isbn];
        if (!book) {
            return res.status(404).json({ message: "Book with isbn: "+isbn+
            " not found" });
        }
        return res.status(200).json(book);
        
    })
    .catch((error) => {
        return res.status(500).json({ message: error });
        
    });

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;

  getAllBooks()
  .then((books) => {
    const keys = Object.values(books);
    const data = keys.filter(book => book.author === author);
    if(data.length > 0){
        return res.status(200).json(data);    
       
    }
    else
    return res.status(404).json({ message: `Book with author ${author} not found` });

  })
  .catch((error) => {
      result = res.status(500).json({ message: error });
      return result;
  });

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getAllBooks()
    .then((books) => {
    const keys = Object.values(books);
    const data = keys.filter(book => book.title === title);
    if(data.length > 0){
        return res.status(200).json(data);    
       
    }
    else
    return res.status(404).json({ message: `Book with title ${title} not found` });

  })
  .catch((error) => {
      result = res.status(500).json({ message: error });
      return result;
  });
    
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn]){
        return res.status(200).json(books[isbn].reviews);
    }
    else{
        return res.status(404).json({message: "ISBN not found"});
    }
  
});

module.exports.general = public_users;
