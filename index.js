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

  if (language === 'javascript') {
    fs.cpSync(`${templates}/express-js`, destination, { recursive: true })
  } else {
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
  console.log(chalk.green('Generating new express app...'))

  if (projectName === '.' || projectName === './') {
    projectName = process.cwd().split('/').pop()
  }

  let { javascript, typescript } = options

  if (typescript && javascript) {
    console.log(chalk.red('⚠️ Please specify only one language to use!'))
    return
  }

  if (!typescript && !javascript) {
    const language = await selectLanguange()
    language === 'Javascript' ? (javascript = true) : (typescript = true)
  }
  if (javascript) {
    console.log(`⏳ Coppying ${chalk.yellow('Javascript')} template...`)
    copyTemplate(`${CURR_DIR}/${projectName}`, 'javascript', projectName)
  }
  if (typescript) {
    console.log(`⏳ Coppying ${chalk.cyan('Typescript')} template...`)
    copyTemplate(`${CURR_DIR}/${projectName}`, 'typescript', projectName)
  }
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

program
  .command('new')
  .argument('<project-name>', 'Name of your express app')
  .description('Create a new express app')
  .option('-ts, --typescript', 'Use typescript')
  .option('-js, --javascript', 'Database to use')
  .action(handleNewAcion)

program.parse(process.argv)
