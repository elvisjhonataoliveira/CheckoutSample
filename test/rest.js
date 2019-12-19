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

describe('Testando o módulo REST',function(){
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



	it('Método de confirmação de pagamento', (done)=>{
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
		app.app.controllers.rest.confirmPayment(app, request, {sendStatus: (status)=>{
			expect(status).to.equal(200);	
			done();
 		}});
	});

	it('Método de recuperação de pedido', (done)=>{
		const request = {
			params: {
				orderId:''+order._id
 			},
 			assert: ()=>{return request},
 			notEmpty: ()=>{return request},
 			isLength: ()=>{return request},
 			validationErrors: ()=>{return undefined},
 			session: {}
 		};
 		const response = {
 			send: (response)=>{
 				expect(response.success).to.equal(true);	
				done();
	 		}, 
	 		status: ()=>{
	 			return response;
	 		}, 
	 		set: ()=>{}
 		}
		app.app.controllers.rest.getOrder(app, request, response);
	});


	it('Método de recuperação de clientes', (done)=>{
		const request = {
			params: {
				customerId:''+customer.id
 			},
 			assert: ()=>{return request},
 			notEmpty: ()=>{return request},
 			isLength: ()=>{return request},
 			validationErrors: ()=>{return undefined},
 			session: {}
 		};
 		const response = {
 			send: (response)=>{
 				expect(response.success).to.equal(true);	
				done();
	 		}, 
	 		status: ()=>{
	 			return response;
	 		}, 
	 		set: ()=>{}
 		}
		app.app.controllers.rest.customerCards(app, request, response);
	});

	it('Método de inclusão de pedido - boleto', (done)=>{
		const request = {
			body:{
	  			amount: 100,
	  			paymentMethod: 'bolbradesco',
	  			firstName: properties.get('test.customer.firstName'),
	  			lastName: properties.get('test.customer.lastName'),
	  			docType: properties.get('test.customer.docType'),
	  			docNumber: ''+properties.get('test.customer.document'),
	  			email: properties.get('test.customer.email')
	  		},
 			assert: ()=>{return request},
 			notEmpty: ()=>{return request},
 			isLength: ()=>{return request},
 			isEmail: ()=>{return request},
 			validationErrors: ()=>{return undefined},
 			session: {}
 		};
 		const response = {
 			send: (response)=>{
 				expect(response.success).to.equal(true);	
				done();
	 		}, 
	 		status: ()=>{
	 			return response;
	 		}, 
	 		set: ()=>{}
 		}
		app.app.controllers.rest.doCheckout(app, request, response);
	});


	it('Método de inclusão de pedido - cartão', (done)=>{
		const request = {
			body:{
	  			amount: 100,
	  			installments: properties.get('test.card.installment'),
	  			email: properties.get('test.customer.email'),
	  			paymentMethodId: properties.get('test.card.paymentMethod'),
	  			token: '123123123'
	  		},
 			assert: ()=>{return request},
 			notEmpty: ()=>{return request},
 			isLength: ()=>{return request},
 			isEmail: ()=>{return request},
 			validationErrors: ()=>{return undefined},
 			session: {}
 		};
 		const response = {
 			send: (response)=>{
 				expect(response.success).to.equal(false);	
				done();
	 		}, 
	 		status: ()=>{
	 			return response;
	 		}, 
	 		set: ()=>{}
 		}
		app.app.controllers.rest.doCheckout(app, request, response);
	});

	it('Método de pesquisa de cliente', (done)=>{
		app.app.controllers.rest.tSearchCustomerId(app, customer, (customerResponse)=>{
			expect(customerResponse.id).to.be.an('string');
			done();
		});
	})

	it('Método de salvamento de cartão', (done)=>{
		app.app.controllers.rest.tSaveCard({customer_id:customer.id}, (response)=>{
			expect(response.success).to.equal(false); 
			done();
		});
	})

	it('Método de salvamento de cliente', (done)=>{
		const response = {
 			send: (response)=>{
 				expect(response.success).to.equal(true);	
				done();
	 		}, 
	 		status: ()=>{
	 			return response;
	 		}, 
	 		set: ()=>{}
 		}
 		let data = {
 			response: {
 				id: order.paymentId,
 				status: order.status,
 				status_detail: order.statusDetail,
 				statement_descriptor: order.statementDescriptor,
 				transaction_details : {
 					external_resource_url: order.externalResource
 				},
 				barcode: {
 					content: order.barcode
 				}
 			}
 		};
 		app.app.controllers.rest.tPaymentHandler(order, data, response, app, {});
	})

});
