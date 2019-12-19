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

describe('Testando o módulo de usuário',function(){
	this.timeout(10000);
	
	before((done)=>{
		dbconnection.initDb((error, dbInstance)=>{
			db = dbconnection.getDb();
			app.config.dbconnection.initDb((err, db)=>{
				done();
			});	
		});
		
	});
 
	it('Página de login', (done)=>{
		app.app.controllers.user.login(app, request, {render: (page, params)=>{
			expect(page).to.equal('login');	
			done();
 		}});
	});

	it('Método de login', (done)=>{
		const request = {
			body: {
				username:'admin',
	 			password:'admin'
 			},
 			assert: ()=>{return request},
 			notEmpty: ()=>{return request},
 			isLength: ()=>{return request},
 			validationErrors: ()=>{return undefined},
 			session: {}
 		};
		app.app.controllers.user.doLogin(app, request, {render: (page, params)=>{
			expect(page).to.equal('login');	
			done();
 		}, redirect: (url)=>{
 			expect(url).to.equal('/');	
 			done();
 		}});
	});

	it('Método de logout', (done)=>{
		const request = {
			session: {
				user: {}
			}
 		};
		app.app.controllers.user.logout(app, request, {redirect: (url)=>{
 			expect(url).to.equal('/');	
 			done();
 		}});
	});

	it('Página de criação de usuário', (done)=>{
		app.app.controllers.user.create(app, request, {render: (page, params)=>{
			expect(page).to.equal('user/user');	
			done();
 		}});
	});

	it('Método de criação de usuário', (done)=>{
		const request = {
			body: {
				username:'admin',
	 			password:'admin'
 			},
 			assert: ()=>{return request},
 			notEmpty: ()=>{return request},
 			isLength: ()=>{return request},
 			validationErrors: ()=>{return undefined},
 			session: {}
 		};
		app.app.controllers.user.save(app, request, {redirect: (url)=>{
			expect(url).to.contains('/user');	
			done();
 		}});
	});

	it('Lista de usuários', (done)=>{
		app.app.controllers.user.list(app, request, {render: (page, params)=>{
			expect(page).to.equal('user/list');	
			done();
 		}});
	});
	
	it('Recuperação de usuário', (done)=>{
		const request = {
			params: {
				userId:'5df834155d17fc0c33b9143c'
			}
 		};
		app.app.controllers.user.get(app, request, {render: (page, params)=>{
			expect(page).to.equal('user/user');	
			done();
 		}, redirect: (url)=>{
 			expect(url).to.equal('/user-new');	
 			done();
 		}});
	}); 	

 	after('Finalizando banco de dados', (done)=>{
 		console.log('Finalizando banco');
 		dbconnection.close();
 		app.config.dbconnection.close();
 		done();
 	});
});
