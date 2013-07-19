// Generated by CoffeeScript 1.6.2
var Event, Que, app, config, express, http, mail, models, mongoStore, mongoose, nodemailer, path, routes, smtpTransport;

express = require('express');

mongoose = require('mongoose');

mongoStore = require('connect-mongodb');

routes = require('./routes');

http = require('http');

path = require('path');

models = require('./models');

config = require('./config');

nodemailer = require("nodemailer");

app = express();

Event = null;

Que = null;

app.configure(function() {
  app.set('port', process.env.PORT || config.server.port);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    store: mongoStore(app.set('db-uri')),
    secret: 'topsecret'
  }));
  app.use(express.logger({
    format: '\x1b[1m:method\x1b[0m \x1b[33m:url\x1b[0m :response-time ms'
  }));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express["static"](path.join(__dirname, 'public')));
  app.use(function(err, req, res, next) {
    console.log(err);
    return res.send(404, "FUCK 4-0-4");
  });
  return app.use(function(req, res) {
    console.log("Page not found 404");
    return res.send(404, "FUCK 4-0-4");
  });
});

app.configure('development', function() {
  app.set('db-uri', config.db.URL);
  app.use(express.errorHandler({
    dumpExceptions: true
  }));
  return app.set('view options', {
    pretty: true
  });
});

app.configure('test', function() {
  app.set('db-uri', config.db.URL);
  return app.set('view options', {
    pretty: true
  });
});

app.configure('production', function() {
  return app.set('db-uri', config.db.URL);
});

models.defineModels(mongoose, function() {
  var db;

  app.Event = Event = mongoose.model('Event');
  app.Que = Que = mongoose.model('Que');
  return db = mongoose.connect(app.set('db-uri'));
});

app.get('/', routes.index);

app.get('/partials/:name', routes.partials);

app.get('/api/mail', function(req, res) {
  var mailOptions, mailto;

  mailOptions = {
    from: "So You Gotta Go <soYouGottaGo@gottaGo.medu.com>",
    to: "",
    subject: "A Bathroom on the 2nd is available!!",
    text: "A Bathroom on the 2nd is available!! "
  };
  mailto = [];
  console.log(req, res);
  Que.find({
    'floor': 2,
    'status': 1
  }, {}, {
    sort: {
      'time': -1
    }
  }).exec(function(err, que) {
    var person, _i, _len;

    if (err != null) {
      return false;
    }
    console.log(que);
    for (_i = 0, _len = que.length; _i < _len; _i++) {
      person = que[_i];
      mailto.push("<" + person.contact + ">");
    }
    mailOptions.to = mailto.join(",");
    mailOptions.text = "A Bathroom on the 2nd is available!! \n ";
    if (mailto.length > 1) {
      mailOption.text += "This message was sent to " + mailto.length + " humans. SO HURRY!";
    }
    return mail(mailOptions, function(err) {});
  });
  res.statusCode = 200;
  return res.send(statusArray);
});

app.post('/api/event', function(req, res) {
  var event, mailOptions, mailto, params;

  params = req.body;
  mailOptions = {
    from: "So You Gotta Go <soYouGottaGo@gottaGo.medu.com>",
    to: "",
    subject: "A Bathroom on the " + params.floor + "nd is available!!",
    text: "A Bathroom on the " + params.floor + "nd is available!! "
  };
  mailto = [];
  event = new Event({
    'floor': params.floor,
    'room': params.room,
    'status': params.status
  });
  return event.save(function(err) {
    if (err != null) {
      res.statusCode = 400;
      return res.send("Error");
    } else {
      res.statusCode = 200;
      res.send("OK");
      console.log("1event.status " + (parseInt(event.status) === 0 || event.status === "0"));
      if (parseInt(event.status) === 0 || event.status === "0") {
        console.log("2event.status " + event.status);
        return Que.find({
          'floor': event.floor,
          'status': 1
        }, {}, {
          sort: {
            'time': -1
          }
        }).exec(function(err, que) {
          var person, _i, _len;

          if (err != null) {
            console.log("err " + err);
            return false;
          }
          console.log("que " + que);
          for (_i = 0, _len = que.length; _i < _len; _i++) {
            person = que[_i];
            mailto.push("<" + person.contact + ">");
          }
          mailOptions.to = mailto.join(",");
          mailOptions.text = "A Bathroom on the " + event.floor + "nd is available!! \n ";
          console.log("mailOptions " + mailOptions);
          if (mailto.length > 1) {
            mailOption.text += "This message was sent to " + mailto.length + " humans. SO HURRY!";
          }
          return mail(mailOptions, function(err) {});
        }).remove();
      }
    }
  });
});

smtpTransport = nodemailer.createTransport("SMTP", {
  service: "medu",
  host: "mail1.medu.com"
});

mail = function(mailOptions, callback) {
  return smtpTransport.sendMail(mailOptions, function(error, response) {
    if (error) {
      console.log(error);
      callback(error);
    } else {
      console.log("Message sent: " + response.message);
      callback();
    }
    return smtpTransport.close();
  });
};

app.get('/api/status', function(req, res) {
  var floor, floorArray, index, statusArray, _i, _len, _ref, _results;

  statusArray = [];
  _ref = config.floors;
  _results = [];
  for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
    floor = _ref[index];
    floorArray = [];
    Event.findOne({
      'floor': floor,
      'room': 'a'
    }, {}, {
      sort: {
        'time': -1
      }
    }).exec(function(err, event) {
      if (err != null) {
        res.statusCode = 400;
        return res.send("Error");
      }
      return floorArray.push(event);
    });
    _results.push(Event.findOne({
      'floor': floor,
      'room': 'b'
    }, {}, {
      sort: {
        'time': -1
      }
    }).exec(function(err, event) {
      console.log(event);
      if (err != null) {
        res.statusCode = 400;
        return res.send("Error");
      }
      floorArray.push(event);
      statusArray.push(floorArray);
      if (index === config.floors.length) {
        res.statusCode = 200;
        return res.send(statusArray);
      }
    }));
  }
  return _results;
});

app.get('/api/que/:floor', function(req, res) {
  return Que.find({
    'floor': req.params.floor,
    'status': 1
  }, {}, {
    sort: {
      'time': -1
    }
  }).exec(function(err, que) {
    if (err != null) {
      res.statusCode = 400;
      return res.send("Error");
    }
    res.statusCode = 200;
    return res.send(que);
  });
});

app.post('/api/que/:floor', function(req, res) {
  var floor, params, que;

  params = req.body;
  floor = req.params.floor;
  que = new Que({
    'floor': floor,
    'status': 1,
    'contact': params.contact
  });
  return que.validate(function(validationErr) {
    return que.save(function(err) {
      if (err != null) {
        res.statusCode = 400;
        return res.send({
          message: "Invalid Email"
        });
      } else {
        res.statusCode = 200;
        return res.send("OK");
      }
    });
  });
});

app.get('(!public)*', routes.index);

http.createServer(app).listen(app.get('port'), function() {
  return console.log("Express server listening on port " + app.get('port'));
});
