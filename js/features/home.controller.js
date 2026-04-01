import { setLoading, setPosts, setUsers, state } from "../core/state.js";
import { fetchPosts } from "../api/posts.api.js";
import { fetchUsers } from "../api/users.api.js";
import { notifyError, normalizePost, normalizeUser } from "../services/posts.service.js";

export async function ensureInitialDataLoaded() {
  if (state.meta.didLoadInitialData) return;
  setLoading(true);
  try {
    const [postsResponse, usersResponse] = await Promise.all([
      fetchPosts({ limit: 300 }),
      fetchUsers({ limit: 100 })
    ]);
    const normalizedPosts = (postsResponse.posts || []).map(normalizePost);
    const normalizedUsers = (usersResponse.users || []).map(normalizeUser);
    setPosts(normalizedPosts);
    setUsers(normalizedUsers);
    state.meta.didLoadInitialData = true;
  } catch (error) {
    notifyError(error.message || "No se pudieron cargar las publicaciones.");
    throw error;
  } finally {
    setLoading(false);
  }
}
