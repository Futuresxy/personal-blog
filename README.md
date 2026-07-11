# Futuresxy Personal Site

这是一个托管在 GitHub Pages 上的个人主页，用于展示：

- 个人简历和技能概览
- GitHub 账号与项目入口
- 学习笔记
- 秋招 / ASPLOS 每日训练看板
- 感兴趣的研究方向
- 高质量资料收藏
- Paper Daily 论文跟踪页面
- 2027 秋招岗位雷达与简历匹配入口

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

每日任务和项目进度在 `tasks.js`：

```text
PROGRESS_BOARD.tracks      任务方向
PROGRESS_BOARD.milestones  阶段里程碑
PROGRESS_BOARD.dailyPlans  每日任务
```

当前看板按 5 个方向组织：

- KVCache 项目
- 力扣刷题
- 算子学习优化
- Paper 阅读
- Ascend / RTX4090 实验平台

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

## 维护每日训练看板

首页导航点击“训练看板”可以进入每日计划页面。

支持的交互：

- 选择日期查看当天任务。
- 按方向筛选任务。
- 点击任务前面的方框标记完成。
- 自动统计今日完成度和各方向完成度。
- 记录“今日完成 / 卡点问题 / 明日调整”。
- 点击“导出状态”下载当前浏览器里的完成状态和每日反馈。

注意：这是 GitHub Pages 静态站点，页面上的勾选和反馈默认保存在当前浏览器的 `localStorage`。如果要把进度公开发布到博客，需要把关键更新写回 `tasks.js` 或整理成 `posts.js` 里的学习笔记，然后提交并推送。

建议的日常流程：

1. 早上打开看板，选择当天日期。
2. 完成一项就勾选一项。
3. 晚上填写每日反馈。
4. 每天或每两天把反馈整理成学习笔记。
5. 根据实际进度调整 `tasks.js`，提交并推送。

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
