//modulo para leitura do arquivo de propriedades
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./config/properties.conf');

module.exports.login = (application, request, response)=>{
	response.render('login', {user:{}, errors:{}});
}

module.exports.doLogin = (application, request, response)=>{
	const user = request.body;
	request.assert('username', 'Especifique um usuário').notEmpty();
	request.assert('password', 'A senha precisa ter pelo menos 4 dígitos').isLength({min: 4});
	const errors = request.validationErrors();
	if(errors && errors.length>0){
		response.render('login', {user:user, errors:errors});
		return;
	}
	const userModel = new application.app.models.UserDAO(application);
	userModel.get({username: user.username, password: user.password}, 0, 0, {}, (error, result)=>{
		if(result && result.length>0){
			request.session.user = result[0];
			response.redirect('/');
			return;
		}
		let errors = [];
		errors[0] = {msg: 'Usuário/Senha não encontrados'};
		response.render('login', {user:user, errors:errors});
	});
}

module.exports.logout = (application, request, response)=>{
	delete request.session.user;
	response.redirect('/');
}

module.exports.create = (application, request, response)=>{
	response.render('user/user', {user: {}, errors:{}});
}

module.exports.save = (application, request, response)=>{
	let user = request.body;
	request.assert('username', 'Especifique um usuário').notEmpty();
	request.assert('password', 'A senha precisa ter pelo menos 4 dígitos').isLength({min: 4});
	const errors = request.validationErrors();
	if(errors && errors.length>0){
		response.render('user/user', {user:user, errors:errors});
		return;
	}
	if(user._id==undefined || user._id==''){
		//gerar token para novo usuário
		const d = new Date().getTime();
		const uuid = '-xxxx-xxxx-4xxx'.replace(/[x]/g, (c)=>{return Math.floor(Math.random()*10);});
		user.token = d+uuid;
	}
	const userModel = new application.app.models.UserDAO(application);

	userModel.save(user, (error, result)=>{
		response.redirect('/user/'+user._id);	
	});
}

module.exports.list = (application, request, response)=>{
	const userModel = new application.app.models.UserDAO(application);
	userModel.get({}, 0, 0, {username: 1}, (error, result)=>{
		response.render('user/list', {result: result});	
	});	
}

module.exports.get = (application, request, response)=>{
	const userId = request.params.userId;
	if(userId!=undefined && userId!=''){
		const userModel = new application.app.models.UserDAO(application);
		userModel.getByID(userId, (error, result)=>{
			if(result){
				response.render('user/user', {user: result, errors:{}});
			} else {
				response.redirect('/user-new');
			}
		});
		return;
	}
	response.redirect('/user-new');
}
