
<div align="center">

简体中文 | [English](README_en.md)

<img src="./src/assets//images/logo.png" width="32" />
<h2 id="title">taro-bazi</h2> <p>一个支持多端运行的八字排盘工具</p> </div>

## 简介

**taro-bazi** 是一个基于 **Taro（React）** 开发的八字排盘应用，支持 **微信小程序** 和 **H5** 多端运行。项目为纯前端实现，无需调用任何 API 接口。

> 📱 本项目主要适配微信小程序，H5 端样式可能存在轻微偏差。

核心特性：
- ✅ **纯前端运行**：无需后端接口，开箱即用
- 🧮 **精准节气算法**：基于寿星万年历计算真太阳时，显著减少排盘误差
- 📅 **支持更广时间范围**：可排盘从公元 100 年起的八字（远超常见工具的 1600 年起）
- ✂️ **一键复制提示词**：生成 AI 提示词，支持原命局、大运流年两种类型
- 🔍 **干支反查功能**：查询某八字在当前年限是否真实存在
- 🎓 **内置名人案例**：附带多位名人八字数据，方便学习参考

## 预览

<img src="./public/preview.gif" width="200" />
<img src="./public/chat.gif" width="400" />

## 使用

### 环境要求

- Node.js ≥ 18（建议使用 v18.19.0 或更高版本）

### 安装依赖

```bash
yarn install
```

### 本地启动（H5）

```bash
yarn dev:h5
```

### 构建（H5）

```bash
yarn build:h5
```

### 启动微信小程序

```bash
yarn dev:weapp
```

## 交流

<p>QQ交流群</p>

<img src="./public/qq.png" width="250" />

## 开源协议

项目基于 [MIT © 2025](./LICENSE) 协议，仅供学习参考，商业使用请保留作者版权信息，作者不保证也不承担任何软件的使用风险。