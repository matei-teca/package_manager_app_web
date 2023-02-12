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

let objectGreatestPackageId;

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

        </div>
       
        <input list="dependenciesListVisible" id="dependencySearchInput" type="text" placeholder="dependency search">


    </div>

    <div id="pckgVersionsCont" class="section"> 
        <div class="title"> PACKAGE VERSIONS </div>

        <div id="versionItemsContainer">
            <div  id="versionId${packageSchema.releases[0].id}" class="versionItem">
                <div id="versionId${packageSchema.releases[0].id}Bttn" class="versionSubItem versionItemBttn">x</div>
                <div id="editableVersion${packageSchema.releases[0].id}" class="versionSubItem editableVersion" contenteditable="true">${packageSchema.releases[0].version}</div>
                <div id="editableVersionDate${packageSchema.releases[0].id}" class="versionSubItem editableVersionDate" contenteditable="true">${packageSchema.releases[0].date}</div>
            </div>
        </div>
        <div id="addNewVersion" class="versionItem">
        <div id="addVersionBttn" class="versionSubItem versionItemBttn">+</div>
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
const getData = (useData1, useData2) => {

    //WHY IS IT /api/package instead of /edit/package ?????

    fetch("/api/package/")
    .then(res => res.json())
    .then(data => {
        fetchedData = data;
        useData1(); 
        useData2(); 

        console.log(data)
    }); 

   
}

//useData1()
const getObjectGreatestPackageId = () => {
    objectGreatestPackageId = fetchedData.packages[fetchedData.packages.length-1].id;
    console.log(objectGreatestPackageId);
}

//useData2()
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
        "id": parseInt(objectGreatestPackageId + 1),
        "name": "placeholder",
        "description": "",
        "dependencies": [],
        "releases": [
            {
                "date": "2022-06-01",
                "version": "8.12.0",
                "id" : 1
            }
        ]
    };
}

// Form events 
const detailsEditor = () => {
    const nameInputEl = document.getElementById("nameInput");
    const detailsInputEl = document.getElementById("detailsInput");

    nameInputEl.addEventListener("input", (e) => {
        packageSchema.name = e.target.value;
    })
    
    detailsInputEl.addEventListener("input", (e) => {
        packageSchema.description = e.target.value;
    })
}

// Add Dependency part

const dependencyEditor = () => {

    const dependencySearchInputEl = document.getElementById("dependencySearchInput");

    dependencySearchInputEl.addEventListener("input", (e) => {
        currValue = e.target.value;
        if(currValue.length > 2 && getFlag){

            getData(getObjectGreatestPackageId, createDependencyOptions);
            getFlag = false;
        }

        if(currValue.length > 2){
            datalistEl.id = "dependenciesListVisible";
        } else {
            datalistEl.id = "dependenciesListHidden"
        }

        datalistListEvent(currValue);
    })

    deleteSelectedDependency();
}
const datalistListEvent = () => {
    let options = datalistEl.childNodes;
    const dependencySearchInputEl = document.getElementById("dependencySearchInput");

    Array.prototype.map.call(options, (el, i) => {
        if(options[i].value === currValue) {
                // alert('item selected: ' + currValue);
        
                currOptionIndex = i;
                displaySelectedDependency();
                updatePackageDependencies();
                deleteSelectedDependency();

                console.log(packageSchema);

                dependencySearchInputEl.value = "";

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
        
        let currDependency = document.getElementById(`dependecyId${dataToDisplayB.id}`)
        currDependency.scrollIntoView();

}
const updatePackageDependencies = () => {
    packageSchema.dependencies.push(dataToDisplayB.id)
}
const deleteSelectedDependency = () => {
    //if time => todo: 
    // bug when adding the same dependency multiple times, 
    // cannot delete && doesn't add to object

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
    
                    // console.log(packageSchema);
                }

            })
        })

    })

}

// Add Version part

