import express from "express";
const app = express();

app.use(express.json());
app.use(express.static("public"));

let scores=[];

// Pi token验证
app.post("/api/auth/verify", async (req,res)=>{
    try{
        const { accessToken } = req.body;

        const r = await fetch("https://api.minepi.com/v2/me",{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        });

        const user = await r.json();

        if(!user?.username){
            return res.json({ok:false});
        }

        return res.json({
            ok:true,
            user
        });

    }catch(e){
        return res.json({ok:false});
    }
});

// 保存分数
app.post("/api/score",(req,res)=>{
    const {user,score}=req.body;

    scores.push({user,score,time:Date.now()});
    scores=scores.slice(-200);

    res.json({ok:true});
});

// 排行榜
app.get("/api/leaderboard",(req,res)=>{
    const sorted=[...scores].sort((a,b)=>b.score-a.score);
    res.json(sorted.slice(0,20));
});

app.listen(3000,()=>{
    console.log("Pi Game running http://localhost:3000");
});