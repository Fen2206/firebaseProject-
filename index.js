const admin = require('firebase-admin');
admin.initializeApp();

//import function 
const {addMessage} = require('./api/addMessage');

//export the function for deployment 

exports.addMessage = addMessage;
