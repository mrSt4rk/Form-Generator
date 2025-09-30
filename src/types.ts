export interface Choice { id: string; name: string }
export type ElementType = 'text' | 'checkbox'

export interface Condition {
  targetElementId: string
  valueToMatch: string | number
}
export interface ConditionGroup {
  op: 'AND' | 'OR'
  conditions: Condition[]
}

export interface Element {
  id: string
  type: ElementType
  label: string
  isRequired?: boolean
  choices?: Choice[]
  visibility?: ConditionGroup
}

export interface Form {
  id: string
  name: string
  elements: Element[]
}
