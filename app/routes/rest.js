module.exports = (app)=>{

	app.post('/rest/checkout-webhook', (request, response)=>{
		app.app.controllers.rest.confirmPayment(app, request, response);
	});
	
	app.get('/rest/checkout/:orderId', (request, response)=>{
		app.app.controllers.rest.getOrder(app, request, response);
	});

	app.post('/rest/checkout', (request, response)=>{
		app.app.controllers.rest.doCheckout(app, request, response);
	});


	app.get('/rest/customer/:customerId/cards', (request, response)=>{
		app.app.controllers.rest.customerCards(app, request, response);
	});

	
}