const API_BASE_URL = (process.env.VUE_APP_API_BASE_URL || "http://127.0.0.1:8000").replace(
  /\/$/,
  ""
);

function parseErrorPayload(payload) {
  if (payload?.errors && typeof payload.errors === "object") {
    return {
      message: payload.message || "Formulár obsahuje neplatné údaje.",
      errors: payload.errors,
    };
  }

  return {
    message: payload?.message || "Správu sa nepodarilo odoslať.",
    errors: null,
  };
}

export async function sendContactForm(form) {
  const response = await fetch(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(form),
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const parsed = parseErrorPayload(payload);
    const error = new Error(parsed.message);
    error.status = response.status;
    error.errors = parsed.errors;
    throw error;
  }

  return payload;
}
