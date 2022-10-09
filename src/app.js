import './style.css';
import './style.css';
console.log(process.env.SECRET_NAME);

const form = document.querySelector('#formulaire');
const resultat = document.querySelector('#resultat');
const inputValue = document.querySelector('#input');
const paginateDIV = document.querySelector('#paginate');

let itemsPerPage = 40;
let totalPage = 0;
let iterate;
let actualPage = 1;

window.onload = () => {
	form.addEventListener('submit', handleSubmit);
	displayResult();
};

function handleSubmit(e) {
	e.preventDefault();

	const resultInput = inputValue.value;

	if (resultInput === '') {
		alertMessage('Attention votre recherche est vide');
		return;
	}

	searchTerm(resultInput);
}

function alertMessage(message) {
	const alertMessage = document.querySelector('.bg-red-100');

	if (!alertMessage) {
		const alert = document.createElement('p');

		alert.classList.add(
			'bg-red-100',
			'border-red-400',
			'text-red-700',
			'px-4',
			'py-3',
			'rounded',
			'max-w-lg',
			'mx-auto',
			'mt-6',
			'text-center'
		);

		alert.innerHTML = `
    <strong class="font-bold">Erreur!</strong>
    <span class="block sm:inline">${message}!</span>
    `;

		form.appendChild(alert);

		setTimeout(() => {
			form.removeChild(alert);
		}, 2000);
	}
}

function searchTerm() {
	const url = `https://pixabay.com/api/?key=${process.env.SECRET_KEY}&q=${inputValue.value}&per_page=${itemsPerPage}&page=${actualPage}`;
	apiFetch(url);
}

function apiFetch(url) {
	fetch(url)
		.then((response) => response.json())
		.then((result) => {
			totalPage = calculatePaginate(result.totalHits);
			displayResult(result.hits);
		});
}

function displayResult(result = []) {
	while (resultat.firstChild) {
		resultat.removeChild(resultat.firstChild);
	}

	result.forEach((image) => {
		const { previewURL, likes, views, largeImageURL } = image;

		resultat.innerHTML += `
		<div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
		<div class="bg-white">
			<img class="w-full" src="${previewURL}" />
			<div class="p-4">
			<p class="font-bold">${likes} <span class="font-light">❤️</span>  </p>
			<p class="font-bold">${views} <span class="font-light">Views</span>  </p>

			<a class="w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
			Large Image
			</a>


			</div>
		</div>
		</div>

		`;
	});

	while (paginateDIV.firstChild) {
		paginateDIV.removeChild(paginateDIV.firstChild);
	}

	pageIterate();
}

function calculatePaginate(total) {
	return parseInt(Math.ceil(total / itemsPerPage));
}

function* createPaginate(total) {
	console.log(total);
	for (let i = 1; i <= total; i++) {
		yield i;
	}
}

function pageIterate() {
	iterate = createPaginate(totalPage);
	while (true) {
		const { value, done } = iterate.next();
		if (done) return;

		const button = document.createElement('a');
		button.href = '#';
		button.dataset.pages = value;
		button.textContent = value;
		button.classList.add(
			'siguiente',
			'bg-yellow-400',
			'px-4',
			'py-1',
			'mr-2',
			'font-bold',
			'mb-1',
			'uppercase',
			'rounded'
		);

		button.addEventListener('click', () => {
			actualPage = value;
			searchTerm();
		});

		paginateDIV.appendChild(button);
	}
}
