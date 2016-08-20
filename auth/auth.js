/**
 * Created by miro on 20/08/16.
 */
'use strict';

var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var compose = require('composable-middleware');

var User = mongoose.model('User', require('../models/Users.js'));

function readToken(failOnError) {
    return compose()
        // Validate jwt
        .use(function(req, res, next) {
            var token = req.body.token || req.query.token || req.headers['x-access-token'];

            console.info("Read token");
            // decode token
            if (token) {
                // verifies secret and checks exp
                jwt.verify(token, req.app.get('jwtTokenSecret'), function(err, decoded) {
                    if (err) {
                        console.error("Token verification failed");
                        if (failOnError) {
                            return res.status(401).json({message: 'Unauthorized access.' });
                        }
                        next();
                    } else {
                        // if everything is good, save to request for use in other routes
                        req.userId = decoded;
                        next();
                    }
                });

            } else {
                // if there is no token log error
                console.error("There is no token");
                if (failOnError) {
                    return res.status(403).json({message: 'No token provided.'});
                }
                next();
            }
        });
}

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function verifyAuthentication(failOnError) {
    return compose()
        .use(readToken(failOnError))
        // Attach user to request
        .use(function(req, res, next) {
            User.findById(req.userId, '-password -salt', function (err, user) {
                if (err) {
                    console.error("Error on user fin: ", err);
                    if (failOnError) {
                        return next(err);
                    }
                }
                if (!user) {
                    console.error("Cannot find user for provided token");
                    if (failOnError) {
                        return res.status(401).send('Unauthorized');
                    }
                }

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
        .use(verifyAuthentication(true))
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

module.exports.readToken = readToken;
module.exports.verifyAuthentication = verifyAuthentication;
module.exports.hasRole = hasRole;
//module.exports.signToken = signToken;