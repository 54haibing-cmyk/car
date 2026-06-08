import express from "express";
import session from "express-session";
import cors from "cors";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── 中间件 ────────────────────────────────────────────
app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || "*",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret:            process.env.SESSION_SECRET || "pi-word-hero-secret-change-me",
    resave:            false,
    saveUninitialized: false,
    cookie: {
        secure:   process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge:   24 * 60 * 60 * 1000   // 24 小时
    }
}));

// 静态文件（index.html / game.js / style.css 等）
app.use(express.static(join(__dirname, "public")));

// ─── 工具函数 ───────────────────────────────────────────

/**
 * 调用 Pi Platform API 验证 accessToken
 * 官方文档：https://developers.minepi.com/doc/javascript2#authenticate
 */
async function verifyWithPiServer(accessToken) {
    const res = await fetch("https://api.minepi.com/v2/me", {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!res.ok) throw new Error(`Pi API 响应异常: ${res.status}`);
    const user = await res.json();
    if (!user?.username) throw new Error("Pi API 未返回有效用户");
    return user;
}

// ─── 路由：身份验证 ─────────────────────────────────────

/**
 * POST /api/auth/validate
 * 前端完成 Pi.authenticate() 后把 accessToken 发来
 * 后端用它向 Pi 服务器确认身份，成功后写入 session
 */
app.post("/api/auth/validate", async (req, res) => {
    const { accessToken } = req.body;
    if (!accessToken) {
        return res.status(400).json({ success: false, message: "缺少 accessToken" });
    }

    try {
        const piUser = await verifyWithPiServer(accessToken);

        // 写入 session
        req.session.user = {
            uid:      piUser.uid,
            username: piUser.username
        };

        return res.json({ success: true, user: req.session.user });

    } catch (err) {
        console.error("[Auth] 验证失败:", err.message);
        return res.status(401).json({ success: false, message: err.message });
    }
});

/**
 * GET /api/auth/me
 * 前端刷新页面后检查 session 是否仍有效
 */
app.get("/api/auth/me", (req, res) => {
    if (req.session?.user) {
        return res.json({ success: true, user: req.session.user });
    }
    return res.status(401).json({ success: false, message: "未登录" });
});

/**
 * POST /api/auth/logout
 */
app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
        res.json({ success: true });
    });
});

// ─── 路由：游戏进度 ─────────────────────────────────────
// 简单示例：存储在内存（生产环境请换成数据库）
const progressStore = new Map();   // uid → { level, xp }

function requireAuth(req, res, next) {
    if (!req.session?.user) {
        return res.status(401).json({ success: false, message: "请先登录" });
    }
    next();
}

/**
 * GET /api/progress
 */
app.get("/api/progress", requireAuth, (req, res) => {
    const uid  = req.session.user.uid;
    const data = progressStore.get(uid) || { level: 0, xp: 0 };
    res.json({ success: true, progress: data });
});

/**
 * POST /api/progress
 * body: { level, xp }
 */
app.post("/api/progress", requireAuth, (req, res) => {
    const { level, xp } = req.body;
    const uid = req.session.user.uid;
    if (typeof level !== "number" || typeof xp !== "number") {
        return res.status(400).json({ success: false, message: "参数错误" });
    }
    progressStore.set(uid, { level, xp });
    res.json({ success: true });
});

// ─── 路由：排行榜 ────────────────────────────────────────

/**
 * GET /api/leaderboard
 */
app.get("/api/leaderboard", (req, res) => {
    const top = [...progressStore.entries()]
        .sort(([, a], [, b]) => b.xp - a.xp)
        .slice(0, 20)
        .map(([uid, data]) => ({ uid, ...data }));
    res.json({ success: true, leaderboard: top });
});

// ─── 路由：Pi 支付（未完成订单处理）──────────────────────

/**
 * POST /api/payments/incomplete
 * Pi SDK 在 onIncompletePaymentFound 回调中通知前端，
 * 前端转发到这里让后端决定 complete 还是 cancel。
 *
 * 注：完整的支付流程还需要
 *   POST /api/payments/approve   → 调用 Pi Platform API approve
 *   POST /api/payments/complete  → 调用 Pi Platform API complete
 * 此处仅保留骨架，具体业务逻辑根据你的商品自行扩展。
 */
app.post("/api/payments/incomplete", requireAuth, async (req, res) => {
    const { paymentId, payment } = req.body;
    console.warn("[Payment] 发现未完成订单:", paymentId, payment?.memo);
    // TODO: 查询数据库判断订单状态，决定 complete 或 cancel
    res.json({ success: true, action: "noted" });
});

// ─── 健康检查 ────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ ok: true }));

// ─── SPA 兜底路由 ─────────────────────────────────────────
app.get("*", (_req, res) => {
    res.sendFile(join(__dirname, "public", "index.html"));
});

// ─── 启动 ─────────────────────────────────────────────────
createServer(app).listen(PORT, () => {
    console.log(`✅  Word Match Hero 服务已启动 → http://localhost:${PORT}`);
    console.log(`   环境: ${process.env.NODE_ENV || "development"}`);
});
