import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

const app=express();
const port=process.env.PORT|3000;
app.set('view engine', 'ejs');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//connect mongoDB with mongoose
import {} from 'dotenv/config';

import { connectDB } from './DB/mongo.js';
connectDB();


//create schema
const itemSchema= new mongoose.Schema({
    name: String
});

//create model
const Item= mongoose.model("Item", itemSchema);

//creating items
const item1=new Item({
    name: "Welcome to your TodoList!"
});

const item2=new Item({
    name: "Hit + button to add new item."
});

const item3=new Item({
    name: "<-- Hit this to delete an item."
});

const defaultItems=[item1, item2, item3];

const listSchema={
    name: String,
    desc: String,
    items: [itemSchema]
};

const List=mongoose.model("List", listSchema);

app.get("/",(req,res)=>{
    async function findAllLists(){
        try{
            const result=await List.find();
            //console.log(result[0].name);

            res.render("home.ejs",{AllLists: result});
        }
        catch(error){
            console.log(error);
        }
    }
    findAllLists();
});

app.get("/about",(req,res)=>{
    res.render("about.ejs");
});

app.get("/today",(req,res)=>{

    //find all items in Item collection
    async function findAllItems(){
        try{
            const itemList= await Item.find({});
            //console.log(itemList);

            //inserting all items into items collection
            async function insertItems(defaultItems){
                try{
                    const result= await Item.insertMany(defaultItems);

                    console.log(`Succesfully inserted ${result.length} document(s).`);
                }
                catch(error){
                    console.log(error);
                }
            }

            if(itemList.length===0){
                insertItems(defaultItems);
                res.redirect("/today");
            }
            else{
                res.render("today",{listTitle: "Today",tasks: itemList});
            }
        }
        catch(error){
            console.log(error);
        }
    }
    findAllItems();
});

app.get("/:customListName", (req,res) => {
    const customListName= _.capitalize(req.params.customListName);

    async function findList(){
        try{
            const foundList=await List.findOne({name: customListName});
            //console.log(foundList);

            if(!foundList){
                //console.log("Doesn't Exists!");
                //create a new list
                const list=new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();

                res.redirect("/"+ customListName);
            }
            else{
                //console.log("Exists!");
                //show existing list

                res.render("today", {listTitle: foundList.name,tasks: foundList.items})
            }
        }
        catch(error){
            console.log(error);
        }
    }
    findList();
});

app.post("/addTask",(req,res)=>{
    const listName=req.body.list;
    const taskName=req.body.task;

    const newItem=new Item({
        name: taskName
    }); 

    if(listName==="Today"){
        newItem.save();
        res.redirect("/today");
    }
    else{
        async function findList(){
            try{
                const foundList=await List.findOne({name: listName});
                foundList.items.push(newItem);
                foundList.save();

                res.redirect("/"+ listName);
            }
            catch(error){
                console.log(error);
            }
        };
        findList();
    }
});

app.post("/delete", (req,res)=> {
    const checkedItemId=req.body.checkbox;
    const listName=req.body.listName;
    //console.log(checkedItemId);

    if(listName==="Today"){
        async function deleteItem(){
            try{
                const result= await Item.deleteOne({_id: checkedItemId});
                console.log(`Succefully deleted ${result.deletedCount} document(s).`);
                res.redirect("/today");
            }
            catch(error){
                console.log(error);
            }
        }
        deleteItem();
    }
    else{
        async function findAndUpdate(){
            try{
                const result=await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}});
                console.log(`Succefully deleted 1 document(s) from ${listName}.`);
                res.redirect("/"+ listName);
            }
            catch(error){
                console.log(error);
            }
        }
        findAndUpdate();
    }
});

app.post("/addList", (req,res) => {
    const listName=_.capitalize(req.body.list);
    const listDesc=req.body.desc;
    //console.log(listName);

    async function checkIfListExists(){
        try{
            const result=await List.find({name: listName});
            //console.log(result.length);
            if(result.length===0 && listName!="Today"){
                //console.log("Doesn't exists!");
                const list=new List({
                    name: listName,
                    desc: listDesc,
                    // items: defaultItems
                });
            
                list.save();

                res.redirect("/");
            }
            else{
                res.redirect("/");
            }
        }
        catch(error){
            console.log(error);
        }
    }
    checkIfListExists();
});

app.post("/deleteList", (req,res) => {
    const listName=_.capitalize(req.body.list);
    //console.log(listName);

    async function deleteList(){
        try{
            const result=await List.deleteOne({name: listName});
            console.log(`Succefully deleted ${listName} list.`);

            res.redirect("/")
        }
        catch(error){
            console.log(error);
        }
    }
    deleteList();
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}.`);
});