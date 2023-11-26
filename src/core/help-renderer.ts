import { textCompiler } from './text-formatter/text-compiler'

type Options = {
  tagLength?: number
  tagStart?: number
  hasDesc?: boolean
}
function renderArg({ name, multiple }: ParameterMeta, _options: Options) {
  return multiple ? '...' + name : `<{${name}|green}>`
}
function renderTag(
  { name, multiple, alias: _alias, description }: ParameterMeta,
  { tagLength = 0, hasDesc = true, tagStart = 0 }: Options,
) {
  const alias = _alias ? `{-${_alias}|cyan}{, |gray}` : ''.padEnd(6, ' ')
  return (
    ''.padEnd(tagStart, ' ') +
    `${alias}{--${name.padEnd(tagLength, ' ')}|gray}` +
    (hasDesc ? `{${description ?? ''}|white}` : '')
  )
}
function joinListWith(list: ParameterMeta[], render: typeof renderArg, separator: string, options?: Options) {
  return `${list
    .map((arg, i) => render(arg, { ...options, tagStart: i === 0 ? 0 : options?.tagStart } as Options))
    .join(separator)}`
}

export default async function helpRenderer(content: string, meta: CommandMeta) {
  let text = content
  meta.tag.push({
    name: 'verbose',
    alias: 'v',
    compact: true,
    multiple: false,
    type: 'boolean',
  })
  meta.tag.push({
    name: 'help',
    alias: 'h',
    compact: true,
    multiple: false,
    type: 'boolean',
  })
  let tagStart = 0
  content.split('\n').forEach((line) => {
    tagStart = Math.max(tagStart, line.indexOf('%tags%'))
  })
  const tagLength = meta.tag.reduce((max, tag) => Math.max(max, tag.name.length), 0) + 3
  const template = {
    app: process.argv0.replace('./', ''),
    command: meta.command,
    arguments: joinListWith(meta.arg, renderArg, ' '),
    tags: joinListWith(meta.tag, renderTag, '\n', { tagStart, tagLength }),
    ...meta.arg.reduce(
      (prev, curr) => {
        prev[`arguments.${curr.name}`] = renderArg(curr, { tagLength })
        return prev
      },
      {} as Record<string, string>,
    ),
    ...meta.tag.reduce(
      (prev, curr) => {
        prev[`tags.${curr.name}`] = renderTag(curr, { tagLength })
        prev[`tags.${curr.name}.tag`] = `{--${curr.name}|gray}`
        prev[`tags.${curr.name}.alias`] = curr.alias ? `{-${curr.alias}|cyan}` : ''
        prev[`tags.${curr.name}.description`] = curr.description ? `{${curr.description}|white}` : ''
        return prev
      },
      {} as Record<string, string>,
    ),
  }

  Object.entries(template).forEach(([key, value]) => {
    text = text.replace(`%${key}%`, value)
  })
  console.log(textCompiler`${text}`)
}
