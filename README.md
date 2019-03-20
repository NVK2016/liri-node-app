# LIRI Node Application 
    LIRI is Language Interpretation and Recognition Interface

LIRI is a command line node app that takes command line parameters. Based on the selected parameters calls the APIs and returns da†a in JSON format.


### Prerequisites
To run this application you will need Node.JS and NPM installed on your system.

Inside of the folder in which you've cloned the files to, run the following command:

    npm install

Inside of the folder in which you've cloned the files to, run the following command:

    npm init -y  [to create the package JSON file] 

    Differnt NODE MODULES INSTALLED 
    * npm install dotenv --save
    * npm install inquirer
    * npm install axios
    * npm install --save node-spotify-api
    * npm install chalk

### Running the application 
by typing this in commandline prompt within the folder path / 

    node liri.js

### Built With : 
1. Node.JS 
    * node-inquirer - to prompt user input 
    * npm chalk - display colorful console.log()
    * npm moment.js - to formate datetime 
    * fs - read & write data from text files 
2. AXIOS to access different APIS 
    * Spotify API 
    * OMDB API 
    * Bands in Town API 
