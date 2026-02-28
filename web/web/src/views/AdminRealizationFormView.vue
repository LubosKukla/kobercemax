<template>
  <section class="space-y-5">
    <div class="rounded-2xl border border-black/10 bg-white p-5 sm:p-6">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 class="font-display text-3xl sm:text-4xl text-heading">
            {{ isEdit ? "Upravit realizaciu" : "Nova realizacia" }}
          </h1>
          <p class="mt-1 text-sm text-dark/70">
            Vyplnte udaje. Tagy pridavajte cez samostatne polia.
          </p>
        </div>
        <BaseButton to="/admin/realizations" variant="darkSolid"
          >Spat na zoznam</BaseButton
        >
      </div>

      <p
        v-if="globalMessage"
        class="mt-4 rounded-xl border border-brand/30 bg-brand/10 px-4 py-2 text-sm text-dark"
      >
        {{ globalMessage }}
      </p>
    </div>

    <form
      class="rounded-2xl border border-black/10 bg-white p-5 sm:p-6"
      @submit.prevent="submit"
    >
      <div
        v-if="coverPreview"
        class="mb-4 overflow-hidden rounded-2xl border border-black/10 bg-light/40"
      >
        <div
          class="flex items-center justify-between border-b border-black/10 px-4 py-3"
        >
          <p class="font-display text-lg text-heading">
            Hlavny obrazok realizacie
          </p>
          <span class="rounded-full bg-brand px-3 py-1 text-xs text-white"
            >Aktivny hlavny obrazok</span
          >
        </div>
        <img
          :src="coverPreview"
          alt="Hlavny obrazok realizacie"
          class="h-64 w-full object-cover sm:h-80"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <BaseInput
          v-model="form.title"
          name="title"
          label="Nazov"
          required
          :error="errors.title"
        />

        <BaseInput
          v-model="form.slug"
          name="slug"
          label="Slug"
          placeholder="automaticky sa doplni z nazvu"
          :error="errors.slug"
        />

        <BaseInput
          v-model="form.date"
          name="date"
          type="date"
          label="Datum"
          :error="errors.date"
        />
      </div>

      <div class="mt-2 grid grid-cols-1 xl:grid-cols-2 gap-2">
        <BaseTextarea
          v-model="form.excerpt"
          name="excerpt"
          label="Kratky popis"
          :error="errors.excerpt"
        />

        <BaseTextarea
          v-model="form.summary"
          name="summary"
          label="Dlhy popis"
          :error="errors.summary"
        />
      </div>

      <div
        class="mt-2 rounded-2xl border border-black/10 bg-light/40 p-3 sm:p-4"
      >
        <div class="px-2">
          <p class="text-sm font-semibold text-heading">Tagy</p>
          <p class="mt-1 text-xs text-dark/70">
            Po dopisani tagu sa automaticky prida nove prazdne pole.
          </p>
        </div>

        <div class="mt-2 space-y-1">
          <div
            v-for="(tag, index) in form.tags"
            :key="`tag-input-${index}`"
            class="flex items-start gap-2"
          >
            <div class="flex-1">
              <BaseInput
                v-model="form.tags[index]"
                :name="`tag-${index}`"
                :placeholder="
                  index === form.tags.length - 1 ? 'Novy tag' : 'Tag'
                "
                @input="onTagInput(index)"
                @blur="onTagBlur(index)"
              />
            </div>
            <button
              type="button"
              class="mt-2 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-black/10 bg-white text-sm font-semibold text-dark transition hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="!canRemoveTag(index)"
              @click="removeTagInput(index)"
              aria-label="Odstranit tag"
            >
              X
            </button>
          </div>
        </div>

        <p v-if="errors.tags" class="px-2 text-xs font-semibold text-brand">
          {{ errors.tags }}
        </p>
      </div>

      <div
        class="mt-4 rounded-2xl border border-black/10 bg-light/40 p-4 sm:p-5"
      >
        <p class="font-display text-xl text-heading">Galeria</p>
        <p class="mt-1 text-sm text-dark/70">
          Nahravajte fotky priamo. Vzdy vidite aktualny zoznam obrazkov.
        </p>

        <div class="mt-3">
          <BaseUpload
            v-model="pendingUpload"
            label="Nahrat fotky"
            accept="image/*"
            :multiple="true"
            :disabled="isUploading || isSaving || isLoading"
            @change="handleGalleryUpload"
          />
        </div>

        <p v-if="uploadMessage" class="mt-2 text-sm text-dark/80">
          {{ uploadMessage }}
        </p>
        <p v-if="errors.gallery" class="mt-2 text-sm text-brand">
          {{ errors.gallery }}
        </p>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <article
            v-for="(image, index) in form.gallery"
            :key="`gallery-image-${index}-${image}`"
            class="group relative overflow-hidden rounded-2xl border border-black/10 bg-white"
          >
            <img
              :src="previewSrc(image)"
              :alt="`Galeria ${index + 1}`"
              class="h-44 w-full object-cover"
              loading="lazy"
              decoding="async"
            />

            <span
              v-if="form.cover_image === image"
              class="absolute left-2 top-2 inline-flex items-center rounded-full bg-brand px-2 py-1 text-xs text-white"
            >
              ✓ Hlavny
            </span>

            <button
              type="button"
              class="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="removingImage === image || isSaving || isLoading"
              @click="removeGalleryItem(image)"
            >
              <span v-if="removingImage === image">...</span>
              <span v-else>X</span>
            </button>

            <button
              type="button"
              class="absolute left-2 bottom-2 rounded-full border border-white/40 bg-black/55 px-3 py-1 text-xs text-white transition hover:bg-black/80"
              @click="setAsCover(image)"
            >
              {{
                form.cover_image === image
                  ? "✓ Hlavny obrazok"
                  : "Nastavit ako hlavny"
              }}
            </button>
          </article>
        </div>

        <p v-if="!form.gallery.length" class="mt-4 text-sm text-dark/70">
          Zatial nie su nahrate ziadne fotky.
        </p>
      </div>

      <div class="mt-4 px-2">
        <BaseCheckbox v-model="form.is_published">
          Publikovat realizaciu
        </BaseCheckbox>
      </div>

      <div class="mt-6 px-2 flex flex-wrap items-center gap-2">
        <BaseButton
          type="submit"
          variant="primary"
          :disabled="isSaving || isLoading"
        >
          {{
            isSaving
              ? "Ukladam..."
              : isEdit
              ? "Ulozit zmeny"
              : "Vytvorit realizaciu"
          }}
        </BaseButton>
        <BaseButton to="/admin/realizations" variant="darkSolid"
          >Zrusit</BaseButton
        >
      </div>
    </form>
  </section>
