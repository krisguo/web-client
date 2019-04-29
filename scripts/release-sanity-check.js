const fs = require('fs')
const path = require('path')

const VERSION = process.argv[2]
const issuesFound = []

function runAllValidations () {
  validateSemverCompatibility()
  validatePackageVersion()
  validateSdkVersion()
  validateSdkPulled()
  validateChangelog()
  report()
}

function validateSemverCompatibility () {
  const semverRe = /^\d+\.\d+\.\d+((-rc|-x)\.\d+)?$/i
  if (!semverRe.test(VERSION)) {
    issuesFound.push(`Version ${VERSION} is not semver compatible`)
  }
}

function validatePackageVersion () {
  const packageJson = getPackageJson()

  if (packageJson.version !== VERSION) {
    issuesFound.push(
      `package.json version should equal ${VERSION}, got ${packageJson.version}`
    )
  }
}

function validateSdkVersion () {
  const sdkVersion = getRequestedSdkVersion()

  const prodReleaseRe = /^\d+\.\d+\.\d+$/
  if (prodReleaseRe.test(VERSION) && prodReleaseRe.test(sdkVersion)) {
    issuesFound.push(
      `${VERSION} should use prod version of @tokend/js-sdk, got ${sdkVersion}`
    )
  }
}

function validateSdkPulled () {
  const yarnLockContent = readFile('../yarn.lock')
  const sdkVersion = getRequestedSdkVersion()

  const freshSdkVersionRe = new RegExp(`@tokend/js-sdk@${sdkVersion}`)
  if (!freshSdkVersionRe.test(yarnLockContent)) {
    issuesFound.push(
      '@tokend/js-sdk version of package.json mismatched with the one in yarn.lock'
    )
  }
}

function validateChangelog () {
  const changelogPath = path.resolve(__dirname, '../CHANGELOG.md')
  const changelogContent = fs.readFileSync(changelogPath, 'utf8')

  const todayDate = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  const releaseTagRe = new RegExp(`^## \\[${escapeRe(VERSION)}\\] - ${todayDate}$`, 'm')
  if (!releaseTagRe.test(changelogContent)) {
    issuesFound.push(`"## [${VERSION}] - ${todayDate}" is absent in CHANGELOG.md`)
  }

  const releaseTagIsNotTopRe = new RegExp(
    '## \\[Unreleased\\][\\s\\S]*' + // [Unreleased] tag
    '## \\[\\d+\\.\\d+\\.\\d+((-rc|-x)\\.\\d+)?\\] - \\d{4}-\\d{2}-\\d{2}[\\s\\S]*' + // any other tag
    `## \\[${escapeRe(VERSION)}\\] - ${todayDate}`, // the new tag
    'i'
  )
  if (releaseTagIsNotTopRe.test(changelogContent)) {
    issuesFound.push(`The ${VERSION} is not the top tag in CHANGELOG.md`)
  }

  const anyReleaseTagRe = /## \[\d+\.\d+\.\d+((-rc|-x)\.\d+)?\] - \d{4}-\d{2}-\d{2}/gi
  const versionExtractorRe = /\[(.*)\]/
  const baseRepoUrl = 'https://github.com/tokend/web-client'
  const anchorsLegend = changelogContent
    .match(anyReleaseTagRe)
    .map(tag => tag.match(versionExtractorRe)[1])
    .map((cur, curId, arr) => {
      return curId === arr.length - 1
        ? `[${cur}]: ${baseRepoUrl}/releases/tag/${cur}`
        : `[${cur}]: ${baseRepoUrl}/compare/${arr[curId + 1]}...${cur}`
    })
    .join('\n')
  if (!changelogContent.includes(anchorsLegend)) {
    issuesFound.push('The anchors legend is invalid')
  }
}

function report () {
  if (issuesFound.length) {
    console.error('Release sanity check failed')

    for (const problem of issuesFound) {
      console.error(problem)
    }

    process.exitCode = 1
  } else {
    console.log(`Release sanity check for ${VERSION} passed`)
    console.log()
  }
}

function getPackageJson () {
  const packageJsonPath = path.resolve(__dirname, '../package.json')
  return require(packageJsonPath)
}

function getRequestedSdkVersion () {
  const packageJson = getPackageJson()
  const sdkVersion = (packageJson.dependencies || {})['@tokend/js-sdk']
  return sdkVersion || '<ERROR_GETTING_VERSION>'
}

function readFile (relativePath) {
  const resolvedPath = path.resolve(__dirname, '../yarn.lock')
  return fs.readFileSync(resolvedPath, 'utf8')
}

function escapeRe (string) {
  return string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
};

runAllValidations()
