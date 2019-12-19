# CheckoutSample
 
> Aplicação web desenvolvida em Node JS para utilizar as API's do MercadoPago

## Prereqs

Para o correto funcionamento da aplicação é necessário que as seguintes soluções estejam instaladas no computador:

- Node js
- Npm
- MongoDB
- Mocha
- nyc

## Instalação

Para realizar o download e instalação siga os passos abaixo:

- Clonar esse repositório em alguma pasta do computador
- Abrir uma tela de terminal (Linux/MacOS) ou o prompt (Windows)
- Entrar na raiz do projeto e executar o comando ```npm install```

Com isso serão instaladas todas as dependências necessárias para o correto funcionamento dessa aplicação.

## Antes de ininicar

Antes de iniciar a aplicação é necessário ir até o arquivo "config/properties.conf" e, caso necessário, alterar as propriedades contidas nele. Essas propriedades são usadas em toda a aplicação para realizar diversas operações (ex.: comunicação as API's do Mercado Pago, comunicação com o banco de dados, parametros de testes, etc.).

## Iniciar a aplicação

Para iniciar a aplicação, abra uma tela do terminal, navegue até a pasta raiz do projeto e execute o comando ```node app.js```

Quando a aplicação estiver no ar e disponível para acesso será exibida a mensagem "Servidor iniciado com sucesso na porta XXXX". A porta é parametrizável no arquivo 'properties.conf' mencionado anteriormente.

## Primerio acesso

Quando a aplicação é iniciada ela realiza a criação de um usuário 'padrão'. Uma vez que a aplicação for iniciada, para acessá-la deve-se navegar até a URL dela e utilizar o usuário/senha 'admin/admin'. Esse é o usuário padrão da aplicação, sendo assim, após fazer login deve-se criar um usuário 'próprio'. O usuário 'admin' não possui chave de acesso para a API REST da aplicação.

Após o login, a primeira tela da aplicação já é a de pagamento. As outras opções (ex.: criação de usuário, consulta de pagamento, pagamento com cartões salvos, etc.) estão no menu ;)

## Execução dos teste

Para executar os testes basta ir na pasta raiz do projeto e executar o comando ```npm test```. Os testes configurados serão executados. 

Antes de executar os testes é recomendável iniciar a aplicação e realizar o cadastro de clientes/cartões/pedidos para que os testes possam ser concluídos com sucesso.

## Meta

Distributed under the MIT license. See ``LICENSE`` for more information.