//Base de datos
var MongoClient = require('mongodb').MongoClient;
var urlMongo = 'mongodb://127.0.0.1:27017/data';
var db;

//Conectarse al servidor 
exports.connectDB = function(){
    return new Promise((resolve, reject) =>{
        if(db) return resolve(db);
        MongoClient.connect(urlMongo, (err, _db) => {
            if (err) return reject(err);
            db = _db;
            resolve(_db);
        });
    });
};

exports.insert = function(json){
    return new Promise((resolve, reject) =>{ 
        exports.connectDB().then(db =>{
            db.collection('games').insertOne({
                player: json.player, 
                victory: json.victory, 
                table: json.table,
                defeat: json.defeat
            }, (err, result) =>{
                if(err) return reject(err);
                return resolve(result.insertedCount);
            });
        });
    });
};

exports.getStatistics = function(player){
    return new Promise((resolve, reject) =>{ 
        exports.connectDB().then(db =>{
            db.collection('games').aggregate( 
            {   $match: {
                    player: player
                }
            },
            {
                $group: {
                     _id: null, played: { $sum: 1 }, victories: { $sum: '$victory' }, tables: { $sum: '$table'}, defeats: { $sum: '$defeat'} 
                }
            }, (err, result) =>{
                if(err) return reject(err);
                return resolve(result);
            });
        });
    });    
};