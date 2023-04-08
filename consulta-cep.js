console.log("=== CEP ===");

const formCep = document.querySelector("form");
let endereco = localStorage.endereco ? JSON.parse(localStorage.endereco.split(",")) : [];

// Actions

function onlyNumbers (e) {
    this.value = this.value.replace(/\D+/g, "");
}

function validateEntry() {
    if(this.value.length === 8){
        this.classList.remove("error");
    } else {
        this.classList.add("error");
        this.focus();
    }
}

function getAddress(e) {
    e.preventDefault();

    const cep = document.querySelector("#cep");
    const postalCode = cep.value;

    // endpoint
    const endpoint = `https://viacep.com.br/ws/${postalCode}/json/`;

    const config = {
        method: "GET"
    };

    // request
    fetch(endpoint, config)
        .then(function(resp) { return resp.json(); })
            .then(addAddressSuccess)
        .catch(getAddressError);
    
    cep.value = '';
    cep.focus();
}

function addAddressSuccess(address){
    if(address.erro){
        getAddressError();
    } else{
        endereco.push({
            logradouro: address.logradouro,
            cep: address.cep,
            localidade: address.localidade,
            bairro: address.bairro,
            uf: address.uf
        });

        localStorage.setItem("endereco", JSON.stringify(endereco));
        getAddressSuccess();
    }
}

function getAddressSuccess(){
    if (endereco.length > 0){
        const card = endereco.map(function(item) {
            return `<div class="card m-3 col-sm-12" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${item.logradouro}</h5>
                            <h6 class="card-subtitle mb-2 text-body-secondary">${item.bairro} - ${item.localidade} - ${item.uf}</h6>
                            <p class="card-text">${item.cep}</p>
                        </div>
                    </div>`
        }).join("");

        document.querySelector(".cards").innerHTML = card;
    }
}

function getAddressError(){
    const cep = document.querySelector("#cep");
    cep.classList.add("is-invalid");
    setTimeout( () => {
        cep.classList.remove("is-invalid");
    }, 3000);
}

// Mapping Events
document.querySelector("#cep").addEventListener("input", onlyNumbers);
document.querySelector("#cep").addEventListener("focusout", validateEntry);
formCep.addEventListener("submit", getAddress);
document.addEventListener("DOMContentLoaded", getAddressSuccess);