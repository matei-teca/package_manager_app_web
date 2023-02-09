let rootEl;
let packageSchema;
let datalistEl;
let getFlag = true;
let addedDependencyEl;
let currValue;
let fetchedData;
let currOptionIndex;
let dataToDisplay;
let dataToDisplayB;

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
        <div id="dependecyId-1" class="dependencyItem">
            <div id="dependecyId-1Bttn" class="dependencySubItem dependencyItemBttn">x</div>
            <div class="dependencySubItem">Enzyme</div>
            <div class="dependencySubItem">5.12.0</div>
        </div>

        <div id="dependecyId-2" class="dependencyItem">
            <div id="dependecyId-2Bttn" class="dependencySubItem dependencyItemBttn">x</div>
            <div class="dependencySubItem">Enzyme</div>
            <div class="dependencySubItem">5.12.0</div>
        </div>

        <div id="dependecyId-3" class="dependencyItem">
            <div id="dependecyId-3Bttn" class="dependencySubItem dependencyItemBttn">x</div>
            <div class="dependencySubItem">Enzyme</div>
            <div class="dependencySubItem">5.12.0</div>
        </div>
        </div>
       
        <input list="dependenciesListVisible" id="dependencySearchInput" type="text" placeholder="dependency search">


    </div>

    <div class="section"> 
        <div class="title"> PACKAGE VERSIONS </div>

        <div id="versionB" class="versionItem">
            <div class="versionSubItem versionItemBttn">x</div>
            <div class="versionSubItem">1.18.2</div>
            <div class="versionSubItem">2022-03-01</div>
        </div>

        <div id="versionA" class="versionItem">
            <div class="versionSubItem versionItemBttn">x</div>
            <div class="versionSubItem">1.18.3</div>
            <div class="versionSubItem">2022-03-01</div>
        </div>

        <div id="addNewVersion" class="versionItem">
            <div id="addNewVersionBttn" class="versionSubItem versionItemBttn">+</div>
            <div class="versionSubItem">ADD NEW VERSION</div>
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

    dataToDisplay = fetchedData.packages.map((item) => {return {name: item.name, version: item.releases[0].version, id: item.id}});

    dataToDisplay.map((el) => {

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
    })
    
    detailsInputEl.addEventListener("input", (e) => {
        packageSchema.description = e.target.value;
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

    deleteSelectedDependency();
}
const datalistListEvent = () => {
    let options = datalistEl.childNodes;

    Array.prototype.map.call(options, (el, i) => {
        if(options[i].value === currValue) {
                // alert('item selected: ' + currValue);
        
                currOptionIndex = i;
                displaySelectedDependency();
                updatePackageDependencies();
                deleteSelectedDependency();

                console.log(packageSchema);

        return;
        }
    })
}
const displaySelectedDependency = (el) => {
        let dependencyItemsContainerEl = document.getElementById("dependencyItemsContainer");
        
        dataToDisplayB = dataToDisplay[currOptionIndex];

        addedDependencyEl = `
        <div id="dependecyId${dataToDisplayB.id}" class="dependencyItem">
            <div id="dependecyId${dataToDisplayB.id}Bttn" class="dependencySubItem dependencyItemBttn">x</div>
            <div class="dependencySubItem">${dataToDisplayB.name}</div>
            <div class="dependencySubItem">${dataToDisplayB.version}</div>
        </div>`;

        dependencyItemsContainerEl.insertAdjacentHTML("beforeend", addedDependencyEl);
        // dependencyBttns = document.querySelectorAll(".dependencyItemBttn");
        // dependencyItems = document.querySelectorAll(".dependencyItem");

}

const updatePackageDependencies = () => {
    packageSchema.dependencies.push(dataToDisplayB.id)
}

const deleteSelectedDependency = () => {

    let dependencyBttns = document.querySelectorAll(".dependencyItemBttn");
    let dependencyItems = document.querySelectorAll(".dependencyItem");
    
    Array.prototype.map.call(dependencyBttns, (bttn) => {

        bttn.addEventListener("click", function(){
            
            Array.prototype.map.call(dependencyItems, (item) => {

                if(bttn.id === item.id + 'Bttn'){

                    //removes the package visually
                    let itemEl = document.getElementById(item.id);
                    itemEl.style.display = "none";

                    //removes the package from the dependency object
                    let dependencyId = item.id.split("dependecyId")[1];
                    const index = packageSchema.dependencies.indexOf(Number(dependencyId));

                    if (index > -1) { // only splice array when item is found
                        packageSchema.dependencies.splice(index, 1);
                    }
    
                    console.log(packageSchema);
                }

            })
        })

    })

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





