const should = require('should');
const request = require('request');
const chai = require('chai');
const expect = chai.expect;
const dbconnection = require('../config/dbconnection');
const app = require('../config/server');
//modulo para leitura do arquivo de propriedades
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./config/properties.conf');

const baseUrl = properties.get('test.baseUrl');
let db;

describe('Testando o módulo de checkout',function(){
	this.timeout(10000);
	
	before((done)=>{
		dbconnection.initDb((error, dbInstance)=>{
			db = dbconnection.getDb();
			done();
		});
		app.config.dbconnection.initDb((err, db)=>{
		});
	});
	
 	it('Página de checkout', (done)=>{
 		app.app.controllers.checkout.checkout(app, request, {render: (page, params)=>{
			if(params.should.have.property('errors')){
				expect(params.errors.length).to.equal(undefined);	
			}
 			done();
 		}});	
 	});

 	it('Recuperação de pedido', (done)=>{
 		try{
 			db.collection('order').find({}).toArray((error, result)=>{
 				dbconnection.close();
	 			if(result && result.length>0){
	 				const request = {
			 			params: {
			 				orderId: result[0]._id
			 			}
			 		}
			 		app.app.controllers.checkout.success(app, request, {render: (page, params)=>{
						expect(params).to.not.equal(undefined);	
						done();
			 		}});
	 			} else {
	 				done();
	 			}
	 		});
 		} catch(e){
 			expect(body.success).to.equal(undefined);
 			dbconnection.close();
 			done();
 		}
 	});

 	it('Lista de pedidos', (done)=>{
 		app.app.controllers.checkout.list(app, request, {render: (page, params)=>{
			expect(page).to.equal('checkout/list');	
			done();
 		}});	
 	});

 	it('Lista de pedidos', (done)=>{
 		app.app.controllers.checkout.savedCards(app, request, {render: (page, params)=>{
			expect(page).to.equal('checkout/cards');	
			done();
 		}});
 	});
});
