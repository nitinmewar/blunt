const path = require('path')
const inquirer = require('inquirer')
const fs = require('fs')
const glob = require('glob')
const simpleGit = require('simple-git')
const git = simpleGit()


async function newRepo(octokit) {
    const questions = [
        {
            name: 'name',
            type: 'input',
            message: 'enter the name for repo : ',
            default: path.basename(process.cwd()),
            validate: function (value) {
                if (value.length) {
                    return true
                } else {
                    return 'please enter a valid input : '
                }
            }
        }, {
            name: 'description',
            type: 'input',
            message: 'repo description : ',
            default: null
        }, {
            name: 'visibility',
            type: 'input',
            message: 'set repo public or private ',
            choices: [
                'public', 'private'
            ],
            default: 'public'
        }
    ]
    const answer = await inquirer.prompt(questions)

    const data = {
        name: answer.name,
        description: answer.description,
        private: (answer.visibility === 'private')
    }

    try {
        const response = await octokit.repos.createForAuthenticatedUser(data)
        return response.data.clone_url
    } catch (error) {
        console.log(error)
    }
}

async function ignoreFiles() {
    const files = glob.sync("**/*", {"ignore": '**/node_modules/**'})
    const filesTOIgnore = glob.sync('**/node_modules/,node_modules/**')
    if (filesTOIgnore.length) {
        fs.writeFileSync('.gitignore', filesTOIgnore.join('\n') + '\n')
    } else {
        fs.closeSync(fs.openSync('.gitignore', 'w'))
    }
    const questions = [{
            name: 'ignore',
            type: 'checkbox',
            message: 'please select files and/or folders to ignore : ',
            choices: files
        }]

    const answer = await inquirer.prompt(questions)
    if (answer.ignore.length) {
        fs.writeFileSync('.gitignore', answer.ignore.join('\n'))
    }
}

async function intialCommit(url) {
    try {
        await git.init().add('.gitignore').add('./*').commit('initial commit').addRemote('origin', url).push(url, 'master', ['--set-upstream'])

        return true
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    newRepo,
    ignoreFiles,
    intialCommit
}
