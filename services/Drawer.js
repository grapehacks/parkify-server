var mongoose = require('mongoose');
var schedule = require('node-schedule');

var User = mongoose.model('User', require('../models/Users.js'));
var Card = mongoose.model('Card', require('./../models/Cards.js'));
var Message = mongoose.model('Messages', require('./../models/Messages.js'));
var DrawDate = mongoose.model('DrawDate', require('../models/DrawDate.js'));
var History = mongoose.model('History', require('../models/History.js'));


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
        }, {userIndex: undefined, subSum: 0.0});

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
    var that = this;
    this.draw = function () {
        console.log("Draw started");
        User.find({'removed': false, 'type': 0, 'participate': 1}).populate('card')
            .exec(function (err, users) {
                    var userDrawData = users.map(function (user) {
                        // TODO: Use number of wins and attempts to assign weight
                        return {
                            'user': user,
                            'weight': 1.0
                        };
                    });

                    users.forEach(function(user){
                        if (!user.rememberLastChoice){
                           // If user doesn't remember choice we would clear it choice
                           user.participate = 2;
                        }
                        user.numberOfAttempts += 1;
                        user.save();
                    });

                    Card.find({'removed': false, 'active': true}).populate('user')
                        .exec(function (err2, cards) {
                            var drawnUsers = drawUsers(userDrawData, cards.length);
                            console.log("Cards to draw found", cards.length);
                            console.log("Drawn users", drawnUsers.length);

                            var winners = [];

                            var usersThatHadCardAlready = drawnUsers.filter(function (user) {
                                return user.card !== undefined;
                            });

                            usersThatHadCardAlready.forEach(function (user) {
                                Message.create({
                                    topic: "Wygrałeś",
                                    text: "Zachowaj swoją kartę",
                                    type: 2,
                                    read: false,
                                    user: user
                                });

                                user.numberOfWins += 1;
                                user.unreadMsgCounter = user.unreadMsgCounter + 1;
                                user.save();

                                winners.push({'user': user, 'card': user.card});

                                var userIndex = drawnUsers.indexOf(user);
                                drawnUsers.splice(userIndex, 1);

                                var cardTmp = cards.filter(function (card) {
                                   return card._id.equals(user.card._id);
                                })[0];
                                var cardIndex = cards.indexOf(cardTmp);
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
                                    text: "Tym razem się nie udało... Graj dalej, a może kiedyś się uda ]:->",
                                    type: 0,
                                    read: false,
                                    user: user
                                });

                                user.unreadMsgCounter = user.unreadMsgCounter + 1;
                                user.save();
                            });

                            cards.forEach(function (card) {
                                if (drawnUsers.length > 0) {
                                    var winner = drawnUsers.splice(0, 1)[0];
                                    console.log("Winner :", winner);
                                }

                                if (card.user){
                                    //Update loser
                                    var looser = card.user;
                                    console.log("Loser :", looser);

                                    if (winner) {
                                        Message.create({
                                            topic: "Wygrałeś",
                                            text: "Wygrałeś. Weź kartę od: " + looser.name,
                                            type: 3,
                                            read: false,
                                            user: winner
                                        });
                                        winner.unreadMsgCounter = winner.unreadMsgCounter + 1;

                                        Message.create({
                                            topic: "Przegrałeś",
                                            text: "Przegrałeś. Oddaj swoją kartę: " + winner.name,
                                            type: 1,
                                            read: false,
                                            user: looser
                                        });
                                    } else {
                                        Message.create({
                                            topic: "Przegrałeś",
                                            text: "Przegrałeś. Oddaj swoją kartę do HR",
                                            type: 1,
                                            read: false,
                                            user: looser
                                        });
                                    }

                                    looser.card = undefined;
                                    looser.unreadMsgCounter = looser.unreadMsgCounter + 1;
                                    looser.save();

                                } else if (winner) {
                                    Message.create({
                                        topic: "Wygrałeś",
                                        text: "Pobierz kartę z HR",
                                        type: 2,
                                        read: false,
                                        user: winner
                                    });

                                    winner.unreadMsgCounter = winner.unreadMsgCounter + 1;
                                }

                                if (winner) {
                                    winner.card = card;
                                    winner.numberOfWins += 1;
                                    winner.save();
                                }
                                card.user = winner;
                                card.save();

                                winners.push({'user': winner, 'card': card});
                            });

                            setTimeout(function () {
                                History.create({
                                    winners: winners,
                                    users: users
                                });

                                var date = new Date();
                                date.setDate(date.getDate() + 14);
                                that.setDrawDate(date);
                            }, 100);
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
        job = schedule.scheduleJob(drawDate, this.draw);
        if (!job){
            job = undefined;
        }
    }.bind(this);

    DrawDate.findOne({}, function (err, drawDate) {
        if (drawDate){
            scheduleDraw(drawDate.date);
        }
    });

    this.setDrawDate = function (drawDate) {
        // TODO: Validation
        var prommise = new Promise(function (resolve, reject) {
            DrawDate.remove({}, function (err) {
                if (err) {
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
