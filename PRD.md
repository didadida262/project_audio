# 变声器 - 产品需求文档 (PRD)

## 项目概述
变声器是一个纯前端的SPA应用，允许用户录音并进行实时变音处理。应用采用Aceternity主题风格，提供简约酷炫的用户体验。

## 技术栈
- **前端**: React + TypeScript + Next.js
- **后端**: Node.js (API Routes)
- **数据库**: Neon (PostgreSQL)
- **部署**: Vercel
- **UI框架**: Aceternity UI
- **音频处理**: FFmpeg

## 功能需求

### 1. 页面布局
- **左侧区域**:
  - 文本显示区域：实时显示用户录音内容
  - 录音按钮：大按钮，点击开始/停止录音
- **右侧区域**:
  - 变音选项按钮
  - 音频播放控制
  - 下载功能

### 2. 核心功能

#### 2.1 录音功能
- 点击录音按钮开始录音
- 实时语音识别，将语音转换为文本显示
- 支持录音状态指示（录音中/停止）
- 录音质量优化

#### 2.2 变音功能
- **黑客声音**: 低沉厚重的音质
- **女生声音**: 尖细的音质
- 实时音频处理
- 变音效果预览

#### 2.3 音频处理
- 使用FFmpeg进行音频转换
- 支持音频格式转换
- 音频质量优化
- 处理延迟最小化

#### 2.4 用户体验
- 实时反馈
- 音频播放控制
- 下载处理后的音频文件
- 响应式设计

## 技术实现

### 前端架构
```
src/
├── components/
│   ├── AudioRecorder.tsx      # 录音组件
│   ├── VoiceTransformer.tsx   # 变音组件
│   ├── TextDisplay.tsx        # 文本显示组件
│   └── Layout.tsx             # 布局组件
├── hooks/
│   ├── useAudioRecorder.ts    # 录音Hook
│   └── useVoiceTransform.ts   # 变音Hook
├── utils/
│   ├── audioUtils.ts          # 音频工具函数
│   └── ffmpegUtils.ts         # FFmpeg工具函数
└── styles/
    └── globals.css            # 全局样式
```

### 后端API
```
api/
├── audio/
│   ├── record.ts              # 录音API
│   ├── transform.ts            # 变音API
│   └── download.ts            # 下载API
└── database/
    └── connection.ts          # 数据库连接
```

### 数据库设计
```sql
-- 用户录音记录表
CREATE TABLE audio_records (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    original_audio_url TEXT,
    transformed_audio_url TEXT,
    transform_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);
```

## 部署配置

### Vercel配置
- 环境变量配置
- FFmpeg二进制文件配置
- 数据库连接配置
- 静态资源优化

### 性能优化
- 音频文件压缩
- 懒加载组件
- 缓存策略
- CDN配置

## 开发计划

### Phase 1: 基础架构
- [x] 项目初始化
- [ ] 基础组件开发
- [ ] 数据库连接

### Phase 2: 核心功能
- [ ] 录音功能实现
- [ ] 变音功能实现
- [ ] 音频处理优化

### Phase 3: 用户体验
- [ ] UI/UX优化
- [ ] 性能优化
- [ ] 测试和调试

### Phase 4: 部署
- [ ] Vercel配置
- [ ] 生产环境测试
- [ ] 上线部署

## 验收标准
1. 录音功能正常工作，实时显示文本
2. 变音功能正常，支持两种变音效果
3. 音频播放和下载功能正常
4. 界面美观，符合Aceternity风格
5. 应用在Vercel上正常运行
6. 响应式设计，支持移动端
