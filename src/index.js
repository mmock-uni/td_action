const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob');
const fs = require('fs');
import {get} from 'lodash'


const findError = (data) => {
    let possibleError = []
    // eslint-disable-next-line
    data.map((single, i) => {
        if(single.match(/switch\s*\(\s*.*\s*\)/g)) { //detects all switches
            possibleError.push((i + 1)) // array starts from 0 but the line count starts from 1
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
    console.log(errors)
    return errors
}


const find = async () => {
    const globber = await glob.create('*')

    let errorsGlobal = [] //all errors over all files

    for await (const filePath of globber.globGenerator()) {
        await fs.readFile(filePath, 'utf8', (err, data) => {
            if(
                !filePath.toString().includes('node_modules') === true &&
                !filePath.toString().includes('.git') === true &&
                !filePath.toString().includes('.idea') === true

            )
                console.log(filePath)

            // if(data !== undefined) {
            //     const changedData = data.toString().replace('"', '').split('\n')
            //     const errors = findError(changedData)
            //     if (errors.length > 0) {
            //         errorsGlobal.push({
            //             filePath,
            //             errors
            //         })
            //     }
            //     console.log(errorsGlobal)
            //
            // }

        })


    }

    console.log(errorsGlobal)
}

try {

    find()


} catch (error) {
    core.setFailed(error.message);
}