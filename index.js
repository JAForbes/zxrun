#! /usr/bin/env node
import * as P from 'path'
import * as FS from 'fs'
import minimist from 'minimist'
import {} from 'zx'

const argv = minimist(process.argv.slice(2))

async function main(){
    const entryFilePaths = [P.resolve(process.cwd(), 'run.js'), P.resolve(process.cwd(), 'run.mjs')]

    
    let found, module;
    for( let file of entryFilePaths ) {
        try {
            await FS.promises.stat(file)
            found = file
            break;
        } catch (e) {}
    }

    if (!found) {
        console.error('Could not find run.js or run.mjs in the current working directory.')
        console.error('Run files must be run from the root of your project.')
        process.exit(1)
    }

    try {
        module = await import(found)
    } catch (e) {
        console.error('Run file found but an error occured while importing it')
        console.error(e.stack)
        process.exit(1)
    }

    const functions = Object.keys(module).filter( k => typeof module[k] == 'function' )

    if( !functions.length ) {
        console.error('Run file imported successfully but there were no exported functions')
        console.error('In order to execute functions from zxrun they must be exported.')
        process.exit(1)
    }
    
    let help = `
        zxrun [zxrun options] [commands] [options]

        [zxrun options]

        --verbose   By default all commands and internal logs are logged silent.
                    You can disable this behaviour via --verbose.

        [options]

        Any flags you want.  The resulting flags and parameters wil be passed to the command
        you execute.

        ||zxrun ${functions[0]} --a 1 --b 2

        ||async function ${functions[0]} ({ a, b }) {
        ||||// logs 1 2
        ||||console.log(a,b) 
        ||}

        ${functions.map( x => x + '\n\n||' + 'zxrun ' + x + ' [options]').join('\n\n')}
    `

    help = help.split('\n').map( x => x.trim() ).join('\n')
    help = help.replace(/\|\|/g,'    ')

    $.verbose = argv.verbose

    let f = argv._.shift()

    if (!f || argv.help || argv.h) {
        console.log(help)
        process.exit()
    }

    if(!functions.includes(f)) {
        console.error('Command',f,'is not one of the supported operations')
        console.error('You must run one of the following:', functions.join(' | '))
        process.exit(1)
    }

    try {
        await module[f](argv)
    } catch (e) {
        console.error('An error occurred while running',f)
        console.error(e.stack)
        process.exit(1)
    }
}

main().catch( e => {
    console.error(e)
    process.exit(1)
})