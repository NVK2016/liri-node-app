//code to read and set any environment variables with the dotenv package
// require("dotenv").config();

//Add the code required to import the keys.js file and store it in a variable.
// var keys = require("./keys.js");

// Core node package for reading and writing files
var fs = require("fs");

//A simple to use API library for the Spotify REST API.
var Spotify = require('node-spotify-api');

//able to access your keys information
// var spotify = new Spotify(keys.spotify);

// Load the NPM Package inquirer
var inquirer = require("inquirer");

// Create a "Prompt" with a series of questions.
inquirer
  .prompt([
    // Here we create a basic text prompt.
    {
      type: "input",
      message: "Welcome, please type in your name??",
      name: "username"
    },
    // Here we create a list to select prompt. 
    {
        type: "list",
        message: "How can I help you today? \n The available commands are:",
        choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says"],
        name: "action"
      }
    ]) .then(function(inquirerResponse) {
    // If the inquirerResponse confirms, we displays the inquirerResponse's  from the answers.
    console.log("\nWelcome " + inquirerResponse.username);
    console.log("chosen action: "+inquirerResponse.action);

});
      