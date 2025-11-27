# Otter 笔记应用

一个基于 React Native 和 Expo 的本地笔记应用，支持用户认证和 SQLite 数据库存储。

## ⚠️ 重要提示

**此应用无法在 Expo Snack 中运行！**

由于应用使用了 SQLite 数据库（需要原生模块），必须在真实设备或模拟器上运行。详细说明请查看 `SNACK_LIMITATIONS.md`。

## 🚀 快速开始

### 方法 1：在手机上使用 Expo Go（推荐）

1. **在手机上安装 Expo Go**
   - iOS：从 App Store 下载
   - Android：从 Google Play 下载

2. **克隆仓库到本地**
   ```bash
   git clone https://github.com/zq12345678/app1.git
   cd app1
   ```

3. **安装依赖**
   ```bash
   npm install
   ```

4. **启动开发服务器**
   ```bash
   npx expo start
   ```

5. **扫描二维码**
   - iOS：使用相机应用扫描
   - Android：使用 Expo Go 应用扫描

### 方法 2：使用 iOS 模拟器（仅限 Mac）

```bash
npm install
npx expo start
# 按 'i' 键在 iOS 模拟器中打开
```

### 方法 3：使用 Android 模拟器

```bash
npm install
npx expo start
# 按 'a' 键在 Android 模拟器中打开
```

## 📱 功能特性

### ✅ 已实现功能

- **用户认证系统**
  - 用户注册（邮箱、用户名、密码）
  - 用户登录
  - 会话管理（使用 AsyncStorage）
  - 自动登录

- **数据库功能**
  - SQLite 本地数据库
  - 用户数据隔离
  - 级联删除（删除课程时自动删除相关讲座和笔记）

- **课程管理**
  - 创建课程
  - 查看课程列表
  - 删除课程

- **讲座管理**
  - 在课程下创建讲座
  - 查看讲座列表
  - 删除讲座

- **笔记/转录管理**
  - 在讲座下创建笔记
  - 查看笔记内容
  - 删除笔记

## 🗂️ 项目结构

```
app1/
├── App.js                          # 主应用入口，包含数据库初始化
├── components/
│   ├── HomeScreen.js              # 主页（课程列表）
│   ├── FolderDetailScreen.js     # 课程详情（讲座列表）
│   ├── NoteDetailScreen.js       # 讲座详情（笔记列表）
│   ├── LoginScreen.js            # 登录界面
│   ├── RegisterScreen.js         # 注册界面
│   ├── AIChatScreen.js           # AI 聊天（占位）
│   ├── StyleGuideScreen.js       # 样式指南
│   └── LanguageSelectionScreen.js # 语言选择
├── contexts/
│   ├── AuthContext.js            # 认证上下文（用户状态管理）
│   └── RecordingContext.js       # 录音上下文
├── services/
│   └── database.js               # 数据库服务层（所有 CRUD 操作）
├── TESTING_GUIDE.md              # 测试指南（英文）
├── IMPLEMENTATION_SUMMARY_CN.md  # 实现总结（中文）
├── SNACK_LIMITATIONS.md          # Snack 限制说明
└── README_CN.md                  # 本文件
```

## 🧪 测试应用

详细的测试步骤请查看 `TESTING_GUIDE.md`。

### 快速测试流程

1. **注册新用户**
   - 邮箱：test@example.com
   - 用户名：testuser
   - 密码：123456

2. **创建课程**
   - 点击 "+" 按钮
   - 输入课程名称

3. **创建讲座**
   - 点击课程进入详情
   - 点击 "+" 按钮
   - 输入讲座标题

4. **创建笔记**
   - 点击讲座进入详情
   - 点击 "+" 按钮
   - 输入笔记内容

5. **测试登出/登入**
   - 登出后重新登录
   - 验证数据是否保留

## 🔧 技术栈

- **React Native** - 跨平台移动应用框架
- **Expo** - React Native 开发工具链
- **React Navigation** - 导航库
- **expo-sqlite** - SQLite 数据库
- **AsyncStorage** - 本地存储（会话管理）
- **React Context API** - 状态管理

## 📊 数据库架构

### 用户表 (users)
- id (主键)
- email (唯一)
- username
- password
- created_at

### 课程表 (courses)
- id (主键)
- user_id (外键 → users)
- name
- created_at

### 讲座表 (lectures)
- id (主键)
- course_id (外键 → courses)
- user_id (外键 → users)
- title
- lecture_number
- created_at

### 笔记表 (transcripts)
- id (主键)
- lecture_id (外键 → lectures)
- user_id (外键 → users)
- content
- timestamp
- created_at

## 🐛 故障排除

### 应用一直在加载

**原因**：数据库初始化失败

**解决方案**：
1. 检查是否在真实设备或模拟器上运行（不是 Snack）
2. 查看控制台日志中的错误信息
3. 尝试清除缓存：`npx expo start -c`

### 无法连接到开发服务器

**解决方案**：
1. 确保手机和电脑在同一 WiFi 网络
2. 检查防火墙设置
3. 尝试使用隧道模式：`npx expo start --tunnel`

### 依赖安装失败

**解决方案**：
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 开发说明

### 添加新功能

1. 如需修改数据库结构，编辑 `services/database.js`
2. 如需添加新页面，在 `components/` 目录创建新文件
3. 如需修改导航，编辑 `App.js`

### 调试技巧

1. 使用 `console.log()` 输出调试信息
2. 在 Expo Go 中摇晃设备打开开发菜单
3. 启用远程调试：开发菜单 → Debug Remote JS

## 🔐 安全注意事项

⚠️ **当前实现仅用于演示目的**

生产环境需要改进：
- 使用 bcrypt 或类似库对密码进行哈希
- 实现 JWT 或 OAuth 认证
- 添加输入验证和清理
- 使用 HTTPS
- 实现速率限制

## 📄 许可证

MIT

## 👥 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 联系方式

如有问题，请在 GitHub 上创建 Issue。

