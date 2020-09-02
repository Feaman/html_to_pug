<template lang="pug" >
.footer
  .title COMMENT:
  textarea(
    v-model="comment"
  )
  .button(
    @click="send()"
    :class="{ 'button--disabled': !this.comment }"
  ) send
  transition(
    name="scale-fade"
  )
    .notify(
      v-if="showSent"
    ) Comment sent
</template>

<script lang="ts" >
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Directions, Sortings } from '~/dictionaries/dictionaries'

@Component
export default class Footer extends Vue {
  @Prop() spaces!: string
  @Prop() attributesDirection!: string
  @Prop() attributesSorting!: string
  @Prop() from!: string

  directions = Directions
  sortings = Sortings
  comment: string = ''
  showSent = false

  send () {
    if (this.comment) {
      this.showSent = true
      setTimeout(() => this.showSent = false, 1000)
      this.comment = ''
      this.$axios.request({
        method: 'post',
        url: 'https://pavlo.ru/apps/html-to-pug/add-comment',
        data: { from: this.from, comment: this.comment, date: new Date() }
      })
    }
  }
}
</script>

<style lang="stylus" scoped >
@import '~assets/css/mixins'

.footer
  width 100%
  max-width 1920px
  position relative

  .title
    font-size 20px
    font-weight bold

  textarea
    width 100%
    height 104px
    border 4px solid rgba(0, 0, 0, 0.8)
    border-radius 6px
    box-shadow 0 0 5px rgba(0, 0, 0, 0.5), inset 0 0 5px #000
    margin 16px 0 0 0
    padding 16px
    outline none
    fontFamily()

  .button
    width 104px
    margin 24px 0 0 0

  .notify
    position absolute
    z-index 10
    bottom -2px
    left 120px
    box-shadow 0 0 5px rgba(0, 0, 0, 0.5)
    background-color #fff
    padding 16px
    border-radius 6px
    background-color #212121
    color #fff
    text-align center
</style>
