require('dotenv').config();

const express = require('express');
const app = express();
const expressLayouts = require("express-ejs-layouts");
const SpotifyWebApi = require('spotify-web-api-node');

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res) => {
    res.render("home");
  });

  // render artist
  app.get("/artist-search", (req, res) => {
    spotifyApi
  .searchArtists(req.query.fname)
  .then(data => {
    console.log('The received data from the API: ', data.body.artists.items);
    // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
    res.render("artist-search-results", {artists : data.body.artists.items})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
