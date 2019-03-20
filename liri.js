//////////////-----------VARIABLES-----------------///////////////////////////////////////
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

// console.log(spotify);

// Load the NPM Package inquirer
var inquirer = require("inquirer");

//////////////--------------END-OF-VARIABLES--------------///////////////////////////////////////

//FUNCTIONS
//-----------------------------------------------------------

function liriChatbox(){
  // Create a "Prompt" with a series of questions.
  inquirer
    .prompt([
      // // Here we create a basic text prompt.
      // {
      //   type: "input",
      //   message: "Welcome, please type in your name??",
      //   name: "username"
      // },
      // Here we create a list to select prompt. 
      {
          type: "list",
          message: "How can I help you today? \n The available commands are:",
          choices: ["concert-this", "spotify-this-song", "movie-this", "do-what-it-says", "exit-app"],
          name: "action"
        }
      ]) .then(function(inquirerResponse) {
      // If the inquirerResponse confirms, we displays the inquirerResponse's  from the answers.
      console.log("\nWelcome " + inquirerResponse.username);
      // console.log("Choosen action: "+inquirerResponse.action);
      
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
            console.log("\nWelcome " + inquirerResponse.username);

            //Call Spotify API once ethe enter's a track name 
            spotifyThis(response.songName)
          });
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
            // console.log("\nWelcome " + inquirerResponse.username);
            // console.log("Movie name: "+result.movieName);

            //Call Movie function once a user enters a movie name 
            movieThis(result.movieName); 

          });
                 

          break;
        case "do-what-it-says":
          doWhatItSays();
          break;
        default: 
          // console.log(inquirerResponse.action);
          console.log("Thank you... come again!!");
          break; 
      }
      //End of SWitch CASe 
  });
}

//FUNCTION 
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
    if(dataArr[1] !== ''){
      spotifyThis(dataArr[1]);
    }

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
      console.log("\n * Title of the movie: " + response.data.Title );
      console.log("\n * Year the movie came out: " + response.data.Year);
      console.log("\n * IMDB Rating: " + response.data.Ratings[0].Value);
      console.log("\n * Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
      console.log("\n * Country where the movie was produced: " + response.data.Country);
      console.log("\n * Language(s): " + response.data.Language);
      console.log("\n * Plot of the movie: " + response.data.Plot);
      console.log("\n * Actors: " + response.data.Actors +"\n");

      //Recursive Function 
      liriChatbox(); 
    })
  //otherwise log error - Follow the docs. 
  .catch(function (error) {
      console.log('Hello - Movie function')
      console.log(error);
    }
  );
}

//Data related to concert details 
function concertThis(inputArtist){

  console.log(inputArtist);
  //If the user doesn't type a artist in, the program will output data for the movie 'Lady gaga'
  if (inputArtist === undefined || inputArtist === '')  {
    inputArtist = "Lady Gaga";

  }
  // Then run a request with axios to the OMDB API with the movie specified
  var queryUrl = "https://rest.bandsintown.com/artists/" + inputArtist.split(' ').join('%20') + "/events?app_id=codingbootcamp"

  // This line is just to help us debug against the actual URL.
  console.log(queryUrl);

  axios.get(queryUrl)
  .then(
    function(response) {
      console.log(response.data.length); 
      for( var i = 0; i < response.data.length; i++){
        console.log("-----------EVENT Details ---------------\n");
        console.log("\n Name of the venue: " + response.data[i].venue.name );
        console.log("\n Venue Location: " + response.data[i].venue.city);
        //Using Moment to format Date 
        console.log("\n Date of the Event: " + response.data[i].datetime);
        console.log("----------------------\n");
      }
      //Recursive Function 
      liriChatbox(); 
    })
  //otherwise log error - Follow the docs. 
  .catch(function (error) {
      console.log('Hello - Concert function')
      console.log(error);
    }
  );
}

//Song details will be displayed 
function spotifyThis(songName){
  console.log(songName);

  if(songName==undefined || songName==""){
    //* If no song is provided then your program will default to "I want it that way" by Backstreet boys.
    songName = "I want it that Way";
  }		
  //search is the EASIEST way to find an artist, album, or track. other way is to request 
  spotify.search({ type: 'track', query: songName })
  .then(function(response) {
    console.log(response);
    console.log("ARTIST(S) : " );
    console.log("Song Name : " );
    console.log("Preview Link : " );
    console.log("ALBUM : " );

    // //Recursive Function 
    // liriChatbox(); 
  })
  .catch(function(err) {
    console.log(err);
  });
}


//----------------------------------------
//MAIN PROCESS
//----------------------------------------
liriChatbox(); 
