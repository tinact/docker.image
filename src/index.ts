import * as core from '@actions/core'
import * as fs from 'fs'
import * as cp from 'child_process'

async function run(): Promise<void> {
  try {
    const imageName = core.getInput('image_name', {required: true})
    const imageTag = core.getInput('image_tag') || 'latest'
    const buildArgs = core.getInput('build_args')
    const registry = core.getInput('registry') || 'registry.hub.docker.com'
    const registryUsername = core.getInput('registry_username', {
      required: true
    })
    const registryPassword = core.getInput('registry_password', {
      required: true
    })
    const dockerfile = core.getInput('dockerfile') || 'dockerfile'

    const repository = `${registry}/${imageName}:${imageTag}`

    login(registry, registryUsername, registryPassword)
      .then(() =>
        core.info(`Successfully Logging into Docker registry ${registry}.`)
      )
      .catch(err => core.setFailed(err.message))

    build(repository, dockerfile, buildArgs)
      .then(() =>
        core.info(
          `Successfully Building docker image: ${imageName}:${imageTag}.`
        )
      )
      .catch(err => core.setFailed(err.message))

    push(repository, registry)
      .then(() =>
        core.info(`Successfully Pushing docker image to ${registry}.`)
      )
      .catch(err => core.setFailed(err.message))
  } catch (error) {
    core.setFailed(error.message)
  }
}

const login = async (
  registry: string,
  registryUsername: string,
  registryPassword: string
): Promise<void> => {
  core.info(`Logging into Docker registry ${registry}.`)
  cp.execSync(
    `docker login -u ${registryUsername} --password-stdin ${registry} >/dev/null 2>&1`,
    {
      input: registryPassword
    }
  )
}

const build = async (
  repository: string,
  dockerfile: string,
  buildArgs: string
): Promise<void> => {
  if (!fs.existsSync(dockerfile)) {
    core.setFailed(`Dockerfile does not exist in location ${dockerfile}`)
  }

  core.info(`Building docker image: ${repository}`)
  cp.execSync(
    `${buildCommand(dockerfile, repository, buildArgs)} >/dev/null 2>&1`
  )
}

const push = async (repository: string, registry: string): Promise<void> => {
  core.info(`Pushing docker image to ${registry}`)
  cp.execSync(`docker push ${repository}  >/dev/null 2>&1`)
}

const buildCommand = (
  dockerfile: string,
  repository: string,
  buildArgs: string
): string => {
  let createBuildCommand = `docker build -t ${repository}`
  if (buildArgs) {
    const buildArgsArray: string[] = buildArgs.split(',')
    const argsSuffix = buildArgsArray.map(arg => `--build-arg ${arg}`).join(' ')
    createBuildCommand = `${createBuildCommand} ${argsSuffix}`
  }

  return `${createBuildCommand} ${dockerfile}`
}

run()
