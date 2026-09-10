# MAVE TEST 预渲染使用说明

这套流程的目标是：Claude Design 继续负责视觉和内容，GitHub Actions 自动把它导出的页面转换为搜索引擎和 AI 无需运行 JavaScript也能读取的 HTML。所有自动生成只发生在 `TEST` 分支；确认无误后才合并到 `main`。

## 当前覆盖的公开页面

| 页面 | Claude Design 源文件 | 网站输出 |
| --- | --- | --- |
| 首页 | `src/bundles/home.bundle.html` | `index.html` |
| Hearth Studio | `src/models/hearth-studio.dc.html` | `models/hearth-studio/index.html` |
| Grove Studio | `src/bundles/grove-studio.bundle.html` | `models/grove-studio/index.html` |
| Hearth One Bedroom | `src/bundles/hearth-one-bedroom.bundle.html` | `models/hearth-one-bedroom/index.html` |
| Hearth Pod | `src/bundles/hearth-pod.bundle.html` | `models/hearth-pod/index.html` |
| Grove Pod | `src/bundles/grove-pod.bundle.html` | `models/grove-pod/index.html` |
| Resources | `src/bundles/resources.bundle.html` | `resources/index.html` |
| ADU cost article | `src/bundles/modular-adu-cost.bundle.html` | `resources/how-much-does-a-modular-adu-cost/index.html` |

不要手工修改右栏的输出文件。GitHub Actions 会自动生成它们。

## 这一次如何安全上传

1. 打开 GitHub 仓库，确认左上角分支是 `TEST`，不是 `main`。
2. 选择 **Add file → Upload files**。
3. 将修复包内的文件和文件夹一起拖入上传区，保持目录结构不变。
4. 页面底部确认显示 **Commit directly to the TEST branch**。
5. Commit message 可写：`prerender all public pages on TEST`。
6. 点击 **Commit changes**。
7. 打开 **Actions → Prerender static pages**，等待绿色勾。
8. 工作流会再产生一个 `chore: prerender static pages [skip ci]` 提交。Vercel 通常会出现两次部署，请检查时间最新、来源是这个自动提交的部署。
9. 逐页检查桌面端和手机端。全部通过前不要合并到 `main`。

## 以后每次用 Claude Design 更新页面

### 推荐工作流：继续接收 Claude 的 bundle

1. 在 Claude Design 修改视觉或文字。
2. 只导出有变化的页面 HTML。
3. 按上表重命名并替换 `src/bundles/` 中对应的 `.bundle.html`。
4. 上传到 GitHub 的 `TEST` 分支。
5. 等待 GitHub Actions 两个步骤都通过：
   - `Prerender`
   - `Audit crawlable output`
6. 打开 TEST 网址逐页检查：Logo、图片、排版、菜单、按钮、表单、桌面端和手机端。
7. 查看网页源代码，搜索 `PRERENDER:START`；其后应能看到真实标题、价格和正文，而不是只有 `Unpacking...`。
8. 确认后再创建 `TEST → main` Pull Request 并合并。
9. 正式域名部署完成后，再检查 `www.mavebuild.com` 的对应页面。

如果 Actions 变红，不要合并。打开失败任务并下载 `prerender-debug`，把日志、PNG 和 HTML 发给 Codex 诊断。

### Hearth Studio 的特殊说明

Hearth Studio 当前使用已经清理好的 `src/models/hearth-studio.dc.html`，不要用旧 bundle 覆盖它。如果 Claude Design 更新了这个页面，请向它索要“raw Design Component source”，或者把新导出的 bundle 发给 Codex转换后再替换。

## 发给 Claude Design 的固定提示词

每次修改前，把下面这段一起发给 Claude Design：

> Keep the current visual design and interactions. This site must remain compatible with the MAVE GitHub prerender pipeline. If possible, return the raw Design Component HTML containing `<x-dc>` and the `<script type="text/x-dc" data-dc-script>` logic block. Do not replace `support.js` with an HTML page. Keep all visible product names, dimensions, prices, descriptions, headings, image alt text, title, meta description and canonical URL in the page source. Do not add `noindex`. Use stable HTTPS or local asset paths. Also provide the normal self-contained bundle as a fallback. Do not edit generated `models/**/index.html` or `resources/**/index.html` files.

Claude 如果仍然只能给 self-contained bundle，也没关系：将 bundle 放进 `src/bundles/`，现在的解包脚本会自动处理。

## 自动验收规则

每次工作流会检查：

- 页面存在静态 `#__prerender` 正文；
- title、description 和 canonical 完整；
- 页面包含 JSON-LD 结构化数据；
- 静态正文达到该页面最低字数；
- 静态正文没有 `This page requires JavaScript`；
- 静态正文没有未解析的 `{{ template }}`；
- 自动提取的图片和字体文件都存在。

任何一项失败，工作流会变红并停止，不会把坏的生成页面提交回仓库。

## 谁负责什么

| 角色 | 负责内容 |
| --- | --- |
| Claude Design | 页面视觉、内容、组件和交互设计，导出 raw source 或 bundle |
| Codex / 自动脚本 | 解包、资源本地化、预渲染、SEO/GEO 元数据、结构化数据和验收 |
| 你 | 只在 `TEST` 上传；检查最终视觉和功能；确认后合并到 `main` |

当新增一个全新 URL 时，不要只上传 HTML。还需要把它加入 `scripts/routes.mjs`、`sitemap.xml` 和 `vercel.json`；这一步交给 Codex处理最安全。
