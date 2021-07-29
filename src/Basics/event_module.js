const EventEmitter = require('events');
/// here EventEmitter is a class

const emitter = new EventEmitter();


//// it should be create first register and then it should be emit ,,,, ordering is important
/// register a listener
emitter.on('messageLogged',(arg)=> {
    console.log("Listener logged", arg);
})

//// raise an event ,,, can pass arguments 
emitter.emit('messageLogged', { id: 1 , url: 'url'});
/// emit = making a noise ,produce - signaling 


// in server to end the response res.end()