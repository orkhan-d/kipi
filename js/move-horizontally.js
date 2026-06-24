const banner = document.querySelector('.banner');
const kipi = document.querySelector('.banner .kipi');

const bannerRect = banner.getBoundingClientRect();
const kipiRect = kipi.getBoundingClientRect();

let posX = kipi.clientWidth / 2;
let posY = -kipi.clientHeight / 2;
let vx = 0, vy = 0;

kipi.style.bottom = `${posY}px`;

const maxSpeed = 3;    // Максимальная скорость элемента
const friction = 0.98; // Трение (замедление), чтобы движение не было безумным
const impulse = 0.2;   // Сила случайного толчка на каждом кадра

let isShowing = false; // иногда надо и показать себя красивого:)


const moveKipi = () => {
	// Если прыжка нет, рассчитываем обычное хаотичное движение
	if (!isShowing) {
		const angle = Math.random() * Math.PI * 2;
		const direction = Math.sin(angle) > 0 ? 1 : -1;
		
		vx += direction * impulse;
		
		// Ограничение обычной скорости
		const currentSpeed = Math.sqrt(vx * vx + vy * vy);
		if (currentSpeed > maxSpeed) {
			vx = (vx / currentSpeed) * maxSpeed;
		}
		
		// Применяем трение среды
		vx *= friction;
		
		// Изменяем координаты
		posX += vx;
		
		const maxLeft = bannerRect.width - kipiRect.width;
		
		// Отскок от границ (физика столкновений)
		if (posX < 0) {
			posX = 0; vx *= -1;
		}
		if (posX > maxLeft) {
			posX = maxLeft; vx *= -1;
		}
	} else {
		posY += vy;

		if (posY > 0) {
			posY = 0;
			vy = 0;
		}
		
		if (posY < -kipi.clientHeight / 2) {
			posY = -kipi.clientHeight / 2;
			vy = 0;
		}
	}
	
	kipi.style.transform = 'none';
	kipi.style.left = `${posX}px`;
	kipi.style.bottom = `${posY}px`;
	
	requestAnimationFrame(moveKipi);
}


const showKipi = () => {
	const randomDelay = Math.random() * (6000 - 3000) + 3000;
	
	setTimeout(() => {
		isShowing = true;
		vx = 0;
		
		setTimeout(() => {
			vy = 5;
			
			setTimeout(() => {
				vy = -5;
				
				setTimeout(() => {
					isShowing = false;
					showKipi();
				}, 600);
				
			}, 2500);
		}, 600);
	}, randomDelay);
}

window.addEventListener('DOMContentLoaded', () => {
	kipi.style.transform = 'none';
	moveKipi();
	showKipi();
});