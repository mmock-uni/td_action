const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob');
const fs = require('fs');
import {get} from 'lodash'


const findError = (data) => {
    console.log("looking for errors")
    let possibleError = []
    // eslint-disable-next-line
    data.map((single, i) => {
        console.log(single)
        if(single.match(/switch\s*\(\s*.*\s*\)/g)) { //detects all switches
            possibleError.push((i + 1)) // array starts from 0 but the line count starts from 1
            console.log(possibleError)
        }
    })

    let errors = []
    if(possibleError.length > 0){
        for (let i = 0 ; i < possibleError.length ; ++i) {
            let index = possibleError[i] - 1
            let indexNext = i < possibleError.length - 1 ? possibleError[i + 1] - 1 + 1 : data.length - 1
            let join = data
                .slice(index, indexNext)
                .join('')
            if (join.match(/(switch\s*\(\s*.*\s*\)\s*{.*default:.*(\s*.*{(\s*|.*){(.*)}(\s*|.*)})?})/g) === null) {
                //wrong switch found
                errors.push('In the following line (' + possibleError[i] + ') is a wrongly coded switch statement! default value is missing!')
            }
        }
    }
    return errors
}


const find = async () => {
    const globber = await glob.create('src/test.js')

    for await (const filePath of globber.globGenerator()) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            console.log('------------')
            console.log(filePath)
            const changedData = data.replace('"', '').split(/\\n/)
            const result = findError(changedData)
            console.log(result)
            console.log(result.length)
        })
    }
}

try {

    find().then(() => {
            console.log('all done')
        }
    )


} catch (error) {
    core.setFailed(error.message);
}