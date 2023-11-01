function AbrirPopUp() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}


function AparecerPergunta() {
    event.preventDefault();
    var x = document.getElementById('jogadores').value;
    if (x == 1) {
        document.getElementById('contracomputadorDiv').style.display = 'block'; // Show question 
    } else {
        document.getElementById('contracomputadorDiv').style.display = 'none'; // Hide question 
    }
}


function abrir(event){
    document.getElementById('painel').style.display = 'block';
}

function fechar(){
        document.getElementById('painel').style.display = 'none';
    
}

function jogarnovamente(){
    document.getElementById('estatisticas').style.display = 'none';

}