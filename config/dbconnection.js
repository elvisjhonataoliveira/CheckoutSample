/*
	Responsável por fazer a inicialização do banco de dados e por retornar a conexão com o banco.
*/
//modulo para leitura do arquivo de propriedades
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./config/properties.conf');

const client = require('mongodb').MongoClient;
let _db;
const url = properties.get('db.endpoint');
const dbName = "checkoutsample";

const initDb = (callback)=>{
    if (_db) {
        return callback(null, _db);
    }
	client.connect(url, {}, connected);
	function connected(err, db) {
        if (err) {
            return callback(err);
        }
        _db = db;
        return callback(null, _db);
    }
}

const getDb = ()=>{
	if(_db==undefined){
		console.log("Banco de dados não inicializado, chame o initDb antes.");
	}
    return _db.db(dbName);
}

const close = ()=>{
    _db.close();
}

module.exports = {
    getDb,
    initDb,
    close
};