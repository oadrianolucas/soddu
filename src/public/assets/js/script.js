$(document).ready(() => {
  var options = {
    animation: true,
    delay: 20000,
  };
  let myAlert = document.querySelector(".toast");
  let bsAlert = new bootstrap.Toast(myAlert, options);
  bsAlert.show();
});

$(document).ready(() => {
  handleSelect = (elm) => {
    window.location = elm.value;
  };
});

const cep = document.querySelector("#cep");
const showData = (result) => {
  for (const campo in result) {
    if (document.querySelector("#" + campo)) {
      document.querySelector("#" + campo).value = result[campo];
    }
  }
};
cep.addEventListener("blur", (e) => {
  let search = cep.value.replace("-", "");
  const options = {
    method: "GET",
    mode: "cors",
    cache: "default",
  };
  fetch(`https://viacep.com.br/ws/${search}/json/`, options)
    .then((response) => {
      response.json().then((data) => showData(data));
    })
    .catch((e) => console.log("Deu Erro: " + e, message));
});
$(document).ready(() => {
  $("#phone").mask("(00)00000-0000");
});
$(document).ready(() => {
  $("#cep").mask("99999-999");
});
$(".chosen").chosen({ no_results_text: "Nenhuma opção encontrada: " });
