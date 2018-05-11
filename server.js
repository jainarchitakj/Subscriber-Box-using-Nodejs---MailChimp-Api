const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');
const async = require('async');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');



const app = express();

//
app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public' ));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(session({
  resave: true,
  saveUinitialiazed: true,
  secret: "yahoooooooooooo",
  store: new MongoStore({ url: 'mongodb://baiku:baiku@ds014658.mlab.com:14658/baikubikes'})
}));
app.use(flash());


app.route('/')
  .get((req, res, next) => {
    res.render('main/home', { message: req.flash('success') });
  })
  .post((req, res, next) => {
    request({
      url: 'https://us18.api.mailchimp.com/3.0/lists/8ae352dcc6/members',
      method: 'POST',
      headers: {
        'Authorization': 'randomUser 0e07eb6234b34b3e72106af40afe5bed-us18',
        'Content-Type': 'application/json'
      },
      json: {
        'email_address': req.body.email,
        'status': 'subscribed'
      }
    }, function(err, response, body) {
      if (err) {
        console.log(err);
      } else {
        req.flash('success', 'You have submitted your email');
        res.redirect('/');
      }
    });
  });

// Session = memory store, if you want to perserve the data for future use
// Data Store = mongodb, redis

app.listen(3030, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Running on Port 3030");
  }
});
