require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body['access_token']))
  .catch((error) =>
    console.log('Something went wrong when retrieving an access token', error)
  );

// Default page title
app.locals.pageTitle = 'Express Spotify Lab - Julia Pisarek';

// Registration partials
hbs.registerPartials(__dirname + '/views/partials');

// Our routes go here:
app.get('/', (request, response) => {
  response.render('artist-search', {
    // pageStyles: [{ style: '/styles/home.css' }]
  });
});

// get artist
app.get('/artist-search', (request, response) => {
  const name = request.query.name;

  spotifyApi
    .searchArtists(name)
    .then((data) => {
      console.log('The received data from the API: ', data.body.artists.items);
      response.render('artist-search-results', {
        artists: data.body.artists.items
      });
    })
    .catch((err) =>
      console.log('The error while searching artists occurred: ', err)
    );
});

// get artist albums
app.get('/albums/:artistId', (request, response, next) => {
  const album = request.query.artistId;

  spotifyApi
    .getArtistAlbum(album)
    .then((data) => {
      console.log(
        'The received data from the API: ',
        data.body.artists.items.albumId
      );
      response.render(
        'albums',
        {
          albums: data.body.artists.items.albumId
        }
        // pageStyles: [{ style: '/styles/albums.css' }],
      );
    })
    .catch((err) =>
      console.log('The error while searching albums occurred: ', err)
    );
});

app.listen(3000, () =>
  console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊')
);
