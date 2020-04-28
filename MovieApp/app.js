var express=require("express");
const app=express();
const request=require("request");
const bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine",'ejs');

app.get('/',(req,res)=>{
    res.render("home");
});
app.get('/movie/search',(req,res)=>{
    res.render('search');
})
app.post('/results',(req,res)=>{
    var movieName=req.body.movie; 
    console.log(movieName);
    request('http://www.omdbapi.com/?s='+movieName+'&apikey=thewdb',(error,response,body)=>{
        if(!error&&response.statusCode==200){
            // res.send(bo);
            var body=JSON.parse(body);
            res.render('results',{body:body});
        }
    })
})
   // res.send("Home page for app");

app.listen(3000,()=>{
    console.log("Movie app has started");
    
})
