import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const temporaryProject = mkdtempSync(join(tmpdir(), 'export-from-json-'))
let archivePath

const run = (command, args, options = {}) => execFileSync(command, args, {
  cwd: temporaryProject,
  encoding: 'utf8',
  stdio: 'pipe',
  ...options,
})

try {
  const packOutput = execFileSync('npm', ['pack', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
  })
  const [{ filename }] = JSON.parse(packOutput)
  archivePath = join(root, filename)

  writeFileSync(join(temporaryProject, 'package.json'), JSON.stringify({
    private: true,
    type: 'module',
  }))
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', archivePath])

  run('node', [
    '--input-type=module',
    '--eval',
    `import exportFromJSON from 'export-from-json';
     const content = exportFromJSON({ data: [{ name: 'Ada' }], exportType: 'tsv', processor: value => value });
     if (content !== 'name\\r\\nAda' || exportFromJSON.types.tsv !== 'tsv') process.exit(1);`,
  ])
  run('node', [
    '--eval',
    `const exportFromJSON = require('export-from-json');
     const content = exportFromJSON({ data: { name: 'Ada' }, exportType: 'json', processor: value => value });
     if (JSON.parse(content).name !== 'Ada') process.exit(1);`,
  ])

  const typeFixture = join(temporaryProject, 'consumer.ts')
  writeFileSync(typeFixture, `
    import exportFromJSON, { type ExportType, type IOption, type TableEntries } from 'export-from-json'
    const type: ExportType = 'tsv'
    const data = [{ name: 'Ada' }]
    const options: IOption<string> = { data, exportType: type, processor: value => value }
    const entries: TableEntries = [{ fieldName: 'name', fieldValues: ['Ada'] }]
    void entries
    exportFromJSON(options)
  `)
  execFileSync(join(root, 'node_modules', '.bin', 'tsc'), [
    '--noEmit',
    '--strict',
    '--target',
    'es2022',
    '--module',
    'nodenext',
    '--moduleResolution',
    'nodenext',
    typeFixture,
  ], {
    cwd: temporaryProject,
    stdio: 'inherit',
  })

  process.stdout.write('Installed package verification passed.\n')
} finally {
  if (archivePath) rmSync(archivePath, { force: true })
  rmSync(temporaryProject, { recursive: true, force: true })
}
