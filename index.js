const express = require("express");
const users = require("./MOCK_DATA.json");

const app = express();
const PORT = 8000;

const fs = require("fs");
// Middleware to parse URL-encoded data
app.use(express.urlencoded({extended:false}));


//Routes
/*app.get("/users",(req, res)=>{
    const html = `
    <ul>
    ${users.map(user => `<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html);
})*/

//common route to handle get post operations

app.route('/api/users/:id')
.get((req,res)=>{
    const id = Number(req.params.id);
    const user = users.find((user)=>user.id===id);
    return res.json(user);
})
.patch((req,res)=>{
    const id = Number(req.params.id);
    const user =users.findIndex((user)=>user.id===id);
    const body =req.body;
    users[user].first_name = body.first_name;
    users[user].job_title = body.job_title;
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users),(err, data)=>{
    console.log("user updated having id: ", users.length)
    return res.json({status : "success", id : users.length})})
})
.delete((req,res)=>{
    const id = Number(req.params.id);
    const user =users.findIndex((user)=>user.id===id);
    users.splice(user,1)
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users),(err, data)=>{
    console.log("user deleted", users.length+1)
    return res.json({status : "success", id : users.length+1})})
})
//route to create new user data

app.post("/api/users/",(req,res)=>{
    const body = req.body;
    users.push({...body, id: users.length+1});
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users),(err, data)=>{
       console.log("created new user")
       return res.json({status: "success", id :  users.length});
    })
});

//REST API
app.get("/api/users", (req, res)=>{
    return res.json(users);
});

app.listen(PORT, ()=> console.log('Server started at PORT :'+PORT))