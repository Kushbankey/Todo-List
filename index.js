import express from "express";
import bodyParser from "body-parser";

const app=express();
const port=3000;
let todayTask=[];
let workTask=[];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}));

/*
app.get("/",(req,res)=>{
    res.render("home.ejs");

    todayTask.length=0;
});
app.get("/about",(req,res)=>{
    res.render("about.ejs");
});
app.get("/today",(req,res)=>{
    res.render("today.ejs");

    //todayTask.length=0;
});
app.get("/work",(req,res)=>{
    res.render("work.ejs");

    //workTask.length=0;
});

app.post("/addTask",(req,res)=>{
    const listType=req.body["listType"];
    const newTask=req.body["task"];

    if(listType==="today"){
        todayTask.push(newTask);
        //res.redirect("/today");
        res.render("today.ejs",{task: todayTask});
    }
    else{
        workTask.push(newTask);
        //res.redirect("/work");
        res.render("work.ejs",{task: workTask});
    }
});
*/


app.get("/",(req,res)=>{
    res.render("home.ejs");
});
app.get("/about",(req,res)=>{
    res.render("about.ejs");
});

app.post("/addTask",(req,res)=>{
    const listType=req.body["listType"];
    const newTask=req.body["task"];

    if(listType==="today"){
        todayTask.push(newTask);
        res.redirect("/today");
    }
    else{
        workTask.push(newTask);
        res.redirect("/work");
    }
});

app.get("/today",(req,res)=>{
    res.render("today.ejs",{task: todayTask});

    //todayTask.length=0;
});
app.get("/work",(req,res)=>{
    res.render("work.ejs",{task: workTask});

    //workTask.length=0;
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}.`);
});