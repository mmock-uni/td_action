const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob')
import {get} from 'lodash'

const find = async () => {
    console.log("find start")
    const globber = await glob.create('**')
    console.log(globber)

    console.log("glob created")

    for await (const file of globber.globGenerator()) {
        console.log(file)
    }
    console.log('find done')
}

try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);

    find().then(() => {
            console.log('all done')
        }
    )


} catch (error) {
    core.setFailed(error.message);
}