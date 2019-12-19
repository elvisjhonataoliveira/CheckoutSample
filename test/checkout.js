const should = require('should');
const request = require('request');
const chai = require('chai');
const expect = chai.expect;
//modulo para leitura do arquivo de propriedades
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./config/properties.conf');

const baseUrl = properties.get('test.baseUrl');
describe('Testando o módulo de checkout',function(){
	this.timeout(15000);
	it('Pagamento com boleto',function(done){
	  	request.post({
	  		url: baseUrl+'/rest/checkout',
	  		header: {'token': properties.get('test.user.token')},
	  		json:true,
	  		body:{
	  			amount: 100,
	  			paymentMethod: 'bolbradesco',
	  			firstName: properties.get('test.customer.firstName'),
	  			lastName: properties.get('test.customer.lastName'),
	  			docType: properties.get('test.customer.docType'),
	  			docNumber: ''+properties.get('test.customer.document'),
	  			email: properties.get('test.customer.email')
	  		}
	  	}, (error, response, body)=>{
	  		expect(response.statusCode).to.equal(200);
	  		if(body.should.have.property('success')){
	  			expect(body.success).to.equal(true);
	  		}
	  		done();
	  	});
	});

	it('Pagamento com cartão',function(done){
  		request.post({
	  		url: baseUrl+'/rest/checkout',
	  		header: {'token': properties.get('test.user.token')},
	  		json:true,
	  		body:{
	  			amount: 100,
	  			installments: properties.get('test.card.installment'),
	  			email: properties.get('test.customer.email'),
	  			paymentMethodId: properties.get('test.card.paymentMethod'),
	  			token: '123123123'
	  		}
  		}, (error, response, body)=>{

	  		expect(response.statusCode).to.equal(400);
	  		if(body.should.have.property('success')){
	  			expect(body.success).to.equal(false);
	  		}
	  		// if(body.should.have.property('mpErrors')){
	  		// 	expect(body.mpErrors[0].code).to.equal(2006);
	  		// }
	  		done();
  		});
 	});

});