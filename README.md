# Futuresxy Personal Site

这是一个托管在 GitHub Pages 上的个人主页，用于展示：

- 个人简历和技能概览
- GitHub 账号与项目入口
- 学习笔记
- 感兴趣的研究方向
- 高质量资料收藏
- Paper Daily 论文跟踪页面

公网地址：

```text
https://futuresxy.github.io/personal-blog/
```

GitHub 仓库：

```text
https://github.com/Futuresxy/personal-blog
```

## 本地查看

```bash
cd /home/songxy/workspace/personal-blog
python -m http.server 8000
```

然后访问：

```text
http://localhost:8000
```

## 修改个人信息

大部分展示内容都在 `posts.js`：

```text
SITE_PROFILE        个人信息、简历、技能、指标
RESEARCH_INTERESTS 研究方向
RESOURCE_LIBRARY   资料库
BLOG_POSTS         学习笔记
```

更新页面内容后提交并推送：

```bash
git add .
git commit -m "Update personal site"
git push
```

GitHub Actions 会自动重新部署。

## 编辑学习笔记

页面右上角点击“写笔记”可以打开本地编辑器。浏览器里的保存会写入当前浏览器的 `localStorage`。

如果想把编辑后的笔记发布到公网：

1. 在编辑器里点击“导出”，得到新的 `posts.js`。
2. 替换项目里的 `posts.js`。
3. 提交并推送到 GitHub。

也可以直接手动编辑 `posts.js` 里的 `BLOG_POSTS`。

## Paper Daily

研究方向页面已经链接：

```text
https://futuresxy.github.io/paper-daily/
```

后续可以把 Paper Daily 里读过的论文整理成 `BLOG_POSTS` 文章，或者加入 `RESOURCE_LIBRARY`。

## GitHub Pages

部署工作流在：

```text
.github/workflows/pages.yml
```

发布方式是 GitHub Actions。只要 push 到 `main` 分支，就会自动部署。
