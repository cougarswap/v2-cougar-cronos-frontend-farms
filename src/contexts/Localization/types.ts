import { ReactText } from 'react'

export type ContextData = {
  [key: string]: ReactText
}

export type Translate = (key: string, data?: ContextData) => string
