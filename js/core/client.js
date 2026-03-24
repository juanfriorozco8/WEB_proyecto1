const BASE_URL = "https://dummyjson.com";

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.message || `Error HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export function get(path) {
  return request(path, { method: "GET" });
}

export function post(path, data) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export function patch(path, data) {
  return request(path, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}

export function deleteRequest(path) {
  return request(path, { method: "DELETE" });
}
