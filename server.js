const express=require("express");
const dotenv=require("dotenv");
const cors=require("cors");

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

app.get("/",(req,res)=>{
    res.send("SkillGap Backend is running");
});

app.get("/test", (req, res) => {
    res.send("Test API working");
});

const PORT=process.env.PORT || 5000;
app.listen(PORT,()=>{
   console.log(`Server is running on port ${PORT}`);
});