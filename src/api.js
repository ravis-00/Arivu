// src/api.js

const BASE_URL =
  "https://script.google.com/macros/s/AKfycbxlIIPCz4j0FGWJwB68p53EtU7KbqTScLyec3zTHXZU0WzioyvFFitl56eVZumb3DNeXg/exec";

/**
 * Small helper to build a URL with query params (for GET)
 */
function buildUrl(params) {
  const url = new URL(BASE_URL);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
}

// ---- Helpers ----

/**
 * Generic GET helper – expects JSON response from Apps Script.
 */
async function getJson(urlOrParams) {
  const url =
    typeof urlOrParams === "string" ? urlOrParams : buildUrl(urlOrParams);

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("GET error", res.status, text);
    throw new Error(`HTTP ${res.status}`);
  }
  return res.json();
}

/**
 * Generic POST helper – sends JSON as request body.
 *
 * NOTE:
 * We intentionally do NOT set a custom Content-Type header.
 * This avoids a CORS preflight (OPTIONS) call, and Apps Script
 * can still read the body using e.postData.contents.
 */
async function postJson(data) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    console.error("POST error", res.status, text);
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}

// ---- API functions ----

// List of prakalpas (and locations)
export async function fetchPrakalpas() {
  return getJson({ action: "getPrakalpas" });
}

// Questions for a specific prakalpa + employee
export async function fetchQuestions(prakalpaCode, employeeId, location) {
  return getJson({
    action: "getQuestions",
    prakalpaCode,
    employeeId,
    location,
  });
}

// Save quiz result
export async function submitResult(payload) {
  return postJson({
    action: "submitResult",
    ...payload,
  });
}

// Dashboard summary
export async function fetchDashboard() {
  return getJson({ action: "getDashboard" });
}

// (optional later) Fetch certificate info by employee
export async function fetchCertificate(prakalpaCode, employeeId) {
  return getJson({
    action: "getCertificate",
    prakalpaCode,
    employeeId,
  });
}
