var mongoose = require('mongoose');
var schedule = require('node-schedule');

var User = mongoose.model('User', require('../models/Users.js'));
var Card = mongoose.model('Card', require('./../models/Cards.js'));
var DrawDate = mongoose.model('DrawDate', require('../models/DrawDate.js'));

var draw = function(users, cards) {
    var drawNext = function drawNext(users, cards, results) {
        console.log("users ", users.length, " cards ", cards.length, " results ", results.length);

        if (cards.length === 0 || users.length == 0) {
            return results;
        }
        var sumWeight = users.reduce(function(prev, curr) { return prev + curr.weight}, 0.0);
        var drawnValue = Math.random() * sumWeight;

        var drawnUserData = users.reduce(function (prev, curr, index) {
            var userIndex = prev.userIndex;
            var subSum = prev.subSum;

            subSum = subSum + curr.weight;

            if (drawnValue > prev.subSum && drawnValue <= subSum) {
                userIndex = index;
            }

            return {
                userIndex: userIndex,
                subSum: subSum
            }
        }, { userIndex: undefined, subSum:0.0 });

        if (drawnUserData.userIndex === undefined) {
            throw new Error("Unable to draw a user");
        }

        var user = users[drawnUserData.userIndex];
        users.splice(drawnUserData.userIndex, 1);

        // TODO: Check if user had a card and match'em.
        var cardIndex = 0;
        var card = cards[cardIndex];
        cards.splice(cardIndex, 1);

        results.push({
            "winner" : user,
            "card" : card
        });
        return drawNext(users, cards, results);
    };

    return drawNext(users, cards, []);
}

var Drawer = function (){
    var job = undefined;

    var draw = function () {
        console.log("Draw started");
        User
            .find(
                {"removed": false},
                function (err, items) {
                    var users = items.filter(function (item) {
                        return item.participate !== 0;
                    });
                    console.log("Users to draw found", users.length);
                    // TODO: Find better way to assign weight
                    users.forEach(function (item) {
                        item.weight = 1.0;
                    });

                    Card.find(
                        {
                            "removed": false,
                            "active": true
                        },
                        function (err2, cards) {
                            console.log("Cards to draw found", cards.length);
                            var drawResult = draw(users, cards);
                            DrawDate.remove({});

                            // TODO: messages/users/cards update
                        }
                    );
                });
    };

    var scheduleDraw = function (drawDate) {
        console.log("Schedule with date", drawDate);
        if (job !== undefined){
            console.log("Previous schedule cancel");
            job.cancel();
        }
        job = schedule.scheduleJob(drawDate, draw);
    };

    DrawDate.findOne({}, function (err, drawDate) {
        if (drawDate){
            scheduleDraw(drawDate.date);
        }
    });

    this.setDrawDate = function(drawDate){
        // TODO: Validation
        var prommise = new Promise(function (resolve, reject) {
            DrawDate.remove({}, function (err) {
                if (err){
                    reject();
                    return;
                }
                DrawDate.create({
                    date: drawDate
                }, function (err) {
                    if (err) {
                        reject();
                        return;
                    }

                    scheduleDraw(drawDate);
                    resolve();
                });
            });
        });
        return prommise;
    };
};

module.exports = new Drawer();
