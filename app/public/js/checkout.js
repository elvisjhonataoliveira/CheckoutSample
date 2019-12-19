function addEvent(to, type, fn){  
    if(document.addEventListener){
        to.addEventListener(type, fn, false);
    } else if(document.attachEvent){
        to.attachEvent('on'+type, fn);
    } else {
        to['on'+type] = fn;
    }  
}; 

function getBin() {
  const cardnumber = document.getElementById("cardNumber");
  return cardnumber.value.substring(0,7).replace(' ', '');
};
function guessingPaymentMethod(event) {
    var bin = getBin();

    if (event.type == "keyup") {
        if (bin.length >= 6) {
            window.Mercadopago.getPaymentMethod({
                "bin": bin
            }, setPaymentMethodInfo);
        }
    } else {
        setTimeout(function() {
            if (bin.length >= 6) {
                window.Mercadopago.getPaymentMethod({
                    "bin": bin
                }, setPaymentMethodInfo);
            }
        }, 100);
    }
};

function setPaymentMethodInfo(status, response) {
    if (status == 200) {
        const paymentMethodElement = document.querySelector('input[name=paymentMethodId]');

        if (paymentMethodElement) {
            paymentMethodElement.value = response[0].id;
        } else {
            const input = document.createElement('input');
            input.setAttribute('name', 'paymentMethodId');
            input.setAttribute('type', 'hidden');
            input.setAttribute('value', response[0].id);     

            form.appendChild(input);
        }

        Mercadopago.getInstallments({
            "bin": getBin(),
            "amount": parseFloat(document.querySelector('#amount').value.replace(/\./g,'')),
        }, setInstallmentInfo);

    } else {
        alert(`payment method info error: ${response}`);  
    }
};

function setInstallmentInfo(status, response) {
    var selectorInstallments = document.querySelector("#installments"),
    fragment = document.createDocumentFragment();
    selectorInstallments.options.length = 0;

    if (response.length > 0) {
        var option = new Option("Escolha...", '-1'),
        payerCosts = response[0].payer_costs;
        fragment.appendChild(option);

        for (var i = 0; i < payerCosts.length; i++) {
            fragment.appendChild(new Option(payerCosts[i].recommended_message, payerCosts[i].installments));
        }

        selectorInstallments.appendChild(fragment);
        selectorInstallments.removeAttribute('disabled');
    }
    hideLoader();
};


doSubmit = false;
function doPay(event){
    event.preventDefault();
    if($('#paymentMethod').val()!='credit-card'){
        finishNonCreditCardPayment();
        return false;
    } else if(!doSubmit){
        var $form = document.querySelector('#pay');
        showLoader();
        window.Mercadopago.createToken($form, sdkResponseHandler); 
        return false;
    }
};

let appToken;

function setToken(token){
    appToken = token;
}

function sdkResponseHandler(status, response) {
	if (status != 200 && status != 201) {
        const errors = response.cause;
        $("#error-list").empty();
        errors.forEach(function(error, index){
        	$("#error-list").append("<li>"+messages[error.code]+"</li>");
        });
        $("#modal-container").show();
        hideLoader();
    }else{
        $('#token').val(response.id);
        var form = document.querySelector('#pay');
        $.ajax({
			url : "/rest/checkout",
			type: "POST",
			data : $(form).serialize()
		}).always(paymentFinishHandler);
        
    }
};


function finishNonCreditCardPayment(){ 
    showLoader();
    var form = document.querySelector('#pay');
    $.ajax({
        url : "/rest/checkout",
        type: "POST",
        data : $(form).serialize()
    }).always(paymentFinishHandler);
    ;
}