const addVersionEditor = () => {
    let addVersionBttnEl = document.getElementById("addVersionBttn");
    let newVersionValue;
    let newDateValue;
    let newVersionId = 2;

    addVersionBttnEl.addEventListener("click", function(){
        getLatestVersion();
        updatePackageReleasesAKAVersions();
        displayNewVersion();
        newVersionId++;

        // console.log(packageSchema.releases)
    })

    const displayNewVersion = () => {
        const versionItemsContainerEl = document.getElementById("versionItemsContainer");

        let versionJSX = `
        <div id="versionId${newVersionId}" class="versionItem">
            <div id="versionId${newVersionId}Bttn" class="versionSubItem versionItemBttn">x</div>
            <div id="editableVersion${newVersionId}" class="versionSubItem editableVersion" contenteditable="true">${newVersionValue}</div>
            <div id="editableVersionDate${newVersionId}" class="versionSubItem editableVersionDate" contenteditable="true">${newDateValue}</div>
        </div>
        `

        versionItemsContainerEl.insertAdjacentHTML("afterbegin", versionJSX);

        let currVerionEl = document.getElementById(`versionId${newVersionId}`)
        currVerionEl.scrollIntoView();

        deleteSelectedVersion(newVersionId);
        changeAddedVersion();
    }

    const getLatestVersion = () => {
        newVersionValue = packageSchema.releases[0].version.split(".");
        newVersionValue[newVersionValue.length-1] = parseInt(newVersionValue[newVersionValue.length-1]);
        newVersionValue[newVersionValue.length-1] += 1;
        newVersionValue = newVersionValue.join(".");

        newDateValue = new Date();
        newDateValue = newDateValue.toISOString().substring(0, 10);
    }

    const updatePackageReleasesAKAVersions = () => {
        packageSchema.releases.unshift({"date": newDateValue, "version": newVersionValue, "id": newVersionId})

    }
    
    deleteSelectedVersion(newVersionId);
    changeAddedVersion();
}
const deleteSelectedVersion = (newVersionIndexParam) => {

    let versionBttns = document.querySelectorAll(".versionItemBttn");
    let versionItems = document.querySelectorAll(".versionItem");
    
    Array.prototype.map.call(versionBttns, (bttn) => {

        bttn.addEventListener("click", function(){
            
            Array.prototype.map.call(versionItems, (item) => {

                if(bttn.id === item.id + 'Bttn'){

                    //removes the version visually
                    let itemEl = document.getElementById(item.id);
                    itemEl.style.display = "none";

                    //removes the version from the releases object
                    let currItemId = item.id.split("versionId")[1];

                    packageSchema.releases.map(rItem => {

                        if(rItem.id == currItemId){

                            const index = packageSchema.releases.indexOf(rItem);

                            if (index > -1) { // only splice array when item is found
                                packageSchema.releases.splice(index, 1);
                            }
                        }
                    })
                }

            })
        })

    })

}
const changeAddedVersion = () => {

    let versionInputs = document.querySelectorAll(".editableVersion");
    let versionDateInputs = document.querySelectorAll(".editableVersionDate");
    let currInputIdInt;
    let currDateInputIdInt;

    // console.log("works");

    Array.prototype.map.call(versionInputs, input => {

        input.addEventListener("input", function(e) {

            currInputIdInt = parseInt(input.id.split("editableVersion")[1]);
            packageSchema.releases.map(item => {
                if (item.id === currInputIdInt){
                    item.version = input.innerText;
                }
            })

            console.log(packageSchema.releases);

        }, false);

    });

    Array.prototype.map.call(versionDateInputs, inputDate => {

        inputDate.addEventListener("input", function(e) {

            currDateInputIdInt = parseInt(inputDate.id.split("editableVersionDate")[1]);

            packageSchema.releases.map(item => {
                if (item.id === currDateInputIdInt){
                    item.date = inputDate.innerText;
                }
            })
            
            console.log(packageSchema.releases);

        }, false);

    });
}

// Sumbit Button

const submit = () => {
    // const submitBttnEl = document.getElementById("saveBttn");
    const formEl = document.getElementById("form1");

    formEl.addEventListener('submit', (event) => {
        event.preventDefault();
        // console.log(packageSchema);

        let windowLocation = window.location;

        if(windowLocation.href.length < 36){
            fetchDataPost();
            //console.log("post works");

            //Redirect to package updating editor
            window.location = `http://127.0.0.1:9002/edit/package/${parseInt(objectGreatestPackageId)+1}`;

            //fill up the Package
            // getCurrPackageData(fillPutForm, () => {});

        } else {
            fetchDataPut();
            // getCurrPackageData(fillPutForm, () => {});

            // console.log("put works");
        }


    });
}

const fetchDataPost = () => {
    // console.log(objectGreatestPackageId)

    fetch("/edit/package/", {
        method: "POST",
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(
            packageSchema
        )
    })

    .then(res => res.json())
    .then(data => {
        console.log(data)
    });

}

