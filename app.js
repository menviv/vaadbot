var restify = require('restify');
var builder = require('botbuilder');
var request = require('request');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
//var bot = new builder.UniversalBot(connector);

var bot = new builder.UniversalBot(connector, {
    localizerSettings: { 
        defaultLocale: "he" 
    }
});

server.post('/api/messages', connector.listen());


//=========================================================
// Bots Dialogs
//=========================================================
/*
bot.dialog('/', function (session) {
    session.send("Hello World");
});

/*
bot.dialog('/', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

bot.dialog('/', [
    function (session) {
        session.beginDialog('/askName');
    },
    function (session, results) {
        session.send('Hello %s!', results.response);
        session.beginDialog('/askProffesion');
    }
]);



bot.dialog('/askName', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.endDialogWithResult(results);
    }
]);

bot.dialog('/askProffesion', [
    function (session) {
        builder.Prompts.text(session, 'And...what do you do for a living?');
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.company = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);

*/


var visitor = {
    "room0": { 
        description: "אני מניח שפנית אלינו כי משהו מטריד אותך...?:",
        commands: { "נראה לי שעשיתי טעות": "room1", "כן אבל פאדיחה וזה": "room2", "ממש רוצה לדבר עם מישהו": "room3" }
    },
    "room1": {
        description: "רגע, אני רוצה לנחש, עשיתם סקס מגניב אבל הוא היה מגניב מידי? :)",
        commands: { "כן": "room11", "כן ויותר מפעם אחת": "room111", "אין לי מספיק ידע אז לא בטוח/ה": "room1111", "לא": "room4" }
    },
    "room11": {
        description: "אז החשש הוא מהידבקות?",
        commands: { "כן": "room112", "אין לי מספיק ידע אז לא בטוח/ה": "room113", "לא": "room4" }
    }, 
    "room111": {
        description: "אז אני מניח שאת/ה בטוח/ה שאת/ה נשא למרות שטרם נבדקת... נכון?",
        commands: { "כן": "room111-1", " לא בטוח/ה": "room111-2", "לא": "room111-3" }
    },
    "room111-1": {
        description: "מרשה לי להרגיע אותך קצת?",
        commands: { "כן": "room111-1-1", " לא בטוח/ה": "room111-2-2", "לא": "room111-3-3" }
    },
    "room111-2": {
        description: "הצדק איתך וכנראה שהכל בסדר, אבל אולי תגיע למרכז הבדיקות האנונימי שלנו?",
        commands: { "הפחד.. הפחד..": "room111-2-1", "אין מצב בעולם": "room111-2-2", "מה זה אומר אנונימי?": "room111-2-3" }
    },
    "room111-3": {
        description: "מעולה! כי אתה כנראה בסדר. כולנו בסדר. אבל היית רוצה לוודא זאת ואולי לקבל קצת ידע שיקטין את מידת החשש שלך?",
        commands: { "כן": "room111-3-1", " לא בטוח/ה": "room111-3-2", "לא": "room111-3-3" }
    },            
    "room1111": {
        description: "מה דעתך שנדבר בטלפון? באנונימיות, כך אוכל לשאול עוד שאלות ולהרגיע אותך...",
        commands: { "יאללה": "room1111-1", "איזה פחד...": "room1111-2", " ממש לא!": "room1111-3", "אולי בשלב אחר": "room1111-4" }
    },    
    "room13": {
        description: "",
        commands: { "כן": "room11", "כן ויותר מפעם אחת": "room12", "אין לי מספיק ידע אז לא בטוח/ה": "room13", "לא": "room4" }
    },             
    "room2": {
        description: "ממי הפאדיחה הכי גדולה?",
        commands: { "המשפחה": "room21", "החברים": "room21", "הפרטנר לחיים": "room21", "כולם": "room21" }
    },
     "room21": {
        description: "אני לא אמור לכתוב את זה, אבל גם אני הייתי שם... אצלי זאת היתה המשפחה?",
        commands: { "ממש ממש": "room21-1", "הלוואי שרק הם": "room21-1", "הם ממש לא מעניינים": "room21-1" }
    },     
     "room21-1": {
        description: "אז ממה הפאדיחה? מה הכי מפדח במה שקורה אצלך עכשיו?",
        commands: { "כן ממש": "room21-1-1", "אני כבר נשא/ית וסקרנ/ית לגבי אחרים": "room21-1-2", "פחות :)": "room21-1-3" }
    },
    "room3": {
        description: "אני אשמח לשוחח איתך, איך תרצה לקיים את זה?",
        commands: { "כאן": "room31", "טלפון": "room32", "לבוא למרכז האנונימי": "room33" }
    }, 
    "room31": {
        description: "אז יאללה, בוא נתחיל מהתחלה?",
        commands: { "סבבה": "room0", "אם חייבים...": "room0", "פחות, ביוש": "room5" }
    },            
    "room4": {
        description: "חבר טוב עשה טעות?",
        commands: { "כן": "room41", "האמת שגם אני פעם, אבל מזמן": "room42", "לא": "room33", "נבוכים לומר": "room44" }
    }    
}



