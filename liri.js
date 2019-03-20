//////////////-----------DECLARING ALL REQUIRED VARIABLES-----------------///////////////////////////////////////

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

const chalk = require('chalk');

// Load the NPM Package inquirer
var inquirer = require("inquirer");

var moment = require("moment"); 
var guestUser = ''; 
//////////////--------------END-OF-VARIABLES--------------///////////////////////////////////////

//FUNCTIONS
//-----------------------------------------------------------

function liriChatbox(){
  // Create a "Prompt" with a series of questions.
  inquirer
    .prompt([
      // Here we create a list to select prompt. 
      {
          type: "list",
          message: "How can I help you today? \n The available commands are:",
          choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "exit-this"],
          name: "action"
        }
      ]) .then(function(inquirerResponse) {
      
      //Based on the user input calls the respective function 
      switch(inquirerResponse.action){
        case "concert-this":
        
          inquirer
          .prompt([
          // Here we create a basic text prompt.
          {
            type: "input",
            message: "Please enter the artist, to know more about the upcoming event(s)",
            name: "concertName"
          }]) 
          .then(function(result) {
              concertThis(result.concertName); 
          });
          break;
        case "spotify-this-song":
          console.log("spotify-this-song");
          inquirer
          .prompt([
          // Here we create a basic text prompt.
          {
            type: "input",
            message: "Please enter the track you want to play?",
            name: "songName"
          }]) .then(function(response) {

            //Call Spotify API once ethe enter's a track name 
            spotifyThis(response.songName)
          });
          break;
        case "movie-this":
          // console.log("movie-this");
          inquirer
          .prompt([
          // Here we create a basic text prompt.
          {
            type: "input",
            message: "Please enter movie name ?",
            name: "movieName"
          }]) .then(function(result) {

            //Call Movie function once a user enters a movie name 
            movieThis(result.movieName); 

          });     
          break;
        case "do-what-it-says":
          doWhatItSays();
          break;
        case "exit-this":
          console.log(chalk.green.bold("Thank you... "+ guestUser +" come again!!"));
          break; 
        default: 
            //Do nothing 
          break;
      }
      //End of SWitch CASe 
  });
}
////////////////////////////////////////////////////
//
//            FUNCTIONs - for APIs 
//
////////////////////////////////////////////////////

function doWhatItSays(){
  // console.log("doWhatItSays");
    //reads values from random.txt file 
  fs.readFile("random.txt", "utf8", function(error, data) {

    // If the code experiences any errors it will log the error to the console , display in red color 
    if (error) {
      return console.log(chalk.red(error));
    }

    // We will then print the contents of data
    // console.log(data);

    // Then split it by commas (to make it more readable)
    var dataArr = data.split(",");

    // We are passing the song name from split array 
    if(dataArr[1] !== ''){
      spotifyThis(dataArr[1]);
    }

    //Recursive Call THe prompt again 
    liriChatbox(); 
  });
}

//Movie related Data 
function movieThis(inputMovie){

  console.log(inputMovie);
  //If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
  if (inputMovie === undefined || inputMovie === '')  {
    inputMovie = "Mr. Nobody";
    console.log(chalk.bold("-----------------------"));
    console.log(chalk.bold("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/"));
    console.log(chalk.bold("It's on Netflix!\n"));

  }

  // Then run a request with axios to the OMDB API with the movie specified
  var queryUrl = "http://www.omdbapi.com/?t=" + inputMovie.split(' ').join('%20') + "&y=&plot=short&apikey=trilogy";

  
  axios.get(queryUrl)
  .then(
    function(response) {
      // If the axios was successful...
      // Then log the body from the site!
      console.log(chalk.whiteBright.bgMagenta("-----------------------------------------\n"));
      console.log(chalk.bold("\n * Title of the movie: ") + response.data.Title );
      console.log(chalk.bold("\n * Year the movie came out: ") + response.data.Year);
      console.log(chalk.bold("\n * IMDB Rating: ") + response.data.Ratings[0].Value);
      console.log(chalk.bold("\n * Rotten Tomatoes Rating: ") + response.data.Ratings[1].Value);
      console.log(chalk.bold("\n * Country where the movie was produced: ") + response.data.Country);
      console.log(chalk.bold("\n * Language(s): " )+ response.data.Language);
      console.log(chalk.bold("\n * Plot of the movie: ") + response.data.Plot);
      console.log(chalk.bold("\n * Actors: " )+ response.data.Actors +"\n");
      console.log(chalk.whiteBright.bgMagenta("-------------------------------------------\n"));

      //Recursive Function -- asking for the prompt again  
      liriChatbox(); 
    })
  //otherwise log error - Follow the docs. 
  .catch(function (error) {
      console.log('Hello - Movie function')
      console.log(chalk.red(error));
    }
  );
}

