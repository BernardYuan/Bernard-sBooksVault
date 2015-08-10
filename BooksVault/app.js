/**
 * Created by Bernard on 2015/4/16.
 */
var express=require('express');
var http=require('http');
var db=require('mysql');
var bodyparser=require('body-parser');
var dbconfig=require('./configure.json');
var crypto=require('crypto');
var database=db.createConnection(dbconfig);
var SE=require('./SearchEngine');

var app=express();
app.set('view engine', 'jade');
app.set('views','./views');
app.use(express.static('public'));
app.use('/book',express.static('public'));
app.use(bodyparser.urlencoded({
    extended: true
}));

var order={
    "Year+0 DESC":"Publish Time Descending",
    "Year+0":"Publish Time Ascending",
    "Title DESC":"Title Alphabetic Descending" ,
    "Title":"Title Alphabetic Ascending",
    "books_basic.ID+0 DESC":"ID Descending" ,
    "books_basic.ID+0":"ID Ascending"

};
app.get('/book/:id',function(req,res){
    var ID=req.params.id;
    database.query('SELECT * FROM books_basic INNER JOIN books_detail ON books_basic.ID=books_detail.ID WHERE books_basic.ID="'+ID+'";',function(err,rows){
        console.log(rows);
        if(err) {
            res.render("error",err);
        }else {
            res.render('book_detail',{book:rows[0]});
        }
    });
});
app.post('/ordersearch',function(req,res){
    console.log(req.body);
    var kword=req.body["keyword"];
    var fword=kword.split(']')[0];
    var key=kword.slice(fword.length+1);
    kword=kword.split(']')[0].slice(1);
    var okey="";
    if(req.body["orderkey"]) {
        okey=req.body["orderkey"];
    }else {
        okey="Year+0 DESC";
    }
    console.log(kword);
    console.log(key);
    SE.OrderSearch[kword](database,key,okey,function(err,rows){
        console.log(rows); //error page needed
        if(err) {
            res.render('searchresult',{warning:{type:"alert-danger",info:err.message},word:"["+kword+"]"+key,books:[]});
        } else if(rows.length) {
            res.render('searchresult',{warning:{type:"alert-info",info:"Find "+rows.length+' result(s) about "'+'".ordered by '+order[okey]+'.'},word:"["+kword+"]"+key,books:rows});
        }else {
            res.render('searchresult',{warning:{type:"alert-warning",info:"Find "+rows.length+' result(s) about "'+'".'},word:"["+kword+"]"+key,books:[]});
        }
    });
});
app.post('/searchresult',function(req,res){ //search engine need some optimization
   console.log(req.body);
    var keyword=req.body["keyword"];
    var searchKey=req.body["searchkey"];
    SE.Search[searchKey](database,keyword,function(err,rows){
        console.log(rows); //error page needed
        if(err) {
            res.render('index',{warning:{type:"alert-danger",info:err.message}})
        } else if(rows.length){
            res.render('searchresult',{warning:{type:"alert-info",info:"Find "+rows.length+' result(s) about "'+keyword+'".ordered by Publish Year Descending'},word:"["+searchKey+"]"+keyword,books:rows});
        }else {
            res.render('index',{warning:{type:"alert-warning",info:'Find 0 Results About "'+keyword+'"with "'+searchKey+' "'}});
        }
    });
   // database.query('SELECT DISTINCT Title, Subtitle FROM books_basic WHERE Title LIKE "'+ppkeyword+'" OR Subtitle LIKE "'+ppkeyword+'";',);
});

