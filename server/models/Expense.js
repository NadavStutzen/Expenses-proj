const mongoose = require('mongoose')
const Schema = mongoose.Schema

const expenseSchema = new Schema({
    item : String,
    amount : Number,
    date : Date,
    group : String
})

const Expense = mongoose.model("expense", expenseSchema)
module.exports = Expense


// name, a string
// amount, a number
// date, a date
// group, a string