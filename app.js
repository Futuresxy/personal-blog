(function () {
  const storageKey = "personal-blog-posts";
  const taskStateKey = "personal-blog-task-state";
  const reflectionKey = "personal-blog-reflections";
  const themeKey = "personal-blog-theme";
  const profile = window.SITE_PROFILE || {};
  const researchInterests = window.RESEARCH_INTERESTS || [];
  const resources = window.RESOURCE_LIBRARY || [];
  const progressBoard = window.PROGRESS_BOARD || { tracks: [], milestones: [], dailyPlans: [] };
  let posts = loadPosts();
  let activeTag = "全部";
  let activeResourceType = "全部";
  let activeId = posts[0]?.id || null;
  let taskState = loadTaskState();
  let reflections = loadReflections();
  let selectedPlanDate = resolveInitialPlanDate(progressBoard.dailyPlans || []);
  let activeProgressTrack = "全部";

  const postList = document.getElementById("postList");
  const tagRow = document.getElementById("tagRow");
  const searchInput = document.getElementById("searchInput");
  const reader = document.getElementById("reader");
  const readerArticle = document.getElementById("readerArticle");
  const editorDialog = document.getElementById("editorDialog");
  const draftList = document.getElementById("draftList");
  const progressEls = {
    dailyPlanSelect: document.getElementById("dailyPlanSelect"),
    trackFilters: document.getElementById("trackFilters"),
    progressSummary: document.getElementById("progressSummary"),
    dailyTaskList: document.getElementById("dailyTaskList"),
    trackProgress: document.getElementById("trackProgress"),
    milestoneList: document.getElementById("milestoneList"),
    saveReflection: document.getElementById("saveReflection"),
    exportProgress: document.getElementById("exportProgress"),
    reflectionDone: document.getElementById("reflectionDone"),
    reflectionBlockers: document.getElementById("reflectionBlockers"),
    reflectionNext: document.getElementById("reflectionNext")
  };
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

  function loadTaskState() {
    const saved = localStorage.getItem(taskStateKey);
    if (!saved) return {};
    try {
      return JSON.parse(saved) || {};
    } catch (error) {
      console.warn("Failed to load task state", error);
      return {};
    }
  }

  function loadReflections() {
    const saved = localStorage.getItem(reflectionKey);
    if (!saved) return {};
    try {
      return JSON.parse(saved) || {};
    } catch (error) {
      console.warn("Failed to load reflections", error);
      return {};
    }
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
    if (progressEls.dailyPlanSelect) {
      progressEls.dailyPlanSelect.addEventListener("change", () => {
        cacheCurrentReflection();
        selectedPlanDate = progressEls.dailyPlanSelect.value;
        renderProgressDashboard();
      });
    }
    if (progressEls.saveReflection) {
      progressEls.saveReflection.addEventListener("click", () => saveReflection(true));
    }
    if (progressEls.exportProgress) {
      progressEls.exportProgress.addEventListener("click", exportProgressState);
    }
  }

  function render() {
    renderProfile();
    renderMetrics();
    renderProgressDashboard();
    renderResume();
    renderResearch();
    renderResources();
    renderTags();
    renderPosts();
    renderReader(posts[0]);
  }

  function renderProgressDashboard() {
    if (!progressEls.dailyTaskList || !progressBoard.dailyPlans?.length) return;

    const plans = progressBoard.dailyPlans;
    const currentPlan = plans.find((plan) => plan.date === selectedPlanDate) || plans[0];
    selectedPlanDate = currentPlan.date;

    progressEls.dailyPlanSelect.innerHTML = plans.map((plan) => `
      <option value="${escapeAttr(plan.date)}" ${plan.date === selectedPlanDate ? "selected" : ""}>
        ${escapeHtml(plan.date)} · ${escapeHtml(plan.title)}
      </option>
    `).join("");

    renderTrackFilters();
    renderProgressSummary(currentPlan);
    renderDailyTasks(currentPlan);
    renderTrackProgress();
    renderMilestones();
    fillReflection(currentPlan.date);
  }

  function renderTrackFilters() {
    const tracks = [{ id: "全部", label: "全部方向" }, ...(progressBoard.tracks || [])];
    progressEls.trackFilters.innerHTML = tracks.map((track) => `
      <button class="tag-button ${track.id === activeProgressTrack ? "is-active" : ""}" type="button" data-track="${escapeAttr(track.id)}">
        ${escapeHtml(track.label)}
      </button>
    `).join("");
    progressEls.trackFilters.querySelectorAll("button").forEach((button) => {
      button.addEventListener("click", () => {
        cacheCurrentReflection();
        activeProgressTrack = button.dataset.track;
        renderProgressDashboard();
      });
    });
  }

  function renderProgressSummary(currentPlan) {
    const allTasks = getAllTasks();
    const dailyTasks = currentPlan.tasks || [];
    const totalDone = allTasks.filter((task) => taskState[task.id]).length;
    const dailyDone = dailyTasks.filter((task) => taskState[task.id]).length;
    const nextMilestone = getNextMilestone();
    const selectedTrack = activeProgressTrack === "全部" ? "全部方向" : getTrack(activeProgressTrack)?.label || activeProgressTrack;

    progressEls.progressSummary.innerHTML = [
      { value: `${dailyDone}/${dailyTasks.length}`, label: "今日完成" },
      { value: `${totalDone}/${allTasks.length}`, label: "计划总进度" },
      { value: selectedTrack, label: "当前筛选" },
      { value: nextMilestone ? formatDate(nextMilestone.date) : "完成", label: nextMilestone ? nextMilestone.title : "全部里程碑" }
    ].map((item) => `
      <div class="progress-stat">
        <strong>${escapeHtml(item.value)}</strong>
        <span>${escapeHtml(item.label)}</span>
      </div>
    `).join("");
  }

  function renderDailyTasks(currentPlan) {
    const tasks = (currentPlan.tasks || []).filter((task) => activeProgressTrack === "全部" || task.track === activeProgressTrack);
    progressEls.dailyTaskList.innerHTML = `
      <div class="task-day-head">
        <div>
          <p class="eyebrow">${escapeHtml(currentPlan.date)}</p>
          <h3>${escapeHtml(currentPlan.title)}</h3>
          <p>${escapeHtml(currentPlan.focus || "")}</p>
        </div>
        <span>${escapeHtml(tasks.length)} 项</span>
      </div>
      ${tasks.map((task) => {
        const track = getTrack(task.track);
        const done = Boolean(taskState[task.id]);
        return `
          <label class="task-item ${done ? "is-done" : ""}">
            <input type="checkbox" data-task-id="${escapeAttr(task.id)}" ${done ? "checked" : ""}>
            <span class="task-body">
              <span class="task-line">
                <strong>${escapeHtml(task.title)}</strong>
                <span class="task-meta">
                  <span>${escapeHtml(track?.label || task.track)}</span>
                  <span>${escapeHtml(task.priority || "P1")}</span>
                </span>
              </span>
              <span class="task-detail">${escapeHtml(task.detail || "")}</span>
            </span>
          </label>
        `;
      }).join("")}
    `;

    progressEls.dailyTaskList.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        cacheCurrentReflection();
        taskState[checkbox.dataset.taskId] = checkbox.checked;
        persistTaskState();
        renderProgressDashboard();
      });
    });
  }

  function renderTrackProgress() {
    const allTasks = getAllTasks();
    progressEls.trackProgress.innerHTML = (progressBoard.tracks || []).map((track) => {
      const tasks = allTasks.filter((task) => task.track === track.id);
      const done = tasks.filter((task) => taskState[task.id]).length;
      const percent = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
      return `
        <div class="track-progress-item">
          <div class="track-progress-head">
            <span>${escapeHtml(track.label)}</span>
            <strong>${done}/${tasks.length}</strong>
          </div>
          <div class="progress-bar" aria-label="${escapeAttr(track.label)}完成度">
            <span style="width: ${percent}%"></span>
          </div>
        </div>
      `;
    }).join("");
  }

  function renderMilestones() {
    const today = new Date();
    progressEls.milestoneList.innerHTML = (progressBoard.milestones || []).map((item) => {
      const isPast = new Date(`${item.date}T00:00:00`) < new Date(today.toDateString());
      return `
        <article class="milestone-item ${isPast ? "is-past" : ""}">
          <time>${escapeHtml(formatDate(item.date))}</time>
          <h4>${escapeHtml(item.title)}</h4>
          <p>${escapeHtml(item.detail)}</p>
        </article>
      `;
    }).join("");
  }

  function fillReflection(date) {
    const current = reflections[date] || {};
    progressEls.reflectionDone.value = current.done || "";
    progressEls.reflectionBlockers.value = current.blockers || "";
    progressEls.reflectionNext.value = current.next || "";
  }

  function cacheCurrentReflection() {
    if (!selectedPlanDate || !progressEls.reflectionDone) return;
    reflections[selectedPlanDate] = {
      done: progressEls.reflectionDone.value.trim(),
      blockers: progressEls.reflectionBlockers.value.trim(),
      next: progressEls.reflectionNext.value.trim(),
      updatedAt: new Date().toISOString()
    };
    persistReflections();
  }

  function saveReflection(showFeedback) {
    cacheCurrentReflection();
    if (!showFeedback || !progressEls.saveReflection) return;
    const oldText = progressEls.saveReflection.textContent;
    progressEls.saveReflection.textContent = "已保存";
    window.setTimeout(() => {
      progressEls.saveReflection.textContent = oldText;
    }, 1200);
  }

  function exportProgressState() {
    cacheCurrentReflection();
    const allTasks = getAllTasks();
    const completed = allTasks.filter((task) => taskState[task.id]).map((task) => task.id);
    const payload = {
      exportedAt: new Date().toISOString(),
      boardLastUpdated: progressBoard.lastUpdated || "",
      completed,
      taskState,
      reflections
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `progress-${getLocalDateString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function getAllTasks() {
    return (progressBoard.dailyPlans || []).flatMap((plan) => plan.tasks || []);
  }

  function getTrack(trackId) {
    return (progressBoard.tracks || []).find((track) => track.id === trackId);
  }

  function getNextMilestone() {
    const today = new Date();
    return (progressBoard.milestones || []).find((item) => new Date(`${item.date}T23:59:59`) >= today);
  }

  function persistTaskState() {
    localStorage.setItem(taskStateKey, JSON.stringify(taskState));
  }

  function persistReflections() {
    localStorage.setItem(reflectionKey, JSON.stringify(reflections));
  }

  function resolveInitialPlanDate(plans) {
    if (!plans.length) return "";
    const today = getLocalDateString();
    if (plans.some((plan) => plan.date === today)) return today;
    const pastPlans = plans.filter((plan) => plan.date <= today);
    return (pastPlans[pastPlans.length - 1] || plans[0]).date;
  }

  function getLocalDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
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
