const should = require('should');
const request = require('request');
const chai = require('chai');
const expect = chai.expect;
//modulo para leitura do arquivo de propriedades
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./config/properties.conf');

const baseUrl = properties.get('test.baseUrl');

describe('Testando o módulo de cliente',function(){
	this.timeout(15000);
	it('Recuperar cartões dos clientes',function(done){
	  	request.get({
	  		url: baseUrl+'/rest/customer/'+properties.get('test.customer.id')+'/cards',
	  		header: {'token': properties.get('test.user.token')},
	  		json:true
	  	}, (error, response, body)=>{
	  		expect(response.statusCode).to.equal(200);
	  		if(body.should.have.property('success')){
	  			expect(body.success).to.equal(true);
	  		}
	  		done();
	  	});
	});

});
