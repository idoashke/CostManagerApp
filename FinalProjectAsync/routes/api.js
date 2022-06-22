const express = require('express');
const router = express.Router();
const Cost = require('../models/costs');
const User = require('../models/users');
const Sum = require('../models/sums');
const {log} = require("debug");
const {json} = require("express");


router.post('/users/profile', function (req, res, next) {
    console.log('id is : '+req.body.id);
    User.find({ id:req.body.id }).then(function (user) {
        const id = user[0].id;
        const fName = user[0].fName;
        const lName = user[0].lName;
        const gender = user[0].gender;
        const mStatus = user[0].mStatus;
        const bDate = user[0].bDate;
        console.log(id + ' , ' + fName + ' , ' + lName + ' , ' + gender);
        res.render('userPage', { name: fName+" "+lName , userId: id});

    }).catch((data) => {
        res.render('error', {type:'user' , id: req.body.id, message: `You didn't create an account for this id yet.` });
    });
});

router.get('/users/addUser', function(req, res, next) {
    res.render('addUser');
});

router.post('/users/addUser/success', function (req, res, next) {
    User.create(req.body).then(function (user) {
        console.log(user.id);
        res.render('userAdded', { id:user.id, name:user.fName + ' ' + user.lName});

    }).catch(next);

});

router.post('/users/addCost', function (req, res, next) {
    const userId = req.body.id;
    console.log("user id for new cost is " + userId);
    res.render('addCost', { id : userId});

})

router.post('/users/addCost/success', function (req, res, next) {
    const userId = req.body.userId;
    const sum = req.body.sum;
    const date = req.body.date;
    const str = req.body.date.split("-");  // str[0], str[1], '00' --> (year, month, day)
    const year = str[0];
    const month = str[1];
    Sum.findOneAndUpdate({ userId : userId, year : year },{ $inc:{totalSum:Number(sum),[month]:Number(sum)} }
        , {upsert:true, setDefaultsOnInsert:true}).then(function (ans) {
        console.log(ans);
    }).catch(next);

    Cost.create(req.body).then(function (cost) {
        console.log(cost.userId);
        res.render('costAdded', { id:cost.userId, title:cost.title});

    }).catch(next);

});

router.post('/users/report', function (req, res, next) {
    const userId = req.body.userId;
    console.log("user id for report is " + userId);
    res.render('report', { userId : userId});

});

router.post('/users/report/costsTable', function (req, res, next) {
    const userId = req.body.userId;
    const month = req.body.month;
    const year = req.body.year;
    console.log('the month is:  ' + month);
    console.log('the year is:  ' + year);
    let startDate, endDate, chosenDate, totalSum;
    function f1() {
        return new Promise(resolve => {
            if (year == undefined) {
                chosenDate = month;
                const str = month.split("-");
                const myDate = new Date( str[0], str[1]);
                const lastDate = new Date(myDate.getFullYear(), myDate.getMonth(), 0);
                const lastDay = lastDate.getDate();
                console.log(lastDay);
                startDate = str[0] + '-' + str[1] + '-' + '01';
                endDate = str[0] + '-' + str[1] + '-' + lastDay;
                Sum.findOne({userId: userId, year: str[0]}).then(function (sum) {
                    const temp = str[1];
                    totalSum = sum[temp];
                    console.log('totalSum month is: ' + totalSum);
                    resolve();
                }).catch((data) => {
                    res.render('error', {type:'report for' , id: chosenDate, message: `You didn't add any cost to this year yet.` });
                });
            } else if (month == undefined) {
                chosenDate = year;
                startDate = year + '-' + '01' + '-' + '01'; // Date --> yyyy-mm-dd
                endDate = year + '-' + '12' + '-' + '31';
                Sum.findOne({userId: userId, year: year}).then(function (sum) {
                    totalSum = sum.totalSum;
                    console.log('totalSum year is: ' + totalSum);
                    resolve();
                }).catch((data) => {
                    res.render('error', {type:'report for ' , id: chosenDate, message: `You didn't add any cost to this year yet.` });
                });
            }
            console.log('startDate: ' + startDate, ' , endDate: ' + endDate);
            console.log('user id is :' + userId);
        });
    }

    async function f2() {
        await f1();
        Cost.find({userId: userId, date: {$gte: startDate, $lte: endDate}}).then(function (cost) {
            res.render('costsTable', {costList: cost, chosenDate: chosenDate, totalSum: totalSum});

        }).catch(next);
    }
    f2().catch(next);

})

module.exports = router;
