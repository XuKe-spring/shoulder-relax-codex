# Shoulder Relax Codex

肩颈放松训练 Web 应用，面向久坐办公、学习和需要短时间舒展的人群。应用提供分级训练课程、动作可视化引导、语音提示、倒计时提示音、摄像头姿态检测和训练记录。

线上版本：https://shoulder-relax-codex.vercel.app

当前版本：`v1.0.0`

## 功能概览

- 三类训练课程：微休息、标准课程、深度放松。
- 动作流程自动倒计时，并在动作结束后自动切换到下一个动作。
- 支持中文语音引导、倒计时提示音和训练完成提示音。
- 复杂动作提供正视图、侧视图和动作要点，降低理解成本。
- 使用摄像头进行基础姿态检测和动作质量反馈。
- 支持训练完成结果页、训练历史和提醒设置。
- 已部署到 Vercel，支持直接访问训练页路由。

## 技术栈

- React
- TypeScript
- Vite
- React Router
- Framer Motion
- MediaPipe Pose
- Tailwind CSS
- Vercel

## 本地运行

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

生产构建：

```bash
npm run build
```

本地预览生产构建：

```bash
npm run preview
```

代码检查：

```bash
npm run lint
```

## 项目结构

```text
src/
  components/            通用组件、姿态叠层和动作动画
  components/svg-animations/
                          训练动作可视化
  data/                  课程和动作数据
  hooks/                 计时器等 React hooks
  pages/                 首页、训练页、完成页、历史页、设置页
  types/                 类型定义
  utils/                 语音、提示音、姿态分析、提醒和本地存储
```

## 主要页面

- `/`：首页与课程入口。
- `/train/micro`：微休息课程。
- `/train/standard`：标准课程。
- `/train/deep`：深度放松课程。
- `/complete`：训练完成结果页。
- `/history`：训练历史。
- `/settings`：提醒和偏好设置。

## 开发流程

当前项目采用下面的基础流程：

```text
想法/需求定义
→ MVP 功能开发
→ 本地可运行版本
→ Git 版本管理
→ GitHub 云端备份
→ 产品细节与设计优化
→ 本地完整测试
→ Vercel 部署
→ 线上真实环境测试
→ 发布版本
→ 持续迭代
```

当前阶段：`持续迭代`。

## 发布记录

第一个可分享版本为 `v1.0.0`。详细说明见 [RELEASE_NOTES.md](./RELEASE_NOTES.md)。

## 后续计划

- 收集真实用户反馈，优先修复用户看不懂、用不顺的地方。
- 优化不同摄像头角度、身高和体型下的姿态识别稳定性。
- 增加更细的训练统计和动作质量趋势。
- 优化移动端浏览器权限、音频播放和提醒授权体验。
