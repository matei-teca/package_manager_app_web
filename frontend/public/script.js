let rootEl;

const formStructure = () => {
    return `
    <form>
  <label for="fname">First name:</label><br>
  <input type="text" id="fname" name="fname"><br>
  <label for="lname">Last name:</label><br>
  <input type="text" id="lname" name="lname">
    </form>
    `
}

const displayForm = () => {
    rootEl = document.getElementById("root");
    rootEl.insertAdjacentHTML("beforeend", formStructure());
}

const loadEvent = _ => {
    displayForm();
};

window.addEventListener("load", loadEvent);
