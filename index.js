#!/usr/bin/env node

import { dirname } from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { program } from 'commander'
import chalk from 'chalk'

const CURR_DIR = process.cwd()
const __dirname = dirname(fileURLToPath(import.meta.url))

program
  .command('new')
  .argument('<project-name>', 'Name of your express app')
  .description('Create a new express app')
  .action(async (projectName) => {
    console.log('Creating a new express app called', projectName)
    const from = `${__dirname}/templates/express-js`
    const to = `${CURR_DIR}/${projectName}`

    if (!fs.existsSync(to)) {
      fs.mkdirSync(to)
    }
    fs.cpSync(from, to, { recursive: true })
    const packageJson = JSON.parse(
      fs.readFileSync(`${to}/package.json`, 'utf-8')
    )
    packageJson.name = projectName
    fs.writeFileSync(
      `${to}/package.json`,
      JSON.stringify(packageJson, null, 2) + '\n'
    )

    fs.renameSync(`${to}/_gitignore`, `${to}/.gitignore`)
    console.log(chalk.green('Done!'))
  })

program.parse(process.argv)
