const app = require('commander')
const chalk = require('chalk')
const clear = require('clear')
const figlet = require('figlet')
const inquirer = require('inquirer')
const auth = require('./creds')
const repo = require('./new_repo')

app.command('init').description(`let's run this MF`).action(async () => {
    console.log('welcome to github initializer app')

})
    app.parse(process.argv)

    if (! app.args.length) {
        app.Help()
    }
    clear()

    console.log(chalk.cyan(figlet.textSync('blunt', {horizontalLayout: 'full'})))

    console.log('made with ♥ by nitin \n please contact me via nitinmewar28@gmail.com')

    const questions = [{
            name: 'proceed',
            type: 'input',
            message: 'procceed to push this project to github?',
            choices: [
                'yes', 'no'
            ],
            default: 'yes'
        }]

async function run (){
    const answer = await inquirer.prompt(questions)

    if (answer.proceed == 'yes') {
        console.log(chalk.grey('authenticating........'))
        const octokit = await auth.authenticate()
        console.log(chalk.grey('initializing new github repo......'))
        const url = await repo.newRepo(octokit)
        
        console.log('github repo created. choose files to ignore : ')
        await repo.ignoreFiles()
        console.log(chalk.grey('commiting file to github at : '+ chalk.yellow(url)))
        const commit = await repo.intialCommit(url)

        if(commit){
          console.log(chalk.green('project uploaded to github!!'))
        }
    } else {
        console.log(chalk.grey('see you soon!!!  '))
    }
  }
  run()
