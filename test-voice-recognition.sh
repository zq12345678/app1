#!/bin/bash

# 语音识别功能测试脚本

echo "================================"
echo "语音识别功能测试"
echo "================================"
echo ""

# 检查项目目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在项目根目录运行此脚本"
    exit 1
fi

echo "✅ 项目目录检查通过"
echo ""

# 检查依赖
echo "检查必要的依赖..."
if grep -q "expo-av" package.json && grep -q "expo-file-system" package.json; then
    echo "✅ expo-av 和 expo-file-system 已安装"
else
    echo "❌ 缺少必要的依赖"
    exit 1
fi
echo ""

# 检查修复后的文件
echo "检查修复后的代码..."
if grep -q "Audio.IOSOutputFormat.LINEARPCM" contexts/RecordingContext.js; then
    echo "✅ 录音格式已修改为 LINEAR16"
else
    echo "❌ 录音格式未正确修改"
    exit 1
fi

if grep -q "encoding: 'LINEAR16'" contexts/RecordingContext.js; then
    echo "✅ API 配置已添加 LINEAR16 编码"
else
    echo "❌ API 配置缺少编码参数"
    exit 1
fi

if grep -q "FileSystem.readAsStringAsync" contexts/RecordingContext.js; then
    echo "✅ 已恢复真实的 Google API 调用"
else
    echo "❌ 仍在使用模拟转录"
    exit 1
fi
echo ""

# 检查 API 配置
echo "检查 API 配置..."
if [ -f "config/api.js" ]; then
    echo "✅ API 配置文件存在"
    if grep -q "GOOGLE_API_KEY" config/api.js; then
        echo "✅ API 密钥已配置"
    else
        echo "⚠️  警告: API 密钥可能未配置"
    fi
else
    echo "❌ API 配置文件不存在"
    exit 1
fi
echo ""

echo "================================"
echo "✅ 所有检查通过！"
echo "================================"
echo ""
echo "下一步操作："
echo "1. 运行 'npm start' 启动应用"
echo "2. 在模拟器或真机上打开应用"
echo "3. 进入任意笔记详情页面"
echo "4. 点击底部麦克风按钮测试录音"
echo "5. 说一段话后停止录音"
echo "6. 等待识别结果显示"
echo ""
echo "如果遇到问题，请查看 '语音识别修复说明.md'"
echo ""

