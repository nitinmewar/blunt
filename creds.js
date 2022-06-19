const inquirer = require('inquirer')
const {Octokit} = require('@octokit/rest')
const Configstore = require('configstore')
const packageJson = require('./package.json')

const config = new Configstore(packageJson.name)

async function authenticate () {

    let token = config.get('github_token')
    if(token){
        console.log('token found in config. intializing authentication.....')
        try{
            const octokit = new Octokit({
                auth : token
            })
            return octokit
        }catch (error){
            throw error
        }
    }else{
    const questions = [{
        name: 'token',
        type : 'input',
        message : 'visit setting -> developer setting -> access token -> generate new token\n please enter your github access token : ',
        validate : function(value){
            if(value.length == 40){
                return true
            }else{
                return 'please enter valid access token!'
            }
        }
    }]

    const answer = await inquirer.prompt(questions)
    try{
        const octokit = new Octokit({
            auth : answer.token
        })
        config.set('github_token',answer.token)
        return octokit
    }catch (error){
        console.log(error);
    } }
}

module.exports = {authenticate}