function installmentsCharge() {
    Mercadopago.setPublishableKey("TEST-99c6d09d-7dca-4c45-bffb-b9d69908b8be"); //INSERT YOUR PUBLIC KEY AVAILABLE IN: https://www.mercadopago.com/mlb/account/credentials
  function addEvent(el, eventName, handler) {
    if (el.addEventListener) {
      el.addEventListener(eventName, handler);
    } else {
      el.attachEvent('on' + eventName, function () {
        handler.call(el);
      });
    }
  };
  function getBin() {
    var ccNumber = document.querySelector('input[data-checkout="cardNumber"]');
    return ccNumber.value.replace(/[ .-]/g, '').slice(0, 6);
  };

  function guessingPaymentMethod(event) {
    var bin = getBin();

    if (event.type == "keyup") {
      if (bin.length >= 6) {
        Mercadopago.getPaymentMethod({
          "bin": bin
        }, setPaymentMethodInfo);
      }
    } else {
      setTimeout(function () {
        if (bin.length >= 6) {
          Mercadopago.getPaymentMethod({
            "bin": bin
          }, setPaymentMethodInfo);
        }
      }, 100);
    }
  };

  function setPaymentMethodInfo(status, response) {
    if (status == 200) {
      var form = document.querySelector('#pay');

      if (document.querySelector("input[name=paymentMethodId]") == null) {
        var paymentMethod = document.createElement('input');
        paymentMethod.setAttribute('name', "paymentMethodId");
        paymentMethod.setAttribute('type', "hidden");
        paymentMethod.setAttribute('value', response[0].id);
        form.appendChild(paymentMethod);
      } else {
        document.querySelector("input[name=paymentMethodId]").value = response[0].id;
      }

      var img = "<img src='" + response[0].thumbnail + "' align='center' style='margin-left:10px;' ' >";
      $("#bandeira").empty();
      $("#bandeira").append(img);
      amount = document.querySelector('#amount').value;
      Mercadopago.getInstallments({
        "bin": getBin(),
        "amount": amount
      }, setInstallmentInfo);

    }
  };

  addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'keyup', guessingPaymentMethod);
  addEvent(document.querySelector('input[data-checkout="cardNumber"]'), 'change', guessingPaymentMethod);

  doSubmit = false;
  addEvent(document.querySelector('#pay'), 'submit', doPay);

  function doPay(event) {
    event.preventDefault();
    if (!doSubmit) {
      var $form = document.querySelector('#pay');

      Mercadopago.createToken($form, sdkResponseHandler);

      return false;
    }
  };

  function sdkResponseHandler(status, response) {
    if (status != 200 && status != 201) {
      alert("verify filled data");
    } else {

      var form = document.querySelector('#pay');
      var card = document.createElement('input');
      card.setAttribute('name', "token");
      card.setAttribute('type', "hidden");
      card.setAttribute('value', response.id);
      form.appendChild(card);
      doSubmit = true;
      form.submit();
    }
  };
  function setInstallmentInfo(status, response) {
    var selectorInstallments = document.querySelector("#installments"),
      fragment = document.createDocumentFragment();
    selectorInstallments.options.length = 0;
    if (response.length > 0) {
      var option = new Option("Choose...", '-1'),
        payerCosts = response[0].payer_costs;
      fragment.appendChild(option);
      for (var i = 0; i < payerCosts.length; i++) {
        option = new Option(payerCosts[i].recommended_message || payerCosts[i].installments, payerCosts[i].installments);
        fragment.appendChild(option);
      }
      selectorInstallments.appendChild(fragment);
      selectorInstallments.removeAttribute('disabled');
    }
  };
}

$(document).ready(function() {
    $('#checkout').click(function(){ 
          $('.shopping-cart').fadeOut(500);
          setTimeout(() => { $('.container_payment').show(500).fadeIn(); }, 500);
          
    });
  });