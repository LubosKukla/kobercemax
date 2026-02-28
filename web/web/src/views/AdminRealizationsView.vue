<template>
  <section class="space-y-5">
    <div class="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="font-display text-3xl sm:text-4xl text-heading">Realizacie</h1>
          <p class="mt-1 text-sm text-dark/70">Sprava realizacii ulozenych v databaze.</p>
        </div>
        <BaseButton to="/admin/realizations/new" variant="primary">Pridat realizaciu</BaseButton>
      </div>

      <form class="mt-4 flex flex-wrap items-center gap-2" @submit.prevent="applySearch">
        <div class="min-w-[260px] flex-1">
          <BaseInput
            v-model="searchInput"
            name="q"
            type="search"
            placeholder="Hladajte podla nazvu alebo slugu"
          />
        </div>
        <BaseButton type="submit" variant="darkSolid">Hladaj</BaseButton>
      </form>

      <p
        v-if="statusMessage"
        class="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm text-green-700"
      >
        {{ statusMessage }}
      </p>
      <p
        v-if="errorMessage"
        class="mt-4 rounded-xl border border-brand/30 bg-brand/10 px-4 py-2 text-sm text-dark"
      >
        {{ errorMessage }}
      </p>
    </div>

    <div class="rounded-2xl border border-black/10 bg-white p-4 sm:p-5">
      <div v-if="isLoading" class="py-8 text-center text-dark/70">Nacitavam realizacie...</div>

      <div v-else class="overflow-x-auto">
        <table class="w-full min-w-[860px] text-left">
          <thead>
            <tr class="border-b border-black/10 text-xs uppercase tracking-[0.12em] text-dark/60">
              <th class="px-3 py-3">ID</th>
              <th class="px-3 py-3">Nazov</th>
              <th class="px-3 py-3">Slug</th>
              <th class="px-3 py-3">Datum</th>
              <th class="px-3 py-3">Stav</th>
              <th class="px-3 py-3">Akcie</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in rows"
              :key="`admin-realization-${item.id}`"
              class="border-b border-black/10 align-top"
            >
              <td class="px-3 py-3 text-sm text-dark/75">
                <p>{{ item.id }}</p>
              </td>
              <td class="px-3 py-3 text-sm font-semibold text-heading">
                {{ item.title }}
              </td>
              <td class="px-3 py-3 text-sm text-dark/70">{{ item.slug }}</td>
              <td class="px-3 py-3 text-sm text-dark/70">{{ formatDate(item.date) }}</td>
              <td class="px-3 py-3">
                <span
                  class="inline-flex cursor-pointer rounded-full px-3 py-1 text-xs font-medium transition"
                  :class="
                    item.is_published
                      ? 'bg-green-100 text-green-700'
                      : 'bg-black/10 text-dark/70'
                  "
                  :style="isTogglingId === item.id ? 'opacity:.6;pointer-events:none;' : ''"
                  :title="'Dvojklik pre prepnutie publikovania'"
                  @dblclick="togglePublished(item)"
                >
                  {{ item.is_published ? "Publikovane" : "Skryte" }}
                </span>
              </td>
              <td class="px-3 py-3">
                <div class="flex items-center gap-2">
                  <BaseButton :to="`/admin/realizations/${item.id}/edit`" variant="darkSolid">
                    Upravit
                  </BaseButton>
                  <BaseButton
                    variant="primary"
                    :disabled="isDeletingId === item.id"
                    @click="removeItem(item)"
                  >
                    {{ isDeletingId === item.id ? "Mazem..." : "Vymazat" }}
                  </BaseButton>
                </div>
              </td>
            </tr>

            <tr v-if="!rows.length">
              <td colspan="6" class="px-3 py-8 text-center text-dark/60">
                Zatial tu nie su ziadne realizacie.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p class="text-sm text-dark/70">
          Celkom: <strong>{{ pagination.total }}</strong> realizacii
        </p>
        <div class="flex items-center gap-2">
          <BaseButton
            variant="darkSolid"
            :disabled="pagination.currentPage <= 1 || isLoading"
            @click="loadPage(pagination.currentPage - 1)"
          >
            Predchadzajuca
          </BaseButton>
          <span class="text-sm text-dark/70">
            Strana {{ pagination.currentPage }} / {{ pagination.lastPage }}
          </span>
          <BaseButton
            variant="darkSolid"
            :disabled="pagination.currentPage >= pagination.lastPage || isLoading"
            @click="loadPage(pagination.currentPage + 1)"
          >
            Dalsia
          </BaseButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";
