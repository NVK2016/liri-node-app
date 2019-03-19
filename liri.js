//code to read and set any environment variables with the dotenv package
require("dotenv").config();

//Add the code required to import the keys.js file and store it in a variable.
var keys = require("./key");

// Core node package for reading and writing files
var fs = require("fs");

//A simple to use API library for the Spotify REST API.
var Spotify = require('node-spotify-api');

//able to access your keys information
var spotify = new Spotify(keys.spotify);

//Grabs data from axios to access API 
var axios = require("axios");

console.log(spotify);

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
    console.log("Choosen action: "+inquirerResponse.action);
    
    //Based on the user input call the function 
  switch(inquirerResponse.action){
    case "concert-this":
      console.log("concert-this");
      break;
    case "spotify-this-song":
      console.log("spotify-this-song");
      break;
    case "movie-this":
      console.log("movie-this");
      inquirer
      .prompt([
      // Here we create a basic text prompt.
      {
        type: "input",
        message: "Please enter movie name ?",
        name: "movieName"
      }]) .then(function(result) {
        // If the inquirerResponse confirms, we displays the inquirerResponse's  from the answers.
        console.log("\nWelcome " + inquirerResponse.username);
        console.log("Movie name: "+result.movieName);

        //Call Movie function 
        movieThis(result.movieName); 

      });
      break;
    case "do-what-it-says":
      doWhatItSays()
      break;
    default: 
    console.log("do-what-it-says");
      break; 
  }

});
      

function doWhatItSays(){
  console.log("doWhatItSays");
    //Do What it says 
  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }

    // We will then print the contents of data
    console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We will then re-display the content as an array for later use.
    console.log(dataArr);

  });
}

//Movie related Data 
function movieThis(inputMovie){

  console.log(inputMovie);
  //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
  if (inputMovie === undefined || inputMovie === '')  {
    inputMovie = "Mr. Nobody";
    console.log("-----------------------");
    console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
    console.log("It's on Netflix!");

  }

  // Then run a request with axios to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + inputMovie.split(' ').join('%20') + "&y=&plot=short&apikey=trilogy";

  // This line is just to help us debug against the actual URL.
  console.log(queryUrl);

  axios.get(queryUrl)
  .then(
    function(response) {
      // If the axios was successful...
      // Then log the body from the site!
      // console.log(response.data);
      // var cssStyle = "color:'DodgerBlue';font-weight:bold; "; 
      console.log("\n Title: " + response.data.Title );
      console.log("\n Release Year: " + response.data.Year);
      console.log("\n IMDB Rating: " + response.data.Ratings[0].Value);
      console.log("\n Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("\n Country: " + response.data.Country);
      console.log("\n Language(s): " + response.data.Language);
      console.log("\n Plot: " + response.data.Plot);
      console.log("\n Actors: " + response.data.Actors);
    })
  //otherwise log error - Follow the docs. 
  .catch(function (error) {
      console.log('Hello - Movie function')
      console.log(error);
    }
  );
}