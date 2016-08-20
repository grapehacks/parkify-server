var mongoose = require('mongoose');
var schedule = require('node-schedule');

var User = mongoose.model('User', require('../models/Users.js'));
var Card = mongoose.model('Card', require('./../models/Cards.js'));
var Message = mongoose.model('Messages', require('./../models/Messages.js'));
var DrawDate = mongoose.model('DrawDate', require('../models/DrawDate.js'));

var drawUsers = function(usersData, amount) {
    var userFromUserData = function (userData) {
        return userData.user;
    };

    if (usersData.length <= amount) {
        return usersData.map(userFromUserData);
    }

    var results = [];
    for(var i = 0; i < amount; i++) {
        var sumWeight = usersData.reduce(function(prev, curr) { return prev + curr.weight}, 0.0);
        var drawnValue = Math.random() * sumWeight;

        var drawnUserData = usersData.reduce(function (prev, curr, index) {
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

        var user = usersData[drawnUserData.userIndex];
        usersData.splice(drawnUserData.userIndex, 1);

        results.push(user);
    }
    return results.map(userFromUserData);
};

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
                    }).map(function (user) {
                        // TODO: Find better way to assign weight
                        return {
                            "user": user,
                            "weight": 1.0
                        };
                    });

                    users.forEach(function(user){
                       if (!user.rememberLastChoice){
                           // If user doesn't remember choice we would clear it choice
                           user.participate = 2;
                           User.update(user);
                       }
                    });

                    Card.find(
                        {
                            "removed": false,
                            "active": true
                        },
                        function (err2, cards) {
                            console.log("Cards to draw found", cards.length);
                            var drawnUsers = drawUsers(users, cards.length);

                            var usersThatHadCardAlready = drawnUsers.filter(function (user) {
                                return user.card != undefined;
                            });

                            usersThatHadCardAlready.forEach(function (user) {
                                Message.create({
                                    topic: "Wygrałeś",
                                    text: "Zachowaj swoją kartę",
                                    type: 2,
                                    read: false,
                                    user: user
                                });

                                user.unreadMsgCounter = user.unreadMsgCounter + 1;
                                User.update(user);

                                var userIndex = drawnUsers.indexOf(user);
                                drawnUsers.splice(userIndex, 1);

                                var cardIndex = cards.findIndex(function (card) {
                                   return card == user.card;
                                });
                                cards.splice(cardIndex, 1);
                            });

                            var usersThatHaveNotBeenDrawnAndHaveNotHadACard = users.filter(function (user) {
                                if (user.card != undefined) {
                                    return false;
                                }
                                return (drawnUsers.indexOf(user) == -1);
                            });

                            usersThatHaveNotBeenDrawnAndHaveNotHadACard.forEach(function (user) {
                                Message.create({
                                    topic: "Przegrałeś",
                                    text: "Tym razem się nie udało... Graj dalej a może kiedyś się uda.",
                                    type: 0,
                                    read: false,
                                    user: user
                                });

                                user.unreadMsgCounter = user.unreadMsgCounter + 1;
                                User.update(user);
                            });

                            cards.forEach(function (card) {
                                if (users.indexOf(card.user) >= 0){

                                }
                            });

                            DrawDate.remove({});
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
        if (!job){
            job = undefined;
        }
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
                if (drawDate < Date.now()){
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
