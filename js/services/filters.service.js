function includesText(value, query) {
  return value.toLowerCase().includes(query.toLowerCase());
}

export function applyFilters(posts, filters) {
  let result = [...posts];

  if (filters.query) {
    const query = filters.query.trim().toLowerCase();
    result = result.filter((post) => {
      const title = post.title.toLowerCase();
      const body = post.body.toLowerCase();
      return title.includes(query) || body.includes(query);
    });
  }

  if (filters.userId) {
    const userId = Number(filters.userId);
    result = result.filter((post) => post.userId === userId);
  }

  if (filters.tag) {
    result = result.filter((post) =>
      post.tags.some((tag) => includesText(tag, filters.tag))
    );
  }

  switch (filters.sort) {
    case "oldest":
      result.sort((a, b) => a.id - b.id);
      break;
    case "title-asc":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "title-desc":
      result.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case "newest":
    default:
      result.sort((a, b) => b.id - a.id);
  }

  return result;
}

export function getAvailableFilterData(posts, users) {
  const tags = new Set();
  posts.forEach((post) => { post.tags.forEach((tag) => tags.add(tag)); });

  const authors = users
    .map((user) => ({
      id: user.id,
      label: `${user.firstName} ${user.lastName}`.trim()
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return {
    authors,
    tags: Array.from(tags).sort((a, b) => a.localeCompare(b))
  };
}
