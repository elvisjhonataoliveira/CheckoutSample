module.exports = (app)=>{
	
	app.get('/', (request, response)=>{
		app.app.controllers.checkout.checkout(app, request, response);
	});

	app.get('/checkout-new', (request, response)=>{
		app.app.controllers.checkout.checkout(app, request, response);
	});

	app.post('/checkout', (request, response)=>{
		app.app.controllers.checkout.doCheckout(app, request, response);
	});

	app.get('/checkout/saved', (request, response)=>{
		app.app.controllers.checkout.savedCards(app, request, response);
	});

	app.get('/checkout/:orderId', (request, response)=>{
		app.app.controllers.checkout.success(app, request, response);
	});

	app.get('/checkout', (request, response)=>{
		app.app.controllers.checkout.list(app, request, response);
	});

}