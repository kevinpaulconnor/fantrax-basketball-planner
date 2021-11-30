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
var { matchupDates } = require('./constants')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

function write(item, filename) {
  const params ={ 
    Bucket : bucketName,
    Key : filename,
    Body: JSON.stringify(item),
  };
  return s3.putObject(params, () => {}).promise();
}

function matchupFilename(id) {
  return `schedule-matchup-${id}.json`;
}

async function read(filename) {
  try {
    const params = {
      Bucket: bucketName,
      Key: filename
    }
    const data = await s3.getObject(params).promise();

    return JSON.parse(data.Body);
  } catch (e) {
    if (e.code === "NoSuchKey") {
      return e.code;
    }
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
}

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

  let bigGamesData = [];
  let result = await getSchedulePage(1);
  let nextPage = result.meta.next_page;
  bigGamesData.push(filterGames(result.data));
  while (nextPage !== null) {
    result = await getSchedulePage(nextPage);
    nextPage = result.meta.next_page;
    bigGamesData.push(filterGames(result.data));
  }
  bigGamesData = bigGamesData.flat();
  
  let matchupCount = 1;
  let gamesThisMatchup;
  let matchupPromises = [];

  //write schedule to each matchup
  matchupDates.forEach(async matchup => {
    gamesThisMatchup = bigGamesData.filter(game =>
      game.date >= matchup.start && game.date <= matchup.end
    );
    matchupPromises.push(write(gamesThisMatchup, matchupFilename(matchupCount)));
    matchupCount += 1;
  });

  await Promise.all(matchupPromises).then(() => 
    res.json({
      success: 'process finished',
      url: req.url,
    })
  );

});

app.get('/matchup-dates', function(req, res) {
  res.json({
    success: 'get call succeed!', 
    data: matchupDates,
    url: req.url
  });
});

app.get('/matchup/:id', async function(req, res) {
  let matchupID;
  if (req.params.id === 'current') {
    let now = new Date().toISOString();
    matchupId = matchupDates.findIndex(element => element.end > now)
  } else {
    matchupId = req.params.id;
  }

  const data = await read(matchupFilename(matchupId));
  const ret = {
    games: data,
    id: matchupId,
  }
  res.json({
    success: 'get call succeed!', 
    data: ret,
    url: req.url
  });
});

app.get('/teams', async function(req, res) {
  const filename = 'nbateams.json';
  let data = await read(filename);
  if (data === "NoSuchKey") {
    const url = 'https://www.balldontlie.io/api/v1/teams';
    const response = await axios.get(url);
    data = response.data.data;
    await write(data, filename);
  }
  res.json({
    success: 'get call succeed!', 
    data: data,
    url: req.url
  });
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
