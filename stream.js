var
http = require("http"),
EventEmitter = require("events").EventEmitter;

function streamHandler(req, res) {
]  var emitter  = new EventEmitter();

  function listener(timeline) {
    res.statusCode = 200;
    res.write(JSON.stringify(timeline));
    res.end();
    clearTimeout(timeout);
  }

  var timeout = setTimeout(function(){
    res.setHeader('Content-Type', 'text/plain');
    res.write(JSON.stringify([]));
    res.end();
    emitter.removeListener('timeline',listener);
  },10000);

  emitter.addListener('timeline',listener);

  function get_timeline() {

    var request = http.request({
      method:'GET',
      port:80,
      path:'',
      hostname:''
    });

    request.addListener( 'response', function(response) {
      var body = '';

      response.addListener( 'data', function(data) {
        body += data;
      });

      response.addListener( 'end', function() {
        var timeline = JSON.parse(body);

        if( timeline.length > 0) {
          emitter.emit('timeline', timeline);
        }
      });
    });

    request.end();
  }

  setInterval( get_timeline, 5000 );
}

exports.streamHandler = streamHandler;

