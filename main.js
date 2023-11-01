var board;
var pecas;
var selected;
var remover;
var ratual;
var catual;
var ls1;
var ls2;
var vencedor;
var jogAtual;
var began = false;
var fase1;
var vsAI = false;
var diff;
var tempoInicio;
var movimentosJogador1 = 0;
var movimentosJogador2 = 0;

players = ["pink", "white"];
playerClassNames = ["pink-piece", "white-piece"];
selectedClassNames = ["pink-selected", "white-selected"];

//variaveis para a leaderboard
lbr = 0
lbb = 0

function contarPecas() {
     //console.log("contarPecas chamada");
    pecas1 = [0, 0];
    for (r = 0; r < rows; r++) {
        for (c = 0; c < columns; c++) {
            if (board[r][c] == 1) {
                pecas1[0]++;
            }
            if (board[r][c] == 2) {
                pecas1[1]++;
            }
        }
    }
    console.log("pecas: " + pecas1[0] + " " + pecas1[1]);
    return;
}


// muda o jogador
function trocaJogador() {
    if (jogAtual == 1) {
        jogAtual = 2;
        movimentosJogador1++;
    } else {
        jogAtual = 1;
        movimentosJogador2++;
    }
     //console.log("jogador " + jogAtual + " selecionado");
}

// retorna o valor do jogador não atual
function outroJogador() {
    if (jogAtual == 1) {
        return 2;
    } else {
        return 1;
    }
}

function atualizarTab() {
     //console.log("atualizarTab chamada");
    for (r = 0; r < rows; r++) {
        for (c = 0; c < columns; c++) {
            tile = document.getElementById(r.toString() + "," + c.toString());
            if (board[r][c] == 1) {
                tile.classList.add("pink-piece");
            }
            if (board[r][c] == 2) {
                tile.classList.add("white-piece");
            }
            if (board[r][c] == 0) {
                tile.classList.remove("pink-selected");
                tile.classList.remove("white-selected");
                tile.classList.remove("pink-piece");
                tile.classList.remove("white-piece");
            }
        }
    }
     //console.log("Tabuleiro atualizado");
}

function PodeColocar(r, c, jogAtual, ratual, catual, board) {
     //console.log("PodeColocar chamada");
    linhas = board.length;
    colunas = board[0].length;

    //verificar se a posição está vazia
    if (board[r][c] != 0) {
         //console.log("Posição não vazia");
        return false;
    }
    // caso seja a fase 2, removemos a peça que está na posição atual temporariamente
    if (!fase1) {
        board[ratual][catual] = 0;
    }

    //e colocamos a peça na posição que queremos
    board[r][c] = jogAtual;

    directions = [[0, 1], [1, 0]];

    for ([dr, dc] of directions) {
        count = 1; // Initialize a counter for the current direction

        // Check for possible 3 in the positive directions
        for (i = 1; i <= 3; i++) {
            row = r + dr * i;
            col = c + dc * i;
            if (row >= 0 && row < linhas && col >= 0 && col < colunas && board[row][col] === jogAtual) {
                count++;
            } else {
                break;
            }
        }

        for (i = 1; i <= 3; i++) {
            row = r - dr * i;
            col = c - dc * i;
            if (row >= 0 && row < linhas && col >= 0 && col < colunas && board[row][col] === jogAtual) {
                count++;
            } else {
                break;
            }
        }
        // Reset the counter if we don't have a "3 in a row" in the current direction and remove the "fake piece"
        board[r][c] = 0;

        if (count >= 3) {
            // A "3 in a row" is found in one of the directions
             //console.log("3 em linha encontrados");
            return false;
        }
    }

    board[r][c] = 0;

    if (!fase1) {
        board[ratual][catual] = jogAtual;
    }

    // If no "3 in a row" is found in any direction, it's a valid move
     //console.log("Movimento válido");
    return true;
}

function podeEscolher(r, c, jogAtual) {
     //console.log("podeEscolher chamada");
    return board[r][c] == jogAtual;
}

