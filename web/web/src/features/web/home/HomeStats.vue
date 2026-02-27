<template>
  <BaseStatsCounter class="-mt-24 relative z-10" :items="stats" theme="dark" />
</template>

<script>
import BaseStatsCounter from "@/components/commons/base/BaseStatsCounter.vue";

export default {
  name: "HomeStats",
  components: {
    BaseStatsCounter,
  },
  data() {
    return {
      stats: [
        {
          value: 1000,
          suffix: "+",
          label: "produktov skladom",
          text: "široký výber pripravený ihneď",
        },
        {
          value: 100,
          suffix: "+",
          label: "druhov podláh",
          text: "pre domácnosti aj firmy",
        },
        {
          value: 25,
          suffix: "+",
          label: "rokov skúseností",
          text: "od návrhu po montáž",
        },
        {
          value: 100,
          suffix: "+",
          label: "realizácií ročne",
          text: "po celom Slovensku",
        },
      ],
    };
  },
};
</script>
