import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

// 解决 ES Module 下 __dirname 问题
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== 静态资源目录（你的游戏文件放这里）=====
app.use(express.static(path.join(__dirname, "public")));

// ===== 可选：健康检查接口（Pi/部署常用）=====
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString()
  });
});

// ===== 首页路由 =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== 可扩展 API（比如分数系统）=====
app.use(express.json());

// 保存分数（示例）
let scores = [];

app.post("/api/score", (req, res) => {
  const { user, score } = req.body;

  if (!user || typeof score !== "number") {
    return res.status(400).json({ error: "invalid payload" });
  }

  scores.push({ user, score, time: Date.now() });

  // 只保留最近 100 条
  scores = scores.slice(-100);

  res.json({ success: true });
});

// 获取排行榜
app.get("/api/scores", (req, res) => {
  res.json(scores.sort((a, b) => b.score - a.score));
});

// ===== 启动服务器 =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});