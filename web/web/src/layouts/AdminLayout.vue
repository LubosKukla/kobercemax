<template>
  <div class="min-h-screen bg-light">
    <header class="bg-dark text-white border-b border-white/10">
      <div class="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="font-display text-xl sm:text-2xl leading-none">
            <span class="text-[#5d8fbf]">KOBERCE</span><span class="text-brand">MAX</span>
          </p>
          <p class="text-xs text-white/70 mt-1">Admin realizacii</p>
        </div>

        <div class="flex items-center gap-2">
          <RouterLink
            to="/admin/realizations"
            class="rounded-full border px-4 py-2 text-sm transition"
            :class="
              $route.name === 'admin-realizations'
                ? 'border-brand bg-brand text-white'
                : 'border-white/30 text-white hover:border-white'
            "
          >
            Realizacie
          </RouterLink>

          <RouterLink
            to="/admin/realizations/new"
            class="rounded-full border px-4 py-2 text-sm transition"
            :class="
              $route.name === 'admin-realization-create'
                ? 'border-brand bg-brand text-white'
                : 'border-white/30 text-white hover:border-white'
            "
          >
            Nova realizacia
          </RouterLink>
        </div>

        <div class="flex items-center gap-3">
          <p class="hidden sm:block text-sm text-white/80">
            {{ userLabel }}
          </p>
          <BaseButton variant="soft" :disabled="isLoggingOut" @click="logout">
            {{ isLoggingOut ? "Odhlasujem..." : "Odhlasit" }}
          </BaseButton>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";
import { fetchAdminMe, logoutAdmin } from "@/services/adminApi";
import useSnackbar from "@/composables/useSnackbar";

export default {
  name: "AdminLayout",
  components: {
    BaseButton,
  },
  setup() {
    const snackbar = useSnackbar();
    return {
      snackbar,
    };
  },
  data() {
    return {
      user: null,
      isLoggingOut: false,
    };
  },
  computed: {
    userLabel() {
      const email = this.user?.email || "";
      return email ? `Prihlaseny: ${email}` : "Prihlaseny admin";
    },
  },
  async created() {
    await this.loadUser();
  },
  methods: {
    async loadUser() {
      try {
        const payload = await fetchAdminMe();
        this.user = payload?.user || null;
      } catch (error) {
        if (this.$route.name !== "admin-login") {
          this.snackbar.info(error?.message || "Prihlasenie vyprsalo. Prihlaste sa znova.");
        }
        this.$router.replace({
          name: "admin-login",
          query: { redirect: this.$route.fullPath },
        });
      }
    },
    async logout() {
      this.isLoggingOut = true;
      try {
        await logoutAdmin();
        this.snackbar.success("Boli ste odhlaseny.");
      } catch (error) {
        // Continue and force logout in UI regardless of backend response.
        this.snackbar.warning(error?.message || "Odhlasenie sa nepodarilo overit.");
      } finally {
        this.isLoggingOut = false;
        this.$router.replace({ name: "admin-login" });
      }
    },
  },
};
</script>
