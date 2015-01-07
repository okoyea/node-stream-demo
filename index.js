var server = require("./server");
var stream = require("./stream");

server.start(stream.streamHandler);