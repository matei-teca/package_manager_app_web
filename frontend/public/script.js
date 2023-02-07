let rootEl;
let packageSchema;

const formStructure = () => {
    return `
    <div id="formContainer">
    <form id="form1">

    <div id = "section1" class="section">
        <div id = "title1" class="title"> PACKAGE DETAILS </div>
        <input id="nameInput" type="text" placeholder="name">
        <textarea id="detailsInput" placeholder="details" ></textarea>
    </div>

    <div id = "pckgDependenciesCont" class="section"> 
        <div class="title"> PACKAGE DEPENDENCIES </div>

        <div id="dependencyC" class="dependencyItem">
            <div id="dependencyC_bttn" class="dependencySubItem dependencyItemBttn">x</div>
            <div id="dependencyC_name" class="dependencySubItem">Enzyme</div>
            <div id="dependencyC_version" class="dependencySubItem">5.12.0</div>
        </div>

        <div id="dependencyB" class="dependencyItem">
            <div id="dependencyB_bttn" class="dependencySubItem dependencyItemBttn">x</div>
            <div id="dependencyB_name" class="dependencySubItem">Enzyme</div>
            <div id="dependencyB_version" class="dependencySubItem">5.12.0</div>
        </div>

        <div id="dependencyA" class="dependencyItem">
            <div id="dependencyA_bttn" class="dependencySubItem dependencyItemBttn">x</div>
            <div id="dependencyA_name" class="dependencySubItem">Enzyme</div>
            <div id="dependencyA_version" class="dependencySubItem">5.12.0</div>
        </div>

       
        <input id="dependencySearchInput" type="text" placeholder="dependency search">

    </div>

    <div class="section"> 
        <div class="title"> PACKAGE VERSIONS </div>

        <div id="versionB" class="dependencyItem">
            <div class="dependencySubItem dependencyItemBttn">x</div>
            <div class="dependencySubItem">1.18.2</div>
            <div class="dependencySubItem">2022-03-01</div>
        </div>

        <div id="versionA" class="dependencyItem">
            <div class="dependencySubItem dependencyItemBttn">x</div>
            <div class="dependencySubItem">1.18.3</div>
            <div class="dependencySubItem">2022-03-01</div>
        </div>

        <div id="addNewVersion" class="dependencyItem">
            <div id="addNewVersionBttn" class="dependencySubItem dependencyItemBttn">+</div>
            <div class="dependencySubItem">ADD NEW VERSION</div>
        </div>
    </div>

    <div class="section">
        <button id="saveBttn" type="submit" form="form1" value="Submit">SAVE PACKAGE</button>
        <button id="deleteBttn" type="submit" form="form1" value="Delete">DELETE PACKAGE</button>
    </div>

    </form>
    </div>
    `
}

const displayForm = () => {
    rootEl = document.getElementById("root");
    rootEl.insertAdjacentHTML("beforeend", formStructure());
}

const changeForm = () => {
    const nameInputEl = document.getElementById("nameInput");
    const detailsInputEl = document.getElementById("detailsInput");

    packageSchema = {
        "id": 1,
        "name": "npm",
        "description": "",
        "dependencies": [],
        "releases": [
            {
                "date": "2022-06-01",
                "version": "8.12.0"
            },
            {
                "date": "2022-05-25",
                "version": "8.11.0"
            }
        ]
    };

    nameInputEl.addEventListener("input", (e) => {
        packageSchema.name = e.target.value;

        console.log(packageSchema);
    })
    
    detailsInput.addEventListener("input", (e) => {
        packageSchema.description = e.target.value;

        console.log(packageSchema);
    })
    

}

const loadEvent = _ => {
    displayForm();
    changeForm();
};

window.addEventListener("load", loadEvent);
