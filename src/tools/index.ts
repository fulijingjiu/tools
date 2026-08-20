import type { Tool } from './tools.types'
import { tool as jsonFormatter } from './json-formatter'
import { tool as base64 } from './base64'
import { tool as urlEncoder } from './url-encoder'
import { tool as timestamp } from './timestamp'
import { tool as numberConverter } from './number-converter'
import { tool as imageCompressor } from './image-compressor'
import { tool as textProcessor } from './text-processor'
import { tool as passwordGenerator } from './password-generator'
import { tool as hash } from './hash'
import { tool as jwtParser } from './jwt-parser'
import { tool as markdownPreview } from './markdown-preview'
import { tool as qrcodeGenerator } from './qrcode-generator'
import { tool as colorConverter } from './color-converter'
import { tool as regexTester } from './regex-tester'
import { tool as unitConverter } from './unit-converter'
import { tool as textDiff } from './text-diff'

export const tools: Tool[] = [
  jsonFormatter,
  base64,
  urlEncoder,
  timestamp,
  numberConverter,
  textProcessor,
  imageCompressor,
  passwordGenerator,
  hash,
  jwtParser,
  markdownPreview,
  qrcodeGenerator,
  colorConverter,
  regexTester,
  unitConverter,
  textDiff,
]

export const toolsByCategory = tools.reduce(
  (acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = []
    acc[tool.category].push(tool)
    return acc
  },
  {} as Record<string, Tool[]>,
)
