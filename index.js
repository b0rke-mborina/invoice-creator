// set desired vars
const currency = "€"; // $, kn
const paymentMethods = [
	"cash",
	"credit card",
	"PayPal"
];
const services = [
	{
		name: "Wash car",
		price: "10"
	},
	{
		name: "Mow lawn",
		price: "20"
	},
	{
		name: "Pull weeds",
		price: "30"
	}
];
let invoiceItems = [];

// save elements
let servicesEl = document.getElementById("services");
let emptyMsgEl = document.getElementById("empty-msg");
let itemsEl = document.getElementById("invoice-items");
let notesEl = document.getElementById("notes");
let totalPriceEl = document.getElementById("total-price");
let sendBtn = document.getElementById("send-btn");

// setup onload state
window.onload = function() {
	invoiceItems = JSON.parse(localStorage.getItem("invoiceItems")) || [];
	loadServices();
	loadEmptyInvoiceList();
	if (invoiceItems.length > 0) {
		loadItems();
		emptyMsgEl.style.display = "none";
	}
	loadNotes();
	loadTotalPrice();
};

// define what to do on send
sendBtn.addEventListener("click", () => {
	loadServices();
	loadEmptyInvoiceList();
	invoiceItems = [];
	loadNotes();
	loadTotalPrice();
});

// define what to do on reload
window.onbeforeunload = function(event) {
	localStorage.setItem("invoiceItems", JSON.stringify(invoiceItems));
}

// add event listeners to dynamically added elements: service buttons and remove buttons
for (let i = 0; i < services.length; i++) {
	document.body.addEventListener("click", function(event) {
		if (event.target.id === `service-${i}`) {
			let itemInInvoiceItems = invoiceItems.filter(item => item.name === services[i].name);
			if (itemInInvoiceItems.length === 0) {
				invoiceItems.push({
					name: services[i].name,
					price: services[i].price
				});
				loadItems();
				emptyMsgEl.style.display = "none";
				loadTotalPrice();
			}
		};
		if (event.target.id === `remove-btn-${i}`) {
			invoiceItems = invoiceItems.filter(item => item !== invoiceItems[i]);
			loadItems();
			invoiceItems.length === 0 ? emptyMsgEl.style.display = "block" : null;
			loadTotalPrice();
		};
	});
}

// loads services buttons
function loadServices() {
	while (servicesEl.firstChild) {
		servicesEl.removeChild(servicesEl.firstChild);
	}
	let serviceBtn = null;
	services.forEach(service => {
		serviceBtn = document.createElement("button");
		serviceBtn.id = "service-" + services.indexOf(service);
		serviceBtn.classList.add("service-btn");
		serviceBtn.textContent = `${service.name}: ${currency}${service.price}`
		servicesEl.appendChild(serviceBtn);
	});
}

// loads empty invoice list and message
function loadEmptyInvoiceList() {
	while (itemsEl.firstChild) {
		itemsEl.removeChild(itemsEl.firstChild);
	}
	emptyMsgEl.style.display = "block";
}

// loads invoice items
function loadItems() {
	while (itemsEl.firstChild) {
		itemsEl.removeChild(itemsEl.firstChild);
	}
	invoiceItems.forEach(item => {
		itemsEl.innerHTML += `
			<div id="invoice-item-${services.indexOf(item)}" class="invoice-item">
				<div>
					<span class="item-name">${item.name}</span>
					<button id="remove-btn-${invoiceItems.indexOf(item)}" class="remove-btn">Remove</button>
				</div>
				<div class="right">
					<span class="item-currency">${currency}</span>
					<span class="item-price">${item.price}</span>
				</div>
			</div>
		`
	});
}

// loads notes
function loadNotes() {
	let lastArrayEl = paymentMethods.pop();
	notesEl.textContent = `We accept ${paymentMethods.join(", ")}, or ${lastArrayEl}`;
	paymentMethods.push(lastArrayEl);
}

// keeps total price updated
function loadTotalPrice() {
	let totalPrice = 0;
	invoiceItems.forEach(item => {
		totalPrice += Number(item.price);
	});
	totalPriceEl.textContent = currency + " " + totalPrice;
}
