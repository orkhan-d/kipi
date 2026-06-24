let modalOpen = false;

const modalWrapper = document.querySelector('.modal-wrapper');
const body = document.body;

const showModal = () => {
	modalOpen = true;
	modalWrapper.classList.add('modal-open');
	body.classList.add('modal-open');
}

const closeModal = () => {
	modalOpen = false;
	modalWrapper.classList.remove('modal-open');
	body.classList.remove('modal-open');
}