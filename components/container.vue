<template lang="pug" >
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
        :value="from"
        @input="setFrom($event)"
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
        :value="to"
        @input="setTo($event)"
        ref="to"
      )
</template>

<script lang="ts" >
import { Vue, Component, Prop, Ref } from 'vue-property-decorator'
import { Directions, Sortings } from '~/dictionaries/dictionaries'

@Component
export default class Container extends Vue {
  @Ref('from') $from!: HTMLDivElement
  @Ref('textarea') $textarea!: HTMLTextAreaElement
  @Ref('to') $to!: HTMLTextAreaElement

  @Prop() from!: string
  @Prop() to!: string
  @Prop() spaces!: number
  @Prop() isLoading!: boolean
  @Prop() isAccent!: boolean

  directions = Directions
  sortings = Sortings
  _from: string = ''
  _to: string = ''

  created () {
    this._from = this.from
    this._to = this.to
    this.$events.$on('recalculate-all', () => {
      this.recalculateAll()
    })
  }

  mounted () {
    this.$textarea.focus()
    this.recalculateTextareaHeight(this.$textarea)
  }

  setFrom (event: Event) {
    if (event.target instanceof HTMLTextAreaElement) {
      this._from = event.target.value
      this.$emit('set-from', this._from)
    }
  }

  setTo (event: Event) {
    if (event.target instanceof HTMLTextAreaElement) {
      this._to = event.target.value
      this.$emit('set-to', this._to)
    }
  }

  recalculateAll (): void {
    this.recalculateResultHeight(this.$to)
    this.recalculateTextareaHeight(this.$textarea)
  }

  recalculateTextareaHeight ($element: HTMLTextAreaElement): void {
    if ($element) {
      $element.style.height = 'auto'
      $element.style.height = $element.scrollHeight + 'px'

      setTimeout(() => {
        if ((this.$from instanceof HTMLElement) && $element.scrollHeight < this.$from.offsetHeight) {
          $element.style.height = this.$from.offsetHeight - 48 + 'px'
        }
      }, 300)
    }
  }

  recalculateResultHeight ($element: HTMLTextAreaElement): void {
    if ($element) {
      $element.style.height = 'auto'
      $element.style.height = $element.scrollHeight + 'px'

      setTimeout(() => {
        if ((this.$from instanceof HTMLElement) && $element.scrollHeight < this.$from.offsetHeight) {
          $element.style.height = this.$from.offsetHeight - 44 + 'px'
        }
      }, 300)
    }
  }
}
</script>

<style lang="stylus" scoped >
@import ('~assets/css/mixins')

fieldWidth = 704px
fieldHeight = 664px
border-radius = 24px

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
    top 0
    transition height 0.1s ease-out, top 0.1s ease-out, left 0.1s ease-out, right 0.1s ease-out, transform 0.1s ease-out
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
    left 0
    z-index 20
    border 8px solid #00ab88
    background-color #424242
    padding 8px 0
    box-shadow 0 0 6px #000, inset 0 0 8px #000

  .to
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
      top 24px
      left 'calc(50% - %s)' % (fieldHeight / 2)
</style>
