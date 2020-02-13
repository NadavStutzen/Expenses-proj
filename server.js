const express = require("express");
const path = require("path");
const bodyParser = require('body-parser')
const api = require('./server/routes/api')
const app = express();
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Expense = require('./server/models/Expense')
// const rawData = require('./data.json')
mongoose.connect("mongodb://localhost/Expenses",{useNewUrlParser : true})

app.use(express.static(path.join(__dirname, "dist")));
app.use(express.static(path.join(__dirname, "node_modules")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', api)

// for(let dat of rawData){
//     const exp = new Expense(dat)
//     exp.save()
// }


const port = 3000;
app.listen(port, function() {
  console.log(`Running server on port ${port}`);
});

