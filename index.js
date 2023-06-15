#!/usr/bin/env node

import { join, resolve } from 'path'
import { program } from 'commander'
import fs from 'fs'

const __dirname = resolve()

program
  .command('new')
  .argument('<project-name>', 'Name of your express app')
  .description('Create a new express app')
  .action(async (projectName) => {
    console.log('Creating a new express app called', projectName)
    const from = join(__dirname, 'templates/express-js')
    const to = join(process.cwd(), projectName)
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to)
    }
    fs.cpSync(from, to, { recursive: true })
    const packageJson = JSON.parse(fs.readFileSync(join(to, 'package.json')))
    packageJson.name = projectName
    fs.writeFileSync(
      join(to, 'package.json'),
      JSON.stringify(packageJson + '\n', null, 2)
    )
    console.log('Done!')
  })

program.parse(process.argv)
