const navButton = document.querySelector(".nav-button");
const navOpen = document.querySelector(".nav-open");
const navOpenLinks = document.querySelectorAll(".nav-open li");

const tl = gsap.timeline().pause().reversed(true);
tl.to(".cover", 1, { width: "60%", ease: Power2.easeOut })
	.to("nav", 1, { height: "100%", ease: Power2.easeOut }, "-=0.5")
	.fromTo(
		".nav-open",
		0.5,
		{ opacity: 0, x: 50, ease: Power2.easeOut },
		{
			opacity: 1,
			x: 0,
			onComplete: () => {
				navOpen.style.pointerEvents = "auto";
			}
		}
	)
	.to(".cover-name", 0.25, { opacity: 0, ease: Power2.easeOut }, "-=1.5");

navOpenLinks.forEach(value => {
	tl.fromTo(
		value,
		0.2,
		{ display: "none", x: 50, ease: Power2.easeOut },
		{ display: "inherit", x: 0, ease: Power2.easeOut }
	);
});
navButton.addEventListener("click", e => {
	if (tl.isActive()) {
		e.preventDefault();
		e.stopImmediatePropagation();
		return false;
	}
	toggleTween(tl);
});

function toggleTween(tween) {
	tween.reversed() ? tween.play() : tween.reverse();
}
