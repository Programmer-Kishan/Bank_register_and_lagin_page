

const express = require('express');
const path = require('path');
const hbs = require('hbs');
const app = express();
const alert = require("alert");

require("./db/conn");
const User = require("./models/register");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const css_path = path.join(__dirname, '../public/css')
const image_path = path.join(__dirname, "../public/images")
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(static_path));
app.use(express.static(css_path));
app.use(express.static(image_path));
app.set("view engine", "hbs");
app.set('views', template_path);
hbs.registerPartials(partial_path);

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/views/create", (req, res) => {
    res.render("create");
})

app.get("/views/login", (req, res) => {
    res.render("login");
})

app.post("/views/create", (req, res) => {
    try {
        
        let p1 = req.body.password;
        let p2 = req.body.cpassword;

        if (p1 === p2) {
            
            const user = new User({
                username: req.body.name,
                dob: req.body.DOB,
                email: req.body.email,
                phoneNumber: req.body.pnum,
                address: req.body.addr,
                gender: req.body.gender,
                password: req.body.password
            });

            user.save();
            res.status(201).render("index")
        }
        else {
            alert("Password not matching try again: ")
            res.redirect("/views/create")
        }

    } catch (error) {
        res.status(400).send(error)
    }
})

app.post("/login", (req, res) => {
    
    try {
        
        const name = req.body.username;
        const password = req.body.password;

        User.findOne({username: name, password: password}, (err, foundList) => {
            if(!err) {
                if (!foundList) {
                    alert("No Such User is there Please try again");
                }
                else {
                    res.send("You have been successfully loged in");
                }
            }
            else {
                res.send(err);
            }
        })
        
    } catch (error) {
        res.status(400).send(error);
    }

})

app.listen(port, () => {
    console.log(`Server started at the port ${port}`);
})