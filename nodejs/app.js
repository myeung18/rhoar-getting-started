'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const jsyaml = require('js-yaml');

const app = express();

// Health Check Middleware
const probe = require('kube-probe');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

let configMap;
let message = "Default hard-coded greeting: Hello-hey, %s!";

app.use('/api/greeting', (request, response) => {
  const name = (request.query && request.query.name) ? request.query.name : 'World';
  return response.send({content: message.replace(/%s/g, name)});
});

// set health check
probe(app);

// TODO: Periodic check for config map update
setInterval(() => {
  displayMessage().then((config) => {
    if (!config) {
      message = null;
      return;
    }

    if (JSON.stringify(config) !== JSON.stringify(configMap)) {
      configMap = config;
      message = config.message;
    }
  }).catch((err) => {
    console.log("error: ", err);
  });
}, 2000);

// TODO: Retrieve ConfigMap
// Find the Config Map

//const openshiftRestClient = require('openshift-rest-client').OpenshiftClient;
//const config = require('openshift-rest-client').config;
//const customConfig = config.getInCluster();
//
//async function retrieveConfigMap() {
//  const client = await openshiftRestClient({config: customConfig});
//  const configmap = await client.api.v1.namespaces('example').configmaps('app-config').get();
//  return jsyaml.safeLoad(configmap.body.data['app-config.yml']);
//}

async function displayMessage() {
    console.log("hello fron concole.")
}


module.exports = app;
module.exports = app;
