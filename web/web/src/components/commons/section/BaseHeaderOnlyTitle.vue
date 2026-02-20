<template>
  <div class="text-center pt-16">
    <h1 class="font-display font-bold text-4xl sm:text-8xl lg:text-9xl text-dark">
      {{ title }}
    </h1>
  </div>
</template>

<script>
export default {
  name: "BaseHeaderOnlyTitle",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