import BaseInput from "@/components/commons/inputs/BaseInput.vue";
import {
  deleteAdminRealization,
  fetchAdminRealizations,
  toggleAdminRealizationPublished,
} from "@/services/adminApi";

export default {
  name: "AdminRealizationsView",
  components: {
    BaseButton,
    BaseInput,
  },
  data() {
    return {
      rows: [],
      searchInput: "",
      isLoading: false,
      isDeletingId: null,
      isTogglingId: null,
      errorMessage: "",
      statusMessage: "",
      searchDebounceTimer: null,
      lastAppliedSearch: "",
      pagination: {
        currentPage: 1,
        lastPage: 1,
        total: 0,
      },
    };
  },
  created() {
    this.searchInput = String(this.$route.query.q || "");
    this.lastAppliedSearch = this.searchInput.trim();
    this.statusMessage = this.resolveStatusMessage();
    const initialPage = Number(this.$route.query.page || 1);
    this.loadPage(initialPage > 0 ? initialPage : 1);
  },
  beforeUnmount() {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
      this.searchDebounceTimer = null;
    }
  },
  watch: {
    searchInput() {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
      }
      this.searchDebounceTimer = setTimeout(() => {
        this.applySearch();
      }, 450);
    },
  },
  methods: {
    resolveStatusMessage() {
      const status = this.$route.query.status;
      if (status === "created") return "Realizacia bola vytvorena.";
      if (status === "updated") return "Realizacia bola upravena.";
      return "";
    },
    formatDate(value) {
      if (!value) return "-";
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return value;
      return new Intl.DateTimeFormat("sk-SK", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(parsed);
    },
    async loadPage(page = 1) {
      this.isLoading = true;
      this.errorMessage = "";
      const searchTerm = this.searchInput.trim();

      try {
        const payload = await fetchAdminRealizations({
          q: searchTerm,
          page,
          perPage: 20,
        });

        this.rows = Array.isArray(payload.data) ? payload.data : [];
        this.pagination.currentPage = Number(payload.current_page || 1);
        this.pagination.lastPage = Number(payload.last_page || 1);
        this.pagination.total = Number(payload.total || 0);
        this.lastAppliedSearch = searchTerm;

        const query = {};
        if (searchTerm) query.q = searchTerm;
        if (this.pagination.currentPage > 1) query.page = String(this.pagination.currentPage);
        if (this.$route.query.status) query.status = this.$route.query.status;

        this.$router.replace({ name: "admin-realizations", query });
      } catch (error) {
        this.errorMessage = error.message || "Nepodarilo sa nacitat realizacie.";
      } finally {
        this.isLoading = false;
      }
    },
    applySearch() {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer);
        this.searchDebounceTimer = null;
      }
      const normalized = this.searchInput.trim();
      if (normalized === this.lastAppliedSearch && this.pagination.currentPage === 1) return;
      this.loadPage(1);
    },
    async togglePublished(item) {
      if (!item?.id || this.isTogglingId === item.id) return;

      this.isTogglingId = item.id;
      this.errorMessage = "";

      try {
        const updated = await toggleAdminRealizationPublished(item.id);
        const index = this.rows.findIndex((row) => row.id === item.id);
        if (index !== -1) {
          this.rows[index] = updated;
        }
      } catch (error) {
        this.errorMessage = error.message || "Nepodarilo sa prepnut stav publikovania.";
      } finally {
        this.isTogglingId = null;
      }
    },
    async removeItem(item) {
      if (!item?.id) return;
      const confirmed = window.confirm(`Naozaj chcete vymazat realizaciu "${item.title}"?`);
      if (!confirmed) return;

      this.isDeletingId = item.id;
      this.errorMessage = "";

      try {
        await deleteAdminRealization(item.id);
        const targetPage =
          this.rows.length === 1 && this.pagination.currentPage > 1
            ? this.pagination.currentPage - 1
            : this.pagination.currentPage;
        await this.loadPage(targetPage);
      } catch (error) {
        this.errorMessage = error.message || "Vymazanie sa nepodarilo.";
      } finally {
        this.isDeletingId = null;
      }
    },
  },
};
</script>