function paymentFinishHandler(response){
    if(response.success || response.responseJSON.success){
        //deu certo
        window.location.replace('/checkout/'+(response.id?response.id:response.responseJSON.id));
    } else if(response.responseJSON.errors){
        //deu erro de validação da aplicação
        $("#error-list").empty();
        response.responseJSON.errors.forEach(function(error, index){
            $("#error-list").append("<li>"+error.msg+"</li>");
        });
        hideLoader();
        $("#modal-container").show();

    } else if(response.responseJSON.mpErrors){
        //deu erro no MP
        $("#error-list").empty();
        response.responseJSON.mpErrors.forEach(function(error, index){
            $("#error-list").append("<li>"+error.description+"</li>");
        });
        hideLoader();
        $("#modal-container").show();
    } else if(response.responseJSON.scMessage){
        //deu erro no MP
        $("#error-list").empty();
        $("#error-list").append("<li>"+response.responseJSON.scMessage+"</li>");
        hideLoader();
        $("#modal-container").show();
    } else {
        $("#error-list").empty();
        $("#error-list").append("<li>Erro ao processar pagamento. Tente novamente.</li>");
        hideLoader();
        $("#modal-container").show();
    }
}

function showLoader(){
	$("#loader").show();
}

function hideLoader(){
	$("#loader").hide();
}


function nextFocus(element, maxLength, nextElement) {
    $(element).keyup(function () {
        if ($(element).val().length == maxLength) {
            $(nextElement).focus();
        }
    });
    $(element).keypress(function(e){
        if (e.which === 13) {
            $(nextElement).focus();
        }
    });    
}



let messages = [];
messages['205'] = 'Digite o número do seu cartão.';
messages['208'] = 'Escolha um mês.';
messages['209'] = 'Escolha um ano.';
messages['212'] = 'Informe seu documento.';
messages['213'] = 'Informe seu documento.';
messages['214'] = 'Informe seu documento.';
messages['220'] = 'Informe seu banco emissor.';
messages['221'] = 'Digite o nome e sobrenome.';
messages['224'] = 'Digite o código de segurança.';
messages['E301'] = 'Há algo de errado com esse número. Digite novamente.';
messages['E302'] = 'Confira o código de segurança.';
messages['316'] = 'Por favor, digite um nome válido.';
messages['322'] = 'Confira seu documento.';
messages['323'] = 'Confira seu documento.';
messages['324'] = 'Confira seu documento.';
messages['325'] = 'Confira a data.';
messages['326'] = 'Confira a data.';
messages['default'] = 'Confira os dados.';
messages['accredited'] = 'Pronto, seu pagamento foi aprovado! No resumo, você verá a cobrança do valor como statement_descriptor';
messages['cc_rejected_bad_filled_card_number'] = 'Confira o número do cartão.';
messages['cc_rejected_bad_filled_date'] = 'Confira a data de validade.';
messages['cc_rejected_bad_filled_other'] = 'Confira os dados.';
messages['cc_rejected_bad_filled_security_code'] = 'Confira o código de segurança.';
messages['cc_rejected_blacklist'] = 'Não conseguimos processar seu pagamento.';
messages['cc_rejected_call_for_authorize'] = 'Você deve autorizar ao payment_method_id o pagamento do valor ao Mercado Pago.';
messages['cc_rejected_card_disabled'] = 'Ligue para o payment_method_id para ativar seu cartão. O telefone está no verso do seu cartão.';
messages['cc_rejected_card_error'] = 'Não conseguimos processar seu pagamento.';
messages['cc_rejected_duplicated_payment'] = 'Você já efetuou um pagamento com esse valor. Caso precise pagar novamente, utilize outro cartão ou outra forma de pagamento.';
messages['cc_rejected_high_risk'] = 'Seu pagamento foi recusado. Escolha outra forma de pagamento. Recomendamos meios de pagamento em dinheiro.';
messages['cc_rejected_insufficient_amount'] = 'O payment_method_id possui saldo insuficiente.';
messages['cc_rejected_invalid_installments'] = 'O payment_method_id não processa pagamentos parcelados.';
messages['cc_rejected_max_attempts'] = 'Você atingiu o limite de tentativas permitido. Escolha outro cartão ou outra forma de pagamento.';
messages['cc_rejected_other_reason'] = 'O payment_method_id não processou seu pagamento';
messages['pending_contingency'] = 'Estamos processando o pagamento. Em até 2 dias úteis informaremos por e-mail o resultado.';
messages['pending_review_manual'] = 'Estamos processando o pagamento. Em até 2 dias úteis informaremos por e-mail se foi aprovado ou se precisamos de mais informações.';
messages['pending_waiting_payment'] = 'Solicitação de pagamento aprovada. Para realizar o pagamento utilize as informações abaixo.';
