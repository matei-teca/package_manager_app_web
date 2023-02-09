let rootEl;
let packageSchema;
let datalistEl;
let getFlag = true;
let addedDependencyEl;
let currValue;
let fetchedData;
let currOptionIndex;
let dataToDisplay;

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

        <div id="dependencyItemsContainer">
        <div class="dependencyItem">
            <div class="dependencySubItem dependencyItemBttn">x</div>
            <div class="dependencySubItem">Enzyme</div>
            <div class="dependencySubItem">5.12.0</div>
        </div>

        <div class="dependencyItem">
            <div class="dependencySubItem dependencyItemBttn">x</div>
            <div class="dependencySubItem">Enzyme</div>
            <div class="dependencySubItem">5.12.0</div>
        </div>

        <div id="dependencyA" class="dependencyItem">
            <div id="dependencyA_bttn" class="dependencySubItem dependencyItemBttn">x</div>
            <div id="dependencyA_name" class="dependencySubItem">Enzyme</div>
            <div id="dependencyA_version" class="dependencySubItem">5.12.0</div>
        </div>
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

// Inserting datalist to formStrucutre()
const createDataList = () => {
    const parentEl = document.getElementById("pckgDependenciesCont");
    datalistEl = document.createElement("datalist");
    datalistEl.id = "dependenciesListVisible";

    parentEl.appendChild(datalistEl);
}

// Fetching the items from pkgs.json via server.js
const getData = (useData1) => {

    fetch("/api/package/")
    .then(res => res.json())
    .then(data => {
        fetchedData = data;
        useData1(); 
    });

}

//useData1()
const createDependencyOptions = () => {

    console.log(fetchedData);
    dataToDisplay = fetchedData.packages.map((item) => {return {name: item.name, version: item.releases[0].version}});

    dataToDisplay.map((el) => {
        console.log(el);

        let dependencyListEl = document.createElement("option");
        dependencyListEl.value = `${el.name} (versionnn ${el.version})`;
        datalistEl.appendChild(dependencyListEl);

    });
}

//Store the (package schema) object in a global variable
const storePackageSchema = () => {
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
}

// Form events 
const changeForm = () => {
    const nameInputEl = document.getElementById("nameInput");
    const detailsInputEl = document.getElementById("detailsInput");
    const dependencySearchInputEl = document.getElementById("dependencySearchInput");

    nameInputEl.addEventListener("input", (e) => {
        packageSchema.name = e.target.value;

        console.log(packageSchema);
    })
    
    detailsInputEl.addEventListener("input", (e) => {
        packageSchema.description = e.target.value;

        console.log(packageSchema);
    })

    dependencySearchInputEl.addEventListener("input", (e) => {
        currValue = e.target.value;
        if(currValue.length > 2 && getFlag){

            getData(createDependencyOptions);
            getFlag = false;
        }

        if(currValue.length > 2){
            datalistEl.id = "dependenciesListVisible";
        } else {
            datalistEl.id = "dependenciesListHidden"
        }

        // console.log(currValue);
        
        datalistListEvent(currValue);

    })
}
const datalistListEvent = (currValue) => {
    let options = datalistEl.childNodes;

    for(var i = 0; i < options.length; i++) {
      if(options[i].value === currValue) {
        // alert('item selected: ' + currValue);

        currOptionIndex = i;
        addedDependencyContent();

        break;
      }
    }

    // options.map((el, i) => {console.log(options[i])})
}
const addedDependencyContent = (el) => {
        let dependencyItemsContainerEl = document.getElementById("dependencyItemsContainer");
        
        let dataToDisplayB = dataToDisplay[currOptionIndex];
        console.log(dataToDisplayB);

        addedDependencyEl = `
        <div class="dependencyItem">
            <div class="dependencySubItem dependencyItemBttn">x</div>
            <div class="dependencySubItem">${dataToDisplayB.name}</div>
            <div class="dependencySubItem">${dataToDisplayB.version}</div>
        </div>`;

        dependencyItemsContainerEl.insertAdjacentHTML("beforeend", addedDependencyEl);

}

// Inserting ALL created html elements into rootDiv of index.html
const displayForm = () => {
    rootEl = document.getElementById("root");
    rootEl.insertAdjacentHTML("beforeend", formStructure());

    createDataList();
}

//loadEvent
const loadEvent = _ => {
    storePackageSchema();
    displayForm();
    changeForm();
};

window.addEventListener("load", loadEvent);





