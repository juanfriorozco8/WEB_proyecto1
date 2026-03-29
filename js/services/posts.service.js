import { formatAuthorName } from "../utils/dom.js";
import { setUiError, setUiSuccess } from "../core/state.js";

export function normalizePost(post) {
  return {
    id: Number(post.id),
    title: String(post.title || "").trim(),
    body: String(post.body || "").trim(),
    userId: Number(post.userId) || 0,
    tags: Array.isArray(post.tags) ? post.tags : [],
    reactions: Number(post.reactions?.likes ?? post.reactions ?? 0),
    views: Number(post.views || 0)
  };
}

export function normalizeUser(user) {
  return {
    id: Number(user.id),
    firstName: String(user.firstName || "").trim(),
    lastName: String(user.lastName || "").trim(),
    username: String(user.username || "").trim(),
    email: String(user.email || "").trim(),
    company: user.company?.name || ""
  };
}

export function mergePostsWithAuthors(posts, users) {
  const usersById = new Map(users.map((user) => [user.id, user]));
  return posts.map((post) => {
    const author = usersById.get(post.userId) || null;
    return { ...post, author, authorName: formatAuthorName(author) };
  });
}

export function paginatePosts(posts, page = 1, limit = 9) {
  const totalItems = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (safePage - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    items: posts.slice(startIndex, endIndex),
    page: safePage,
    totalPages,
    totalItems,
    limit
  };
}

export function getUniqueTags(posts) {
  const tags = new Set();
  posts.forEach((post) => { post.tags.forEach((tag) => tags.add(tag)); });
  return Array.from(tags).sort((a, b) => a.localeCompare(b));
}

export function getAuthorSummary(posts, users) {
  const counts = new Map();
  posts.forEach((post) => {
    counts.set(post.userId, (counts.get(post.userId) || 0) + 1);
  });
  return users
    .map((user) => ({ ...user, totalPosts: counts.get(user.id) || 0 }))
    .filter((user) => user.totalPosts > 0)
    .sort((a, b) => b.totalPosts - a.totalPosts);
}

export function notifySuccess(message) {
  setUiSuccess(message);
}

export function notifyError(message) {
  setUiError(message);
}
