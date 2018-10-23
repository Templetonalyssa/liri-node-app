//variables required to use node packages
require("dotenv").config();

var request = require("request");
var moment = require("moment");
var spotify = require("node-spotify-api");
var fs = require("fs");

var keys = require("./keys");

//structured similiar to Activity 15 Bank JS, one set of inputs, multiple outputs. In this case, each output will consist of a different function


var command = process.argv[2];
var dataWanted = process.argv[3];

function switchThis (command,dataWanted){
    switch (command) {
    case "concert-this":
        concertThis(dataWanted);
        break;

    case "spotify-this-song":
        spotifyThis(dataWanted);
        break;

    case "movie-this":
         movieThis(dataWanted);
        break;

    case "do-what-it-says":
        doTheThing(dataWanted);
        break;
}
};

//functions that correspond to each of the directions from the homework
//Function "concertThis" is similiar to activity 17, OMDB Request

function concertThis(artist) {

    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
        var data = JSON.parse(body)
        for (var i = 0; i < data.length; i++) {
            console.log("Venue Name: " + data[i].venue.name);
            console.log("Venue City: " + data[i].venue.city)
            var date = data[i].datetime
            console.log("Concert Date: " + moment(date).format("MM/DD/YYYY"));
        }
    })
}

function spotifyThis(song) {
    if (song === undefined) {
        song = "The Sign"
    }
    let config = {
        id: keys.spotify.id,
        secret: keys.spotify.secret
    }
    var spotifySong = new spotify(config);

    spotifySong.search({
        type: 'track',
        query: song
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
            var artists = data.tracks.items[0].artists[i].name;
            console.log(artists);
        }
        var songlink = data.tracks.items[0].preview_url;
        console.log(songlink);
        var songalbum = data.tracks.items[0].album.name;
        console.log(songalbum);

    });
}

//Function "movieThis" is similiar to Activity 17, but with us requesting more data from the JSON

function movieThis(movieName) {
    if (movieName === undefined) {
        movieName = "Mr. Nobody"
    }

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
console.log(movieName);

request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover the imdbRating and other required info
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("Release Year: " + JSON.parse(body).Year);
    console.log("IMDB Rating: " +JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
    console.log("Country Where Produced: " + JSON.parse(body).Country);
    console.log("Language: " +JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot)
    console.log("Actors: " + JSON.parse(body).Actors);

  }
});
}

function doTheThing(){
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

        switchThis(dataArr[0],dataArr[1]);
      
      });
   
}

switchThis(process.argv[2],process.argv[3]);