(function () {
  const storageKey = "personal-blog-posts";
  const themeKey = "personal-blog-theme";
  const profile = window.SITE_PROFILE || {};
  const researchInterests = window.RESEARCH_INTERESTS || [];
  const resources = window.RESOURCE_LIBRARY || [];
  let posts = loadPosts();
  let activeTag = "全部";
  let activeResourceType = "全部";
  let activeId = posts[0]?.id || null;

  const postList = document.getElementById("postList");
  const tagRow = document.getElementById("tagRow");
  const searchInput = document.getElementById("searchInput");
  const reader = document.getElementById("reader");
  const readerArticle = document.getElementById("readerArticle");
  const editorDialog = document.getElementById("editorDialog");
  const draftList = document.getElementById("draftList");
  const fields = {
    title: document.getElementById("postTitle"),
    date: document.getElementById("postDate"),
    tags: document.getElementById("postTags"),
    excerpt: document.getElementById("postExcerpt"),
    content: document.getElementById("postContent"),
    importBox: document.getElementById("importBox")
  };

  initTheme();
  render();
  bindEvents();

  function loadPosts() {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        return normalizePosts(JSON.parse(saved));
      } catch (error) {
        console.warn("Failed to load local posts", error);
      }
    }
    return normalizePosts(window.BLOG_POSTS || []);
  }

  function normalizePosts(input) {
    return input
      .filter(Boolean)
      .map((post) => ({
        id: post.id || slugify(post.title || String(Date.now())),
        title: post.title || "未命名文章",
        date: post.date || new Date().toISOString().slice(0, 10),
        tags: Array.isArray(post.tags) ? post.tags : String(post.tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
        excerpt: post.excerpt || "",
        content: post.content || ""
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }

  function bindEvents() {
    searchInput.addEventListener("input", renderPosts);
    document.getElementById("openEditor").addEventListener("click", openEditor);
    document.getElementById("contactEditor").addEventListener("click", openEditor);
    document.getElementById("themeToggle").addEventListener("click", toggleTheme);
    document.getElementById("printResume").addEventListener("click", () => window.print());
    document.getElementById("newPost").addEventListener("click", createPost);
    document.getElementById("deletePost").addEventListener("click", deletePost);
    document.getElementById("savePost").addEventListener("click", savePost);
    document.getElementById("exportPosts").addEventListener("click", exportPosts);
    document.getElementById("importPosts").addEventListener("click", importPosts);
  }

  function render() {
    renderProfile();
    renderMetrics();
    renderResume();
    renderResearch();
    renderResources();
    renderTags();
    renderPosts();
    renderReader(posts[0]);
  }

  function renderProfile() {
    document.getElementById("profileHeadline").textContent = profile.headline || "";
    document.getElementById("profileTitle").textContent = profile.role || profile.name || "";
    document.getElementById("profileSummary").textContent = profile.summary || "";
    document.getElementById("profileLinks").innerHTML = (profile.links || []).map((link) => `
      <a class="pill-link" href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>
    `).join("");
    document.getElementById("focusList").innerHTML = `
      <h3>近期关注</h3>
      ${(profile.focus || []).map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
    `;
  }

  function renderMetrics() {
    document.getElementById("metricRow").innerHTML = (profile.metrics || []).map((metric) => `
      <div class="metric-item">
        <strong>${escapeHtml(metric.value)}</strong>
        <span>${escapeHtml(metric.label)}</span>
      </div>
    `).join("");
  }

  function renderResume() {
    document.getElementById("resumeTimeline").innerHTML = (profile.resume || []).map((item) => `
      <article class="timeline-item">
        <span>${escapeHtml(item.period)}</span>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.detail)}</p>
      </article>
    `).join("");

    document.getElementById("skillPanel").innerHTML = (profile.skills || []).map((group) => `
      <section class="skill-group">
        <h3>${escapeHtml(group.group)}</h3>
        <div class="skill-tags">${group.items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      </section>
    `).join("");
  }

  function renderResearch() {
    document.getElementById("researchGrid").innerHTML = researchInterests.map((item) => `
      <article class="research-card">
        <div class="mini-tags">${item.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="read-button" href="${escapeAttr(item.link)}" target="_blank" rel="noreferrer">相关入口</a>
      </article>
    `).join("");
  }

  function renderResources() {
    const types = ["全部", ...new Set(resources.map((item) => item.type))];
    document.getElementById("resourceFilters").innerHTML = types.map((type) => `
      <button class="tag-button ${type === activeResourceType ? "is-active" : ""}" type="button" data-type="${escapeAttr(type)}">${escapeHtml(type)}</button>
    `).join("");
    document.querySelectorAll("#resourceFilters button").forEach((button) => {
      button.addEventListener("click", () => {
        activeResourceType = button.dataset.type;
        renderResources();
      });
    });

    const filtered = resources.filter((item) => activeResourceType === "全部" || item.type === activeResourceType);
    document.getElementById("resourceGrid").innerHTML = filtered.map((item) => `
      <article class="resource-card">
        <div class="resource-meta">
          <span>${escapeHtml(item.type)}</span>
          <span>${escapeHtml(item.topic)}</span>
        </div>
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.description)}</p>
        <a class="read-button" href="${escapeAttr(item.url)}" target="_blank" rel="noreferrer">打开资料</a>
      </article>
    `).join("");
  }

  function renderTags() {
    const tags = ["全部", ...new Set(posts.flatMap((post) => post.tags))];
    tagRow.innerHTML = tags.map((tag) => (
      `<button class="tag-button ${tag === activeTag ? "is-active" : ""}" type="button" data-tag="${escapeAttr(tag)}">${escapeHtml(tag)}</button>`
    )).join("");
    tagRow.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        activeTag = button.dataset.tag;
        renderTags();
        renderPosts();
      });
    });
  }

  function renderPosts() {
    const query = searchInput.value.trim().toLowerCase();
    const filtered = posts.filter((post) => {
      const matchesTag = activeTag === "全部" || post.tags.includes(activeTag);
      const haystack = [post.title, post.excerpt, post.content, post.tags.join(" ")].join(" ").toLowerCase();
      return matchesTag && (!query || haystack.includes(query));
    });

    postList.innerHTML = filtered.length ? filtered.map((post) => `
      <article class="post-card">
        <div class="post-meta">${escapeHtml(formatDate(post.date))}</div>
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.excerpt)}</p>
        <div class="mini-tags">${post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
        <button class="read-button" type="button" data-id="${escapeAttr(post.id)}">阅读全文</button>
      </article>
    `).join("") : `<div class="empty-state">没有找到匹配的文章。</div>`;

    postList.querySelectorAll(".read-button").forEach((button) => {
      button.addEventListener("click", () => {
        const post = posts.find((item) => item.id === button.dataset.id);
        renderReader(post);
        location.hash = "#reader";
      });
    });
  }

  function renderReader(post) {
    if (!post) {
      reader.hidden = true;
      return;
    }
    reader.hidden = false;
    readerArticle.innerHTML = `
      <div class="post-meta">${escapeHtml(formatDate(post.date))}</div>
      <h2>${escapeHtml(post.title)}</h2>
      <div class="mini-tags">${post.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
      <div class="article-body">${markdownToHtml(post.content)}</div>
    `;
  }

  function openEditor() {
    activeId = activeId || posts[0]?.id || null;
    renderDrafts();
    fillForm(posts.find((post) => post.id === activeId) || posts[0]);
    editorDialog.showModal();
  }

  function renderDrafts() {
    draftList.innerHTML = posts.map((post) => `
      <button class="draft-item ${post.id === activeId ? "is-active" : ""}" type="button" data-id="${escapeAttr(post.id)}">
        <strong>${escapeHtml(post.title)}</strong>
        <span>${escapeHtml(formatDate(post.date))}</span>
      </button>
    `).join("");
    draftList.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        activeId = button.dataset.id;
        fillForm(posts.find((post) => post.id === activeId));
        renderDrafts();
      });
    });
  }

  function fillForm(post) {
    const current = post || blankPost();
    fields.title.value = current.title;
    fields.date.value = current.date;
    fields.tags.value = current.tags.join(", ");
    fields.excerpt.value = current.excerpt;
    fields.content.value = current.content;
  }

  function createPost() {
    const post = blankPost();
    posts.unshift(post);
    activeId = post.id;
    persist();
    renderDrafts();
    fillForm(post);
  }

  function deletePost() {
    if (!activeId) return;
    posts = posts.filter((post) => post.id !== activeId);
    activeId = posts[0]?.id || null;
    persist();
    render();
    renderDrafts();
    fillForm(posts[0]);
  }

  function savePost() {
    const title = fields.title.value.trim() || "未命名文章";
    const next = {
      id: activeId || slugify(title),
      title,
      date: fields.date.value || new Date().toISOString().slice(0, 10),
      tags: fields.tags.value.split(",").map((tag) => tag.trim()).filter(Boolean),
      excerpt: fields.excerpt.value.trim(),
      content: fields.content.value.trim()
    };
    const index = posts.findIndex((post) => post.id === activeId);
    if (index >= 0) posts[index] = next;
    else posts.unshift(next);
    activeId = next.id;
    posts = normalizePosts(posts);
    persist();
    render();
    renderDrafts();
    fillForm(posts.find((post) => post.id === activeId));
  }

  function exportPosts() {
    const data = `window.BLOG_POSTS = ${JSON.stringify(posts, null, 2)};\n`;
    const blob = new Blob([data], { type: "text/javascript;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "posts.js";
    link.click();
    URL.revokeObjectURL(url);
  }

  function importPosts() {
    if (fields.importBox.hidden) {
      fields.importBox.hidden = false;
      fields.importBox.focus();
      return;
    }
    const raw = fields.importBox.value.trim();
    if (!raw) return;
    const json = raw.replace(/^window\.BLOG_POSTS\s*=\s*/, "").replace(/;\s*$/, "");
    posts = normalizePosts(JSON.parse(json));
    activeId = posts[0]?.id || null;
    persist();
    render();
    renderDrafts();
    fillForm(posts[0]);
    fields.importBox.value = "";
    fields.importBox.hidden = true;
  }

  function persist() {
    localStorage.setItem(storageKey, JSON.stringify(posts));
  }

  function blankPost() {
    const id = `note-${Date.now()}`;
    return {
      id,
      title: "新的学习笔记",
      date: new Date().toISOString().slice(0, 10),
      tags: ["学习笔记"],
      excerpt: "",
      content: "## 今天的问题\n\n\n## 我的理解\n\n\n## 后续要验证\n"
    };
  }

  function markdownToHtml(markdown) {
    const lines = markdown.split("\n");
    let html = "";
    let inCode = false;
    let inList = false;
    for (const line of lines) {
      if (line.startsWith("```")) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += inCode ? "</code></pre>" : "<pre><code>";
        inCode = !inCode;
        continue;
      }
      if (inCode) {
        html += `${escapeHtml(line)}\n`;
        continue;
      }
      if (line.startsWith("## ")) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<h3>${escapeHtml(line.slice(3))}</h3>`;
      } else if (line.startsWith("# ")) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<h3>${escapeHtml(line.slice(2))}</h3>`;
      } else if (line.startsWith("- ")) {
        if (!inList) {
          html += "<ul>";
          inList = true;
        }
        html += `<li>${escapeHtml(line.slice(2))}</li>`;
      } else if (line.trim()) {
        if (inList) {
          html += "</ul>";
          inList = false;
        }
        html += `<p>${escapeHtml(line)}</p>`;
      }
    }
    if (inList) html += "</ul>";
    if (inCode) html += "</code></pre>";
    return html;
  }

  function initTheme() {
    const saved = localStorage.getItem(themeKey);
    if (saved === "dark") document.documentElement.classList.add("dark");
  }

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(themeKey, document.documentElement.classList.contains("dark") ? "dark" : "light");
  }

  function slugify(value) {
    return String(value).trim().toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, "-").replace(/^-|-$/g, "") || `note-${Date.now()}`;
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(value));
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value);
  }
}());
