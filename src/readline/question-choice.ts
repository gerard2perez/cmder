/* eslint-disable @typescript-eslint/no-explicit-any */
import { pickColor, viteBulletOff, viteBulletOn } from '@g2p/cmder/readline/bullets/vite-bullets'
import { readLinePlusPlus } from './readline-plus-plus/readline-plus-plus'
import { upDownHandler } from '@g2p/cmder/readline/readline-plus-plus/handlers'

type Concrete<T> = T extends readonly string[] ? T[number] : ThisType<T>
type ChoiceConfig<T> = {
  elements: T
  SelectedBullet?: typeof viteBulletOn
  UnSelectedBullet?: typeof viteBulletOff
}

function manyFormatter(selectedIndex: number, options: string[], on = viteBulletOn, off = viteBulletOff) {
  return options
    .map((option, index) => {
      return selectedIndex === index ? on(option, index) : off(option, index)
    })
    .join('\n')
}

/**
 * @throws {Error} Operation cancelled
 */
export async function QuestionChoice<T>(template: string, config: ChoiceConfig<T>) {
  const {
    SelectedBullet: on,
    UnSelectedBullet: off,
    elements: sources,
  } = Object.assign(
    {
      SelectedBullet: viteBulletOn,
      UnSelectedBullet: viteBulletOff,
    },
    config,
  )
  const isEnum = !(sources instanceof Array)
  const fixedElements =
    sources instanceof Array ? sources : (Object.keys(sources as never).filter((key) => isNaN(Number(key))) as string[])

  return readLinePlusPlus(
    `{status} ${template}: {indicator} {placeholder}{options}`,
    {
      elements: fixedElements,
      defaults: '',
    },
    {
      placeholder: ({ elements, handler, ended }) =>
        ended ? pickColor(elements[handler], handler) : `{- Use arrow-keys. Enter to submit|gray}`,
      options: ({ handler: selectedIndex, ended, elements }) =>
        ended ? '' : '\n' + manyFormatter(selectedIndex, elements, on, off),
    },
    {
      hideCursor: true,
      handler: upDownHandler(fixedElements.length),
      extractor: ({ handler, elements }) =>
        (isEnum ? sources[elements[handler] as never] : elements[handler]) as Concrete<T>,
    },
  )
}
