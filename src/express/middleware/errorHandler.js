const winston = require('winston');

module.exports = function(err, req, res, next){
    winston.error(err.message, err);
    res.status(500).send({ status:false, message:'Something wen wrong.' })
}