/// id = 604478883aa04a2b917717f8


/// timestamp is included in the id ,, you can sort it on based upon id
//// 12 bytes for id


/// 4 bytes for timestamp
/// 3 bytes machine identifier
//// 2 bytes process identifier
//// 3 bytes counter


///1 bytes = 8 bits
// 2^ 8 = 256
// 2 ^ 24 = 16M


// driver -> Mongodb

/// highly scalabale


const mongoose = require('mongoose');

const id = new mongoose.Types.ObjectId();

console.log(id.getTimestamp())

const isValid = mongoose.Types.ObjectId.isValid('1234')

console.log("isValid ", isValid)