function PodeMover(r, c, ratual, catual) {
     //console.log("PodeMover chamada");
    rd = Math.abs(r - ratual);
    cd = Math.abs(c - catual);

     //console.log("rd: " + rd + " cd: " + cd);


    // caso a distância entre as coordenadas seja 1, a peça pode mover-se
    return (rd === 1 && cd === 0) || (rd === 0 && cd === 1);
}

function verLinhas(r, c, jogAtual, board) {
     //console.log("verLinhas chamada");
    const linhas = board.length;
    const colunas = board[0].length;

    directions = [[0, 1], [1, 0]];

    for ([dr, dc] of directions) {
        count = 1; // Initialize a counter for the current direction

        // Check for possible 3 in the positive directions
        for (i = 1; i <= 3; i++) {
            row = r + dr * i;
            col = c + dc * i;
            if (row >= 0 && row < linhas && col >= 0 && col < colunas && board[row][col] === jogAtual) {
                count++;
            } else {
                break;
            }
        }

        for (i = 1; i <= 3; i++) {
            row = r - dr * i;
            col = c - dc * i;
            if (row >= 0 && row < linhas && col >= 0 && col < colunas && board[row][col] === jogAtual) {
                count++;
            } else {
                break;
            }
        }

        if (count >= 3) {
            // A "3 in a row" is found in one of the directions
             //console.log("3 em linha encontrados");
            return true;
        }
    }
    return false;
}

function MovimentoRepetido(ls1, ls2, r, c, ratual, catual, jogAtual) {
     //console.log("MovimentoRepetido chamada");
    lst = ls1;
    if (jogAtual == 2) {
        lst = ls2;
    }

    if (lst[0] == ratual && lst[1] == catual && lst[2] == r && lst[3] == c)
        return true;
    return false;
}

function temJogadas(jogAtual, ls1, ls2, rows, columns, board) {
     //console.log("temJogadas chamada");
    moves = [
        [-1, 0], // Move up
        [1, 0],  // Move down
        [0, -1], // Move left
        [0, 1]   // Move right
    ];

    for (i = 0; i < rows; i++) {
        for (j = 0; j < columns; j++) {
            if (board[i][j] === jogAtual) {
                for ([dx, dy] of moves) {
                    newRow = i + dx;
                    newCol = j + dy;

                    if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns &&
                        PodeColocar(newRow, newCol, jogAtual, i, j, board) &&
                        !MovimentoRepetido(ls1, ls2, newRow, newCol, ratual, catual, jogAtual)) {
                        // A valid move is found
                         //console.log("Movimento válido encontrado");
                        return true;
                    }
                }
            }
        }
    }
    // If no valid moves are found, return false
     //console.log("Nenhum movimento válido encontrado");
    return false;
}

function verVitoria() {
     //console.log("verVitoria called");
    if(pecas[0] == 2){
        anunciarVencedor(1);
        return;
    }
    if(pecas[1] == 2){
        anunciarVencedor(2);
        return;
    }

//     if(!temJogadas(1, ls1, ls2, rows, columns, board)){
//         anunciarVencedor(2);
//     }
//     if(!temJogadas(2, ls1, ls2, rows, columns, board)){
//         anunciarVencedor(1);
//     }
}

function anunciarVencedor(ganhou) {
     //console.log("anunciarVencedor called");
    s = document.getElementById("vencedor");
    if (ganhou == 1) {
        s.innerText = "pink Wins";
        // atualizar lista da leaderboard
        lbr++;
        document.getElementById("prosa").style.value = lbr;
    } else {
        s.innerText = "white Wins";
        // atualizar lista da leaderboard
        lbb++;
        document.getElementById("pbranco").style.value = lbb;    
    }
    var estatisticasDiv = document.getElementById('estatisticas');
    estatisticasDiv.style.display = 'block';
}

function atualizarLeaderboard() {
     //console.log("atualizarLeaderboard called");
    document.getElementById("prosa").innerText = lbr;
    document.getElementById("branca").innerText = lbb;
}

