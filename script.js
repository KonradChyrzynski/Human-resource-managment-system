
let myArray = [
    {"imie": "Jan", "nazwisko": "Kowalski", "dzial": "IT", "wynagrodzenieKwota": "3000", "wynagrodzenieWaluta": "PLN"},
    {"imie": "Anna", "nazwisko": "Bąk", "dzial": "Administracja", "wynagrodzenieKwota": "2400.50", "wynagrodzenieWaluta": "PLN"},
    {"imie": "Paweł", "nazwisko": "Zabłocki", "dzial": "IT", "wynagrodzenieKwota": "3300", "wynagrodzenieWaluta": "PLN"},
    {"imie": "Tomasz", "nazwisko": "Osiecki", "dzial": "Administracja", "wynagrodzenieKwota": "2100", "wynagrodzenieWaluta": "PLN"},
    {"imie": "Iwona", "nazwisko": "Leihs-Gutowska", "dzial": "Handlowiec", "wynagrodzenieKwota": "3100", "wynagrodzenieWaluta": "PLN"},
];



let inputSearch = document.querySelector(".form-control-one");
let addWorkerButton = document.querySelector(".btn-success");
let departmentSelect = document.querySelector(".department-select");
let searchBtn = document.querySelector(".search-btn");
let minValue = document.querySelector("#minValue");
let maxValue = document.querySelector("#maxValue");
let departmentData = [];
let departments = [];
let departmentsNestedArray  = [];
//start program
startProgram(myArray)
//start program


function startProgram(data) {
    buildMainTable(data)
    buildSecondTable()
    addOptionToSelect()
}



function searchTable(value, data){
    let filteredData = [];

    data.forEach(function(worker){
        value.toLowerCase()
        let name = worker.imie.toLowerCase()

        if(name.includes(value)){
           filteredData.push(worker)
        }
    })
    return filteredData
}

function searchByDepartment(value,data){
    let filteredData = [];

    data.forEach(function(worker){
        value.toLowerCase()
        let department = worker.dzial.toLowerCase()

        if(department.includes(value)){
            filteredData.push(worker)
        }
    })
    return filteredData
}


function searchBySallary(valueMin,valueMax,data){
    let filteredData = [];

    data.forEach(function(worker){
        let sallary = worker.wynagrodzenieKwota.toLowerCase()

        if((sallary >= valueMin || valueMin == "") && (sallary <= valueMax || valueMax == "")){
            filteredData.push(worker)
        }
    })
    return filteredData
}


function addOptionToSelect(){
    departmentSelect.innerHTML = "<option>Wszystkie działy</option>"
    departmentData.forEach(function(department){
        let departmentType = `<option value="${department}">${department}</option>`;
    
        departmentSelect.innerHTML += departmentType        
    })
}

function searchAlgorithm(){
    let minSallaryValue = minValue.value
    let maxSallaryValue = maxValue.value
    let inputSearchValue = inputSearch.value.toLowerCase();
    let selectValue = departmentSelect.value.toLowerCase();
    let sallaryData = searchBySallary(minSallaryValue,maxSallaryValue,myArray)
    if(selectValue === "wszystkie działy"){
        let finallData = searchTable(inputSearchValue, sallaryData)
        buildMainTable(finallData)
        return finallData;

    } else{
       let selectData = searchByDepartment(selectValue, sallaryData);
       let finallData = searchTable(inputSearchValue, selectData);
       buildMainTable(finallData);
       return finallData;
    }
}

    
function buildMainTable(data){
    let table1 = document.getElementById('myTable1');

    table1.innerHTML = ''

    data.forEach(function(worker, index){
        //prevent from adding empty object
        if(worker.imie != "" && worker.nazwisko != "" && worker.dział != "" && worker.wynagrodzenieKota != ""){
            let workersData = `<tr data-id="${index}">
            <td>${worker.imie}</td>
            <td>${worker.nazwisko}</td>
            <td>${worker.dzial}</td>
            <td id="relative-td">${worker.wynagrodzenieKwota + " " + worker.wynagrodzenieWaluta} <i class="fas fa-user-times"></i></td>
            </tr>
            `;
            table1.innerHTML += workersData;

            if(departmentData.includes(worker.dzial)){
                return
            }else{
                departmentData.push(worker.dzial);
                
            }
        }     
    }
     
    
    )  
    let totalSallaryOfAllWorkers = myArray.reduce((sum, worker) => parseFloat(worker.wynagrodzenieKwota) + sum, 0);

    let firstTableRow = `
    <tr>
    <td>Łączna suma wynagrodzeń</td>
    <th></th>
    <th></th>
    <td>${totalSallaryOfAllWorkers + " PLN" }</td>
    </tr>
    `
    
    table1.innerHTML += firstTableRow;

    let userDeleteIcon = document.querySelectorAll(".fa-user-times")

    userDeleteIcon.forEach(function(icon){
        let tr = icon.parentNode.parentNode
        let trID = tr.dataset.id
        icon.addEventListener("click", () => {myArray.splice(trID,1)
            startProgram(myArray)
        })
    })
    

}


function buildSecondTable(){
    let table2 = document.getElementById('myTable2');
    table2.innerHTML = ''
    let secondTableRow = `<tr>
    <th data-order="desc">Dział</th>
    <th></th>
    <th></th>
    <th data-order="desc">Suma wynagrodzeń</th>
    </tr>`
    table2.innerHTML += secondTableRow

    let totalSallarySumOfDepartments = myArray.reduce((acc, worker) => {
        return {...acc, [`${worker.dzial}`]: (acc[worker.dzial] || 0) + parseFloat(worker.wynagrodzenieKwota)}
    }, {})

    let departments = Object.keys(totalSallarySumOfDepartments)

    for(let i = 0; i < departments.length; i++){
        let departmentHtmlData = `<tr>
        <td>${departments[i]}</td>
        <td><td>
        <td>${totalSallarySumOfDepartments[departments[i]]}</td>
        </tr>`
        table2.innerHTML += departmentHtmlData;
    }
    
    


}







//addEventListener


inputSearch.addEventListener("keyup", function() {
    searchAlgorithm()
})



departmentSelect.addEventListener("change", function() {
    searchAlgorithm()
})

searchBtn.addEventListener("click", function() {
    searchAlgorithm()
})

//This algorithm, adds new worker.
addWorkerButton.addEventListener("click", function(e){
    e.preventDefault();
    let inputsArray = Array.from(document.querySelectorAll('form input'))
    let userData = inputsArray.reduce((acc, input) => ({...acc,[input.id]: input.value}), {})
    myArray.push(userData)
    startProgram(myArray)
    inputsArray.forEach(input =>{
        input.value = ""
    })
})

$('.filter-table').on('click', function(){
    let column = $(this).data('colname')
    let order = $(this).data('order')
    let text = $(this).html()

    text = text.substring(0, text.length - 1)

    if(order == 'desc'){
        $(this).data('order', 'asc')
        myArray = searchAlgorithm().sort((a,b) => a[column] > b[column] ? 1 : -1) 
        text += '&#9660'
    }else{
        $(this).data('order', 'desc')
        myArray = searchAlgorithm().sort((a,b) => a[column] < b[column] ? 1 : -1) 
        text += '&#9650'
    }
    $(this).html(text)
    buildMainTable(myArray)
})

















