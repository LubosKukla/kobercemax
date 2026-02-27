<template>
  <div
    class="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] max-w-2xl border border-black/10"
  >
    <h2 class="font-display text-3xl sm:text-4xl font-bold text-heading">NAPÍŠTE NÁM</h2>
    <p class="mt-2 text-sm text-dark/60">Môžete nás kedykoľvek kontaktovať</p>

    <form class="mt-6 grid gap-4" @submit.prevent="handleSubmit">
      <div class="grid gap-4 sm:grid-cols-2">
        <BaseInput
          v-model="form.firstName"
          label="Meno"
          placeholder="Jan"
          required
          :error="errors.first_name"
        />
        <BaseInput
          v-model="form.lastName"
          label="Priezvisko"
          placeholder="Novák"
          required
          :error="errors.last_name"
        />
      </div>
      <BaseInput
        v-model="form.email"
        type="email"
        label="Email"
        placeholder="jan.novak@gmail.com"
        required
        :error="errors.email"
      />
      <BaseInput
        v-model="form.phone"
        type="tel"
        label="Tel. číslo"
        placeholder="+421 900 000 000"
        :error="errors.phone"
      />
      <BaseTextarea
        v-model="form.message"
        label="Správa"
        placeholder="Napíšte nám"
        rows="5"
        required
        :error="errors.message"
      />

      <p v-if="submitError" class="px-2 text-sm font-semibold text-brand">
        {{ submitError }}
      </p>
      <p v-if="submitSuccess" class="px-2 text-sm font-semibold text-dark">
        {{ submitSuccess }}
      </p>

      <div class="pt-2">
        <BaseButton
          variant="darkSolid"
          type="submit"
          class="w-full py-3 text-base"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? "Odosielam..." : "Odoslať správu" }}
        </BaseButton>
      </div>
    </form>

    <p class="mt-4 text-xs text-dark/60 text-center">
      Tým, že nás kontaktujete, súhlasíte so spracovaním osobných údajov podľa
      <router-link
        to="/zasady-ochrany-sukromia"
        class="text-dark underline underline-offset-2"
      >
        Zásad ochrany osobných údajov
      </router-link>
    </p>
  </div>
</template>

<script>
import BaseInput from "@/components/commons/inputs/BaseInput.vue";
import BaseTextarea from "@/components/commons/inputs/BaseTextarea.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";
import { sendContactForm } from "@/services/contactApi";

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
      errors: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
      },
      isSubmitting: false,
      submitError: "",
      submitSuccess: "",
    };
  },
  methods: {
    clearErrors() {
      this.errors = {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
      };
    },
    mapApiValidationErrors(apiErrors) {
      this.clearErrors();
      if (!apiErrors) return;

      Object.keys(this.errors).forEach((key) => {
        const fieldError = apiErrors[key];
        if (Array.isArray(fieldError) && fieldError.length) {
          this.errors[key] = fieldError[0];
        }
      });
    },
    resetForm() {
      this.form = {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      };
    },
    async handleSubmit() {
      if (this.isSubmitting) return;

      this.submitError = "";
      this.submitSuccess = "";
      this.clearErrors();
      this.isSubmitting = true;

      try {
        const payload = {
          first_name: this.form.firstName,
          last_name: this.form.lastName,
          email: this.form.email,
          phone: this.form.phone,
          message: this.form.message,
        };

        const response = await sendContactForm(payload);
        this.submitSuccess =
          response?.message || "Ďakujeme, správu sme prijali. Čoskoro sa vám ozveme.";
        this.resetForm();
      } catch (error) {
        this.mapApiValidationErrors(error.errors);
        this.submitError =
          error.message || "Správu sa nepodarilo odoslať. Skúste to prosím neskôr.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
