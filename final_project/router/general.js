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

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    
    const methCall = new Promise((resolve,reject)=>{
        try {
            const data = books;
            resolve(data);
        } catch(err) {
            reject(err)
        }


    });
       
    methCall.then(
    (data) => res.status(200).send(JSON.stringify(data, null, 4)),
    (err) => res.status(500).send(err)
    );

          
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  //res.send(books[isbn]);
  axios.get = () => Promise.resolve({ data: books[isbn] });

    axios.get()
        .then((response) => {
            if (response.data) {
                return res.status(200).json(response.data);
            } else {
                return res.status(404).json({ message: `Book with ISBN ${isbn} not found` });
            }
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error fetching book details", error: error.message });
        });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const keys = Object.values(books);
  const data = keys.filter(book => book.author === author);
  if(data.length > 0){
    axios.get = () => Promise.resolve({ data: data });
    axios.get()
    .then((response) => {
        if (response.data) {
            return res.status(200).json(response.data);
        } else {
            return res.status(404).json({ message: `Book with author ${author} not found` });
        }
    })
    .catch((error) => {
        return res.status(500).json({ message: "Error fetching book by author", error: error.message });
    });
   
  }
  else
    return res.status(404).json({message: "Author not found"});
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const keys = Object.values(books);
    const data = keys.filter(book => book.title === title);
    if(data.length > 0){
        axios.get = () => Promise.resolve({ data: data });
        axios.get()
        .then((response) => {
            if (response.data) {
                return res.status(200).json(response.data);
            } else {
                return res.status(404).json({ message: `Book with title ${title} not found` });
            }
        })
        .catch((error) => {
            return res.status(500).json({ message: "Error fetching book by author", error: error.message });
        });
       
    }
    else
        return res.status(404).json({message: "Title not found"});
      
    
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
