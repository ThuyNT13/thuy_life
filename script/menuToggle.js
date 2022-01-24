// Used to toggle the menu on small screens when clicking on the menu button
function toggleFunction() {
    const elementObj = document.getElementById("navDemo");

    if (elementObj.className.indexOf("show") == -1) {
      elementObj.className += " show";
    } else {
      elementObj.className = elementObj.className.replace(" show", "");
    }
}
