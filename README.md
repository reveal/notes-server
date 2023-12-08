# reveal.js Speaker Notes Server

reveal.js includes a speaker notes plugin which shows your speaker notes and an upcoming slide preview in a new browser window. However in some cases it can be desirable to run notes on a separate device or browser from the one you're presenting with. That's where this Node.js-based speaker notes plugin comes in.

## Getting Started

1. Navigate to your reveal.js folder
1. `npm install reveal-notes-server`
1. `node node_modules/reveal-notes-server`
1. Include the following scripts in your presentation, after `Reveal.initialize`:  
    
    ```html
    <script src="socket.io/socket.io.js"></script>
    <script src="node_modules/reveal-notes-server/client.js"></script>
   <script>
    startClient({
        enableQR: true // set to false if you wish to disable the QR code generation
    })
   </script>
    ```
   
## Cli Options

Here is the list of command line arguments you can use when running the notes server.

   ```
   hostname: argv.hostname,
   port: argv.port || 1947,
   revealDir: argv.revealDir || process.cwd(),
   presentationDir: argv.presentationDir || '.',
   presentationIndex: argv.presentationIndex || '/index.html',
   pluginDir: __dirname
   ```

Example shell script to start the server on your Wi-Fi IP:

```shell
# Replace "wlp3s0" wit your Wi-Fi adapter's name
address=$(ip addr show wlp3s0 | grep 'inet ' | sed -E 's/.*inet (([0-9]{0,3}\.?){4}).*/\1/g')

npx reveal-notes-server \
   --presentationDir=./ \
   --presentationIndex=/my-presentation.adoc \
   --hostname="$address"
```
