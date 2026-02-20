<template>
  <div>
    <ContactTop />
    <section class="bg-white pb-16">
      <div class="relative">
        <div class="relative z-0">
          <ContactCtaImage />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ContactTop from "@/features/web/contact/ContactTop.vue";
import ContactCtaImage from "@/features/web/contact/ContactCtaImage.vue";

export default {
  name: "ContactPage",
  components: {
    ContactTop,
    ContactCtaImage,
  },
};
</script>
