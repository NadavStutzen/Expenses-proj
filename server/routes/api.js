const express = require("express");
const router = express.Router();
const moment = require("moment");
const Expense = require("../models/Expense");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

router.get("/expenses", function(req, res) {
  if (req.query.d1) {
    let d1 = moment(req.query.d1).format("LLLL");
    let d2 = req.query.d2
      ? moment(req.query.d2).format("LLLL")
      : moment().format("LLLL");
    let findProm = Expense.find({
      $and: [{ date: { $gt: d1 } }, { date: { $lt: d2 } }]
    }).sort({date : -1});
    findProm.then(function(result) {
      res.send(result);
    });
  } else {
    Expense.find({})
      .sort({ date: -1 })
      .exec(function(err, result) {
        res.send(result);
      });
  }
});

router.get("/expenses/:group", function(req, res) {
  let group = req.params.group;
  let total = req.query.total;
  if (total === "true") {
    let query = Expense.aggregate([
      { $match: { group: group } },
      {
        $group: {
          _id: "$group",
          TotalAmount: { $sum: "$amount" }
        }
      }
    ]);
    query.then(function(result) {
      res.send(result);
    });
  } else {
    let query = Expense.find({ group: group });
    query.then(function(result) {
      res.send(result);
    });
  }
});

router.post("/new", function(req, res) {
  const data = req.body;
  if (data.name && data.amount && data.group) {
    const item = new Expense({
      item: data.name,
      amount: data.amount,
      group: data.group,
      date: data.date
        ? moment(data.date).format("LLLL")
        : moment().format("LLLL")
    });
    const prom = item.save();
    prom.then(function() {
      console.log(
        `the amount of the expense is : ${item.amount} ,and the product is ${item.item} `
      );
    });
    res.end();
  }
});

router.put("/update/:group1/:group2", function(req, res) {
  const g1 = req.params.group1;
  const g2 = req.params.group2;
  Expense.findOneAndUpdate(
    { group: g1 },
    { $set: { group: g2 } },
    { new: true }
  ).exec(function(err, result) {
    const toSend = `Item changed : ${result.item} and the new group is ${result.group}`;
    res.send(toSend);
  });
});

module.exports = router;
