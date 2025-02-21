const swiper = new Swiper('.swiper', {
		loop: true,
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		},
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
	});

const KEY_LOGIN = 'gloDeliveryLogin';

const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");

const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeAuth = document.querySelector('.close-auth');
const logInForm = document.querySelector('#logInForm');
const loginInput = document.querySelector('#login');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const loginForm = document.getElementById("logInForm");
const passwordInput = document.getElementById("password");

const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');

const restaurantTitle = document.querySelector('.restaurant-title')
const restaurantRating = document.querySelector('.rating')
const restaurantPrice = document.querySelector('.price')
const restaurantCategory = document.querySelector('.category')

const inputSearch = document.querySelector('.input-address');
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag');
const buttonClearCard = document.querySelector('.clear-cart');


let login = localStorage.getItem(KEY_LOGIN);
const cart = JSON.parse(localStorage.getItem(`${KEY_LOGIN}_${login}`)) || [];


function saveCart() {
	localStorage.setItem(`${KEY_LOGIN}_${login}`, JSON.stringify(cart));
}

function downloadCart() {
	const data = JSON.parse(localStorage.getItem(`${KEY_LOGIN}_${login}`));
	if (data) {
		cart.push(...data);
	}
}

const getData = async function(url) {
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Помилка по адресу ${url}, 
		статус помилки ${response.status}!`)
	}

	return await response.json();
}

function validName (str) {
	const regName = /^[a-zA-Z0-9-_\.]{3,20}$/;
	return regName.test(str);
}

function toggleModal() {
	modal.classList.toggle("is-open");
}

function toggleModalAuth() {
	modalAuth.classList.toggle('is-open');
	loginInput.style.borderColor = '';
	passwordInput.style.borderColor = '';
	if (modalAuth.classList.contains('is-open')) {
		disableScroll();
	}
	else {
		enableScroll();
	}
}

function returnMain() {
	containerPromo.classList.remove('hide');
	restaurants.classList.remove('hide');
	menu.classList.add('hide');
}

function authorized() {
	console.log("Авторизован");

	function logOut() {
		login = null;
		cart.length = 0;
		localStorage.removeItem(KEY_LOGIN);
		buttonAuth.style.display = '';
		userName.style.display = '';
		buttonOut.style.display = '';
		cartButton.style.display = '';
		buttonOut.removeEventListener('click', logOut);
		returnMain();
		checkAuth();
	}

	userName.textContent = login;

	buttonAuth.style.display = 'none';
	userName.style.display = 'inline';
	buttonOut.style.display = 'flex';
	cartButton.style.display = 'flex';

	buttonOut.addEventListener('click', logOut);
}

function notAuthorized() {
	console.log("Не авторизован");

	function logIn(event) {
		event.preventDefault();
		if (validName(loginInput.value.trim())) {
			login = loginInput.value;
			localStorage.setItem(KEY_LOGIN, login);
			toggleModalAuth();
			downloadCart();
			buttonAuth.removeEventListener('click', toggleModalAuth);
			closeAuth.removeEventListener('click', toggleModalAuth);
			logInForm.removeEventListener('submit', logIn);
			modalAuth.removeEventListener('click', closeModalAuth);
			logInForm.reset();
			checkAuth();
		}
		else {
			loginInput.style.borderColor = '#f00';
			loginInput.value = '';
		}
	}

	loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const login = loginInput.value.trim();
        const password = passwordInput.value.trim();

        if (!login || !password) {
            if (!login) loginInput.style.borderColor = "red";
            if (!password) passwordInput.style.borderColor = "red";
            alert("Будь ласка, заповніть усі поля.");
        } else {
            localStorage.setItem("login", login);
            displayLoggedIn(login);
            closeModal();
        }
    });


	function closeModalAuth(event) {
		if (event.target.classList.contains('is-open')) {
			toggleModalAuth();
		}
	}

	buttonAuth.addEventListener('click', toggleModalAuth);
	closeAuth.addEventListener('click', toggleModalAuth);
	logInForm.addEventListener('submit', logIn);
	modalAuth.addEventListener('click', closeModalAuth);
}

function checkAuth() {
	if (login) {
		authorized();
	}
	else {
		notAuthorized();
	}
}

function createCardRestaurant(restaurant) {
	const { 
		image, 
		kitchen, 
		name, 
		price, 
		stars, 
		products, 
		time_of_delivery: timeOfDelivery
	} = restaurant;

	const cardsRestaurant = document.createElement('a');
	cardsRestaurant.className = 'card card-restaurant';
	cardsRestaurant.products = products;
	cardsRestaurant.info = { kitchen, name, price, stars };
	
	const card = `
		<img src=${image} alt="image" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title">${name}</h3>
				<span class="card-tag tag">${timeOfDelivery} хвилин</span>
			</div>
			<div class="card-info">
				<div class="rating">
					${stars}
				</div>
				<div class="price">От ${price} ₴</div>
				<div class="category">${kitchen}</div>
			</div>
		</div>
  	`;

	cardsRestaurant.insertAdjacentHTML('beforeend', card);
	cardsRestaurants.insertAdjacentElement('beforeend', cardsRestaurant);
}

function createCardGood(goods) {
	const { 
		description,
		id,
		image,
		name,
		price 
	 } = goods;

	const card = document.createElement('div');
	card.className = 'card';
	card.id = id; 
	const innerHTML = `
		<img src=${image} alt=${name} class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В кошик</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price card-price-bold">${price} ₴</strong>
			</div>
		</div>
	`;
	card.insertAdjacentHTML('beforeend', innerHTML);
	cardsMenu.insertAdjacentElement('beforeend', card);
}

function openGoods(event) {
	const target = event.target;
	if (!login) {
		toggleModalAuth();
	}
	else {
		const restaurant = target.closest('.card-restaurant');
		if (restaurant) {
			cardsMenu.textContent = '';	
			containerPromo.classList.add('hide');
			restaurants.classList.add('hide');
			menu.classList.remove('hide');

			const { kitchen, name, price, stars } = restaurant.info;
			restaurantTitle.textContent = name;
			restaurantRating.textContent = stars;
			restaurantPrice.textContent = `От ${price} ₴`;
			restaurantCategory.textContent = kitchen;

			getData(`./db/${restaurant.products}`).then(function(data) {
				data.forEach(createCardGood);
			});
		}
	}
}

function addToCart (event) {
	const target = event.target;
	const buttonAddToCart = target.closest('.button-add-cart');
	if (buttonAddToCart) {
		const card = target.closest('.card');
		const title = card.querySelector('.card-title-reg').textContent;
		const cost = card.querySelector('.card-price').textContent;
		const id = card.id;
		
		const food = cart.find(function(item){
			return item.id === id
		});
		if (food) {
			++food.count;
		}
		else {
			cart.push( { id, cost, title, count: 1} );
		}
	}
	saveCart();
}

function renderCart() {
	modalBody.textContent = '';

	cart.forEach(function( { id, title, cost, count } ) {
		const itemCart = `
		<div class="food-row">
			<span class="food-name">${title}</span>
			<strong class="food-price">${cost}</strong>
			<div class="food-counter">
				<button class="counter-button counter-minus" data-id=${id}>-</button>
				<span class="counter">${count}</span>
				<button class="counter-button counter-plus" data-id=${id}>+</button>
			</div>
		</div>		
		`;

		modalBody.insertAdjacentHTML('afterbegin', itemCart);
	});

	const totalPrice = cart.reduce(function(result, item) {
		return result + parseFloat(item.cost) * item.count;
	}, 0);
	modalPrice.textContent = totalPrice + ' ₴';
}

function changeCount(event) {
	const target = event.target;


	if (target.classList.contains('counter-button')) {
		const food = cart.find(function(item) {
			return item.id === target.dataset.id;
		});
		if (target.classList.contains('counter-minus')) {
			food.count--;
			if (food.count === 0) {
				cart.splice(cart.indexOf(food), 1);
			}
		}
		if (target.classList.contains('counter-plus')) {

			food.count++;
		}
		renderCart();
		saveCart();
	}
}

function liveSearch(event) {
    if (event.key === 'Enter') {
        const value = inputSearch.value.trim();

        if (!value) {
            inputSearch.style.backgroundColor = 'red';
            inputSearch.value = '';
            setTimeout(() => {
                inputSearch.style.backgroundColor = '';
            }, 1500);
            return;
        }

        getData('./db/partners.json')
            .then((data) => data.map((partner) => partner.products))
            .then((linkProduct) => {
                cardsMenu.textContent = '';

                linkProduct.forEach((link) => {
                    getData(`./db/${link}`).then((data) => {
                        const resultSearch = data.filter((item) => {
                            const name = item.name.toLowerCase();
                            return name.includes(value.toLowerCase());
                        });

                        containerPromo.classList.add('hide');
                        restaurants.classList.add('hide');
                        menu.classList.remove('hide');

                        restaurantTitle.textContent = 'Результат пошуку';
                        restaurantRating.textContent = '';
                        restaurantPrice.textContent = '';
                        restaurantCategory.textContent = 'Різна кухня';

                        resultSearch.forEach(createCardGood);
                    });
                });
            });
    }
}

inputSearch.addEventListener('keydown', liveSearch);

function init() {
	getData('./db/partners.json').then(function(data) {
		data.forEach(createCardRestaurant);
	});
	
	cartButton.addEventListener("click", function() {
		renderCart();
		toggleModal();
	});

	buttonClearCard.addEventListener('click', function(){
		cart.length = 0;
		renderCart();
	})

	modalBody.addEventListener('click', changeCount);

	cardsMenu.addEventListener('click', addToCart);
	
	close.addEventListener("click", toggleModal);
	
	cardsRestaurants.addEventListener('click', openGoods);
	
	logo.addEventListener('click', returnMain);
	
	checkAuth();

	inputSearch.addEventListener('keyup', liveSearch);
}

init();