<template lang="pug" >
.index.column.center
  elven-header(
    @spaces="switchSpaces"
    @direction="switchAttributesDirection"
    @sorting="switchAttributesSorting"
    @copy="copy()"
    :to="to"
    :spaces="spaces"
    :attributesDirection="attributesDirection"
    :attributesSorting="attributesSorting"
  )
  elven-container(
    :from="from"
    :to="to"
    :isAccent="isAccent"
    @set-from="setFrom($event)"
    @set-to="setTo($event)"
  )
  elven-footer(
    :show="!!to"
    :from="from"
    :spaces="spaces"
    :attributesDirection="attributesDirection"
    :attributesSorting="attributesSorting"
  )
</template>

<script lang="ts" >
import { Vue, Component } from 'vue-property-decorator'
import copy from 'copy-to-clipboard'
import { Directions, Sortings } from '~/dictionaries/dictionaries'
import Converter from '~/services/converter'

@Component
export default class Index extends Vue {
  from: string = ''
  to: string = ''
  spaces: number = 2
  attributesDirection: Directions = Directions.ROW
  attributesSorting: Sortings = Sortings.VALUE
  converter = new Converter(this.from, this.spaces, this.attributesDirection, this.attributesSorting)
  isAccent = true
  isLoading = false

  setFrom (value: string): void {
    this.from = value
    this.parse()
  }

  setTo (value: string): void {
    this.to = value
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
          this.$events.$emit('recalculate-all')
        })
      })
  }

  copy () {
    copy(this.to)
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
.index
  height 100%
  padding 32px
  background #EEEEEE url('~assets/svg/background.svg') no-repeat
  background-size 100% auto

  .footer
    margin 32px 0 24px 0
</style>
