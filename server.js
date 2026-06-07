app.post("/api/auth/verify", async (req,res)=>{
    try{
        const {accessToken} = req.body;

        if(!accessToken){
            return res.json({ok:false});
        }

        const r = await fetch("https://api.minepi.com/v2/me",{
            headers:{
                Authorization:`Bearer ${accessToken}`
            }
        });

        const user = await r.json();

        if(!user?.username){
            return res.json({ok:false});
        }

        res.json({ok:true,user});

    }catch(e){
        res.json({ok:false});
    }
});