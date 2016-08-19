/**
 * Created by miro on 20/08/16.
 */
'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');

var User = mongoose.model('User', require('../models/Users.js'));

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
    return compose()
        // Validate jwt
        .use(function(req, res, next) {
            var token = req.body.token || req.query.token || req.headers['x-access-token'];

            // decode token
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, req.app.get('jwtTokenSecret'), function(err, decoded) {
                    if (err) {
                        return res.status(401).json({message: 'Unauthorized access.' });
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.userId = decoded;
                        next();
                    }
                });

            } else {
                // if there is no token
                // return an error
                return res.status(403).json({message: 'No token provided.'});
            }
        })
        // Attach user to request
        .use(function(req, res, next) {
            User.findById(req.userId, function (err, user) {
                if (err) return next(err);
                if (!user) return res.status(401).send('Unauthorized');

                req.user = user;
                next();
            });
        });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
    if (!roleRequired) throw new Error('Required role needs to be set');

    return compose()
        .use(isAuthenticated())
        .use(function meetsRequirements(req, res, next) {
            if (req.app.get('userRoles')[roleRequired] <= req.user.type) {
                next();
            }
            else {
                res.status(403).send('Forbidden');
            }
        });
}

/**
 * Returns a jwt token signed by the app secret
 *
function signToken(id) {
    return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*5 });
}*/

module.exports.isAuthenticated = isAuthenticated;
module.exports.hasRole = hasRole;
//module.exports.signToken = signToken;