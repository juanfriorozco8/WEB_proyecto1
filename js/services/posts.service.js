import { formatAuthorName } from "../utils/dom.js";

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
