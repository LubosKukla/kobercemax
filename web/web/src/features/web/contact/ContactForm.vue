<template>
  <div
    class="rounded-3xl bg-white p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] max-w-2xl border border-black/10"
  >
    <h2 class="font-display text-3xl sm:text-4xl font-bold text-heading">NAPÍŠTE NÁM</h2>
    <p class="mt-2 text-sm text-dark/60">Môžete nás kedykoľvek kontaktovať</p>

    <form class="mt-6 grid gap-4" novalidate @submit.prevent="handleSubmit">
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
      <div class="px-2">
        <BaseCheckbox
          v-model="form.privacyConsent"
          :error="errors.privacy_consent"
          @change="onPrivacyConsentChange"
        >
          Súhlasím so spracovaním osobných údajov.
        </BaseCheckbox>
        <p class="mt-1 pl-8 text-xs text-dark/70">
          Viac informácií nájdete v
          <router-link
            to="/zasady-ochrany-sukromia"
            class="text-dark underline underline-offset-2 hover:text-brand"
          >
            Zásadách ochrany osobných údajov
          </router-link>
          .
        </p>
      </div>

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
  </div>
</template>

<script>
import BaseInput from "@/components/commons/inputs/BaseInput.vue";
import BaseTextarea from "@/components/commons/inputs/BaseTextarea.vue";
import BaseCheckbox from "@/components/commons/inputs/BaseCheckbox.vue";
import BaseButton from "@/components/commons/button/BaseButton.vue";
import { sendContactForm } from "@/services/contactApi";
import { trackContactFormError, trackContactLead } from "@/services/analytics";

export default {
  name: "ContactForm",
  components: {
    BaseInput,
    BaseTextarea,
    BaseCheckbox,
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
        privacyConsent: false,
      },
      errors: {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        message: "",
        privacy_consent: "",
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
        privacy_consent: "",
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
        privacyConsent: false,
      };
    },
    onPrivacyConsentChange(checked) {
      if (checked) {
        this.errors.privacy_consent = "";
        if (this.submitError === "Prosím, skontrolujte vyznačené polia vo formulári.") {
          this.submitError = "";
        }
      }
    },
    validateForm() {
      this.clearErrors();

      const firstName = this.form.firstName.trim();
      const lastName = this.form.lastName.trim();
      const email = this.form.email.trim();
      const phone = this.form.phone.trim();
      const message = this.form.message.trim();
      const privacyConsent = Boolean(this.form.privacyConsent);

      if (!firstName) {
        this.errors.first_name = "Prosím, zadajte meno.";
      }

      if (!lastName) {
        this.errors.last_name = "Prosím, zadajte priezvisko.";
      }

      if (!email) {
        this.errors.email = "Prosím, zadajte email.";
      } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (!emailPattern.test(email)) {
          this.errors.email = "Zadajte email v správnom formáte.";
        }
      }

      if (phone) {
        const phonePattern = /^[+0-9()\s-]+$/;
        const phoneDigitsCount = phone.replace(/\D/g, "").length;
        if (!phonePattern.test(phone) || phoneDigitsCount < 9) {
          this.errors.phone = "Zadajte platné telefónne číslo.";
        }
      }

      if (!message) {
        this.errors.message = "Prosím, napíšte správu.";
      } else if (message.length < 10) {
        this.errors.message = "Správa musí mať aspoň 10 znakov.";
      }

      if (!privacyConsent) {
        this.errors.privacy_consent =
          "Pre odoslanie formulára je potrebný súhlas so zásadami ochrany osobných údajov.";
      }

      this.form = {
        firstName,
        lastName,
        email,
        phone,
        message,
        privacyConsent,
      };

      return !Object.values(this.errors).some(Boolean);
    },
    async handleSubmit() {
      if (this.isSubmitting) return;

      this.submitError = "";
      this.submitSuccess = "";
      const isValid = this.validateForm();
      if (!isValid) {
        this.submitError = "Prosím, skontrolujte vyznačené polia vo formulári.";
        return;
      }

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
        trackContactLead();
        this.resetForm();
      } catch (error) {
        this.mapApiValidationErrors(error.errors);
        trackContactFormError();
        this.submitError =
          error.message || "Správu sa nepodarilo odoslať. Skúste to prosím neskôr.";
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
