import { textCompiler } from './text-formatter/text-compiler'

type Options = {
  tagLength?: number
  tagStart?: number
  hasDesc?: boolean
  theme: Theme
}
function renderArg({ name, multiple }: ParameterMeta, { theme }: Options) {
  return multiple ? '...' + name : `<{${name}|${theme.arg}}>`
}
function renderTag(
  { name, multiple, alias: _alias, description }: ParameterMeta,
  { tagLength = 0, hasDesc = true, tagStart = 0, theme: { tag, text } }: Options,
) {
  const alias = _alias ? `{-${_alias}|${tag.primary}}{, |${tag.secondary}}` : ''.padEnd(6, ' ')
  return (
    ''.padEnd(tagStart, ' ') +
    `${alias}{--${name.padEnd(tagLength, ' ')}|${tag.secondary}}` +
    (hasDesc ? `{${description ?? ''}|${text}}` : '')
  )
}
function joinListWith(list: ParameterMeta[], render: typeof renderArg, separator: string, options?: Options) {
  return `${list
    .map((arg, i) => render(arg, { ...options, tagStart: i === 0 ? 0 : options?.tagStart } as Options))
    .join(separator)}`
}
function plainTheme(data: Theme) {
  const plain: [key: string, color: string][] = []
  Object.keys(data).forEach((key) => {
    const KEY = key as keyof Theme
    if (typeof data[KEY] === 'object') {
      const innerObject = plainTheme(data[KEY] as unknown as Theme)
      plain.push(...innerObject.map(([_key, val]) => [`${key}.${_key}`, val] as [string, string]))
    } else {
      plain.push([`${key}`, data[KEY] as string])
    }
  })
  return plain
}
export default async function helpRenderer(content: string, meta: CommandMeta, theme: Theme) {
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
  const themeReplacements = Object.fromEntries(plainTheme(theme).map(([a, b]) => [`theme.${a}`, b]))
  const template = {
    app: `{${process.argv0.split('/').pop()}|${theme.command.primary}}`,
    command: `{${meta.command}|${theme.command.secondary}}`,
    arguments: joinListWith(meta.arg, renderArg, ' ', { theme }),
    tags: joinListWith(meta.tag, renderTag, '\n', { theme, tagStart, tagLength }),
    ...meta.arg.reduce(
      (prev, curr) => {
        prev[`arguments.${curr.name}`] = renderArg(curr, { theme, tagLength })
        return prev
      },
      {} as Record<string, string>,
    ),
    ...meta.tag.reduce(
      (prev, curr) => {
        prev[`tags.${curr.name}`] = renderTag(curr, { theme, tagLength })
        prev[`tags.${curr.name}.tag`] = `{--${curr.name}|${theme.tag.secondary}}`
        prev[`tags.${curr.name}.alias`] = curr.alias ? `{-${curr.alias}|${theme.tag.primary}}` : ''
        prev[`tags.${curr.name}.description`] = curr.description ? `{${curr.description}|${theme.text}}` : ''
        return prev
      },
      {} as Record<string, string>,
    ),
  }

  Object.entries(themeReplacements).forEach(([key, value]) => {
    text = text.replace(`${key}`, value)
  })
  Object.entries(template).forEach(([key, value]) => {
    text = text.replace(`%${key}%`, value)
  })
  console.log(textCompiler`${text}`)
}