//Data related to concert details 
function concertThis(inputArtist){

  //If the user doesn't type a artist in, the program will output data for the movie 'Lady gaga'
  if (inputArtist === undefined || inputArtist === '')  {
    inputArtist = "Lady Gaga";

  }
  // Then run a request with axios to the OMDB API with the movie specified
  var queryUrl = "https://rest.bandsintown.com/artists/" + inputArtist.split(' ').join('%20') + "/events?app_id=codingbootcamp";

  axios.get(queryUrl)
  .then(
    function(response) {
      console.log(response.data.length); 
      for( var i = 0; i < response.data.length; i++){
        console.log(chalk.whiteBright.bgBlueBright("---------------EVENT Details ---------------\n"));
        console.log(chalk.bold("Name of the venue: " )+ response.data[i].venue.name);
        console.log(chalk.bold("\n Venue Location: " )+ response.data[i].venue.city);
        //Using Moment to format Date 
        console.log(chalk.bold("\n Date of the Event: ") + moment(response.data[i].datetime).format('MM-DD-YYYY'));
        console.log(chalk.whiteBright.bgBlueBright("----------------------------------------\n"));
      }
      //Recursive Function 
      liriChatbox(); 
    })
  //otherwise log error - Follow the docs. 
  .catch(function (error) {
      console.log('Hello - Concert function')
      console.log(chalk.red(error));
    }
  );
}

//Song details will be displayed 
function spotifyThis(songName){
  console.log(songName);

  if(songName==undefined || songName==""){
    //* If no song is provided then your program will default to "The Sign" by Ace of Base.
    songName = "The Sign Ace of Base";
  }		
  //search is the EASIEST way to find an artist, album, or track. other way is to request 
  spotify.search({ type: 'track', query: songName , limit:1 })
  .then(function(response) {
    // console.log(response.tracks.items[0]);
    console.log(chalk.black.bgGreenBright("\n------------------- SPOTIFY ---------------\n"));
    console.log(chalk.bold("ARTIST(S) : ") + chalk.blue.bold(response.tracks.items[0].artists[0].name) );
    console.log(chalk.bold("Song Name : ") + chalk.blue.bold(response.tracks.items[0].name));
    console.log(chalk.bold("Preview Link : ") + chalk.blue.bold(response.tracks.items[0].preview_url) );
    console.log(chalk.bold("ALBUM : ") + chalk.blue.bold(response.tracks.items[0].name) );
    console.log(chalk.black.bgGreenBright("----------------------------------------\n"));

    // //Recursive Function 
    liriChatbox(); 
  })
  .catch(function(err) {
    console.log(chalk.red(err));
  });
}


//----------------------------------------
//MAIN PROCESS
//----------------------------------------

//Ask for the user name & set it to a global variable 
inquirer
.prompt([
  // Here we create a list to select prompt. 
    {
      type: "input",
      message: "Hi, Please type in your name??",
      name: "username"
    }
    ]).then(function(inquirerResponse) {
      guestUser = inquirerResponse.username; 
      console.log(chalk.bold("Welcome "+ guestUser + "\n")); 

      //Calling the User Prompt function that gives optiosn to select from 
      liriChatbox(); 

    })
    .catch(function(error){
      console.log(chalk.red(error));
    });