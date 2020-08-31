<template lang="pug" >
.index.column.center
  .header.column
    .header__title.center ENTER HTML AND CHOOSE OPTIONS
    .row
      .tools
        .tools__group.column
          .tools__title.center SPACES
          .tools__buttons.row
            .button(
              @click="switchSpaces(2)"
              :class="{ 'button--active': spaces === 2 }"
            ) 2
            .button(
              @click="switchSpaces(4)"
              :class="{ 'button--active': spaces === 4 }"
            ) 4
        .tools__group.column
          .tools__title.center ATTRIBUTES DIRECTION
          .tools__buttons.row
            .button(
              @click="switchAttributesDirection(directions.ROW)"
              :class="{ 'button--active': attributesDirection === directions.ROW }"
            ) line
            .button(
              @click="switchAttributesDirection(directions.COLUMN)"
              :class="{ 'button--active': attributesDirection === directions.COLUMN }"
            ) column
        .tools__group.column
          .tools__title.center ATTRIBUTES SORTING
          .tools__buttons.row
            .button(
              @click="switchAttributesSorting(sortings.VALUE )"
              :class="{ 'button--active': attributesSorting === sortings.VALUE }"
            ) VALUE
            .button(
              @click="switchAttributesSorting(sortings.NAME )"
              :class="{ 'button--active': attributesSorting === sortings.NAME }"
            ) NAME
        transition(
          name="fade"
        )
          .tools__container
            .copy-button.button(
              v-if="to"
              @click="copy()"
            ) Copy to clipboard
            .tools__notify(
              :class="{ shown: showCopied }"
            ) Copied to clipboard
  .container.row(
    :class="{ accent: isAccent }"
  )
    .from(
      ref="from"
    )
      simplebar.full-height(
        data-simplebar-auto-hide="false"
      )
        textarea(
          v-model="from"
          @input="parse()"
          ref="textarea"
        )
    .to
      .loader-container.center(
        v-if="isLoading"
      )
        .loader
      simplebar.full-height(
        data-simplebar-auto-hide="false"
      )
        textarea(
          v-html="to"
          ref="to"
        )
</template>

<script lang="ts" >
import { Vue, Component, Ref } from 'vue-property-decorator'
import copy from 'copy-to-clipboard'
import Converter from '~/services/converter'
import { Directions, Sortings } from '~/dictionaries/dictionaries'

@Component
export default class Index extends Vue {
  @Ref('from') $from!: HTMLDivElement
  @Ref('textarea') $textarea!: HTMLTextAreaElement
  @Ref('to') $to!: HTMLTextAreaElement

  // from: string = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd"> <html> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <title>Тег FONT</title> </head> <body> <p><font size="5" color="red" face="Arial">П</font>ервая буква этого предложения написана шрифтом Arial, выделена красным цветом и увеличена в размерах.</p> </body> </html>'.replaceAll('>', '>\n')
  from: string = ''
  to: string = ''
  spaces: number = 2
  attributesDirection: Directions = Directions.ROW
  attributesSorting: Sortings = Sortings.VALUE
  directions = Directions
  sortings = Sortings
  isAccent = true
  isLoading = false
  converter = new Converter(this.spaces, this.attributesDirection, this.attributesSorting)
  showCopied = false

  mounted () {
    this.$textarea.focus()
    this.recalculateTextareaHeight(this.$textarea)
  }

  parse (): void {
    this.isAccent = false
    this.isLoading = true
    this.converter.string = this.from
    this.converter.spaces = this.spaces
    this.converter.attributesDirection = this.attributesDirection
    this.converter.attributesSorting = this.attributesSorting
    this.converter.convert()
      .then((result: string) => {
        this.to = this.textToHtml(result)
        this.$nextTick(() => {
          this.isLoading = false
          this.recalculateAll()
        })
      })
  }

  recalculateAll (): void {
    this.recalculateResultHeight(this.$to)
    this.recalculateTextareaHeight(this.$textarea)
  }

