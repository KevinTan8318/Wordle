const clickSound = new Audio("Sounds/click.mp3");
const allButtons = document.querySelectorAll("button");

allButtons.forEach((button) => {
  button.addEventListener("click", () => {
    clickSound.currentTime = 0;
    clickSound.play();
  });
});
