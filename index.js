const http  = require("http");
const fs = require("fs");
const url = require("url");
const querystring = require("querystring");

const users ={};

const myServer = http.createServer((req,res) =>{
   const myUrl = url.parse(req.url , true);
   const pathname = myUrl.pathname;
   if (req.method === "GET" && pathname === "/") {
    // Serve a simple HTML page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
        <html>
            <body>
                <h1>Welcome to the User Registration and Login Server</h1>
                <form method="POST" action="/register">
                    <h2>Register</h2>
                    <label>Username:</label>
                    <input type="text" name="username" required>
                    <label>Password:</label>
                    <input type="password" name="password" required>
                    <button type="submit">Register</button>
                </form>
                <form method="POST" action="/login">
                    <h2>Login</h2>
                    <label>Username:</label>
                    <input type="text" name="username" required>
                    <label>Password:</label>
                    <input type="password" name="password" required>
                    <button type="submit">Login</button>
                </form>
            </body>
        </html>
    `);}

   else if(req.method === "POST" && pathname =="/register"){
    let body ='';
    req.on('data' , chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        const {username, password} = querystring.parse(body);

        if(!username || !password){
            res.writeHead(400 , {'Content-Type':'application/json'});
            res.end(JSON.stringify({message:'Username & Password Required'}));
           return res.end();
        }

        if(users[username]){
            res.writeHead(400 ,{"Content-Type":"application/json"});
            res.end(JSON.stringify({message:"User is Already Exists"}));
            return res.end();
        }
        users[username] = password;
        res.writeHead(201 , {"Content-Type":"application/json"});
        res.end(JSON.stringify({message:"USer registered Successfully!"}));

    });
   }else if( req.method==="POST" && pathname ==="/login"){
    let body ='';
    req.on('data' , chunk =>{
        body += chunk.toString();
    });
    req.on('end' ,()=>{
        const {username , password} =querystring.parse(body);
        if(users[username] && users[username] === password){
            res.writeHead(200 , {'Content-Type':'application/json'});
            res.end(JSON.stringify({message:'Login Successfully'}));
        }else{
            res.writeHead(404,{'Content-Type':'application/json'});
            res.end(JSON.stringify({message:'Not Found'}));
        }
    })
   }
   fs.appendFile('log.txt',(err) => {
       const logMessage = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;
       if (err) console.error('Failed to write to log file:', err);
   });
})
myServer.listen(8000 , ()=>console.log("Server Started"));