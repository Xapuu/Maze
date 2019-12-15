var hoverText = document.getElementById("hover");
var button = document.getElementById("button");
var textInput = document.getElementById("textI");
var resultBox = document.getElementById("id");

hoverText.addEventListener("mouseover", () => {
    resultBox.innerHTML = 'You hovered the first box.';
})

button.addEventListener("click", () => {
    resultBox.innerHTML = 'You clicked the second box.';
})

textInput.addEventListener("keypress", () => {
    resultBox.innerHTML = 'You are typing in the third box.';
})