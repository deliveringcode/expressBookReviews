const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    if (userswithsamename.length == 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in. Provide username and password" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 3 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({ message: "User successfully logged in"});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.body.review; 
    
    const username = req.session.authorization.username;

    // check review
    if (!review) {
        return res.status(400).json({ message: "Please provide a review for the book." });
    }

    //chexk if book exists
    if (books[isbn]) {
        
        books[isbn].reviews[username] = review;
        
        return res.status(200).json({ 
            message: `The review for the book with ISBN ${isbn} has been successfully added/updated.`,
            reviews: books[isbn].reviews 
        });
        
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

regd_users.delete("/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    
    const username = req.session.authorization.username;

    if (books[isbn]) {
        
        if (books[isbn].reviews[username]) {
            
            delete books[isbn].reviews[username];
            
            return res.status(200).json({ 
                message: `Review for ISBN [${isbn}] deleted.` 
            });
            
        } else {
            return res.status(404).json({ message: `No review found for user ${username} on this book.` });
        }
        
    } else {
        return res.status(404).json({ message: `Book with ISBN ${isbn} not found.` });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