function desistir() {
     //console.log("desistir called");
    for (r = 0; r < rows; r++) {
        for (c = 0; c < columns; c++) {
            tile = document.getElementById(r.toString() + "," + c.toString());
            if (tile != null) {
                tile.remove();
            }
        }
    }
    info = document.getElementById("info");
    s = "";
    info.innerText = s;
    document.getElementById('formgrande').style.display = 'block';
    document.getElementById('miniboards').style.display = 'none';
    document.getElementById('msg').style.display = 'none';
    document.getElementById('vencedor').style.display = 'none';

    document.getElementById('desistirjogo').style.fontWeight = 'normal';
    document.getElementById('comecarjogo').style.fontWeight = 'bold';

    // reset the mini boards
    for (i = 1; i <= 12; i++) {
        document.getElementById("1" + i.toString()).style.display = "block";
        document.getElementById("2" + i.toString()).style.display = "block";
    }

    began = false;
}

function comecar() {
    tempoInicio = Date.now ();
     //console.log("comecar called");
    if (!began) {
        iniciarJogo();
        // hide the form div
        document.getElementById('formgrande').style.display = 'none';
        document.getElementById('miniboards').style.display = 'block';
        document.getElementById('msg').style.display = 'block';

        document.getElementById('desistirjogo').style.fontWeight = 'bold';
        document.getElementById('comecarjogo').style.fontWeight = 'normal';

        began = true;
    }
}

