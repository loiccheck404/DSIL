const loginButton = document.getElementById("loginbtn");
const orderNowButton = document.getElementById("orderbtn");
const viewAllButtons = document.querySelector(".view-all");
const showMoreButtons = document.querySelector(".show-more-btn");

loginButton.addEventListener("click", function () {
  alert("Login button clicked");
});

orderNowButton.addEventListener("click", function () {
  prompt("Enter what you want to buy");
});

viewAllButtons.addEventListener("click", function () {
  alert("showing all");
});

showMoreButtons.addEventListener("click", function () {
  let yes = prompt("You pressed me?");
  if (yes === "") {
    ("enter something stupid");
  } else alert("good boy");
});
