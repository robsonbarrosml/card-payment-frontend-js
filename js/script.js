window.Mercadopago.setPublishableKey("YOUR_PUBLIC_KEY"); //REPLACE WITH YOUR PUBLIC KEY AVAILABLE IN: https://developers.mercadopago.com/panel/credentials
window.Mercadopago.getIdentificationTypes();
  
document.getElementById('cardNumber').addEventListener('keyup', guessPaymentMethod);
document.getElementById('cardNumber').addEventListener('change', guessPaymentMethod);

function guessPaymentMethod(event) {
    let cardnumber = document.getElementById("cardNumber").value;

    if (cardnumber.length >= 6) {
        let bin = cardnumber.substring(0,6);
        window.Mercadopago.getPaymentMethod({
            "bin": bin
        }, setPaymentMethod);
    }
};

function setPaymentMethod(status, response) {
    if (status == 200) {
        let paymentMethodId = response[0].id;
        let element = document.getElementById('paymentMethodId');
        element.value = paymentMethodId;
        getInstallments();
    } else {
        alert(`payment method info error: ${response}`);
    }
}

function getInstallments(){
    window.Mercadopago.getInstallments({
        "payment_method_id": document.getElementById('paymentMethodId').value,
        "amount": parseFloat(document.getElementById('amount').value)
        
    }, function (status, response) {
        if (status == 200) {
            document.getElementById('installments').options.length = 0;
            response[0].payer_costs.forEach( installment => {
                let opt = document.createElement('option');
                opt.text = installment.recommended_message;
                opt.value = installment.installments;
                document.getElementById('installments').appendChild(opt);
            });
        } else {
            alert(`installments method info error: ${response}`);
        }
    });
}    

doSubmit = false;
document.querySelector('#pay').addEventListener('submit', doPay);

function doPay(event){
    event.preventDefault();
    if(!doSubmit){
        var $form = document.querySelector('#pay');

        window.Mercadopago.createToken($form, sdkResponseHandler);

        return false;
    }
};

function sdkResponseHandler(status, response) {
    if (status != 200 && status != 201) {
        alert("verify filled data");
    }else{
        var form = document.querySelector('#pay');
        var card = document.createElement('input');
        card.setAttribute('name', 'token');
        card.setAttribute('type', 'hidden');
        card.setAttribute('value', response.id);
        form.appendChild(card);
        doSubmit=true;
        form.submit();
    }
};

/* checkout */
$(document).ready(function() {
    $('#checkout').click(function(){ 
            $('.shopping-cart').fadeOut(500);
            setTimeout(() => { $('.container_payment').show(500).fadeIn(); }, 500);
    });
});

/* go back */
$(document).ready(function() {
    $('.go_back').click(function(){ 
            $('.container_payment').fadeOut(500);
            setTimeout(() => { $('.shopping-cart').show(500).fadeIn(); }, 500);
    });
});

/* Price initialize */
$(document).ready(function() {
    $('#total-price').text('$ ' + ($('#unit-price').text() * $('#quantity').val()));
    $('#total-payment').text('$ ' + ($('#unit-price').text() * $('#quantity').val()));
    $('#quantity-payment').text($('#quantity').val() + 'x ');
    $('#amount').val(($('#unit-price').text() * $('#quantity').val()));
});

/* Calculate price vs quantity */
$(document).ready(function() {
    $('#quantity').keyup(function(){
        $('#total-price').text('$ ' + ($('#unit-price').text() * $('#quantity').val()));
        $('#total-payment').text('$ ' + ($('#unit-price').text() * $('#quantity').val()));
        $('#quantity-payment').text($('#quantity').val() + 'x ');
        $('#amount').val(($('#unit-price').text() * $('#quantity').val()));
    });
});