<template>
  <v-card>
    <v-card-text class="un-space-y-4">
      <div class="un-flex un-justify-center un-items-center">
        <v-text-field
          label="Min"
          :model-value="modelValue[0]"
          prefix="$"
          density="compact"
          variant="outlined"
          class="un-w-24"
          hide-details
          @change="modelValue[0] = +$event.target.value"
        ></v-text-field>
        <div class="i-mdi:minus un-px-4"></div>
        <v-text-field
          label="Max"
          :model-value="modelValue[1]"
          prefix="$"
          density="compact"
          variant="outlined"
          class="un-w-24"
          hide-details
          @change="modelValue[1] = +$event.target.value"
        ></v-text-field>
      </div>
      <v-range-slider
        v-model="range"
        :min="min"
        :max="max"
        @update:model-value="$emit('update:modelValue', $event)"
        hide-details
        strict
      ></v-range-slider>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      min?: number
      max?: number
      modelValue?: [number, number]
    }>(),
    { min: 0, max: 1, modelValue: () => [0, 1] },
  )
  const { modelValue } = toRefs(props)

  defineEmits<{
    'update:modelValue': [newRange: [number, number]]
  }>()

  const range = ref([0, 1])

  onMounted(() => {
    range.value = modelValue.value
  })
</script>
