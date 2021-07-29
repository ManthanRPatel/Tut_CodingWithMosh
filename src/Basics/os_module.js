const os = require('os');

let totalMemory = os.totalmem()
let freeMemory = os.freemem()

console.log("total Memory : ", totalMemory , ",, freeMemory ",freeMemory )