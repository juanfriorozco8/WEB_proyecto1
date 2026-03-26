import { get } from "../core/client.js";

export function fetchUsers({ limit = 100, skip = 0 } = {}) {
  return get(`/users?limit=${limit}&skip=${skip}`);
}

export function fetchPostsByUser(userId, { limit = 20, skip = 0 } = {}) {
  return get(`/posts/user/${userId}?limit=${limit}&skip=${skip}`);
}
