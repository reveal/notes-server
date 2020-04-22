# reveal.js Speaker Notes Server

In some cases it can be desirable to run notes on a separate device from the one you're presenting on. The Node.js-based notes plugin lets you do this using the same note definitions as its client side counterpart. Include the required scripts by adding the following dependencies:

```javascript
Reveal.initialize({
  dependencies: [
    { src: 'socket.io/socket.io.js', async: true },
    { src: 'plugin/notes-server/client.js', async: true }
  ]
});
```

Then:

1. Install [Node.js](http://nodejs.org/) (9.0.0 or later)
2. Run `npm install`
3. Run `node plugin/notes-server`