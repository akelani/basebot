//this dialog uses onFindAction and a "hasRunVersion" variable in userData
//to be sure this dialog only runs once per user
//use "delete all" command to reset user data and test
//increment currentVersion to cause this dialog to run again for all users

const MATCH = 1.0;
const NOMATCH = 0.0;
const currentVersion = 1.0;

module.exports = function (name, bota) {
    bot.dialog(`/${name}`, [
        function (session, args, next) {
            session.send("(first run for this user)");

            //store the user's message
            session.dialogData.message = session.message; 
            
            //do first run stuff
            session.beginDialog("/chooseLocale");

            session.userData.hasRunVersion = currentVersion;
        },
        function(session, bot) {
            //recover the user's message
            let message = session.dialogData.message; 

            //clear the dialog stack, and save the session
            session.clearDialogStack().save().sendBatch(err => {

                //simulate the bot receiving the message
                bot.receive(message); 
            });
        }
    ]).triggerAction({
        onFindAction: function (context, callback) {
            let hasRunVersion = context.userData.hasRunVersion || 0;
            callback(null, (hasRunVersion < currentVersion ? MATCH : NOMATCH));
        }
    })

};