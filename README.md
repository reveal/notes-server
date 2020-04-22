# reveal.js Speaker Notes Server

reveal.js includes a speaker notes plugin which opens your notes in a new browser window. However in some cases it can be desirable to run notes on a separate device from the one you're presenting on. That's where this Node.js-based speaker notes plugin comes in.

## Getting Started

1. Navigate to your reveal.js folder
1. `npm install reveal-multiplex`
1. `node node_modules/reveal-notes-server`
1. Include the following scripts in your presentation, after `Reveal.initialize`:

```html
<script src="socket.io/socket.io.js"></script>
<script src="node_modules/reveal-notes-server/client.js"></script>
```