const fetchDataPut = () => {

    console.log(objectGreatestPackageId)
    let windowLocationId = window.location.href.slice(window.location.href.length-1, window.location.href.length);

    packageSchema.id = parseInt(windowLocationId);

    fetch(`/edit/package/${windowLocationId}`, {
        method: "PUT",
        headers: {
            'Content-type' : 'application/json'
        },
        body: JSON.stringify(
            packageSchema
        )
    })

    .then(res => res.json())
    .then(data => {
        console.log(data)
    });

}

const fillPutForm = (data) => {

    console.log("fillPutForm works");
    console.log(data);


    // console.log(window.location.pathname);

    // const nameInputEl = document.getElementById("nameInput");
    // const detailsInputEl = document.getElementById("detailsInput");
    // const dependencyItemsContainerEl = document.getElementById("dependencyItemsContainer");
    // const versionItemsContainerEl = document.getElementById("versionItemsContainer");

    // nameInputEl.value = data.name;
    // detailsInputEl.value = data.description;

    // data.dependencies.map((el) => {

    // })
}

const getCurrPackageData = async (usePackageData1, usePackageData2) => {
    // console.log("getCurrPackageData works");

    await fetch(`/api/package/${objectGreatestPackageId+1}`)
    .then(res => res.json())
    .then(data => {

        usePackageData1(data);
        usePackageData2(data);
    }); 

}


// Inserting ALL created html elements into rootDiv of index.html
const displayForm = () => {

    rootEl = document.getElementById("root");

    rootEl.insertAdjacentHTML("beforeend", formStructure());
    rootEl.className = "rootCentered";

    createDataList();
    submit();
}

//loadEvent
const loadEvent = _ => {

    // second callback is added in dependencyEditor()
    getData(getObjectGreatestPackageId, () => {});

    storePackageSchema();
    displayForm();
    detailsEditor();
    dependencyEditor();
    addVersionEditor();
    submit();
    
    // displayVersionEditorExtra();
    // addVersionEditorExtra();
};

window.addEventListener("load", loadEvent);





// Extra Feature

// const addVersionEditorExtra = () => {
//     let addVersionBttnEl = document.getElementById("addVersionBttn");
//     let isAside = false;
//     const addCurrVersionBttnEl = document.getElementById("addCurrVersionBttn");
//     const versionInputEl = document.getElementById("versionInput");
//     const dateInputEl = document.getElementById("versionDateInput");
//     let newVersionValue;
//     let newDateValue;
//     let newVersionId = 0;
  

//     const getInputValues = () => {
//         newVersionValue = versionInputEl.value;
//         newDateValue = dateInputEl.value;
//     }

//     const displayNewVersion = () => {
//         const versionItemsContainerEl = document.getElementById("versionItemsContainer");

//         let versionJSX = `
//         <div id="versionId${newVersionId}" class="versionItem">
//             <div class="versionSubItem versionItemBttn">x</div>
//             <div class="versionSubItem" contenteditable="true">${newVersionValue}</div>
//             <div class="versionSubItem" contenteditable="true">${newDateValue}</div>
//         </div>
//         `

//         versionItemsContainerEl.insertAdjacentHTML("afterbegin", versionJSX);
//     }

//     const updatePackageReleasesAKAVersions = () => {
//         packageSchema.releases.push({"date": newDateValue, "version": newVersionValue})
//     }

//     addCurrVersionBttnEl.addEventListener("click", function(){
//         getInputValues();
//         displayNewVersion();
//         updatePackageReleasesAKAVersions();
//         newVersionId++;

//         console.log(packageSchema);
//     })


//     addVersionBttnEl.addEventListener("click", function(){
//         isAside ? 
//         rootEl.className = "rootCentered":
//         rootEl.className = "rootAside" 

//         isAside = !isAside;
//     })
// }

// const displayVersionEditorExtra = () => {
//     let versionEditorJSX = `
//     <div id = "versionEditorContainer" class="section"> 
//         <div class="versionSubItem">ADD NEW VERSION</div>
//         <input id="versionInput" type="text" placeholder="version">
//         <input id="versionDateInput" type="text" placeholder="date">
//         <button id="addCurrVersionBttn">Add</button>
//     </div>
//     `
//     rootEl.insertAdjacentHTML("beforeend", versionEditorJSX);
// }

