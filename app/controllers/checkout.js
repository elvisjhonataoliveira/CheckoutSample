//modulo para leitura do arquivo de propriedades
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./config/properties.conf');

//módulo do mercado pago
let mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken(properties.get('mercadopago.privatekey'));

//Exibe a página inicial
module.exports.checkout = (application, request, response)=>{
	mercadopago.get("/v1/payment_methods").then((data)=>{

		response.render('checkout/checkout', {errors: {}, order:{}, mpPublickKey: properties.get('mercadopago.publickey'), paymentMethods: data.response});
	});
	
}



//exibe a tela de sucesso para o pagamento
module.exports.success = (application, request, response)=>{
	const orderId = request.params.orderId;
	if(orderId!=undefined){
		const orderModel = new application.app.models.OrderDAO(application);
		orderModel.getByID(orderId, (error, result)=>{
			response.render('checkout/success',{order:result});
		});
		return;
	}
	response.redirect('/checkout');
}

//exibe a lista de pagamento registrados na base de dados
module.exports.list = (application, request, response)=>{
	const orderModel = new application.app.models.OrderDAO(application);
	orderModel.get({}, 0, 0, {creationDate: 1}, (error, result)=>{
		response.render('checkout/list',{result:result});
	});
	return;
}


//exibe a lista de pagamento registrados na base de dados
module.exports.savedCards = (application, request, response)=>{
	const customerModel = new application.app.models.CustomerDAO(application);
	customerModel.get({}, 0, 0, {}, (error, result)=>{
		response.render('checkout/cards', {errors: {}, cards:result, mpPublickKey: properties.get('mercadopago.publickey')});
	});
	return;
}