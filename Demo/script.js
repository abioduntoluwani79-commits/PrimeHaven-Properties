const iconLibrary = window.lucide;

function renderIcons() {
	if (iconLibrary) iconLibrary.createIcons();
}

renderIcons();

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {
	const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
	menuToggle.setAttribute("aria-expanded", String(!isOpen));
	menuToggle.setAttribute("aria-label", isOpen ? "Open menu" : "Close menu");
	navMenu.classList.toggle("is-open", !isOpen);
	menuToggle.innerHTML = `<i data-lucide="${isOpen ? "menu" : "x"}"></i>`;
	renderIcons();
});

navMenu.querySelectorAll("a").forEach((link) => {
	link.addEventListener("click", () => {
		navMenu.classList.remove("is-open");
		menuToggle.setAttribute("aria-expanded", "false");
		menuToggle.setAttribute("aria-label", "Open menu");
		menuToggle.innerHTML = '<i data-lucide="menu"></i>';
		renderIcons();
	});
});

document.querySelectorAll(".save-button").forEach((button) => {
	button.addEventListener("click", () => {
		const isSaved = button.classList.toggle("is-saved");
		button.setAttribute("aria-pressed", String(isSaved));
		button.setAttribute("aria-label", `${isSaved ? "Remove saved" : "Save"} ${button.getAttribute("aria-label").replace(/^(Save |Remove saved )/, "")}`);
	});
});

const searchForm = document.querySelector("#property-search");
const propertyCards = [...document.querySelectorAll(".property-card")];
const searchFeedback = document.querySelector("#search-feedback");
const noResults = document.querySelector("#no-results");

searchForm.addEventListener("submit", (event) => {
	event.preventDefault();
	const formData = new FormData(searchForm);
	const transaction = formData.get("transaction");
	const location = formData.get("location");
	const type = formData.get("type");
	let visibleCount = 0;

	propertyCards.forEach((card) => {
		const matches = (transaction === "all" || card.dataset.transaction === transaction)
			&& (location === "all" || card.dataset.location === location)
			&& (type === "all" || card.dataset.type === type);
		card.hidden = !matches;
		if (matches) visibleCount += 1;
	});

	noResults.hidden = visibleCount !== 0;
	searchFeedback.textContent = visibleCount
		? `${visibleCount} ${visibleCount === 1 ? "home" : "homes"} to explore`
		: "";
	document.querySelector("#properties").scrollIntoView({ behavior: "smooth", block: "start" });
});

const propertyDialog = document.querySelector("#property-dialog");
const dialogImage = document.querySelector("#dialog-image");

document.querySelectorAll(".view-property").forEach((button) => {
	button.addEventListener("click", () => {
		document.querySelector("#dialog-title").textContent = button.dataset.title;
		document.querySelector("#dialog-location").innerHTML = `<i data-lucide="map-pin"></i> ${button.dataset.location}`;
		document.querySelector("#dialog-price").textContent = button.dataset.price;
		document.querySelector("#dialog-features").textContent = button.dataset.features;
		document.querySelector("#dialog-description").textContent = button.dataset.description;
		dialogImage.src = button.dataset.image;
		dialogImage.alt = button.dataset.title;
		propertyDialog.showModal();
		renderIcons();
	});
});

document.querySelector(".dialog-close").addEventListener("click", () => propertyDialog.close());
propertyDialog.addEventListener("click", (event) => {
	if (event.target === propertyDialog) propertyDialog.close();
});

const testimonials = [...document.querySelectorAll(".testimonial-card")];
const testimonialCounter = document.querySelector("#testimonial-counter");
let testimonialIndex = 0;

function moveTestimonial(direction) {
	testimonialIndex = (testimonialIndex + direction + testimonials.length) % testimonials.length;
	testimonials.forEach((testimonial, index) => {
		testimonial.classList.toggle("is-active", index === testimonialIndex);
		testimonial.hidden = index !== testimonialIndex;
	});
	testimonialCounter.textContent = `0${testimonialIndex + 1} — 0${testimonials.length}`;
}

document.querySelector("#testimonial-prev").addEventListener("click", () => moveTestimonial(-1));
document.querySelector("#testimonial-next").addEventListener("click", () => moveTestimonial(1));

function updateTestimonialLayout() {
	testimonials.forEach((testimonial, index) => {
		testimonial.hidden = index !== testimonialIndex;
	});
}

window.addEventListener("resize", updateTestimonialLayout);
updateTestimonialLayout();
