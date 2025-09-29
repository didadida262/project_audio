# 变身器 - Voice Transformer

一个强大的实时语音转换应用，支持多种变音效果。使用React、Next.js、FFmpeg和Neon数据库构建，部署在Vercel上。

## 功能特色

- 🎤 **实时录音**: 高质量音频录制，支持实时语音识别
- 🎭 **多种变音**: 支持黑客声音和女生声音两种变音效果
- 🎵 **音频处理**: 基于FFmpeg的高质量音频转换
- 💾 **一键下载**: 支持转换后音频的下载和分享
- 📱 **响应式设计**: 完美适配桌面和移动设备
- 🎨 **现代UI**: 采用Aceternity风格的简约酷炫界面

## 技术栈

- **前端**: React 18 + TypeScript + Next.js 14
- **UI框架**: Tailwind CSS + Framer Motion + Aceternity UI
- **音频处理**: FFmpeg + Web Audio API
- **数据库**: Neon (PostgreSQL)
- **部署**: Vercel
- **状态管理**: React Hooks

## 项目结构

```
src/
├── components/          # React组件
│   ├── AudioRecorder.tsx    # 录音组件
│   ├── VoiceTransformer.tsx # 变音组件
│   ├── TextDisplay.tsx      # 文本显示组件
│   └── Layout.tsx           # 布局组件
├── hooks/              # 自定义Hooks
│   ├── useAudioRecorder.ts  # 录音Hook
│   └── useVoiceTransform.ts # 变音Hook
├── utils/              # 工具函数
│   ├── audioUtils.ts        # 音频工具
│   └── ffmpegUtils.ts       # FFmpeg工具
├── lib/                # 库文件
│   └── utils.ts             # 通用工具
└── styles/             # 样式文件
    └── globals.css           # 全局样式

app/
├── api/                # API路由
│   ├── audio/              # 音频相关API
│   └── database/           # 数据库连接
├── layout.tsx          # 根布局
└── page.tsx            # 主页面
```

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn
- PostgreSQL数据库 (Neon)

### 安装依赖

```bash
npm install
```

### 环境配置

复制 `env.example` 到 `.env.local` 并配置环境变量：

```bash
cp env.example .env.local
```

配置以下环境变量：

```env
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
npm start
```

## 部署到Vercel

### 1. 准备数据库

1. 在 [Neon](https://neon.tech) 创建PostgreSQL数据库
2. 获取数据库连接字符串

### 2. 部署到Vercel

1. 将代码推送到GitHub仓库
2. 在Vercel中导入项目
3. 配置环境变量：
   - `DATABASE_URL`: Neon数据库连接字符串
   - `NEXT_PUBLIC_APP_URL`: 应用URL

### 3. 自动部署

代码推送到main分支后会自动触发部署。

## 使用说明

1. **录音**: 点击左侧的录音按钮开始录音
2. **语音识别**: 录音过程中会实时显示识别的文本
3. **变音处理**: 录音完成后，在右侧选择变音效果
4. **播放下载**: 转换完成后可以播放或下载音频文件

## 开发指南

### 添加新的变音效果

1. 在 `src/utils/ffmpegUtils.ts` 中添加新的转换类型
2. 在 `src/components/VoiceTransformer.tsx` 中添加对应的按钮
3. 更新 `src/hooks/useVoiceTransform.ts` 中的处理逻辑

### 自定义UI主题

修改 `src/styles/globals.css` 中的CSS变量来自定义主题色彩。

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 联系方式

如有问题或建议，请通过以下方式联系：

- 创建 Issue
- 发送邮件
- 提交Pull Request

---

**变身器** - 让声音变得与众不同！ 🎭✨