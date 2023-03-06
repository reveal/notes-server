let http      = require('http');
let express   = require('express');
let fs        = require('fs');
let mustache  = require('mustache');

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const argv = yargs(hideBin(process.argv)).argv

let app       = express();
let server    = http.createServer(app);
let io        = require('socket.io')(server);

let opts = {
	hostname: argv.hostname,
	port: argv.port || 1947,
	revealDir: argv.revealDir || process.cwd(),
	presentationDir: argv.presentationDir || '.',
	presentationIndex: argv.presentationIndex || '/index.html',
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
app.use( express.static( opts.presentationDir ) );

app.get('/', ( req, res ) => {
	res.writeHead( 200, { 'Content-Type': 'text/html' } );
	fs.createReadStream( opts.presentationDir + opts.presentationIndex ).pipe( res );
});

app.get( '/notes/:socketId', ( req, res ) => {

	fs.readFile( opts.pluginDir + '/index.html', ( err, data ) => {
		res.send( mustache.render( data.toString(), {
			socketId : req.params.socketId
		}));
	});

});

// Actually listen
if(opts.hostname) {
	server.listen( opts.port || null, opts.hostname);
} else {
	server.listen( opts.port || null);
}

let brown = '\033[33m',
	green = '\033[32m',
	reset = '\033[0m';

let slidesLocation = 'http://' + (opts.hostname ? opts.hostname : 'localhost') + ( opts.port ? ( ':' + opts.port ) : '' );

console.log( brown + 'reveal.js - Speaker Notes' + reset );
console.log( '1. Open the slides at ' + green + slidesLocation + reset );
console.log( '2. Click on the link in your JS console to go to the notes page' );
console.log( '3. Advance through your slides and your notes will advance automatically' );
