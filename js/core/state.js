const defaultFilters = {
  query: "",
  userId: "",
  tag: "",
  sort: "newest"
};

export const state = {
  posts: [],
  users: [],
  filteredPosts: [],
  currentPost: null,
  pagination: {
    page: 1,
    limit: 9,
    total: 0
  },
  filters: { ...defaultFilters },
  ui: {
    loading: false,
    error: null,
    success: null
  },
  meta: {
    didLoadInitialData: false
  }
};

export function setPosts(posts) {
  state.posts = Array.isArray(posts) ? posts : [];
}

export function prependPost(post) {
  state.posts = [post, ...state.posts.filter((item) => item.id !== post.id)];
}

export function setUsers(users) {
  state.users = Array.isArray(users) ? users : [];
}

export function setCurrentPost(post) {
  state.currentPost = post;
}

export function setFilteredPosts(posts) {
  state.filteredPosts = Array.isArray(posts) ? posts : [];
  state.pagination.total = state.filteredPosts.length;
}

export function setPage(page) {
  const safePage = Number(page) || 1;
  state.pagination.page = Math.max(1, safePage);
}

export function setFilters(partialFilters) {
  state.filters = { ...state.filters, ...partialFilters };
}

export function resetFilters() {
  state.filters = { ...defaultFilters };
}

export function removePostById(postId) {
  const id = Number(postId);
  state.posts = state.posts.filter((post) => post.id !== id);
  state.filteredPosts = state.filteredPosts.filter((post) => post.id !== id);
  if (state.currentPost && state.currentPost.id === id) {
    state.currentPost = null;
  }
}

export function setLoading(isLoading) {
  state.ui.loading = Boolean(isLoading);
}

export function setUiError(message) {
  state.ui.error = message || "Ocurrió un error inesperado.";
  state.ui.success = null;
}

export function setUiSuccess(message) {
  state.ui.success = message || "";
  state.ui.error = null;
}

export function clearUiMessages() {
  state.ui.error = null;
  state.ui.success = null;
}
