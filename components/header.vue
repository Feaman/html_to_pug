<template lang="pug" >
.header
  transition(
    name="scale-fade"
  )
    .header__content(
      v-if="show"
    )
      .header__info.row.center
        a(
          href="https://developer.mozilla.org/en-US/docs/Web/HTML"
          target="_blank"
        ) HTML
        span &nbsp;to&nbsp;
        a(
          href="https://pugjs.org/api/getting-started.html"
          target="_blank"
        ) PUG
        span &nbsp;converter
      .header__title.center ENTER HTML AND CHOOSE OPTIONS
      .row
        .tools
          .tools__group.column
            .tools__title.center SPACES
            .tools__buttons.row
              .button(
                @click="$emit('spaces', 2)"
                :class="{ 'button--active': spaces === 2 }"
              ) 2
              .button(
                @click="$emit('spaces', 4)"
                :class="{ 'button--active': spaces === 4 }"
              ) 4
          .tools__group.column
            .tools__title.center ATTRIBUTES DIRECTION
            .tools__buttons.row
              .button(
                @click="$emit('direction', directions.ROW)"
                :class="{ 'button--active': attributesDirection === directions.ROW }"
              ) line
              .button(
                @click="$emit('direction', directions.COLUMN)"
                :class="{ 'button--active': attributesDirection === directions.COLUMN }"
              ) column
          .tools__group.column
            .tools__title.center ATTRIBUTES SORTING
            .tools__buttons.row
              .button(
                @click="$emit('sorting', sortings.VALUE )"
                :class="{ 'button--active': attributesSorting === sortings.VALUE }"
              ) VALUE
              .button(
                @click="$emit('sorting', sortings.NAME )"
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
              transition(
                name="scale-fade"
              )
                .tools__notify(
                  v-if="showCopied"
                ) Copied to clipboard
</template>

<script lang="ts" >
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Directions, Sortings } from '~/dictionaries/dictionaries'

@Component
export default class Header extends Vue {
  @Prop() spaces!: string
  @Prop() attributesDirection!: string
  @Prop() attributesSorting!: string
  @Prop() to!: string

  directions = Directions
  sortings = Sortings
  showCopied = false
  show = false

  mounted () {
    setTimeout(() => this.show = true)
  }

  copy () {
    this.$emit('copy')
    this.showCopied = true
    setTimeout(() => {
      this.showCopied = false
    }, 2000)
  }
}
</script>

<style lang="stylus" scoped >
@import ('~assets/css/mixins')
.header
  width 100%
  min-height 225px
  z-index 20

  .header__content
    .header__info
      color #fff
      font-size 18px
      margin 0 0 16px 0
      text-transform uppercase
      word-spacing 4px

      a
        transition color 0.2s

      a:link, a:visited
        color #fff

      a:hover
        color #ff00cc

    .header__title
      font-size 36px
      font-weight bold
      color #fff
      letter-spacing 1px
      text-shadow 1px 0 5px #000

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
          letter-spacing 1px
          line-height 20px
          top 61px
          left 56px
          box-shadow 0 0 5px rgba(0, 0, 0, 0.5)
          background-color #fff
          padding 16px
          border-radius 6px
          background-color #212121
          color #fff
          text-align center

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
        text-shadow 0 0 2px #000
        color #fff

      .button
        margin 0 8px

      .copy-button
        margin 0 24px 0 48px
</style>
