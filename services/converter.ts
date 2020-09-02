import BaseService from './base'
import { Directions, Sortings } from '~/dictionaries/dictionaries'

export default class Converter extends BaseService {
  result: string = ''
  private TEMPLATE_TAG_REPLACEMENT = 'elven-tag-replacer'
  private tagsToReplace = ['template', 'html', 'head', 'body', 'noscript']

  constructor (
    public string: string,
    public spaces: number,
    public attributesDirection: Directions,
    public attributesSorting: Sortings
  ) {
    super()
  }

  convert (): Promise<string> {
    this.result = ''

    // Replace dangerous tags
    this.replaceTags()

    this.parse(this.getInitialNodes(), 0)

    // Replace dangerous tags back
    this.replaceTagsBack()

    this.result = this.result.trim() + '\n'
    return Promise.resolve(this.result)
  }

  private parse (elements: Array<ChildNode>, level: number): void {
    elements.forEach(($element: ChildNode, index: number) => {
      if ($element instanceof Element) {
        this.result += '\n' + this.addSpaces(level) + $element.nodeName.toLowerCase()

        // If attributes
        this.handleAttributes($element, level)

        // If it's a <noscript> tag. Js interpret it's content as text.
        let nodes: NodeListOf<ChildNode>
        if ($element.tagName.toLowerCase() === 'noscript') {
          const $div = document.createElement('div')
          $div.innerHTML = $element.innerHTML
          nodes = $div.childNodes
        } else {
          nodes = $element.childNodes
        }

        if (nodes.length) {
          this.parse(Array.from(nodes), level + 1)
        }
      } else if ($element instanceof Text) {
        this.handleText($element, level, index)
      }
    })
  }

  private replaceTags (): void {
    this.tagsToReplace.forEach((tag: string) => {
      this.string = this.string.replace(new RegExp(`<${tag}>`, 'g'), `<${this.TEMPLATE_TAG_REPLACEMENT}-${tag}>`)
      this.string = this.string.replace(new RegExp(`</${tag}>`, 'g'), `</${this.TEMPLATE_TAG_REPLACEMENT}-${tag}>`)
    })
  }

  private replaceTagsBack (): void {
    this.tagsToReplace.forEach((tag: string) => {
      this.result = this.result.replace(new RegExp(`${this.TEMPLATE_TAG_REPLACEMENT}-${tag}`, 'g'), tag)
    })
  }

  private getInitialNodes (): Array<ChildNode> {
    const $element: HTMLDivElement = document.createElement('div')
    $element.innerHTML = this.string
    let nodes: Array<ChildNode> = Array.from($element.childNodes)
    nodes = nodes.filter(($element: any) => ($element instanceof HTMLElement) || ($element instanceof Text))

    return nodes
  }

  private handleAttributes ($element: Element, level: number): void {
    if ($element.attributes.length) {
      this.result += '(' + (this.attributesDirection === Directions.COLUMN ? '\n' + this.addSpaces(level, this.spaces) : '')
      const attributes: Array<Attr> = Array.from($element.attributes)

      // Sort
      switch (this.attributesSorting) {
        case Sortings.NAME:
          attributes.sort((previous: Attr, next: Attr) => {
            return previous.name.length - next.name.length
          })
          break
        case Sortings.VALUE:
          attributes.sort((previous: Attr, next: Attr) => {
            return next.value.length - previous.value.length
          })
          break
      }

      // Collect attributes name=value pairs
      const attributesPairs: Array<string> = []
      attributes.forEach((attribute: Attr) => {
        attributesPairs.push(attribute.name + this.getValueString(attribute.value))
      })

      this.result += attributesPairs.join(this.attributesDirection === Directions.COLUMN ? '\n' + this.addSpaces(level, this.spaces) : ' ')
      this.result += (this.attributesDirection === Directions.COLUMN ? '\n' + this.addSpaces(level) : '') + ')'
    }
  }

  private handleText ($element: Text, level: number, index: number): void {
    const textContent: string = $element.nodeValue ? $element.nodeValue.trim() : ''
    if (textContent) {
      this.result += this.calculateTextPrefix(level, index) + textContent.replace(/\n/g, '')
    }
  }

  private addSpaces (level: number, extraSpaces: number = 0): string {
    return Array(level * this.spaces + extraSpaces).fill(' ').join('')
  }

  private calculateTextPrefix (level: number, index: number): string {
    if (index === 0) {
      return ' '
    } else {
      return '\n' + this.addSpaces(level) + '| '
    }
  }

  private getValueString (value: string): string {
    return value ? '="' + value + '"' : ''
  }
}
