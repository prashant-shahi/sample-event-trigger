const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');
const fetch = require('node-fetch');

console.log(config);

const app = express();

function sleep(ms) { 
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setReadyStatus(event, callback) {
  if (event.op === "INSERT") {
      const task_id = event.data.new.id;
      const responseBody = `New long running task #${task_id} inserted, with ready status: ${event.data.new.ready_status}`;
      console.log(responseBody);

      // business logic - long running tasks
      await sleep(10);
      const data = "some data"

      const variables = {
        "id": task_id,
        "ready_status": true,
        "data": data
      }
      const options = {
        method: "POST",
        headers: config.headers,
        body: JSON.stringify({
          query: config.query,
          variables
        })
      }

      fetch(config.url, options).then(response => {
        if (response.status && response.status != 200) {
          const error = new Error(`received non-200 http status code while setting ready status for task #${task_id}`);
          console.error(error.message);
          return callback(error);
        }
        return response.json();
      }).then(body => {
          const taskObject = body.data.update_long_running_tasks_by_pk;
          console.log("task object: ", taskObject);
          return callback(null, body);
      });
  }
}

app.use(bodyParser.json());

app.post('/', function (req, res) {
    try{
        setReadyStatus(req.body.event, function(err, data) {
          return res.json(data);
        });
    } catch(e) {
        console.log(e);
        res.status(500).json(e.toString());
    }
});

app.get('/', function (req, res) {
  res.send('Up');
});

var server = app.listen(process.env.PORT, function () {
    console.log("server listening");
});
