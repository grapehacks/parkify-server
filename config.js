/**
 * Created by miro on 19/08/16.
 */
module.exports = {
    'secret': 'test_secret',
    //'database': 'mongodb://grapeapps:Grape2016@ds063715.mlab.com:63715/parkify',
    'database' : 'mongodb://localhost:27017/parkify',
    'userRoles': {
        'user': 0,
        'admin': 1
    },
    defaultNumberOfMessagesToReturn: 10
};