bot.dialog('/', [
    function (session) {
        session.send("זה הזמן להירגע... הכל בסדר :)");    
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function (session, results) {
        session.userData.profile = results.response;
        session.send('היוש %(name)s', session.userData.profile);
        //session.beginDialog('/location');
        session.beginDialog("/location", { location: "room0" });
    }
]);


/*
bot.dialog('/', [
    function (session) {
        //session.sendTyping();
        session.send("זה הזמן להירגע... הכל בסדר :)");        
        session.beginDialog('/ensureProfile', session.userData.profile);
    },
    function (session, results) {
        session.userData.profile = results.profile;
        //session.sendTyping();
        //session.send('היוש  %s!', session.userData.profile.name);
        //session.send('Hello %(name)!', session.userData.profile);
        session.send('Hello %(name)s! I love %(company)s!', session.userData.profile);
        //session.beginDialog('/location');
    }
]);

*/

bot.dialog('/ensureProfile', [
    function (session, args, next) {
        session.dialogData.profile = args || {};
        if (!session.dialogData.profile.name) {
            //builder.Prompts.text(session, "What's your name?");
            builder.Prompts.text(session, 'קודם כל שלום. לי קוראים בוטוש ולך?');
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!session.dialogData.profile.age) {
            //builder.Prompts.text(session, "What company do you work for?");
            builder.Prompts.text(session, "יא... שם מגניב! והגיל? אם יורשה לי...");
        } else {
            next();
        }
    },
    function (session, results) {
        if (results.response) {
            session.dialogData.profile.age = results.response;
        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);




bot.dialog('/location', [
    function (session, args) {
        var location = visitor[args.location];
        session.dialogData.commands = location.commands;
        builder.Prompts.choice(session, location.description, location.commands);
    },
    function (session, results) {
        session.sendTyping();
        var destination = session.dialogData.commands[results.response.entity];
        if (destination != 'room5') {

            session.replaceDialog("/location", { location: destination });

        } else {
            session.sendTyping();
            session.endDialog("תודה על ההקשבה, זה לא מובן מאליו");
            session.endConversation();

        }
        
    }
]);








/*

bot.dialog('/ensureProfilessssss', [
    function (session, args, next) {
        //session.sendTyping();
        session.dialogData.profile = args || {};
        if (!args.profile.name) {
            //builder.Prompts.text(session, "Hi! What is your name?");
            builder.Prompts.text(session, 'קודם כל שלום. לי קוראים בוטוש ולך?');
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.name = results.response;
        }
        if (!args.profile.age) {
            builder.Prompts.text(session, "יא... שם מגניב! והגיל? אם יורשה לי...");
        } else {
            next();
        }
    },
    function (session, results, next) {
        if (results.response) {
            session.dialogData.profile.age = results.response;
        }
        if (!args.profile.sex) {
        builder.Prompts.choice(session, "מכיוון שהשיחה אנונימית, אשמח לדעת אם את/ה:", "גבר|אישה|אחר");
        } else {
            next();
        }
    },

    function (session, results) {
        if (results.response) {
            session.dialogData.profile.sex = results.response;
        }
        session.endDialogWithResults({ repsonse: session.dialogData.profile })
    }
]);

*/







/*
bot.dialog('/cards', [
    function (session) {
        var msg = new builder.Message(session)
            .textFormat(builder.TextFormat.xml)
            .attachments([
                new builder.HeroCard(session)
                    .title("Hero Card")
                    .subtitle("Space Needle")
                    .text("The <b>Space Needle</b> is an observation tower in Seattle, Washington, a landmark of the Pacific Northwest, and an icon of Seattle.")
                    .images([
                        builder.CardImage.create(session, "http://prn.fm/wp-content/uploads/2015/03/bad-social-media-automation-bot.png")
                    ])
                    .tap(builder.CardAction.openUrl(session, "http://www.google.com"))
            ]);
        session.endDialog(msg);
    }
]);

bot.dialog('/picture', [
    function (session) {
        session.send("You can easily send pictures to a user...");
        var msg = new builder.Message(session)
            .attachments([{
                contentType: "image/jpeg",
                contentUrl: "http://www.theoldrobots.com/images62/Bender-18.JPG"
            }]);
        //session.send(msg);
        session.endDialog(msg);
    }
]);
*/


bot.dialog('/command1', [
    function (session) {
        session.send("You can easily send pictures to a user...");
        session.endConversation();
    }
]);


