module.exports = (app)=>{

	app.get('/login', (request, response)=>{
		app.app.controllers.user.login(app, request, response);
	});

	app.post('/login', (request, response)=>{
		app.app.controllers.user.doLogin(app, request, response);
	});
	
	app.get('/logout', (request, response)=>{
		app.app.controllers.user.logout(app, request, response);
	});

	app.get('/user-new', (request, response)=>{
		app.app.controllers.user.create(app, request, response);
	});

	app.post('/user', (request, response)=>{
		app.app.controllers.user.save(app, request, response);
	});

	app.get('/user', (request, response)=>{
		app.app.controllers.user.list(app, request, response);
	});

	app.get('/user/:userId', (request, response)=>{
		app.app.controllers.user.get(app, request, response);
	});
}