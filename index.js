#!/usr/bin/env node

import { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { program } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'

const CURR_DIR = process.cwd()
const templates = dirname(fileURLToPath(import.meta.url)).concat('/templates')

function copyTemplate(destination, language, name) {
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination)
  }

  if (!isDestinationEmpty(destination)) {
    console.log(
      `⚠️  The destination folder ${chalk.yellow(
        destination.split('/').pop()
      )} is not empty. Please make sure it is empty before proceeding.`
    )
    return
  }

  if (language === 'javascript') {
    console.log(`⏳ Coppying ${chalk.yellow('Javascript')} template...`)
    fs.cpSync(`${templates}/express-js`, destination, { recursive: true })
  } else {
    console.log(`⏳ Coppying ${chalk.cyan('Typescript')} template...`)
    fs.cpSync(`${templates}/express-ts`, destination, { recursive: true })
  }

  const packageJson = JSON.parse(
    fs.readFileSync(`${destination}/package.json`, 'utf-8')
  )
  packageJson.name = name

  fs.writeFileSync(
    `${destination}/package.json`,
    JSON.stringify(packageJson, null, 2) + '\n'
  )

  fs.renameSync(`${destination}/_gitignore`, `${destination}/.gitignore`)
}

async function handleNewAcion(projectName, options) {
  console.log(chalk.green('🚀 Preparing your express app...'))
  let projectPath = `${CURR_DIR}/${projectName}`

  if (projectName === '.' || projectName === './') {
    projectName = process.cwd().split('/').pop()
    projectPath = process.cwd()
  }

  let { javascript, typescript } = options

  if (typescript && javascript) {
    console.log(chalk.red('⚠️ Please specify only one language to use!'))
    return
  }
  console.log(projectPath)
  if (!typescript && !javascript) {
    const language = await selectLanguange()
    language === 'Javascript' ? (javascript = true) : (typescript = true)
  }
  if (javascript) {
    copyTemplate(projectPath, 'javascript', projectName)
  }
  if (typescript) {
    copyTemplate(projectPath, 'typescript', projectName)
  }
  console.log(chalk.green('🎉 Your express app is ready!'))

  if (projectPath !== process.cwd()) {
    console.log(
      `👉 Run ${chalk.cyan(
        `cd ${projectName} && npm install`
      )} to install dependencies.`
    )
  }

  console.log(
    `👉 Run ${chalk.cyan(
      `cd ${projectName} && npm start`
    )} to start the server.`
  )
}

async function selectLanguange() {
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'language',
      message: 'Which language do you want to use?',
      choices: ['Javascript', 'Typescript'],
    },
  ])
  return answers.language
}

const isDestinationEmpty = (destination) => {
  const files = fs.readdirSync(destination)
  return files.length === 0
}

program
  .command('new')
  .argument('<project-name>', 'Name of your express app')
  .description('Create a new express app')
  .option('-ts, --typescript', 'Use typescript')
  .option('-js, --javascript', 'Database to use')
  .action(handleNewAcion)

program.parse(process.argv)
