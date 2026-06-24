const banner = document.querySelector('.banner');
const kipi = document.querySelector('.banner .kipi');

const bannerRect = banner.getBoundingClientRect();
const kipiRect = kipi.getBoundingClientRect();

let posX = banner.clientWidth / 2 - kipi.clientWidth / 2;
let posY = banner.clientHeight / 2 - kipi.clientHeight / 2
let vx = 0, vy = 0;

const maxSpeed = 3;    // Максимальная скорость элемента
const friction = 0.98; // Трение (замедление), чтобы движение не было безумным
const impulse = 0.2;   // Сила случайного толчка на каждом кадра

let isJumping = false; // иногда надо и прыгать:)

let currentEmotion = 'angry';
const emotions = ['calm', 'angry', 'sad', 'lovely'];


const moveKipi = () => {
	// Если прыжка нет, рассчитываем обычное хаотичное движение
	if (!isJumping) {
		const angle = Math.random() * Math.PI * 2;
		vx += Math.cos(angle) * impulse;
		vy += Math.sin(angle) * impulse;
		
		// Ограничение обычной скорости
		const currentSpeed = Math.sqrt(vx * vx + vy * vy);
		if (currentSpeed > maxSpeed) {
			vx = (vx / currentSpeed) * maxSpeed;
			vy = (vy / currentSpeed) * maxSpeed;
		}
	}
	
	// Применяем трение среды
	vx *= friction;
	vy *= friction;
	
	// Изменяем координаты
	posX += vx;
	posY += vy;
	
	const maxLeft = bannerRect.width - kipiRect.width;
	const maxTop = bannerRect.height - kipiRect.height;
	
	// Отскок от границ (физика столкновений)
	if (posX < 0) {
		posX = 0; vx *= -1;
	}
	if (posX > maxLeft) {
		posX = maxLeft; vx *= -1;
	}
	if (posY < 0) {
		posY = 0; vy *= -1;
	}
	if (posY > maxTop) {
		posY = maxTop; vy *= -1;
	}
	
	kipi.style.transform = 'none';
	kipi.style.left = `${posX}px`;
	kipi.style.top = `${posY}px`;
	
	requestAnimationFrame(moveKipi);
}


const jumpKipi = () => {
	const randomDelay = Math.random() * (10000 - 5000) + 5000;
	
	setTimeout(() => {
		isJumping = true;
		vx = 0; // Останавливаем движение по горизонтали для четкости прыжка
		vy = 0;
		
		setTimeout(() => {
			switchEmotion();
			
			vy = -4; // Резко задаем скорость вверх (минус означает движение к верхнему краю)
			
			setTimeout(() => {
				vy = 4;
				
				setTimeout(() => {
					vy = -4;
					
					setTimeout(() => {
						vy = 4;
						
						setTimeout(() => {
							vy = 0;
							
							setTimeout(() => {
								isJumping = false;
								jumpKipi();
							}, 600);
							
						}, 250);
						
					}, 250);
					
				}, 250);
			}, 250);
		}, 600);
	}, randomDelay);
}


const switchEmotion = () => {
	const newEmotions = emotions.filter((e) => e !== currentEmotion);
	const newEmotion = newEmotions[Math.floor(Math.random() * newEmotions.length)];
	
	kipi.querySelector(`.kipi-eyes-${currentEmotion}`).classList.remove('kipi-eyes-active');
	
	currentEmotion = newEmotion;
	banner.style.background = `var(--${newEmotion})`;
	
	kipi.querySelector(`.kipi-eyes-${currentEmotion}`).classList.add('kipi-eyes-active');
}


const incrementValues = () => {
	const cards = document.querySelectorAll(".to-increment");
	
	// for slowing on reaching
	const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
	
	const animateValue = (element) => {
		const originalText = element.textContent.trim();
		const targetValue = parseInt(originalText.replace(/\D/g, ""), 10);
		if (isNaN(targetValue)) return;
		
		const duration = 2000;
		let startTime = null;
		
		const updateCounter = (currentTime) => {
			if (!startTime) {
				startTime = currentTime
			}
			const elapsedTime = currentTime - startTime;
			
			// Calculate progress percentage (clamped between 0 and 1)
			const progress = Math.min(elapsedTime / duration, 1);
			
			// Apply the ease-out smoothing curve to our progress calculation
			const easedProgress = easeOutCubic(progress);
			const currentValue = Math.floor(easedProgress * targetValue);
			
			if (progress < 1) {
				// Keep animating if duration hasn't finished
				element.textContent = originalText.replace(/\d+/, currentValue);
				requestAnimationFrame(updateCounter);
			} else {
				// Enforce precision finish and matching text layout structure
				element.textContent = originalText;
			}
		};
		
		// Begin the animation frame loop
		requestAnimationFrame(updateCounter);
	};
	
	const observer = new IntersectionObserver((entries, observerInstance) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				animateValue(entry.target);
				
				// Stop observing this element so the animation only runs once
				observerInstance.unobserve(entry.target);
			}
		});
	}, {
		threshold: 0.1 // Triggers when 10% of the element visibility is reached
	});
	
	// Attach the scroll observer to every card value
	cards.forEach(card => observer.observe(card));
}


window.addEventListener('DOMContentLoaded', () => {
	kipi.style.transform = 'none';
	moveKipi();
	jumpKipi();
	incrementValues();
});