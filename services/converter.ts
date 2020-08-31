import BaseService from './base'
import { Directions, Sortings } from '~/dictionaries/dictionaries'
import $ from 'jQuery'

/*
3. Даже если начинается не с html, то ставится все равно html > body
4. Некорректная обработка текста </body>text</html>
*/

export default class Converter extends BaseService {
  string: string = ''
  result: string = ''

  constructor (
    public spaces: number,
    public attributesDirection: Directions,
    public attributesSorting: Sortings
  ) {
    super()
  }

  convert (): Promise<string> {
    const parser = new DOMParser()
    const nodes: Array<Node> = $.parseHTML(this.string)
    debugger
    this.result = ''
    this.parse(nodes, 0)

    this.result = this.result.trim() + '\n'
    return Promise.resolve(this.result)
  }

  parse (elements: Array<Node>, level: number): void {
    elements.forEach(($element: Node, index: number) => {
      if ($element instanceof Element) {
        this.result += '\n' + this.addSpaces(level) + $element.nodeName.toLowerCase()

        // If attributes
        this.handleAttributes($element, level)

        if ($element.childNodes.length) {
          this.parse(Array.from($element.childNodes), level + 1)
        }
      } else if ($element instanceof Text) {
        this.handleText($element, level, index)
      }
    })
  }

  handleAttributes ($element: Element, level: number): void {
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

  handleText ($element: Text, level: number, index: number): void {
    const textContent: string = $element.nodeValue ? $element.nodeValue.trim() : ''
    if (textContent) {
      this.result += this.calculateTextPrefix(level, index) + textContent
    }
  }

  addSpaces (level: number, extraSpaces: number = 0): string {
    return Array(level * this.spaces + extraSpaces).fill(' ').join('')
  }

  calculateTextPrefix (level: number, index: number): string {
    if (index === 0) {
      return ' '
    } else {
      return '\n' + this.addSpaces(level) + '| '
    }
  }

  getValueString (value: string): string {
    return value ? '="' + value + '"' : ''
  }
}
