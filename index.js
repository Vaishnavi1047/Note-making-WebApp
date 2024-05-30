const express=require('express');
const app=express();
const path = require('path');
const fs=require('fs');


//next two lines are called parsers
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

app.get("/",function(req,res){
    fs.readdir(`./files`,function(err,files){
       // console.log(files);
       res.render("index",{files: files});

    })
});

app.get("/files/:filename",function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8",function(err,filedata){
        res.render('show',{filename: req.params.filename,filedata: filedata});
    })
});

app.get("/edit/:filename",function(req,res){
    res.render('edit',{filename: req.params.filename});
});

// app.post("/edit",function(req,res){
//     fs.rename(`./files/${req.body.previous}`,`./files/${req.body.new}`,function(err){
//         res.redirect('/');
//     })
// });

app.post("/edit", function(req, res) {
    const previousFilename = req.body.previous;
    const newFilename = req.body.new;

    if (previousFilename !== newFilename) {
        // Rename the file
        fs.rename(`./files/${previousFilename}`, `./files/${newFilename}`, function(err) {
            if (err) {
                console.error("Error renaming file:", err);
                res.status(500).send("Error renaming file");
                return;
            }
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
});

app.post("/create",function(req,res){
    fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err){
        res.redirect('/')
    })
});
// app.get("/profile/:username",function(req,res){
//     res.send(`Hey, ${req.params.username}`);
// });

app.listen(3000,function(){
    console.log("running server...");
}) 