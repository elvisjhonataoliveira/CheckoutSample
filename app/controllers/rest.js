//modulo para leitura do arquivo de propriedades 
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./config/properties.conf');

//módulo do mercado pago
let mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken(properties.get('mercadopago.privatekey'));

module.exports.confirmPayment = (application, request, response)=>{
	const payment = request.body;
	response.sendStatus(200);
	mercadopago.get("/v1/payments/"+payment.data.id+"?access_token="+properties.get('mercadopago.privatekey')).then((data)=>{
		const orderModel = new application.app.models.OrderDAO(application);
		orderModel.get({paymentId: data.id}, 0, 0, {}, (error, result)=>{
			if(result){
				result.status = data.status!=undefined?data.status:result.status;
				result.statusDetail = data.status_detail!=undefined?data.status_detail:result.statusDetail;
				orderModel.save(result, (error, result)=>{
				});
			}
		});
	});
}

module.exports.getOrder = (application, request, response)=>{
	const orderId = request.params.orderId;
	response.set('Content-Type', 'application/json');
	if(orderId!=undefined){
		const orderModel = new application.app.models.OrderDAO(application);
		try{
			orderModel.getByID(orderId, (error, result)=>{
				if(result){
					response.send({success: true, order:result});
				} else {
					response.status(400).send({success: false, message: "Registro não encontrado"});
				}				
			});
		} catch(e){
			console.log(e);
			response.status(400).send({success: false, message: "Registro não encontrado"});
		}
		return;
	}
	response.status(400).send({success: false, message: "Não foi especificado o registro a ser pesquisado"});
}

module.exports.customerCards = (application, request, response)=>{
	const customerId = request.params.customerId;
	if(customerId){
		mercadopago.customers.cards.all(customerId).then((cards)=>{
			response.send({success:true, cards: cards.response});
		}).catch((error)=>{
			response.status(400).send({success:false, mpErrors:error.cause});
		});	
		return;
	}
	response.status(400).send({success:false, msg:"Cliente não informado."});
	
}

module.exports.doCheckout = (application, request, response)=>{
	const order = request.body;
	let payment_data = {};
	payment_data.payer = {};
	if(order.paymentMethod=='credit-card' && !order.savedCard){
		payment_data.token = order.token;
		payment_data.installments = parseInt(order.installments);
		payment_data.payment_method_id = order.paymentMethodId;
	} else if(order.savedCard){
		payment_data.token = order.token;
		payment_data.installments = parseInt(order.installments);
		payment_data.payment_method_id = order.paymentMethodId;
		payment_data.payer = {
		    type: "customer",
		    id: order.customerId
		}
	} else {
		payment_data.payment_method_id = order.paymentMethod;
		payment_data.payer.first_name = order.firstName;
		payment_data.payer.last_name = order.lastName;
		payment_data.payer.identification = {};
		payment_data.payer.identification.type = order.docType;
		payment_data.payer.identification.number = order.docNumber;
	}
	request.assert('email', 'Digite um e-mail válido').isEmail();
	request.assert('amount', 'Digite o valor da compra').notEmpty();
	const errors = request.validationErrors();
	if(errors && errors.length>0){
		response.status(400).send({success: false, errors:errors});
		return;
	} 
	
	payment_data.transaction_amount= parseInt(order.amount);
	payment_data.description= order.description!=undefined?order.description:'Pagamento sem produto';
	payment_data.payer.email = order.email;
	mercadopago.payment.save(payment_data).then((data)=>{
		paymentHandler(order, data, response, application, payment_data);
	}).catch((error)=>{
		response.status(400).send({success: false, mpErrors:error.cause});
	});
}

const paymentHandler = (order, data, response, application, payment_data)=>{
	order.paymentId = data.response.id;
	order.status = data.response.status;
	order.statusDetail = data.response.status_detail;
	order.statementDescriptor = data.response.statement_descriptor;
	order.externalResource = order.paymentMethod!='credit-card'?data.response.transaction_details.external_resource_url:undefined;
	order.barcode = order.paymentMethod!='credit-card'?data.response.barcode.content:undefined;
	const orderModel = new application.app.models.OrderDAO(application);
	orderModel.save(order, (error, result)=>{
		if(order.saveCreditCard && payment_data.token){
			searchCustomerId(application, {email: order.email}, (customer)=>{
				saveCard({token: order.token, customer_id: customer.id}, (responseData)=>{
					responseData.id = order._id;
					response.status(responseData.success?200:400).send(responseData);
				});
			});
			return;
		}
		response.status(200).send({success: true, id: order._id});
	});
}

const saveCard = (cardData, callback)=>{
	mercadopago.card.create(cardData).then((card)=>{
		callback({success: true});
	}).catch((error)=> {
		callback({success: false, scMessage:"Erro ao salvar cartão"});
	});
}

const searchCustomerId = (application, customer, callback)=>{
	mercadopago.customers.search({qs: {email: customer.email}}).then((data)=>{
		//se achou é só salvar
		if(data && data.response && data.response.results && data.response.results.length>0){
			customer.id = data.response.results[0].id;
			saveCustomerId(application, customer, ()=>{
				callback(customer);
			});
		} else {
			//caso contrário é necessário criar
			createCustomerId(customer, (customerId)=>{
				customer.id=customerId;
				saveCustomerId(application, customer, ()=>{
					callback(customer);
				});
			});
		}
	});
}

const createCustomerId = (customer, callback)=>{
	mercadopago.customers.create(customer).then((customerResult)=>{
		callback(customerResult.response.id);
	});
}

const saveCustomerId = (application, customer, callback)=>{
	const customerModel = new application.app.models.CustomerDAO(application);
	customerModel.get({id: customer.id}, 0, 0, {}, (error, result)=>{
		if(!result || result.length<=0){
			customerModel.save(customer, (error, result)=>{
				callback({success:true});
			});
			return;
		}
		callback({success:true});
	});	
}

module.exports.tSaveCard = saveCard;
module.exports.tSearchCustomerId = searchCustomerId;
module.exports.tCreateCustomerId = createCustomerId;
module.exports.tSaveCustomerId = saveCustomerId;
module.exports.tPaymentHandler = paymentHandler;
