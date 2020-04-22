let http      = require('http');
let express   = require('express');
let fs        = require('fs');
let mustache  = require('mustache');

let app       = express();
let server    = http.createServer(app);
let io        = require('socket.io')(server);

let opts = {
	port: process.env.PORT || 1947,
	revealDir: process.cwd(),
	pluginDir: __dirname
};

io.on( 'connection', socket => {

	socket.on( 'new-subscriber', data => {
		socket.broadcast.emit( 'new-subscriber', data );
	});

	socket.on( 'statechanged', data => {
		delete data.state.overview;
		socket.broadcast.emit( 'statechanged', data );
	});

	socket.on( 'statechanged-speaker', data => {
		delete data.state.overview;
		socket.broadcast.emit( 'statechanged-speaker', data );
	});

});

app.use( express.static( opts.revealDir ) );

app.get('/', ( req, res ) => {

	res.writeHead( 200, { 'Content-Type': 'text/html' } );
	fs.createReadStream( opts.revealDir + '/index.html' ).pipe( res );

});

app.get( '/notes/:socketId', ( req, res ) => {

	fs.readFile( opts.pluginDir + '/index.html', ( err, data ) => {
		res.send( mustache.render( data.toString(), {
			socketId : req.params.socketId
		}));
	});

});

// Actually listen
server.listen( opts.port || null );

let brown = '\033[33m',
	green = '\033[32m',
	reset = '\033[0m';

let slidesLocation = 'http://localhost' + ( opts.port ? ( ':' + opts.port ) : '' );

console.log( brown + 'reveal.js - Speaker Notes' + reset );
console.log( '1. Open the slides at ' + green + slidesLocation + reset );
console.log( '2. Click on the link in your JS console to go to the notes page' );
console.log( '3. Advance through your slides and your notes will advance automatically' );
