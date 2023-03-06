function generateQR(location) {
	var div = document.createElement("div");
	div.id="qr";
	div.style = "position: absolute; top: 0px; display: grid; background-color: white; z-index: 999; padding: 10px;";
	div.onclick = function () {
		hideQr();
	}

	var spanTop = document.createElement("span");
	spanTop.textContent = "Scan to open notes."

	var spanBot = document.createElement("span");
	spanBot.textContent = "Click to close."

	var img = document.createElement("img");
	img.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + encodeURIComponent(location);
	img.style = "padding: 5px";

	div.appendChild(spanTop);
	div.appendChild(img);
	div.appendChild(spanBot);

	document.body.appendChild(div);
}

function hideQr() {
	document.getElementById("qr").style.display = "none";
}

(function() {

	// don't emit events from inside the previews themselves
	if( window.location.search.match( /receiver/gi ) ) { return; }

	var socket = io.connect( window.location.origin ),
		socketId = Math.random().toString().slice( 2 );

	let location = window.location.origin + '/notes/' + socketId;
	console.log( 'View slide notes at ' + location);
	generateQR(location);

	window.open( window.location.origin + '/notes/' + socketId, 'notes-' + socketId );

	/**
	 * Posts the current slide data to the notes window
	 */
	function post() {

		var slideElement = Reveal.getCurrentSlide(),
			notesElement = slideElement.querySelector( 'aside.notes' );

		var messageData = {
			notes: '',
			markdown: false,
			socketId: socketId,
			state: Reveal.getState()
		};

		// Look for notes defined in a slide attribute
		if( slideElement.hasAttribute( 'data-notes' ) ) {
			messageData.notes = slideElement.getAttribute( 'data-notes' );
		}

		// Look for notes defined in an aside element
		if( notesElement ) {
			messageData.notes = notesElement.innerHTML;
			messageData.markdown = typeof notesElement.getAttribute( 'data-markdown' ) === 'string';
		}

		socket.emit( 'statechanged', messageData );

	}

	// When a new notes window connects, post our current state
	socket.on( 'new-subscriber', function( data ) {
		hideQr();
		post();
	} );

	// When the state changes from inside of the speaker view
	socket.on( 'statechanged-speaker', function( data ) {
		Reveal.setState( data.state );
	} );

	var interval = setInterval(function() {
		if (typeof Reveal == 'undefined') return;
		clearInterval(interval);

		Reveal.initialize().then( () => {
			// reveal.js is ready
			// Monitor events that trigger a change in state
			Reveal.on( 'slidechanged', post );
			Reveal.on( 'fragmentshown', post );
			Reveal.on( 'fragmenthidden', post );
			Reveal.on( 'overviewhidden', post );
			Reveal.on( 'overviewshown', post );
			Reveal.on( 'paused', post );
			Reveal.on( 'resumed', post );

			// Post the initial state
			post();
		} )
	}, 10);
}());
