/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-var-requires */
const WorkerPlugin = require('worker-plugin')
const GitRevisionPlugin = require('git-revision-webpack-plugin')

function ifProduction (value, defaultValue = undefined) {
  return (process.env.NODE_ENV === 'production') ? value : defaultValue
}

const gitRevisionPlugin = new GitRevisionPlugin()

module.exports = {
  lintOnSave: false,
  configureWebpack: {
    plugins: [
      new WorkerPlugin()
    ]
  },
  pwa: {
    name: 'g.drive telescope',
    themeColor: '#3C366B',
    msTileColor: '#3C366B',
    manifestOptions: {
      start_url: '/',
      splash_pages: null
    },
    assetsVersion: gitRevisionPlugin.version(),
    manifestCrossorigin: ifProduction(undefined, 'use-credentials')
  }
}
