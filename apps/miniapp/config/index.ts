import type { UserConfigExport } from '@tarojs/cli'

export default {
  projectName: 'sosohelper-miniapp',
  date: '2026-01-01',
  designWidth: 375,
  deviceRatio: {
    375: 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  framework: 'react',
  compiler: 'webpack5',
  mini: {},
  h5: {}
} satisfies UserConfigExport
