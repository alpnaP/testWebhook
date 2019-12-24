'use strict';

const functions = require('firebase-functions');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion, Payload } = require('dialogflow-fulfillment');
const { Carousel } = require('actions-on-google');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    // This is for Welcome Intent

    function welcome(agent) {
        agent.add(`Welcome to my agent!`);
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    // this is for simple response
    function SR(agent) {
        agent.add('This is the example of Simple response'); 
    }
// This is for card
    function CARD(agent) {
        agent.add(`This message shows the example of card!`);
        agent.add(new Card({
            title: `Title: CAR World`,
            imageUrl: 'https://www.google.com/search?sxsrf=ACYBGNR6ikSRwY08CTlSBEXNtnUz7pJzrA:1577091314223&q=car+images+png&tbm=isch&chips=q:car+images+png,g_1:background:4-z78kOM6CE%3D&usg=AI4_-kTjHcVcyrY4bDw5sDFeKJMojzlVHA&sa=X&ved=2ahUKEwj85b_8ssvmAhUJ4zgGHTzyA6QQgIoDKAJ6BAgLEAg&biw=1366&bih=603#imgrc=OijSdYyeF2pyqM:',
            text: `This shows the car list! 💁`,
            buttonText: 'This is a button',
            buttonUrl: 'https://www.cars.com/'
        })
        );
        agent.add(new Suggestion(`Quick Reply`));
        agent.add(new Suggestion(`Suggestion`));

    }
  
    // This is for carousel card
    function caro(agent) {
    let conv = agent.conv(); // Get Actions on Google library conv instance
     conv.ask('Hello from the Actions on Google client library!'); // Use Actions on Google library
     conv.ask(new Carousel({
        title: 'Google Assistant',
        items: {
          'WorksWithGoogleAssistantItemKey': {
            title: 'Works With the Google Assistant',
            description: 'If you see this logo, you know it will work with the Google Assistant.',
            image: {
              url: 'https://www.google.com/',
              accessibilityText: 'Works With the Google Assistant logo',
            },
          },
          'GoogleHomeItemKey': {
            title: 'Google Home',
            description: 'Google Home is a powerful speaker and voice Assistant.',
            image: {
              url: 'https://www.facebook.com/',
              accessibilityText: 'Google Home'
            },
          },
        },
    }));
     agent.add(conv); // Add Actions on Google library responses to your agent's response
    }
  // this is for Payload
  function TestPayload (agent) {
     agent.add(new Payload("ACTIONS_ON_GOOGLE", [{ 
         google: {
           expectUserResponse: true,
           richResponse: {
             items: [
               {
                 simpleResponse:{
                   displayText:"This is testing payload responses",
                   textTospeech:"Hello"
                 }
               }
             ],
             intent: "actions.intent.OPTION"
           }
         }
       }
  
      ]));
      //agent.add('This is what!');
  }  
    // // See https://github.com/dialogflow/fulfillment-actions-library-nodejs
    // // for a complete Dialogflow fulfillment library Actions on Google client library v2 integration sample

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('simple response', SR);
    intentMap.set('Basic Card', CARD);
    intentMap.set('CarouselC', caro);
    intentMap.set('Test Payload', TestPayload);
    agent.handleRequest(intentMap);
});

