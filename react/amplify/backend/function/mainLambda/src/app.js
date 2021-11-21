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


app.get('/game', function(req, res) {
  axios.get('https://balldontlie.io/api/v1/games?seasons[]=2021&start_date=2021-10-19&end_date=2021-10-19&page=1')
  .then(response => {
    const params ={
        Bucket : bucketName,
        Key : '2021schedule.json',
        Body: JSON.stringify(response.data)
    };
    s3.putObject(params, function (err, data) {
        if(err){
            console.log(`Error creating file ${err.stack}`);
            res.json({error: `error ferch form api: ${err}`});
        } else {         
            console.log('File Created');
            res.json({
              data: data,
              success: 'successfully fetched',
              url: req.url,
            })
        }
    });
  })
  .catch(err => res.json({error: `error ferch form api: ${err}`}));
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
