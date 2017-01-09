var settings = require('../settings'),
	mongoDb = require('mongodb'),
	Db = mongoDb.Db,
	Connection = mongoDb.Connection,
	Server = mongoDb.Server;
	module.exports = new Db(settings.db,new Server(settings.host, settings.port),{safe:true});
	
