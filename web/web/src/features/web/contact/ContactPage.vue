<template>
  <div>
    <ContactTop />
    <section class="bg-white pb-16">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 grid gap-6 lg:grid-cols-[1.05fr_1.2fr] items-stretch">
        <ContactForm />
        <ContactCtaImage />
      </div>
    </section>
  </div>
</template>

<script>
import ContactTop from "@/features/web/contact/ContactTop.vue";
import ContactForm from "@/features/web/contact/ContactForm.vue";
import ContactCtaImage from "@/features/web/contact/ContactCtaImage.vue";

export default {
  name: "ContactPage",
  components: {
    ContactTop,
    ContactForm,
    ContactCtaImage,
  },
};
</script>
