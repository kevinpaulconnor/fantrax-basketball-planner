/* Amplify Params - DO NOT EDIT
	AUTH_FTRAXBBALLPLANNER45410204_USERPOOLID
	ENV
	REGION
	STORAGE_S3DATA_BUCKETNAME
Amplify Params - DO NOT EDIT */
var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
var axios = require('axios')
var AWS = require('aws-sdk')
const bucketName = process.env.STORAGE_S3DATA_BUCKETNAME
var s3 = new AWS.S3()

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});

app.get('/create-schedule', async function(req, res) {
  /* Pull complete NBA 2021-22 schedule from BDL and write to S3 as json */
  async function getSchedulePage(pageNum = 1) {
    const url = `https://balldontlie.io/api/v1/games?seasons[]=2021&start_date=2021-10-19&end_date=2022-04-10&page=${pageNum}`;
    const response = await axios.get(url);
    return response.data;
  }

  function filterGames(newGames) {
    let ret = [];
    newGames.forEach(game => {
      let newGame = { ...game };
      let homeTeamId = game.home_team.id;
      let awayTeamId = game.visitor_team.id;
      delete newGame.period;
      delete newGame.postseason;
      delete newGame.season;
      delete newGame.time;
      newGame.home_team = homeTeamId;
      newGame.visitor_team = awayTeamId;
      ret.push(newGame);
    });
    return ret;
  }

  function write(item) {
    const params ={ 
      Bucket : bucketName,
      Key : '2021schedule.json',
      Body: JSON.stringify(item),
    };
    s3.putObject(params, function (err, data) {
      if(err){
          console.log(`Error creating file ${err.stack}`);
          res.json({error: `error writing file: ${err}`});
      } else {         
          console.log('Schedule File Created');
          res.json({
            success: 'Schedule File Created',
            url: req.url,
          })
      }
    });
  }

  let bigGamesData = [];

  let result = await getSchedulePage(1);
  let nextPage = result.meta.next_page;
  bigGamesData.push(filterGames(result.data));
  while (nextPage !== null) {
    result = await getSchedulePage(nextPage);
    nextPage = result.meta.next_page;
    bigGamesData.push(filterGames(result.data));
  }
  write(bigGamesData);

});

// /**********************
//  * Example get method *
//  **********************/

// app.get('/item', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

// app.get('/item/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

// /****************************
// * Example post method *
// ****************************/

// app.post('/item', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// app.post('/item/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example put method *
// ****************************/

// app.put('/item', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// app.put('/item/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example delete method *
// ****************************/

// app.delete('/item', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

// app.delete('/item/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

// app.listen(3000, function() {
//     console.log("App started")
// });

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
