const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob')
import {get} from 'lodash'

const find = async (globber)=> {
    for await (const file of globber.globGenerator()) {
        console.log(file)
    }
}

try {
    // `who-to-greet` input defined in action metadata file
    const nameToGreet = core.getInput('who-to-greet');
    console.log(`Hello ${nameToGreet}!`);
    const time = (new Date()).toTimeString();
    core.setOutput("time", time);
    const globOptions = {
        followSymbolicLinks: core.getInput('follow-symbolic-links').toUpper() !== 'FALSE'
    }
    const globber = glob.create('*', globOptions)
    find(globber)
} catch (error) {
    core.setFailed(error.message);
}