/* ═══════════════════════════════════════════════
   Pi Word Match Hero - Backend Server
   Express API + Mock Storage (stable version)
═══════════════════════════════════════════════ */

import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// ─── 中间件 ─────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // 直接托管前端

// ─── 简单内存存储（先跑通用）────────────
const userProgress = {};
const payments = [];

// ─── Pi 登录验证（简化版）───────────────
app.post("/api/auth/validate", (req, res) => {
    try {
        const { accessToken } = req.body;

        if (!accessToken) {
            return res.status(400).json({
                success: false,
                message: "missing accessToken"
            });
        }

        // ⚠️ 这里是简化版（真实 Pi SDK 应该服务器验证 token）
        return res.json({
            success: true,
            message: "validated",
            user: {
                username: "PiUser_" + accessToken.slice(0, 6)
            }
        });

    } catch (e) {
        return res.status(500).json({
            success: false,
            message: e.message
        });
    }
});

// ─── 进度读取 ─────────────────────────────
app.get("/api/progress", (req, res) => {
    const userId = "default";

    res.json({
        success: true,
        progress: userProgress[userId] || {
            level: 0,
            xp: 0
        }
    });
});

// ─── 进度保存 ─────────────────────────────
app.post("/api/progress", (req, res) => {
    const userId = "default";

    const { level, xp } = req.body;

    userProgress[userId] = {
        level: level || 0,
        xp: xp || 0
    };

    res.json({
        success: true,
        message: "saved"
    });
});

// ─── Pi 未完成支付处理（占位）────────────
app.post("/api/payments/incomplete", (req, res) => {
    const { paymentId } = req.body;

    payments.push({
        paymentId,
        status: "incomplete"
    });

    console.log("未完成支付:", paymentId);

    res.json({
        success: true
    });
});

// ─── 健康检查 ─────────────────────────────
app.get("/", (req, res) => {
    res.send("Pi Word Match Hero Server Running 🚀");
});

// ─── 启动服务 ─────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});