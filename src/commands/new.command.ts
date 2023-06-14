import { Command } from 'commander'

const program = new Command()

program
  .command('new <project-name>')
  .description('create a new project')
  .option('-ts, --typescript', 'use typescript')
  .option('js, --javascript', 'use javascript')
  .action((projectName: string) => {
    console.log('projectName', projectName)
  })

program.parse(process.argv)

export default program
