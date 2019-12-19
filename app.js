//modulo para leitura do arquivo de propriedades
const PropertiesReader = require('properties-reader');
const properties = PropertiesReader('./config/properties.conf');



const app = require('./config/server');

app.config.dbconnection.initDb((err, db)=>{
	if(err){
		console.log('Erro ao se conectar ao banco de dados')
		console.log(err);
	} else {
		app.listen(properties.get('app.port'), ()=>{
			console.log('Servidor iniciado com sucesso na porta '+properties.get('app.port'));
			new app.app.models.UserDAO(app).get({username: 'admin'}, 0, 0, {}, (error, result)=>{
				if(!result || result.length<1){
					//criar usuário
					new app.app.models.UserDAO(app).save({username: 'admin', password: 'admin'}, (error, result)=>{
					});
				}
			});
		});		
	}	
});