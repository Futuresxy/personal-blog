# Personal Blog

这是一个纯静态个人博客，适合记录学习笔记、技术文章和项目复盘。

## 本地查看

直接用浏览器打开：

```text
personal-blog/index.html
```

如果某些浏览器限制本地文件，也可以在目录里启动一个临时静态服务器：

```bash
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 编辑文章

页面右上角点击“编辑”。这里的编辑会先保存到当前浏览器的 `localStorage`。

静态网站没有数据库和登录系统，所以浏览器里的保存不会自动写回服务器。想让别人看到你的更新：

1. 在编辑器里点击“导出”，得到新的 `posts.js`。
2. 用导出的文件替换本目录里的 `posts.js`。
3. 重新部署网站。

也可以直接手动编辑 `posts.js`，它是一个文章数组。

## 用 GitHub Pages 发布到公网

这个项目已经准备好 GitHub Pages Actions 工作流：

```text
.github/workflows/pages.yml
```

推荐发布步骤：

1. 登录 GitHub CLI：

```bash
gh auth login
```

2. 在本目录初始化 Git 仓库并提交：

```bash
cd /home/songxy/workspace/personal-blog
git init
git add .
git commit -m "Initial personal blog"
```

3. 创建 GitHub 仓库并推送：

```bash
gh repo create personal-blog --public --source=. --remote=origin --push
```

4. 打开 GitHub 仓库的 Pages 设置：

```text
Settings -> Pages -> Source -> GitHub Actions
```

5. 等待 Actions 运行完成后，网站地址通常是：

```text
https://你的用户名.github.io/personal-blog/
```

如果你希望地址是根域名形式：

```text
https://你的用户名.github.io/
```

仓库名需要改成：

```text
你的用户名.github.io
```

然后同样使用 GitHub Pages 发布。

## 其他免费公网部署

### 方案一：GitHub Pages

适合个人博客和学习笔记。GitHub 官方说明 Pages 可以把仓库里的 HTML、CSS、JavaScript 静态文件发布成网站。

常见方式：

1. 新建仓库，例如 `my-blog`。
2. 上传 `index.html`、`styles.css`、`app.js`、`posts.js`、`assets/`。
3. 打开仓库 `Settings -> Pages`。
4. Source 选择部署分支，例如 `main`，目录选择 `/root` 或 `/docs`。
5. 保存后得到一个类似 `https://你的用户名.github.io/my-blog/` 的公网地址。

### 方案二：Cloudflare Pages

适合后续绑定自己的域名。连接 GitHub 仓库后，Cloudflare 会自动部署静态文件。

静态站不需要 build 命令时：

```text
Build command: 留空
Output directory: /
```

如果把博客放在仓库子目录 `personal-blog`，可以把输出目录设为：

```text
personal-blog
```

### 方案三：Netlify

适合快速拖拽部署。可以把 `personal-blog` 文件夹拖到 Netlify 的部署页面，也可以连接 GitHub 仓库自动部署。

## 静态站能不能被别人访问

能。区别是：

- 本地 `index.html`：只在你的电脑上，别人访问不到。
- GitHub Pages / Cloudflare Pages / Netlify：它们把同样的静态文件托管到公网，别人可以通过 URL 访问。

你不需要自己买服务器来运行这个博客。
