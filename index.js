const core = require('@actions/core');
const github = require('@actions/github');
import {get} from 'lodash'

try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    // Get the JSON webhook payload for the event that triggered the workflow
    const payload = JSON.stringify(github.context.payload, undefined, 2)
    const whoCommited = get(payload, "commits")
    console.log(`There where: ${whoCommited} commits`);
    console.log(payload)
} catch (error) {
    core.setFailed(error.message);
}