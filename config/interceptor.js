/*
	Realiza a interceptação de todas as requisições HTTP
*/
let application;

const interceptor = (request, response, next)=>{
	response.locals.user = request.session.user;
	if(request.session.user || request.url=='/login'){
		next();
		return;
	}

	if(request.url.startsWith('/rest')){
		const token = request.header('token');
		const userModel = new application.app.models.UserDAO(application);
		userModel.get({token: token}, 0, 0, {}, (error, result)=>{
			if(result && result.length>0){
				request.session.user = result[0];
				next();
			} else {
				response.sendStatus(403);	
			}
		});
		return;
	}

	response.redirect('/login');	
}

module.exports = (app)=>{
	application = app;
	return interceptor;
}