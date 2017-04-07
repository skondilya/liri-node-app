// Takes in all of the command line arguments: my-tweets,spotify-this-song,movie-this,do-what-it-says
var liriCommand = process.argv[2];
// grab the fs package to handle read/write
var fs = require('fs');
// input such as movie name or song name is stored in this variable 
var secondInput = process.argv[3];

//the diiferent liri commands which we give through our command line 
switch (liriCommand) {
    case 'my-tweets':
        myTweets();
        break;
    case 'spotify-this-song':
        spotifyThisSong(secondInput);
        break;
    case 'movie-this':
        movieThis();
        break;
    case 'do-what-it-says':
        DoWhatItSays();
        break;
}

// function to display my last 20 tweets 
function myTweets(){
  // Grabs the key variables
  var keys = require("./keys.js");
  // Include the twitter package so we can use it in our Node application.
  var Twitter = require('twitter');
  // Gets all of keys from the keys file.
  var client = new Twitter(keys.twitterKeys);
  var params = {
    screen_name: 'ShreyaKondilya',
    count:20
  };

  client.get('statuses/user_timeline', params, function(error, tweets, response) {
      console.log("tweets " + tweets);
      console.log("error "+ error);
      console.log("status " + response.statusCode);
      if (!error && response.statusCode == 200) {
          console.log('My Last 20 Tweets are:')
          for (i = 0; i < tweets.length; i++) {
              console.log([i + 1] + '. ' + tweets[i].text);
              console.log('Created on: ' + tweets[i].created_at);
              console.log(' ');
          } 
      } else {
            console.log(error);
          }
  });

}

// Function to display information related to the song entered in command line 
function spotifyThisSong(secondInput) {
  var request = require('request');

  if (secondInput == null) {
      secondInput= 'The Sign';
  }
  request('https://api.spotify.com/v1/search?q=' + secondInput + '&type=track', function(error, response, body) {
      if (!error && response.statusCode == 200) {
          console.log(' ');
          console.log('Artists: ' + JSON.parse(body).tracks.items[0].artists[0].name);
          console.log('Song: ' + JSON.parse(body).tracks.items[0].name);
          console.log('Preview Link: ' + JSON.parse(body).tracks.items[0].preview_url);
          console.log('Album: ' + JSON.parse(body).tracks.items[0].album.name);

          //Output the data logged in your command line to a text file 
          fs.appendFile('log.txt', ('LOG ENTRY \r\n' 
            + 'Artist: ' + JSON.parse(body).tracks.items[0].artists[0].name + '\r\nSong: ' 
            + JSON.parse(body).tracks.items[0].name + '\r\nPreview Link: ' + JSON.parse(body).tracks.items[0].preview_url 
            + '\r\nAlbum: ' + JSON.parse(body).tracks.items[0].album.name 
            + '\r\nEND \r\n \r\n'), function(err) {
                if (err) throw err;
          });
      }
  });
}

// Function for giving information related to movies entered in the command line 
function movieThis() {
  // Including the request npm package 
  var request = require("request");
  
  // Store all of the arguments in an array
  var nodeArgs = process.argv;
  // Create an empty variable for holding the movie name
  var movieName = "";
  // Loop through all the words in the node argument
  // for-loop to handle the inclusion of "+"s
  if (secondInput == null) {
        movieName = 'mr nobody';
  }
  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    }
    else {
      movieName += nodeArgs[i];
    }
  }

  var queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&tomatoes=true&r=json';
  console.log(queryUrl);

  request(queryUrl, function(error, response, body) {
    // If the request is successful
    if (!error && response.statusCode === 200) {
      // Parse the body of the site and recover just the imdbRating
        console.log("Title: " + JSON.parse(body).Title + "\nYear: " + JSON.parse(body).Year 
        + "\nRating IMDB: " + JSON.parse(body).imdbRating
        + "\nCountry: " + JSON.parse(body).Country + "\nLanguage: " + JSON.parse(body).Language+ "\nPlot: " 
        + JSON.parse(body).Plot + "\nActors: " + JSON.parse(body).Actors
        + "\nRotten Tomato Rating: " + JSON.parse(body).tomatoRating
        + "\nRotten Tomato URL: " + JSON.parse(body).tomatoURL );

        console.log(' ');
        fs.appendFile('log.txt', ('LOG ENTRY MOVIE \r\n'+ 'Title: ' 
          + JSON.parse(body).Title + '\r\nYear: ' + JSON.parse(body).Year + '\r\nIMDb Rating: ' 
          + JSON.parse(body).imdbRating + '\r\nCountry: ' + JSON.parse(body).Country + '\r\nLanguage: ' 
          + JSON.parse(body).Language + '\r\nPlot: '+ JSON.parse(body).Plot + '\r\nActors: ' 
          + JSON.parse(body).Actors + '\r\nRotten Tomatoes Rating: '+ JSON.parse(body).tomatoRating 
          + '\r\nRotten Tomatoes URL: ' + JSON.parse(body).tomatoURL 
          + '\r\n END \r\n \r\n'), function(err) {
            if (err) throw err;
        });
      
    } else {
      console.log("error");
    }

  });

}

// LIRI takes the text inside the random.text file and calls the diffrent command 
function DoWhatItSays() {
  // This block of code will read from the "random.txt" file.
  // The code will store the contents of the reading inside the variable "data"
  fs.readFile("random.txt", "utf8", function(error, data) {
     if (error) {
          console.log(error);
      } else {
          var dataArr = data.split(',');
          spotifyThisSong(dataArr[1]);
     }
  });
 
}
