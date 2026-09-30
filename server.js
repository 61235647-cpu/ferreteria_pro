const express=require("express");
const path=require("path");
const app=express();

app.use(express.json());
app.use(express.static(__dirname));

app.post("/api/dni",async(req,res)=>{
  const dni=String(req.body?.dni||"").replace(/\D/g,"");
  if(!/^\d{8}$/.test(dni)) return res.status(400).json({success:false,message:"El DNI debe tener 8 dígitos."});
  const token=process.env.DNI_API_TOKEN;
  if(!token) return res.status(500).json({success:false,message:"Falta configurar DNI_API_TOKEN en el servidor."});
  try{
    const r=await fetch("https://api.apiperu.dev/dni",{
      method:"POST",
      headers:{Accept:"application/json","Content-Type":"application/json",Authorization:"Bearer "+token},
      body:JSON.stringify({dni})
    });
    const data=await r.json();
    res.status(r.status).json(data);
  }catch(e){
    res.status(503).json({success:false,message:"No se pudo conectar con el servicio de DNI."});
  }
});

const port=process.env.PORT||3000;
app.listen(port,()=>console.log("Ferretería Pro en http://localhost:"+port));
