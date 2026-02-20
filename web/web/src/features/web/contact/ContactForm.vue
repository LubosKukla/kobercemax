<template>
  <div class="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-black/10">
    <h2 class="font-display text-3xl sm:text-4xl font-bold text-heading">NAPÍŠTE NÁM</h2>
    <p class="mt-2 text-sm text-dark/60">Môžete nás kedykoľvek kontaktovať</p>

    <form class="mt-6 grid gap-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <BaseInput v-model="form.firstName" label="Meno" placeholder="Jan" />
        <BaseInput v-model="form.lastName" label="Priezvisko" placeholder="Novák" />
      </div>
      <BaseInput v-model="form.email" type="email" label="Email" placeholder="jan.novak@gmail.com" />
      <BaseInput v-model="form.phone" type="tel" label="Tel. číslo" placeholder="+421 900 000 000" />
      <BaseTextarea v-model="form.message" label="Správa" placeholder="Napíšte nám" rows="5" />

      <div class="pt-2">
        <BaseButton variant="darkSolid" type="submit" class="w-full py-3 text-base">
          Odoslať správu
        </BaseButton>
      </div>
    </form>

    <p class="mt-4 text-xs text-dark/60 text-center">
      Tým, že nás kontaktujete, súhlasíte s našimi
      <span class="text-dark underline underline-offset-2">Podmienkami používania</span>
      a
      <span class="text-dark underline underline-offset-2">Zásady ochrany osobných údajov</span>
    </p>
  </div>
</template>

<script>
import BaseInput from "@/components/commons/inputs/BaseInput.vue";
import BaseTextarea from "@/components/commons/inputs/BaseTextarea.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";

export default {
  name: "ContactForm",
  components: {
    BaseInput,
    BaseTextarea,
    BaseButton,
  },
  data() {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      },
    };
  },
};
</script>
