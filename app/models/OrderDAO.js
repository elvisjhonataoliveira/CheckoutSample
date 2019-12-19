const ObjectId = require('mongodb').ObjectID;
let db;
const collectionName = 'order';

function OrderDAO(app){
	db = app.config.dbconnection.getDb();
}

OrderDAO.prototype.getByID = (orderId, callback)=>{
	db.collection(collectionName).findOne({_id : new ObjectId(orderId)}, callback);
}

OrderDAO.prototype.get = (filters, limit, page, sortBy, callback)=>{
	db.collection(collectionName).find(filters).skip(limit*page).limit(limit).sort(sortBy).toArray(callback);
}

OrderDAO.prototype.save = (order, callback)=>{
	order.updatedDate = new Date();
	let whereClause = {};
	if(order._id!=undefined && order._id!=''){
		order._id=new ObjectId(order._id);
		whereClause._id = order._id;
		db.collection(collectionName).updateOne(whereClause, {$set: order}, {upsert: true}, callback);	
	} else {
		delete order._id;
		order.creationDate = new Date();	
		db.collection(collectionName).insertOne(order, callback);	
	}	
}



module.exports = ()=>{
	return OrderDAO;
}