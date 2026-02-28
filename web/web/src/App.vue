<template>
  <router-view />
  <SnackbarStack />
</template>

<script>
import SnackbarStack from "@/components/commons/snackbar/SnackbarStack.vue";

export default {
  name: "AppRoot",
  components: {
    SnackbarStack,
  },
};
</script>
