const ObjectId = require('mongodb').ObjectID;
let db;
const collectionName = 'user';

function UserDAO(app){
	db = app.config.dbconnection.getDb();
}

UserDAO.prototype.getByID = (userId, callback)=>{
	db.collection(collectionName).findOne({_id : new ObjectId(userId)}, callback);
}

UserDAO.prototype.get = (filters, limit, page, sortBy, callback)=>{
	db.collection(collectionName).find(filters).skip(limit*page).limit(limit).sort(sortBy).toArray(callback);
}

UserDAO.prototype.save = (user, callback)=>{
	user.updatedDate = new Date();
	let whereClause = {};
	if(user._id!=undefined && user._id!=''){
		user._id=new ObjectId(user._id);
		whereClause._id = user._id;
		db.collection(collectionName).updateOne(whereClause, {$set: user}, {upsert: true}, callback);	
	} else {
		delete user._id;
		user.creationDate = new Date();	
		db.collection(collectionName).insertOne(user, callback);	
	}
}

module.exports = ()=>{
	return UserDAO;
}