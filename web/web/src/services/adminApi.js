import axios from "axios";

const API_BASE_URL = (process.env.VUE_APP_API_BASE_URL || "http://127.0.0.1:8000/api").replace(
  /\/$/,
  ""
);

const adminClient = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
  },
});

function normalizeArrayInput(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/\r\n|\r|\n/g)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeRealizationPayload(payload = {}) {
  return {
    title: String(payload.title || "").trim(),
    slug: String(payload.slug || "").trim() || null,
    date: String(payload.date || "").trim() || null,
    excerpt: String(payload.excerpt || "").trim() || null,
    summary: String(payload.summary || "").trim() || null,
    cover_image: String(payload.cover_image || "").trim() || null,
    gallery: normalizeArrayInput(payload.gallery),
    tags: normalizeArrayInput(payload.tags),
    is_published: Boolean(payload.is_published),
  };
}

function parseApiError(error, fallbackMessage = "Operacia zlyhala.") {
  const status = error?.response?.status || 500;
  const payload = error?.response?.data || {};

  return {
    status,
    message: payload?.message || fallbackMessage,
    errors: payload?.errors && typeof payload.errors === "object" ? payload.errors : {},
  };
}

export async function loginAdmin({ email, password, remember = false }) {
  try {
    const { data } = await adminClient.post("/login", {
      email,
      password,
      remember,
    });
    return data;
  } catch (error) {
    throw parseApiError(error, "Prihlasenie zlyhalo.");
  }
}

export async function logoutAdmin() {
  try {
    const { data } = await adminClient.post("/logout");
    return data;
  } catch (error) {
    throw parseApiError(error, "Odhlasenie zlyhalo.");
  }
}

export async function fetchAdminMe() {
  try {
    const { data } = await adminClient.get("/me");
    return data;
  } catch (error) {
    throw parseApiError(error, "Nepodarilo sa overit prihlasenie.");
  }
}

export async function fetchAdminRealizations({ q = "", page = 1, perPage = 20 } = {}) {
  try {
    const { data } = await adminClient.get("/realizations", {
      params: {
        q: q || undefined,
        page,
        per_page: perPage,
      },
    });
    return data;
  } catch (error) {
    throw parseApiError(error, "Nepodarilo sa nacitat realizacie.");
  }
}

export async function fetchAdminRealization(id) {
  try {
    const { data } = await adminClient.get(`/realizations/${id}`);
    return data;
  } catch (error) {
    throw parseApiError(error, "Realizacia nebola najdena.");
  }
}

export async function createAdminRealization(payload) {
  try {
    const { data } = await adminClient.post("/realizations", normalizeRealizationPayload(payload));
    return data;
  } catch (error) {
    throw parseApiError(error, "Nepodarilo sa vytvorit realizaciu.");
  }
}

export async function updateAdminRealization(id, payload) {
  try {
    const { data } = await adminClient.put(
      `/realizations/${id}`,
      normalizeRealizationPayload(payload)
    );
    return data;
  } catch (error) {
    throw parseApiError(error, "Nepodarilo sa ulozit zmeny.");
  }
}

export async function deleteAdminRealization(id) {
  try {
    const { data } = await adminClient.delete(`/realizations/${id}`);
    return data;
  } catch (error) {
    throw parseApiError(error, "Nepodarilo sa vymazat realizaciu.");
  }
}

export async function uploadAdminGalleryImage({ file, slug = "", realizationId = null }) {
  const formData = new FormData();
  formData.append("image", file);
  if (slug) {
    formData.append("slug", slug);
  }
  if (realizationId) {
    formData.append("realization_id", String(realizationId));
  }

  try {
    const { data } = await adminClient.post("/realizations/gallery/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  } catch (error) {
    throw parseApiError(error, "Nepodarilo sa nahrat obrazok.");
  }
}

export async function removeAdminGalleryImage(realizationId, imagePath) {
  try {
    const { data } = await adminClient.delete(`/realizations/${realizationId}/gallery`, {
      data: {
        image: imagePath,
        delete_file: true,
      },
    });
    return data;
  } catch (error) {
    throw parseApiError(error, "Nepodarilo sa odstranit obrazok.");
  }
}

export async function toggleAdminRealizationPublished(id) {
  try {
    const { data } = await adminClient.post(`/realizations/${id}/toggle-published`);
    return data;
  } catch (error) {
    throw parseApiError(error, "Nepodarilo sa zmenit stav publikovania.");
  }
}
