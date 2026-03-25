import { get, post as postRequest } from "../core/client.js";

export function fetchPosts({ limit = 300, skip = 0 } = {}) {
  return get(`/posts?limit=${limit}&skip=${skip}`);
}

export function fetchPostById(postId) {
  return get(`/posts/${postId}`);
}

export function createPost(payload) {
  return postRequest("/posts/add", payload);
}
