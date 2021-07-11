const core = require('@actions/core');
const github = require('@actions/github');
const glob = require('@actions/glob');
const fs = require('fs');
import {get} from 'lodash'

let functionList = ['strcpy', "strcpyA", "strcpyW", "wcscpy", "_tcscpy", "_mbscpy", "StrCpy", "StrCpyA", "StrCpyW", "lstrcpy", "lstrcpyA", "lstrcpyW", "_tccpy", "_mbccpy", "_ftcscpy", "strcpyA", "strcpyW", "wcscpy", "_tcscpy", "_mbscpy", "StrCpy", "StrCpyA", "StrCpyW", "lstrcpy", "lstrcpyA", "lstrcpyW", "_tccpy", "_mbccpy", "_ftcscpy", "strcat", "strcatA", "strcatW", "wcscat", "_tcscat", "_mbscat", "StrCat", "StrCatA", "StrCatW", "lstrcat", "lstrcatA", "lstrcatW", "StrCatBuff", "StrCatBuffA", "StrCatBuffW", "StrCatChainW", "_tccat", "_mbccat", "_ftcscat", "sprintfW", "sprintfA", "wsprintf", "wsprintfW", "wsprintfA", "sprintf", "swprintf", "_stprintf", "wvsprintf", "wvsprintfA", "wvsprintfW", "vsprintf", "_vstprintf", "vswprintf", "strncpy", "wcsncpy", "_tcsncpy", "_mbsncpy", "_mbsnbcpy", "StrCpyN", "StrCpyNA", "StrCpyNW", "StrNCpy", "strcpynA", "StrNCpyA", "StrNCpyW", "lstrcpyn", "lstrcpynA", "lstrcpynW", "strncat", "wcsncat", "_tcsncat", "_mbsncat", "_mbsnbcat", "StrCatN", "StrCatNA", "StrCatNW", "StrNCat", "StrNCatA", "StrNCatW", "lstrncat", "lstrcatnA", "lstrcatnW", "lstrcatn", "gets", "_getts", "_gettws", "IsBadWritePtr", "IsBadHugeWritePtr", "IsBadReadPtr", "IsBadHugeReadPtr", "IsBadCodePtr", "IsBadStringPtr", "memcpy", "RtlCopyMemory", "CopyMemory", "wmemcpy", "lstrlen"
    , "wnsprintf", "wnsprintfA", "wnsprintfW", "_snwprintf", "_snprintf", "_sntprintf", "_vsnprintf", "vsnprintf", "_vsnwprintf", "_vsntprintf", "wvnsprintf", "wvnsprintfA", "wvnsprintfW", "strtok", "_tcstok", "wcstok", "_mbstok", "makepath", "_tmakepath", "_makepath", "_wmakepath", "_splitpath", "_tsplitpath", "_wsplitpath", "scanf", "wscanf", "_tscanf", "sscanf", "swscanf", "_stscanf", "snscanf", "snwscanf", "_sntscanf", "_itoa", "_itow", "_i64toa", "_i64tow", "_ui64toa", "_ui64tot", "_ui64tow", "_ultoa", "_ultot", "_ultow", "CharToOem", "CharToOemA", "CharToOemW", "OemToChar", "OemToCharA", "OemToCharW", "CharToOemBuffA", "CharToOemBuffW", "alloca", "_alloca", "ChangeWindowMessageFilter"]


const findFunctions = (data, functionList) => {
    let result = [] //{line: number, functionName: string}
    let regexp = /[A-Za-z0-9_]/gi;
    for (let i = 0; i < data.length; ++i) {
        for (let j = 0; j < functionList.length; j++) {
            let regex = new RegExp(`${functionList[j]}\\s*\\(.*`, 'g')
            //matches the regex to a single data line
            if (data[i].match(regex)) {
                //checks of the capiatlization is also the as in the function from the list
                //this step is mandatory to reject false positives like StrCat instead of save_StrCat
                let indexBefore = data[i][regex.exec(data[i]).index - 1]
                if((indexBefore !== undefined && !indexBefore.match(regexp)) || indexBefore === undefined){ //indexBefore can also be undefined since there dose not needs to be a character before the regex
                    result.push({
                        lineNumber: i + 1, //because we start to count from 1 and not 0 in file lines
                        functionName: functionList[j]
                    })
                }
            }
        }
    }
    return result
}


const find = async () => {
    const globber = await glob.create('*')

    let errorsGlobal = [] //all errors over all files

    for await (const filePath of globber.globGenerator()) {
        let path = filePath
        let ending = path.toString().split(".").pop()
        if (ending === "c" || ending === "h" || ending === "o") {
            //open file and run checker

            await fs.readFile(filePath, 'utf8', (err, data) => {
                if(data !== undefined) {
                    const changedData = data.toString().replace('"', '').split('\n')
                    const errors = findFunctions(changedData, functionList)
                    if (errors.length > 0) {
                        errorsGlobal.push(JSON.stringify({
                            filePath,
                            errors
                        }))
                        core.setFailed(`weakness found in file ${filePath}, following lines are affected: ${JSON.stringify(errors)}`)
                    }
                } else {
                    console.log('data was undefined')
                    console.log(filePath)
                }

            })
        }
    }
}
try{
    find()
} catch (err){
    core.setFailed('some strange error occurred, please re-run it!')
}