app.get('/insert',function(req,res) {  //turn to insert page
    res.render('insert',{basic:{},detail:{}});
});
app.post('/insertbook',function(req,res){ //insert into the database and return to the Administrator page
    database.query('INSERT INTO books_basic(ID,Title,Subtitle,Description,Image) VALUES("'+req.body["ID"]+'","'+req.body["Title"]+'","'+req.body["Subtitle"]+'","'+req.body["Description"]+'","'+req.body["Image"]+'");',function(err,result){
        if(err) {
            res.render('Admin', {warning:{type:"alert-danger",info:"Insert Error!!!\nMessage:\n"+err.message}});
        }else {
            console.log(result);
            database.query('INSERT INTO books_detail(ID,Author,ISBN,Page,Year,Publisher,Download) VALUES("'+req.body["ID"]+'","'+req.body["Author"]+'","'+req.body["ISBN"]+'","'+req.body["Page"]+'","'+req.body["Year"]+'","'+req.body["Publisher"]+'","'+req.body["Download"]+'");',function(err1,result1){
                if(err1) {
                    res.render('Admin', {warning:{type:"alert-danger",info:"Insert Error!!!\nMessage:\n"+err1.message}});
                }else {
                    console.log(result1);
                    res.render("Admin",{warning:{type:"alert-success",info:"Insert Successful!\n"+JSON.stringify(result)+JSON.stringify(result1)}}); //extraction the username from the cookie
                }
            });
        }
    });
});
app.get('/update',function(req,res){ //go to a page which search the book to update with ID
    res.render('searchbeforeupdate',{title:'Update'});
});
app.post('/update1',function(req,res){   //get the information of the book to update !!!need to consider no matching
    var basic;
    var detail;
    database.query('SELECT * FROM books_basic WHERE ID="'+req.body["ID"]+'";',function(err,result1){
        if(err) {
            res.render('Admin',{warning:{type:"alert-danger",info:"Update Error!!!\n"+err.message}});
        }else if(!result1.length) {
            res.render('Admin',{warning:{type:"alert-warning",info:"Update Warning!!!Result Empty Set."}});
        } else {
            basic=result1[0];
            database.query('SELECT * FROM books_detail WHERE ID="'+req.body["ID"]+'";',function(err2,result2){
                if(err2) {
                    res.render('Admin',{warning:{type:"alert-danger",info:"Update Error!!!\n"+err2.message}});
                }
                else {
                    detail=result2[0];
                    console.log(basic);
                    console.log(detail);
                    res.render('update',{basic:basic, detail: detail});
                }

            });
        }
    });
});
app.post('/updatefinal',function(req, res){  //confirm and modify the update information and go back to the Admin page
    database.query('UPDATE books_basic SET ID="'+req.body["ID"]+'",Title="'+req.body["Title"]+'",Subtitle="'+req.body["Subtitle"]+'",Description="'+req.body["Description"]+'",Image="'+req.body["Image"]+'" WHERE ID="'+req.body["ID"]+'";',function(err1,result1){
        if(err1) {
            res.render("Admin",{warning:{type:"alert-danger",info:"Update Error!!!\n"+err1.message}});
        }else {
            console.log(result1);
            database.query('UPDATE books_detail SET ID="'+req.body["ID"]+'",Author="'+req.body["Author"]+'",ISBN="'+req.body["ISBN"]+'",Page="'+req.body["Page"]+'",Year="'+req.body["Year"]+'",Publisher="'+req.body["Publisher"]+'",Download="'+req.body["Download"]+'" WHERE ID="'+req.body["ID"]+'";',function(err2,result2){
                if(err2) {
                    res.render("Admin",{warning:{type:"alert-danger",info:"Update Error!!!\n"+err2.message}});
                }else {
                    console.log(result2);
                    res.render("Admin",{warning:{type:"alert-success",info:"Update Successful!\n"+JSON.stringify(result1)+JSON.stringify(result2)}});
                }
            })
        }
    });
});
app.get('/delete',function(req,res){  //go to the page  which search for the book to delete with ID
    res.render('searchbeforedelete',{title:'Delete'});
});
app.post("/delete1",function(req,res){  //get the information of the book to delete   !!!need to consider no matching
    var basic;
    var detail;
    database.query('SELECT * FROM books_basic WHERE ID="'+req.body["ID"]+'";',function(err,result1){
        if(err) {
            res.render('Admin',{warning:{type:"alert-danger",info:"Delete Error!!!\n"+err.message}});
        }else if(!result1.length) {
            res.render('Admin',{warning:{type:"alert-warning",info:"Search Result Empty Set"}});
        }else {
            basic=result1[0];
            database.query('SELECT * FROM books_detail WHERE ID="'+req.body["ID"]+'";',function(err2,result2){
                if(err2) {
                    res.render('Admin',{warning:{type:"alert-danger",info:"Delete Error!!!\n"+err2.message}});
                }
                else {
                    detail=result2[0];
                    console.log(basic);
                    console.log(detail);
                    res.render('delete',{basic:basic, detail: detail});
                }

            });
        }
    });
});
app.post('/deletefinal',function(req,res) { //delete it and return to Admin page
    database.query('DELETE FROM books_basic WHERE ID="'+req.body["ID"]+'";',function(err1,result1){
        if(err1) {
            res.render('Admin',{message:{type:"alert-danger",info:"Delete Error!!!\n"+err1.message}});
        }else {
            console.log(result1);
            database.query('DELETE FROM books_detail WHERE ID="'+req.body["ID"]+'";',function(err2,result2){
                if(err2) {
                    res.render('Admin',{warning:{type:"alert-danger",info:"Delete Error!!!\n"+err2.message}});
                }
                else {
                    console.log(result2);
                    res.render('Admin',{warning:{type:"alert-success",info:"Delete Success!\n"+JSON.stringify(result1)+JSON.stringify(result2)}});
                }
            });
        }
    });
});
app.get('/exit',function(req,res){   //return to the index page !!!remember to destroy the cookie
    //some codes needed here to delete the cookie
    res.render('index',{title:"title"});
});

app.post('/Admin',function(req,res) {  //administrator page
    console.log(req.body);
    database.query('SELECT password FROM Admin WHERE username ="'+req.body.username+'";',function(err,rows){
        if(err) {
            res.render('error',{message:"Sorry!",error:err});
        } else if(rows[0]) {
            if(rows[0]["password"]==req.body.password) {
                res.render('Admin',{warning:{type:"alert-success",info:"Hello!~~~  "+req.body["username"]}});
            }
            else{ //wrong password
                res.render('login',{warning:"Wrong Password"}); //in login page the error information should be displayed
            }
        } else {  //no such user
            res.render('login',{warning:"No Such User"});
        }
    });
});

app.get('/login',function(req,res){   //administrator login page
    console.log("login page");
    res.render('login',{});
});
app.get('/',function(req,res){   //index page
    res.render('index',{title:"title"});
    //console.log(req.connection.remoteAddress);
});
app.listen(3000,function() {
   console.log('Listening Port 3000');
});