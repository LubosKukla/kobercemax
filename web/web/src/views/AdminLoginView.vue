<template>
  <section
    class="min-h-screen bg-linear-to-b from-heading/90 via-heading/60 to-black/85 px-4 py-10 sm:py-16"
  >
    <div class="mx-auto w-full max-w-lg rounded-3xl border border-white/20 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.2)] sm:p-8">
      <h1 class="font-display text-4xl sm:text-5xl font-semibold leading-none">
        <span class="text-[#2f5d8a]">KOBERCE</span><span class="text-brand">MAX</span>
      </h1>
      <p class="mt-3 text-dark/75">
        Prihlasenie do administracie realizacii.
      </p>

      <form class="mt-5 space-y-2" @submit.prevent="submit">
        <BaseInput
          v-model="form.email"
          name="email"
          type="email"
          label="Email"
          placeholder="admin@kobercemax.sk"
          autocomplete="email"
          required
          :error="errors.email"
        />

        <BaseInput
          v-model="form.password"
          name="password"
          type="password"
          label="Heslo"
          placeholder="••••••••"
          autocomplete="current-password"
          required
          :error="errors.password"
        />

        <div class="px-2 pt-1">
          <BaseCheckbox v-model="form.remember">
            Zapamatat si prihlasenie
          </BaseCheckbox>
        </div>

        <div class="px-2 pt-2">
          <BaseButton type="submit" :disabled="isSubmitting" variant="primary">
            {{ isSubmitting ? "Prihlasujem..." : "Prihlasit sa" }}
          </BaseButton>
        </div>
      </form>
    </div>
  </section>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";
import BaseCheckbox from "@/components/commons/inputs/BaseCheckbox.vue";
import BaseInput from "@/components/commons/inputs/BaseInput.vue";
import { fetchAdminMe, loginAdmin } from "@/services/adminApi";
import useSnackbar from "@/composables/useSnackbar";

export default {
  name: "AdminLoginView",
  components: {
    BaseButton,
    BaseCheckbox,
    BaseInput,
  },
  setup() {
    const snackbar = useSnackbar();
    return {
      snackbar,
    };
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
        remember: false,
      },
      errors: {
        email: "",
        password: "",
      },
      isSubmitting: false,
    };
  },
  async created() {
    try {
      await fetchAdminMe();
      this.$router.replace({ name: "admin-realizations" });
    } catch (_error) {
      // user is not logged in; keep login page visible
    }
  },
  methods: {
    resetState() {
      this.errors.email = "";
      this.errors.password = "";
    },
    validate() {
      let isValid = true;

      if (!String(this.form.email || "").trim()) {
        this.errors.email = "Zadajte email.";
        isValid = false;
      }
      if (!String(this.form.password || "").trim()) {
        this.errors.password = "Zadajte heslo.";
        isValid = false;
      }

      return isValid;
    },
    applyServerErrors(serverErrors = {}) {
      if (Array.isArray(serverErrors.email) && serverErrors.email.length) {
        this.errors.email = serverErrors.email[0];
      }
      if (Array.isArray(serverErrors.password) && serverErrors.password.length) {
        this.errors.password = serverErrors.password[0];
      }
    },
    async submit() {
      this.resetState();

      if (!this.validate()) {
        this.snackbar.warning("Prosim, doplnte email a heslo.");
        return;
      }

      this.isSubmitting = true;

      try {
        await loginAdmin(this.form);
        this.snackbar.success("Prihlasenie prebehlo uspesne.");

        const target =
          typeof this.$route.query.redirect === "string" && this.$route.query.redirect.startsWith("/admin")
            ? this.$route.query.redirect
            : "/admin/realizations";

        this.$router.replace(target);
      } catch (error) {
        this.applyServerErrors(error.errors);
        this.snackbar.error(error.message || "Prihlasenie zlyhalo.");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
