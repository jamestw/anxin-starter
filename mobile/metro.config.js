// 讓 Metro 能讀到 repo 根目錄的 tokens/（全系統共用色彩）
const path = require('path')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)
config.watchFolders = [path.resolve(__dirname, '../tokens')]

module.exports = config