  recalculateTextareaHeight ($element: HTMLTextAreaElement): void {
    $element.style.height = 'auto'
    $element.style.height = $element.scrollHeight + 'px'

    setTimeout(() => {
      if ((this.$from instanceof HTMLElement) && $element.scrollHeight < this.$from.offsetHeight) {
        $element.style.height = this.$from.offsetHeight - 48 + 'px'
      }
    }, 300)
  }

  recalculateResultHeight ($element: HTMLTextAreaElement): void {
    $element.style.height = 'auto'
    $element.style.height = $element.scrollHeight + 'px'

    setTimeout(() => {
      if ((this.$from instanceof HTMLElement) && $element.scrollHeight < this.$from.offsetHeight) {
        $element.style.height = this.$from.offsetHeight - 44 + 'px'
      }
    }, 300)
  }

  copy () {
    this.showCopied = true
    copy(this.to)
    setTimeout(() => this.showCopied = false, 1000)
  }

  switchSpaces (spaces: number): void {
    this.converter.spaces = this.spaces = spaces
    if (!this.isAccent) {
      this.parse()
    }
  }

  switchAttributesDirection (attributesDirection: Directions): void {
    this.attributesDirection = attributesDirection
    if (!this.isAccent) {
      this.parse()
    }
  }

  switchAttributesSorting (attributesSorting: Sortings): void {
    this.attributesSorting = attributesSorting
    if (!this.isAccent) {
      this.parse()
    }
  }

  textToHtml (string: string): string {
    return string
  }
}
</script>

<style lang="stylus" scoped >
@import ('~assets/css/mixins')

fieldWidth = 704px
fieldHeight = 664px
border-radius = 24px

.index
  height 100%
  padding 32px
  background #EEEEEE url('~assets/svg/background.svg') no-repeat
  background-size 100% auto

  .header
    width 100%
    z-index 20

    .header__title
      font-size 36px
      font-weight bold
      color #fff
      letter-spacing 1px

    .tools
      width 100%
      display flex
      align-items flex-end
      justify-content center
      margin 24px 0 32px 0

      .tools__container
        position relative

        .tools__notify
          position absolute
          top 61px
          left 50%
          opacity 0
          transform translateX(-50%)
          box-shadow 0 0 5px rgba(0, 0, 0, 0.5)
          background-color #fff
          padding 16px
          border-radius 6px
          background-color #212121
          color #fff
          text-align center
          transition opacity 0.3s

          &.shown
            opacity 1

      .tools__group
        margin 0 24px

        .tools__buttons
          margin 0 -12px

        .button
          flex 1

      .tools__title
        font-size 20px
        padding 0 0 16px 0
        font-weight bold
        letter-spacing 2px
        color #fff

      .button
        margin 0 8px

      .copy-button
        margin 0 24px 0 48px

  .container
    max-width 1920px
    width 100%
    height 100%
    justify-content flex-end
    position relative

    .from, .to
      width calc(50% - 16px)
      height 100%
      position absolute
      transition height 0.2s, top 0.2s, left 0.2s, right 0.2s, transform 0.2s
      border-radius border-radius
      background-color #424242
      overflow hidden

      textarea
        width calc(100% - 36px)
        min-height 100% !important
        height 100%
        border none
        background-color #424242
        margin 12px 12px 0 24px
        color #fff
        outline none
        resize none
        overflow hidden
        fontFamily()

    .from
      top 0
      left 0
      z-index 20
      border 8px solid #00ab88
      background-color #424242
      padding 8px 0
      box-shadow 0 0 6px #000, inset 0 0 8px #000

    .to
      top 0
      right 0
      z-index 10
      padding 14px 0
      box-shadow 0 0 5px #000

      .loader-container
        width 100%
        height  100%
        position absolute
        top 0
        left 0
        background-color rgba(0, 0, 0, 0.7)
        border-radius border-radius
        z-index 10

        .loader
          loader(#fff, 100px, 8px)

    &.accent
      .from, .to
        width fieldWidth
        height fieldHeight
        top 50%
        left 50%
        transform translate(-(fieldWidth / 2), -(fieldHeight / 2))
</style>
