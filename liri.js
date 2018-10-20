require("dotenv").config();

var request = require("request");
var moment = require("moment");
var spotify = require("node-spotify-api");

var keys = require("./keys");

var command = process.argv[2];
var dataWanted = process.argv[3];

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
        // doTheThing();
        break;
}


function concertThis(artist) {

    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function (error, response, body) {
        var data = JSON.parse(body)
        for (var i = 0; i < data.length; i++) {
            var name = data[i].venue.name
            console.log(name);
            var venue = data[i].venue.city
            console.log(venue)
            var date = data[i].datetime
            console.log(moment(date).format("MM/DD/YYYY"));
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

function movieThis(movieName) {

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

// This line is just to help us debug against the actual URL.
console.log(movieName);

request(queryUrl, function(error, response, body) {

  // If the request is successful
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
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