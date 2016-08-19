var User = require('./../models/Users');
var Card = require('./../models/Cards');
var Draw = require('./../models/Draws');

var draw = function(users, cards) {
    var drawNext = function drawNext(users, cards, results) {
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

        console.info(drawnUserData);

        if (drawnUserData.userIndex === undefined) {
            throw new Error("Unable to draw a user");
        }

        var user = users[drawnUserData.userIndex];
        users.splice(drawnUserData.userIndex);

        // TODO: Check if user had a card and match'em.
        var cardIndex = 0;
        var card = cards[cardIndex];
        cards.splice(cardIndex);

        results.add({
            "winner" : user,
            "card" : card
        })
    };

    return drawNext(users, cards, []);
}

var Drawer = function (){
    this.draw = function () {
        // TODO: load data from DB
        var cards = [{
            "name": "Card1",
            "type": "Parking 1"
        }, {
            "name": "Card2",
            "type": "Parking 2"
        }];

        var users = [{
            "name": "Eric Bennett",
            "email": "ebennett5@reverbnation.com"
        },{
            "name": "Angela Collins",
            "email": "acollins4@hc360.com"
        },{
            "name": "Angela Fox",
            "email": "afox3@list-manage.com"
        }];
        // End TODO: load data from DB

        // TODO: Find better way to assign weight
        users.forEach(function (item) {

            item.weight = 1.0;
        });
        // End TODO: Find better way to assign weight

        var drawResult = draw(users, cards);

        console.log(drawResult);
    }
};

module.exports = Drawer;
