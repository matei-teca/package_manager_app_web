let rootEl;
let packageSchema;
let datalistEl;
let getFlag = true;

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

       
        <input list="dependenciesListVisible" id="dependencySearchInput" type="text" placeholder="dependency search">


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

const createDataList = () => {
    const parentEl = document.getElementById("pckgDependenciesCont");
    datalistEl = document.createElement("datalist");
    datalistEl.id = "dependenciesListVisible"

    parentEl.appendChild(datalistEl);
}

const displayForm = () => {
    rootEl = document.getElementById("root");
    rootEl.insertAdjacentHTML("beforeend", formStructure());

    createDataList();
}

const changeForm = () => {
    const nameInputEl = document.getElementById("nameInput");
    const detailsInputEl = document.getElementById("detailsInput");
    const dependencySearchInputEl = document.getElementById("dependencySearchInput");

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
    
    detailsInputEl.addEventListener("input", (e) => {
        packageSchema.description = e.target.value;

        console.log(packageSchema);
    })

    // dependencySearchInputEl.addEventListener("input", (e) => {
    //     let currValue = e.target.value;
    //     datalistEl = document.getElementById("dependenciesList");

    //     if(currValue.length > 2){
    //         console.log("works");
    //         // datalistEl.id = "dependenciesListVisible";
    //         getFlag = true;
    //     } 
        
    //     // if (currValue.length <= 2){
    //     //     datalistEl.id = "dependenciesList";
    //     // }
    // })

    dependencySearchInputEl.addEventListener("input", (e) => {
        let currValue = e.target.value;
        if(currValue.length > 2 && getFlag){

            getDependencies();
            getFlag = false;
        }

        if(currValue.length > 2){
            datalistEl.id = "dependenciesListVisible";
        } else {
            datalistEl.id = "dependenciesListHidden"
        }


    })
}

const getDependencies = () => {

    fetch("/api/package/")
    .then(res => res.json())
    .then(data => dependenciesInput(data));

}

const dependenciesInput = (data) => {

    data.map((el) => {
        console.log(el);

        let dependencyListEl = document.createElement("option");
        dependencyListEl.value = el;
        datalistEl.appendChild(dependencyListEl);
    });
}

const loadEvent = _ => {
    displayForm();
    changeForm();
};

window.addEventListener("load", loadEvent);
