const ObjectId = require('mongodb').ObjectID;
let db;
const collectionName = 'customer';

function CustomerDAO(app){
	db = app.config.dbconnection.getDb();
}

CustomerDAO.prototype.getByID = (customerId, callback)=>{
	db.collection(collectionName).findOne({_id : new ObjectId(customerId)}, callback);
}

CustomerDAO.prototype.get = (filters, limit, page, sortBy, callback)=>{
	db.collection(collectionName).find(filters).skip(limit*page).limit(limit).sort(sortBy).toArray(callback);
}

CustomerDAO.prototype.save = (customer, callback)=>{
	customer.updatedDate = new Date();
	let whereClause = {};
	if(customer._id!=undefined && customer._id!=''){
		customer._id=new ObjectId(customer._id);
		whereClause._id = customer._id;
		db.collection(collectionName).updateOne(whereClause, {$set: customer}, {upsert: true}, callback);	
	} else {
		delete customer._id;
		customer.creationDate = new Date();	
		db.collection(collectionName).insertOne(customer, callback);	
	}	
}



module.exports = ()=>{
	return CustomerDAO;
}