function iniciarJogo() {
     //console.log("iniciarJogo called");

    primjog = document.getElementById("primeiracor").value;
    startingPlayer = primjog;

    // ir buscar o número de linhas e colunas ao form
    tamTab = document.getElementById("tamanhotabuleiro").value;
    if (tamTab == 5) {
        rows = 5;
        columns = 6;
    } else {
        rows = 6;
        columns = 6;
    }

    // ir buscar o número de jogadores ao form
    numJogadores = document.getElementById("jogadores").value;
    if (numJogadores == 1) {
        vsAI = true;
    } else {
        vsAI = false;
    }

    //ir buscar a dificuldade
    diff = document.getElementById("niveldificuldade").value;
     //console.log("dficuldade: " + diff);

    win = document.getElementById("vencedor");
    win.innerText = "";
    board = [];
    jogAtual = startingPlayer;

    // o index 0 representa o número de peças do jogador 1 e o index 1 representa o número de peças do jogador 2
    pecas = [0, 0];

    // última jogada do jogador 1 e do jogador 2 [r, c, ratual, catual]
    ls1 = [-1, -1, -1, -1];
    ls2 = [-1, -1, -1, -1];

    vencedor = 0;
    fase1 = true;
    selected = false;
    remover = false;

    for (r = 0; r < rows; r++) {
        row = [];
        for (c = 0; c < columns; c++) {
            // guardar o valor 0 em cada posição do tabuleiro
            row.push(0);

            // criar um div para cada posição do tabuleiro
            tile = document.createElement("div");

            // definir um par de coordenadas para cada div (row-column)
            tile.id = r.toString() + "," + c.toString();

            // dar lhe a tile class
            tile.classList.add("tile");
            tile.addEventListener("click", onClick);
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
    atualizarTab();

    info = document.getElementById("info");
    info.innerText = players[jogAtual - 1] + " player to select the piece";
}
function onClick() {
    if (vencedor != 0) {
        return;
    }

    //converter id para par de coordenadas
    coords = this.id.split(",");
    r = parseInt(coords[0]);
    c = parseInt(coords[1]);

    info = document.getElementById("info");
    s = "";

    if (vsAI && jogAtual == 2) { // se o jogo for contra o computador e for a vez do computador
        if (diff == 1) {
            randomAI();
        }
        if (diff == 2) {
            console.log("antes da AI jogar: " +contarPecas());
            AI2();
            console.log("depois da AI jogar: " +contarPecas());
        }

    } else { // senão, o jogo é contra outro jogador
        //fase de por as peças

        // se o número total de peças for 24, a fase de por peças acaba
         //console.log("pecas: " + pecas[0] + " " + pecas[1]);
        if (pecas[0] + pecas[1] == 24) {
            fase1 = false;
        }

        if (fase1) {
             //console.log("fase1: " + fase1 + "do jogador: " + jogAtual);
            // se a jogada for válida
             //console.log("numero de peças antes de podecolocar: " + pecas[0] + " " + pecas[1]);
            if (PodeColocar(r, c, jogAtual, 0, 0, board)) {


                // colocar a peça
                board[r][c] = parseInt(jogAtual.toString());

                // atualizar o número de peças do jogador
                pecas[jogAtual - 1]++;

                // remover peça do lado
                document.getElementById(jogAtual.toString() + (13 - pecas[jogAtual - 1]).toString()).style.display = "none";

                // trocar de jogador
                trocaJogador();

                // atualizar aspeto do tabuleiro
                atualizarTab();

                // se o número total de peças for 24, a fase de por peças acaba
                 //console.log("pecas: " + pecas[0] + " " + pecas[1]);
                if (pecas[0] + pecas[1] == 24) {
                    fase1 = false;
                    // primeiro prompt para selecionar uma peça e começar a move phase
                    s = players[jogAtual - 1] + " player to select a piece";
                } else {
                    // se não, continua a fase de por peças
                    s = players[jogAtual - 1] + " player to put a piece";
                }

            } else {
                s = "Invalid move"
            }
        }

        //fase de mover as peças
        else {

            // se nenhuma peça estiver selecionada
            if (!selected) {

                //seleciona uma peça para mover
                if (podeEscolher(r, c, jogAtual)) {
                    selected = true;
                    ratual = r;
                    catual = c;
                    tile = document.getElementById(r.toString() + "," + c.toString());

                    // troca o aspeto da peça selecionada
                    if (board[r][c] === 1 || board[r][c] === 2) {
                        playerIndex = board[r][c] - 1;

                        // remove a classe da peça e adiciona a classe da peça selecionada
                        tile.classList.remove(playerClassNames[playerIndex]);
                        tile.classList.add(selectedClassNames[playerIndex]);
                    }
                    s = players[jogAtual - 1] + " player to move the piece";
                } else {
                    s += "Cannot select that piece (wrong player or empty tile)";
                }

                // se uma peça estiver selecionada
            } else {

                // caso a jogada anterior tenha levado a uma remoção de peça
                if (remover) {

                    //remover a peça
                    if (board[r][c] == outroJogador()) {
                        board[r][c] = 0;

                        trocaJogador();

                        // subtrair uma peça ao número total de peças do jogador
                        pecas[jogAtual - 1]--;

                        document.getElementById(jogAtual.toString() + (13 - pecas[jogAtual - 1]).toString()).style.display = "block";
                        selected = false;
                        remover = false;
                        atualizarTab();
                        s = players[jogAtual - 1] + " player to select the piece";
                        verVitoria();
                    } else {
                        s += "Cannot remove that piece";
                    }
                } else {
                    // mover a peça
                    if (r == ratual && c == catual) {

                        //descelecionar a peça atual
                        selected = false;
                        tile = document.getElementById(r.toString() + "," + c.toString());


                        if (board[r][c] === 1 || board[r][c] === 2) {
                            playerIndex = board[r][c] - 1;
                            tile.classList.remove(selectedClassNames[playerIndex]);
                            tile.classList.add(playerClassNames[playerIndex]);
                        }

                        s = players[jogAtual - 1] + " player to select the piece";

                    } else {

                        if (
                            board[r][c] == 0 &&
                            PodeMover(r, c, ratual, catual) &&
                            !MovimentoRepetido(ls1, ls2, r, c, ratual, catual, jogAtual)
                        ) {
                            board[r][c] = jogAtual;

                            rwtf = r; // vou ser honesto
                            cwtf = c; // por algum motivo sem estes dois

                             //console.log("a peça foi para " + r + " " + c);
                            board[ratual][catual] = 0;
                            if (jogAtual == 1) {
                                ls1[0] = r;
                                ls1[1] = c;
                                ls1[2] = ratual;
                                ls1[3] = catual;
                            } else {
                                ls2[0] = r;
                                ls2[1] = c;
                                ls2[2] = ratual;
                                ls2[3] = catual;
                            }

                            rwtf = r; // o JS passa para a função verLinhas
                            cwtf = c; // os valores 5 e 6, sempre

                            atualizarTab();

                            if (verLinhas(rwtf, cwtf, jogAtual, board)) {
                                s = players[jogAtual - 1] + " player to remove the piece";
                                remover = true;
                            } else {
                                trocaJogador();
                                selected = false;
                                verVitoria();
                                s = players[jogAtual - 1] + " player to select the piece";
                            }
                        } else {
                            s += "Cannot move piece there (tile occupied or invalid move)";
                        }
                    }
                }
            }
        }
    }


    if (vencedor == 0) {
        info.innerText = s;
        var tempoAtual = Date.now() - tempoInicio;
        document.getElementById("tempo").innerText = formatarTempo(tempoAtual);
        document.getElementById("pecasRecolhidas1").innerText = 12 - pecas [0];
        document.getElementById("pecasRecolhidas2").innerText = 12 - pecas [1];
        document.getElementById("movimentosJogador1").innerText = movimentosJogador1;
        document.getElementById("movimentosJogador2").innerText = movimentosJogador2;
    } else {
        info.innerText = "";
    }
}

function formatarTempo(tempoEmMilissegundos) {
    var segundos = Math.floor(tempoEmMilissegundos / 1000);
    var minutos = Math.floor(segundos / 60);

    segundos = segundos % 60;

    return minutos + " min " + segundos + " seg";
}

function randomAI() {
    if (fase1) {
        validmoves = [];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (PodeColocar(i, j, jogAtual, 0, 0, board)) {
                    validmoves.push([i, j]);
                     //console.log("valid move: " + i + " " + j);
                }
            }
        }
         //console.log("valid moves: " + validmoves);
        move = validmoves[Math.floor(Math.random() * validmoves.length)];
         //console.log("move: " + move);
        r = move[0];
        c = move[1];
        board[r][c] = parseInt(jogAtual.toString());
        pecas[jogAtual - 1]++;
        document.getElementById(jogAtual.toString() + (13 - pecas[jogAtual - 1]).toString()).style.display = "none";
        atualizarTab();
        jogAtual = 1;
         //console.log("jogador trocado");
        if (pecas[0] + pecas[1] == 24) {
            fase1 = false;
            s = players[jogAtual - 1] + " player to select the piece";
        } else {
            s = players[jogAtual - 1] + " player to put a piece";
        }

    } else {

        if (remover) {

            //remover a peça
            validmoves = [];
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (board[i][j] == outroJogador()) {
                        validmoves.push([i, j]);
                         //console.log("valid removes: " + i + " " + j);
                    }
                }
            }

            move = validmoves[Math.floor(Math.random() * validmoves.length)];
            board[move[0]][move[1]] = 0;
            trocaJogador();

            // subtrair uma peça ao número total de peças do jogador
            pecas[jogAtual - 1]--;

            document.getElementById(jogAtual.toString() + (13 - pecas[jogAtual - 1]).toString()).style.display = "block";
            remover = false;
            atualizarTab();
            verVitoria();
            s = players[jogAtual - 1] + " player to select the piece";

        } else {
            validmoves = [];
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    for (let ia = 0; ia < rows; ia++) {
                        for (let ja = 0; ja < columns; ja++) {
                            if (
                                board[i][j] == jogAtual &&
                                board[ia][ja] == 0 &&
                                PodeMover(i, j, ia, ja) &&
                                !MovimentoRepetido(ls1, ls2, ia, ja, i, j, jogAtual)
                            ) {
                                validmoves.push([i, j, ia, ja]);
                                 //console.log("valid removes: de " + i + " " + j + " para " + ia + " " + ja);
                            }
                        }
                    }
                }
            }
            move = validmoves[Math.floor(Math.random() * validmoves.length)];

            board[move[2]][move[3]] = jogAtual;
            board[move[0]][move[1]] = 0;

             //console.log("remover peça de " + move[0] + " " + move[1]);
             //console.log("a peça foi para " + move[2] + " " + move[3]);

            ls2[0] = move[2];
            ls2[1] = move[3];
            ls2[2] = move[0];
            ls2[3] = move[1];

            atualizarTab();

            if (verLinhas(move[2], move[3], jogAtual, board)) {
                s = players[jogAtual - 1] + " player to remove the piece";
                remover = true;
            } else {
                trocaJogador();
                verVitoria();
                s = players[jogAtual - 1] + " player to select the piece";
            }
        }
    }
}


