# 简历模板站 Resume Template Station

专业简历制作平台，帮助用户打造令人印象深刻的求职简历。100+ 精美模板，在线编辑，一键导出 PDF。

## ✨ 功能特性

- **100+ 精选模板** - 覆盖多种行业、职位和风格，持续更新
- **在线实时编辑** - 所见即所得，左侧编辑右侧实时预览
- **占位符引导** - 模板内置占位提示文字，清晰知道每个位置填什么
- **多种布局风格** - 经典居中、右上角头像、左侧边栏、双栏、简洁无照片、详细型等 7 种布局
- **照片占位规范** - 标准 3cm × 4cm 证件照比例，虚线框提示上传位置
- **PDF 导出** - 一键导出高清 PDF 简历
- **用户系统** - 注册登录、简历管理、收藏夹
- **会员系统** - 免费 + 会员模板分级
- **响应式设计** - 支持桌面端和移动端浏览

## 🛠 技术栈

### 前端
- **React 18** - 用户界面框架
- **React Router 6** - 路由管理
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库
- **html2canvas + jsPDF** - PDF 导出

### 后端
- **Express** - Web 框架
- **Better-SQLite3** - 数据库
- **JWT** - 用户认证
- **bcryptjs** - 密码加密
- **CORS** - 跨域处理

## 📁 项目结构

```
resume-template-station/
├── frontend/              # 前端项目 (React + Vite)
│   ├── src/
│   │   ├── components/    # 公共组件 (Header, Footer, ResumePreview, ResumeForm 等)
│   │   ├── pages/         # 页面 (首页、模板列表、编辑器、用户中心等)
│   │   ├── context/       # 全局状态 (AuthContext)
│   │   ├── utils/         # 工具函数 (API、模板样式)
│   │   ├── App.jsx        # 根组件
│   │   ├── main.jsx       # 入口文件
│   │   └── index.css      # 全局样式
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── backend/               # 后端项目 (Express + SQLite)
│   ├── src/
│   │   ├── routes/        # 路由 (用户、模板、简历、收藏)
│   │   ├── middleware/    # 中间件 (认证)
│   │   ├── db.js          # 数据库连接
│   │   └── index.js       # 入口文件
│   ├── .env.example       # 环境变量模板
│   └── package.json
├── database/              # 数据库
│   ├── schema.sql         # 建表语句
│   ├── seed.sql           # 种子数据
│   └── resume_template.db # 数据库文件 (本地生成，不提交)
├── docs/                  # 文档
│   └── 部署指南.md
├── .gitignore
└── README.md
```

## 🚀 快速开始

### 环境要求
- Node.js >= 16
- npm 或 yarn

### 1. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 2. 配置环境变量

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件，根据需要修改配置：
```env
PORT=3001
JWT_SECRET=your_jwt_secret_key_here    # 请修改为自定义密钥
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. 启动开发服务器

```bash
# 启动后端 (端口 3001)
cd backend
npm run dev

# 启动前端 (端口 5173)
cd frontend
npm run dev
```

浏览器打开 http://localhost:5173 即可访问。

### 4. 初始化数据库

后端启动时会自动创建数据库和表。如需导入初始模板数据：
```bash
# 后端启动后自动初始化，也可手动导入
sqlite3 database/resume_template.db < database/seed.sql
```

## 🌐 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 展示全部模板，支持搜索筛选 |
| `/templates` | 模板中心 | 所有模板列表，平铺展示 |
| `/template/:id` | 模板详情 | 模板预览和详情信息 |
| `/builder/:templateId?` | 简历编辑器 | 在线编辑简历，实时预览 |
| `/user` | 个人中心 | 我的简历、收藏、设置 |
| `/pro` | 会员中心 | 会员特权介绍 |

## 🔌 API 接口

### 用户认证
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/users/register` | 用户注册 |
| POST | `/api/users/login` | 用户登录 |
| GET | `/api/users/me` | 获取当前用户信息 |

### 模板
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/templates` | 获取模板列表 (支持分页、筛选) |
| GET | `/api/templates/featured` | 获取精选模板 |
| GET | `/api/templates/:id` | 获取模板详情 |

### 简历
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/resumes` | 获取用户简历列表 |
| POST | `/api/resumes` | 创建新简历 |
| PUT | `/api/resumes/:id` | 更新简历 |
| DELETE | `/api/resumes/:id` | 删除简历 |

### 收藏
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/favorites` | 获取收藏列表 |
| POST | `/api/favorites` | 添加收藏 |
| DELETE | `/api/favorites/:template_id` | 取消收藏 |

## 🎨 模板布局

支持 7 种简历布局风格：

1. **居中头像** - 经典左对齐设计，照片左侧，信息右侧
2. **右上角头像** - 照片在右上角，信息左侧排列
3. **左上角头像** - 照片在左上角，信息右侧排列
4. **左侧边栏** - 侧边栏导航 + 主内容区双栏结构
5. **双栏布局** - 左右双栏均衡分布内容
6. **简洁无照片** - 无照片版本，纯文字排版
7. **详细型** - 三栏详细布局，信息量大

所有模板均支持：
- 标准 3cm × 4cm 证件照比例
- 浅灰色占位符文字引导
- 清晰的模块层级划分
- 专业职场排版规范

## 📝 开发说明

### 目录规范
- 组件文件名使用大驼峰 (e.g. `ResumePreview.jsx`)
- 工具函数使用小驼峰 (e.g. `templateStyles.js`)
- 页面组件放在 `pages/` 目录
- 可复用组件放在 `components/` 目录

### 状态管理
- 用户认证状态使用 React Context
- 表单数据使用 useState 本地管理
- 预览组件支持实时同步更新

### 占位符机制
预览组件使用 `Placeholder` 组件实现占位效果：
- 字段为空时显示浅灰色提示文字
- 用户输入后自动替换为实际内容
- 列表类内容为空时显示灰色示例条目

## 📄 License

MIT License
