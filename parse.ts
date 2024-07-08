import { parse } from '@swc/core'

import type {
  ArrowFunctionExpression,
  BindingIdentifier,
  CallExpression,
  Expression,
  ExpressionStatement,
  FunctionExpression,
  Identifier,
  Module,
  Pattern,
  TsKeywordType,
  VariableDeclaration,
  VariableDeclarator,
} from '@swc/core'

const source = await Bun.file('./src/commands/demo.ts').text()

const res = await parse(source, {
  syntax: 'typescript',
  script: true,
  comments: true,
})
function getJsDOC(lines: string[], line: number) {
  const jsDoc = [] as string[]
  let isCommenting = false
  for (let i = line - 1; i > 0; i--) {
    const cLine = lines[i].trim()
    const opens = /(\/?\*+ )?(?<content>.*)\*{1,}\/$/gi.exec(cLine)
    const closes = /^\/\*{1,} ?(?<content>.*)(\*{1,}\/)?/gi.exec(cLine)
    let content: string | undefined
    if (cLine.startsWith('//')) {
      content = cLine.substring(2).trim()
    } else if (opens) {
      content = opens.groups?.content.trimEnd()
      isCommenting = true
    } else if (closes) {
      content = closes.groups?.content.trimEnd()
      isCommenting = false
    } else if (isCommenting) {
      const push = /( *\* *)?(?<content>.*)/gi.exec(cLine)
      content = push?.groups?.content?.trimEnd()
    } else if (cLine.length > 0) {
      break
    }
    if (content) jsDoc.push(content)
  }
  return jsDoc.join('\n')
}
function getType(identifier: BindingIdentifier) {
  if (identifier.typeAnnotation?.typeAnnotation.type === 'TsArrayType') {
    if (identifier.typeAnnotation.typeAnnotation.elemType.type === 'TsTypeReference') {
      return {
        isArray: true,
        kind: identifier.typeAnnotation.typeAnnotation.elemType?.typeName?.value,
      }
    } else if (identifier.typeAnnotation.typeAnnotation.elemType.type === 'TsKeywordType') {
      return {
        isArray: true,
        kind: identifier.typeAnnotation.typeAnnotation.elemType.kind,
      }
    }
  } else {
    return {
      isArray: false,
      kind: (identifier.typeAnnotation?.typeAnnotation as TsKeywordType)?.kind,
    }
  }
}
function getMetadata(variableDeclaration: VariableDeclaration, lines: string[]) {
  const variableDeclarator = variableDeclaration.declarations.at(0) as VariableDeclarator
  const identifier = variableDeclarator.id as BindingIdentifier
  const { isArray, kind } = getType(identifier)!
  const restored = `${variableDeclaration.kind} ${identifier.value}: ${kind}`
  const line = lines.findIndex((textLine) => textLine.trim().startsWith(restored))
  const init = variableDeclarator.init
  let optional = false
  let defaults: any
  if (init?.type === 'BinaryExpression') {
    if (init.right) {
      optional = true
      defaults = (init.right as BindingIdentifier).value
    }
  } else {
    return undefined
  }

  return {
    variable: identifier.value,
    defaults,
    optional,
    jsDoc: getJsDOC(lines, line),
    isArray,
    kind,
  }
}
console.log('\033c')

const variableDeclarations = res.body.filter((n) => n.type === 'VariableDeclaration') as VariableDeclaration[]

Bun.write('./output.json', JSON.stringify(variableDeclarations, null, 2))

const vs = variableDeclarations.map((vd) => getMetadata(vd, source.split('\n'))).filter((d) => d)
console.log(vs)