</template>

<script>
import BaseButton from "@/components/commons/button/BaseButton.vue";
import BaseCheckbox from "@/components/commons/inputs/BaseCheckbox.vue";
import BaseInput from "@/components/commons/inputs/BaseInput.vue";
import BaseTextarea from "@/components/commons/inputs/BaseTextarea.vue";
import BaseUpload from "@/components/commons/inputs/BaseUpload.vue";
import {
  createAdminRealization,
  fetchAdminRealization,
  removeAdminGalleryImage,
  uploadAdminGalleryImage,
  updateAdminRealization,
} from "@/services/adminApi";

function makeEmptyForm() {
  return {
    title: "",
    slug: "",
    date: "",
    excerpt: "",
    summary: "",
    cover_image: "",
    gallery: [],
    tags: [""],
    is_published: true,
  };
}

export default {
  name: "AdminRealizationFormView",
  components: {
    BaseButton,
    BaseCheckbox,
    BaseInput,
    BaseTextarea,
    BaseUpload,
  },
  data() {
    return {
      isLoading: false,
      isSaving: false,
      isUploading: false,
      globalMessage: "",
      uploadMessage: "",
      pendingUpload: [],
      removingImage: "",
      form: makeEmptyForm(),
      errors: {},
    };
  },
  computed: {
    isEdit() {
      return this.$route.name === "admin-realization-edit";
    },
    realizationId() {
      return this.$route.params.id;
    },
    coverPreview() {
      return this.previewSrc(
        this.form.cover_image || this.form.gallery[0] || "",
      );
    },
  },
  async created() {
    if (!this.isEdit) return;
    await this.loadDetail();
  },
  methods: {
    toDateInputValue(value) {
      const raw = String(value || "").trim();
      if (!raw) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
        return raw;
      }

      const parsed = new Date(raw);
      if (Number.isNaN(parsed.getTime())) {
        return "";
      }

      return parsed.toISOString().slice(0, 10);
    },
    normalizeTagsForForm(tagsValue) {
      const cleaned = (Array.isArray(tagsValue) ? tagsValue : [])
        .map((tag) => String(tag || "").trim())
        .filter(Boolean);
      return [...cleaned, ""];
    },
    normalizeTagsForPayload() {
      return (Array.isArray(this.form.tags) ? this.form.tags : [])
        .map((tag) => String(tag || "").trim())
        .filter(Boolean);
    },
    ensureTagInputs() {
      const tags = Array.isArray(this.form.tags)
        ? this.form.tags.map((tag) => String(tag || ""))
        : [];

      const nonEmpty = tags.filter((tag) => tag.trim() !== "");
      this.form.tags = [...nonEmpty, ""];
    },
    onTagInput(index) {
      if (!Array.isArray(this.form.tags)) {
        this.form.tags = [""];
      }

      const value = String(this.form.tags[index] || "").trim();
      const isLast = index === this.form.tags.length - 1;

      if (isLast && value !== "") {
        this.form.tags.push("");
      }
    },
    onTagBlur(index) {
      if (!Array.isArray(this.form.tags)) {
        this.form.tags = [""];
        return;
      }

      const value = String(this.form.tags[index] || "").trim();
      const isLast = index === this.form.tags.length - 1;

      if (!isLast && value === "") {
        this.form.tags.splice(index, 1);
      }

      this.ensureTagInputs();
    },
    canRemoveTag(index) {
      if (!Array.isArray(this.form.tags)) return false;
      if (this.form.tags.length <= 1) return false;

      const value = String(this.form.tags[index] || "").trim();
      const isLast = index === this.form.tags.length - 1;

      if (!isLast) return true;
      return value !== "";
    },
    removeTagInput(index) {
      if (!Array.isArray(this.form.tags)) {
        this.form.tags = [""];
        return;
      }
      if (!this.canRemoveTag(index)) return;

      this.form.tags.splice(index, 1);
      this.ensureTagInputs();
    },
    normalizeCoverAndGallery() {
      const uniqueGallery = Array.from(
        new Set(
          (Array.isArray(this.form.gallery) ? this.form.gallery : []).filter(
            Boolean,
          ),
        ),
      );
      let cover = String(this.form.cover_image || "").trim();

      if (!cover && uniqueGallery.length) {
        cover = uniqueGallery[0];
      }

      if (cover && !uniqueGallery.includes(cover)) {
        uniqueGallery.unshift(cover);
      }

      if (cover && uniqueGallery.includes(cover)) {
        const withoutCover = uniqueGallery.filter((image) => image !== cover);
        this.form.gallery = [cover, ...withoutCover];
        this.form.cover_image = cover;
        return;
      }

      this.form.gallery = uniqueGallery;
      this.form.cover_image = uniqueGallery[0] || "";
    },
    resetErrors() {
      this.errors = {};
      this.globalMessage = "";
      this.uploadMessage = "";
    },
    applyFieldErrors(serverErrors = {}) {
      this.errors = {};
      Object.entries(serverErrors || {}).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length) {
          this.errors[field] = messages[0];
        }
      });
    },
    hydrateForm(item) {
      this.form = {
        title: item.title || "",
        slug: item.slug || "",
        date: this.toDateInputValue(item.date),
        excerpt: item.excerpt || "",
        summary: item.summary || "",
        cover_image: item.cover_image || "",
        gallery: Array.isArray(item.gallery) ? [...item.gallery] : [],
        tags: this.normalizeTagsForForm(item.tags),
        is_published: Boolean(item.is_published),
      };
      this.normalizeCoverAndGallery();
      this.ensureTagInputs();
    },
    previewSrc(image) {
      if (!image) return "";
      return image;
    },
    setAsCover(image) {
      if (!image) return;
      this.form.cover_image = image;
      this.normalizeCoverAndGallery();
    },
    insertNewestImage(imagePath) {
      if (!imagePath) return;

      const normalized = (
        Array.isArray(this.form.gallery) ? this.form.gallery : []
      ).filter((image) => image && image !== imagePath);
      const mainImage = String(this.form.cover_image || "").trim();

      if (mainImage) {
        const withoutMain = normalized.filter((image) => image !== mainImage);
        this.form.gallery = [mainImage, imagePath, ...withoutMain];
      } else {
        this.form.gallery = [imagePath, ...normalized];
      }
    },
    async handleGalleryUpload(fileInput) {
      const files = Array.isArray(fileInput)
        ? fileInput.filter(Boolean)
        : fileInput
        ? [fileInput]
        : [];
      if (!files.length) return;

      this.uploadMessage = "";
      this.isUploading = true;

      try {
        let uploadedCount = 0;

        for (const file of files) {
          const payload = await uploadAdminGalleryImage({
            file,
            slug: this.form.slug || this.form.title,
            realizationId: this.isEdit ? this.realizationId : null,
          });

          if (this.isEdit && Array.isArray(payload.gallery)) {
            this.form.gallery = [...payload.gallery];
            this.form.cover_image =
              payload.cover_image || this.form.cover_image;
          } else if (payload.path) {
            this.insertNewestImage(payload.path);
          }

          if (!this.form.cover_image && payload.path) {
            this.form.cover_image = payload.path;
          }

          uploadedCount += 1;
        }

        this.normalizeCoverAndGallery();

        this.uploadMessage =
          uploadedCount === 1
            ? "Fotka bola uspesne nahrata."
            : `Fotky boli uspesne nahrate (${uploadedCount}).`;
      } catch (error) {
        this.globalMessage = error.message || "Nahratie obrazka zlyhalo.";
      } finally {
        this.pendingUpload = [];
        this.isUploading = false;
      }
    },
    async removeGalleryItem(imagePath) {
      if (!imagePath) return;

      this.removingImage = imagePath;
      this.uploadMessage = "";

      try {
        if (this.isEdit) {
          const payload = await removeAdminGalleryImage(
            this.realizationId,
            imagePath,
          );
          this.form.gallery = Array.isArray(payload.gallery)
            ? payload.gallery
            : this.form.gallery.filter((image) => image !== imagePath);
          this.form.cover_image = payload.cover_image || "";
        } else {
          this.form.gallery = this.form.gallery.filter(
            (image) => image !== imagePath,
          );
        }

        if (this.form.cover_image === imagePath) {
          this.form.cover_image = this.form.gallery[0] || "";
        }

        this.normalizeCoverAndGallery();
      } catch (error) {
        this.globalMessage =
          error.message || "Odstranenie obrazka sa nepodarilo.";
      } finally {
        this.removingImage = "";
      }
    },
    async loadDetail() {
      this.isLoading = true;
      this.resetErrors();

      try {
        const item = await fetchAdminRealization(this.realizationId);
        this.hydrateForm(item);
      } catch (error) {
        this.globalMessage =
          error.message || "Nepodarilo sa nacitat realizaciu.";
      } finally {
        this.isLoading = false;
      }
    },
    validate() {
      let ok = true;
      this.errors = {};

      if (!String(this.form.title || "").trim()) {
        this.errors.title = "Nazov je povinny.";
        ok = false;
      }

      this.normalizeCoverAndGallery();
      this.ensureTagInputs();

      return ok;
    },
    async submit() {
      this.resetErrors();
      if (!this.validate()) return;

      this.isSaving = true;

      try {
        const payload = {
          ...this.form,
          tags: this.normalizeTagsForPayload(),
        };

        if (this.isEdit) {
          await updateAdminRealization(this.realizationId, payload);
          this.$router.push({
            name: "admin-realizations",
            query: { status: "updated" },
          });
          return;
        }

        await createAdminRealization(payload);
        this.$router.push({
          name: "admin-realizations",
          query: { status: "created" },
        });
      } catch (error) {
        this.applyFieldErrors(error.errors);
        this.globalMessage = error.message || "Ulozenie sa nepodarilo.";
      } finally {
        this.isSaving = false;
      }
    },
  },
};
</script>
