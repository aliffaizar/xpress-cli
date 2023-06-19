#!/usr/bin/env node

import { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { program } from 'commander'
import chalk from 'chalk'
import inquirer from 'inquirer'

const CURR_DIR = process.cwd()
const templates = `${dirname(fileURLToPath(import.meta.url))}/templates`

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

  const templatePath =
    language === 'javascript'
      ? `${templates}/express-js`
      : `${templates}/express-ts`

  console.log(
    `⏳ Copying ${
      language === 'javascript'
        ? chalk.yellow('Javascript')
        : chalk.cyan('Typescript')
    } template...`
  )
  fs.cpSync(templatePath, destination, { recursive: true })

  const packageJsonPath = `${destination}/package.json`
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
  packageJson.name = name

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')

  fs.renameSync(`${destination}/_gitignore`, `${destination}/.gitignore`)
}

async function handleNewAction(projectName, options) {
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

  if (!typescript && !javascript) {
    const language = await selectLanguage()
    javascript = language === 'Javascript'
    typescript = language === 'Typescript'
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

  console.log(`👉 Run ${chalk.cyan(`npm install`)} to install dependencies.`)
}

async function selectLanguage() {
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
  .command('new <project-name>')
  .description('Create a new express app')
  .option('-ts, --typescript', 'Use typescript')
  .option('-js, --javascript', 'Use javascript')
  .action(handleNewAction)

program
  .command('generate <type> <name>')
  .description('Generate a new file' + chalk.red(' (Not implemented yet)'))

program.parse(process.argv)