function AI2() {

    if (fase1) {
        move = [];
        pontos = -1;
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (PodeColocar(i, j, jogAtual, 0, 0, board)) {
                    a = heuristica(i, j);
                    if (a > pontos) {
                        move = [i, j];
                        pontos = a;
                    }
                }
            }
        }

         //console.log("move: " + move);
        r = move[0];
        c = move[1];
        board[r][c] = parseInt(jogAtual.toString());
        pecas[jogAtual - 1]++;
        document.getElementById(jogAtual.toString() + (13 - pecas[jogAtual - 1]).toString()).style.display = "none";
        atualizarTab();
        jogAtual = 1;
         //console.log("jogador trocado");
        if (pecas[0] + pecas[1] == 24) {
            fase1 = false;
            s = players[jogAtual - 1] + " player to select the piece";
        }
        else {
            s = players[jogAtual - 1] + " player to put a piece";
        }

    } else {

        if (remover) {

            //remover a peça
            move = [];
            pontos = -1;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (board[i][j] == outroJogador()) {
                        a = heuristica(i, j);
                        if (a > pontos) {
                            move = [i, j];
                            pontos = a;
                        }
                    }
                }
            }

            board[move[0]][move[1]] = 0;
            trocaJogador();

            // subtrair uma peça ao número total de peças do jogador
            pecas[jogAtual - 1]--;

            document.getElementById(jogAtual.toString() + (13 - pecas[jogAtual - 1]).toString()).style.display = "block";
            remover = false;
            atualizarTab();
            verVitoria();
            s = players[jogAtual - 1] + " player to select the piece";

        } else {
            move = [];
            points = -1;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    for (let ia = 0; ia < rows; ia++) {
                        for (let ja = 0; ja < columns; ja++) {
                            if (
                                board[i][j] == jogAtual &&
                                board[ia][ja] == 0 &&
                                PodeMover(i, j, ia, ja) &&
                                !MovimentoRepetido(ls1, ls2, ia, ja, i, j, jogAtual)
                            ) {
                                a = heuristica(ia, ja);
                                if (a > points) {
                                    move = [i, j, ia, ja];
                                    points = a;
                                }
                            }
                        }
                    }
                }
            }

            board[move[2]][move[3]] = jogAtual;
            board[move[0]][move[1]] = 0;

             //console.log("remover peça de " + move[0] + " " + move[1]);
             //console.log("a peça foi para " + move[2] + " " + move[3]);

            ls2[0] = move[2];
            ls2[1] = move[3];
            ls2[2] = move[0];
            ls2[3] = move[1];

            atualizarTab();

            if (verLinhas(move[2], move[3], jogAtual, board)) {
                s = players[jogAtual - 1] + " player to remove the piece";
                remover = true;
            } else {
                trocaJogador();
                verVitoria();
                s = players[jogAtual - 1] + " player to select the piece";
            }
        }
    }
}

function heuristica(r, c) {
    var pontos = 0;
     //console.log("heuristica chamada");
     //console.log("a ver: " + jogAtual + " em " + r + c);
    // se faz um 3 em linha, ganha 100 pontos
    if (verLinhas(r, c, jogAtual, board)) {
        pontos += 100;
    }

    moves = [
        [-1, 0], // Move up
        [1, 0],  // Move down
        [0, -1], // Move left
        [0, 1]   // Move right
    ];

    for ([dx, dy] of moves) {
        newRow = r + dx;
        newCol = c + dy;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < columns) {
            
            // compare the ls2 with the new position
            if (MovimentoRepetido(ls1, ls2, newRow, newCol, ratual, catual, jogAtual)) {
                pontos -= 100;
            }
    

            // se for peça do jogador, ganha 10 pontos
            if (board[newRow][newCol] == jogAtual) {
                pontos += 10;
            }

            // se for peça do adversário, ganha 10 pontos

            if (board[newRow][newCol] == outroJogador()) { 
                pontos += 5;
            }

        }
    }
     //console.log("em " + r + c + " heuristica: " + pontos);

     //console.log("em " + r + c + " heuristica: " + pontos);
    return pontos;

}
