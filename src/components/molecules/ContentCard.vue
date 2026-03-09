<template>
  <Card
:centered="true"
:customClass="customClass">
    <slot></slot>
  </Card>
</template>

<script setup lang="ts">
import Card from './Card.vue'

withDefaults(
  defineProps<{
    customClass?: string
  }>(),
  {
    customClass: '',
  },
)
</script>
