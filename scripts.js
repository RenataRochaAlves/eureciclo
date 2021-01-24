let galao = document.getElementById('galao');
let qtde = document.getElementById('garrafas');
let container = document.getElementById('container');
let button = document.querySelector('button');
let novoCalculo = document.querySelector('.novoCalculo');
let resultado = document.querySelector('#resultado');

let volumeGalao = undefined;
let volumeGarrafas = [];

galao.onchange = function(evt) {
    volumeGalao = parseFloat(evt.target.value);
}

function addGarrafa(numGarrafa, numVolume) {
	let garrafaObj = {
		garrafa: numGarrafa,
		volume: numVolume
	}

	volumeGarrafas[numGarrafa - 1] = garrafaObj;
}

function getGarrafas() {
	const labels = document.querySelectorAll('#container label');

	for (const label of labels) {
		label.onchange = function(evt) {
			volumeGarrafas[label.getAttribute('id') - 1].volume = parseFloat(evt.target.value);
		}
	}
}

qtde.onchange = function(evt) {
	container.innerHTML = '';
	volumeGarrafas.length = evt.target.value;

	for (let i = 0; i < volumeGarrafas.length; i++) {
		let novaGarrafa = document.createElement('label');
		novaGarrafa.setAttribute('for', 'garrafa' + (i + 1));
		novaGarrafa.setAttribute('id', (i + 1));
		novaGarrafa.innerHTML =
				`Garrafa ${i + 1}:
					<div>
							<input id="garrafa${i + 1}" name="garrafa${i + 1}" type="number" min="0" placeholder="5" required>
							litros
					</div>`
					
		container.appendChild(novaGarrafa);
		addGarrafa(i + 1, 0);
		getGarrafas();
	}
}

button.onclick = function(evt) {
	evt.preventDefault();
	button.style.display = 'none';
	resultado.innerHTML = '';

	let total = volumeGarrafas.reduce((prev, cur) => prev + cur.volume, 0);
	if(total < volumeGalao) {
		let mensagem = document.createElement('h3');
		mensagem.innerHTML = 'O volume das garrafas não é o suficiente para encher o galão';
		resultado.appendChild(mensagem);
	} else {
		let volumeOrdenado = volumeGarrafas.sort((a, b) => (a.volume > b.volume) ? -1 : 1 );
		let garrafasUsadas = [];
		let reservaMaior = [];
		let reservaMenor = [];
		let totalGarrafasUsadas = 0;

		volumeOrdenado.forEach(item => {
			totalGarrafasUsadas = garrafasUsadas.reduce((prev, cur) => prev + cur.volume, 0);
			if(totalGarrafasUsadas < volumeGalao) {
				if(item.volume > volumeGalao) {
					reservaMaior.push(item);
				} else if(item.volume > (volumeGalao - totalGarrafasUsadas)) {
					reservaMenor.push(item);	
				} else if (item.volume > 0) {
					garrafasUsadas.push(item);
				}
			}
		});

		totalGarrafasUsadas = garrafasUsadas.reduce((prev, cur) => prev + cur.volume, 0);

		if(totalGarrafasUsadas < volumeGalao) {
			let reservaMenorOrdenada = reservaMenor.sort((a, b) => (a.volume > b.volume) ? 1 : -1 );
			let reservaMaiorOrdenada = reservaMaior.sort((a, b) => (a.volume > b.volume) ? -1 : 1 );

			reservaMenorOrdenada.forEach(item => {
				totalGarrafasUsadas = garrafasUsadas.reduce((prev, cur) => prev + cur.volume, 0);
				if(totalGarrafasUsadas < volumeGalao) {
					garrafasUsadas.push(item);
				}
			});

			totalGarrafasUsadas = garrafasUsadas.reduce((prev, cur) => prev + cur.volume, 0);
			
			if(reservaMaiorOrdenada.length > 0 && totalGarrafasUsadas !== volumeGalao && (totalGarrafasUsadas - volumeGalao) >= (reservaMaiorOrdenada[0].volume - volumeGalao) || totalGarrafasUsadas < volumeGalao) {
				garrafasUsadas = [reservaMaiorOrdenada[0]];
			}
		}

		totalGarrafasUsadas = garrafasUsadas.reduce((prev, cur) => prev + cur.volume, 0);

		listaGarrafas = [];
		garrafasUsadas = garrafasUsadas.sort((a, b) => (a.garrafa > b.garrafa) ? 1 : -1 )
		garrafasUsadas.forEach(item => {
			let garrafaInfo = "Garrafa " + item.garrafa + " (" + item.volume + "L)";
			listaGarrafas.push(garrafaInfo);
		});

		let resposta = document.createElement('div');
		resposta.setAttribute('id', 'resposta');
		resposta.innerHTML = `
														<div>
															<p>Garrafas usadas:</p>
															<h3>${
																listaGarrafas.join(' | ')
															}</h3>
														</div>
														<div>
															<p>Sobra:</p>
															<h3>${
																totalGarrafasUsadas - volumeGalao
															}</h3>
														</div>`;
		resultado.appendChild(resposta);
	}

	novoCalculo.classList.remove('novoCalculo');
}

novoCalculo.onclick = () => location.reload();