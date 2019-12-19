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

describe('Testando o módulo Customer',function(){
	this.timeout(15000);

	let order;
	let customer;
	before((done)=>{
		dbconnection.initDb((error, dbInstance)=>{
			db = dbconnection.getDb();
			db.collection('order').find({}).toArray((error, result)=>{
				if(result && result.length>0){
					order = result[0];
				} else {
					order = {
						_id: 'asdf123123asdfasdf',
						paymentId: 12312123
					}
				}
				db.collection('customer').find({}).toArray((error, result)=>{
					if(result && result.length>0){
						customer = result[0];
					} else {
						customer = {
							id: 'asdf123123asdfasdf',
							email: 'teste.teste@teste.com.br'
						}
					}
					done();
				});
			});
		});
		app.config.dbconnection.initDb((err, db)=>{
		});		
	});

	it('Método de atualização de cliente', (done)=>{
		const request = {
			body: {
				data:{
					id: order.paymentId
				}
 			},
 			assert: ()=>{return request},
 			notEmpty: ()=>{return request},
 			isLength: ()=>{return request},
 			validationErrors: ()=>{return undefined},
 			session: {}
 		};
		new app.app.models.CustomerDAO(app).save(customer, (error, result)=>{
			expect(result.result.ok).to.equal(1);	
			done();		
		});
	});

});
