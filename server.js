var
sys = require("sys"),
http = require("http"),
url = require("url"),
path = require("path"),
fs = require("fs"),
events = require("events");

function start(stream) {

  //helper to handle file verification
  function loadFile(uri, res) {
    var filename = path.join(process.cwd(), uri);
    fs.exists(filename, function(exists) {

      //non-existing files; send the contents with a 404 not found header
      if(!exists) {
        res.writeHeader(404, {"Content-Type": "text/plain"});
        res.write("404 Not Found\n");
        res.end();
        return;
      }

      fs.readFile(filename, "binary", function(err, file) {
        //in the case of an unexpected condition, send a 500 header
        if(err) {
          res.writeHeader(500, {"Content-Type": "text/plain"});
          res.write(err + "\n");
          res.end();
          return;
        }

        //send the contents with a 200 ok header
        res.writeHeader(200);
        res.write(file, "binary");
        res.end();
      });
    });
  }

  //helper to handle HTTP requests
  function onRequest(req, res) {
    var pathname = url.parse(req.url).pathname;

    if(pathname === '/stream') {
      stream(req, res);
    } else {
      loadFile(pathname, res);
    }
  }

  //create server; listen for an HTTP request on port 3000
  http.createServer(onRequest).listen(3000);

  //log message to terminal window
  sys.puts('Server Running at http://localhost:3000/');
}

exports.start = start;
