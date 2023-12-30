// Function to add a new operation
function addOperation() {
    const operationsContainer = document.getElementById("operationsContainer");
    const operationDiv = document.createElement("div");
    operationDiv.className = "operation";
    operationDiv.innerHTML = `
        <label>Date:</label>
        <input type="date" class="operationDate">

        <label>Type:</label>
        <select class="operationType">
            <option value="addition">Ajout</option>
            <option value="withdrawal">Récupération </option>
        </select>

        <label>Amount:</label>
        <input type="number" class="operationAmount" placeholder="-----">
    `;
    operationsContainer.appendChild(operationDiv);
    generateTable();
}









// Function to calculate and display the final balance at a specific date
function calculateFinalBalance() {
    const specificDate = new Date(document.getElementById("specificDate").value);
    if (isNaN(specificDate)) {
        alert("Veuillez entrer une date spécifique valide.");
        return;
    }
    const initialAmount = parseFloat(document.getElementById("initialAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;
    const operationsContainer = document.getElementById("operationsContainer");
    const operationInputs = Array.from(operationsContainer.getElementsByClassName("operation"));
    const sortedOperations = operationInputs.sort((a, b) => {
        const dateA = new Date(a.getElementsByClassName("operationDate")[0].value);
        const dateB = new Date(b.getElementsByClassName("operationDate")[0].value);
        return dateA - dateB;
    });
    let finalBalance = initialAmount;
    let prevDate = new Date(document.getElementById("creationDate").value);
    for (let i = 0; i < sortedOperations.length; i++) {
        const operationDate = new Date(sortedOperations[i].getElementsByClassName("operationDate")[0].value);
        const isAddition = sortedOperations[i].getElementsByClassName("operationType")[0].value === "addition";
        const amount = parseFloat(sortedOperations[i].getElementsByClassName("operationAmount")[0].value);
        if (isNaN(amount)) {
            continue;
        }
        const days = (operationDate - prevDate) / (24 * 60 * 60 * 1000);
        let interest = 0;
        if (interestRate > 0) {
            interest = ((finalBalance + amount) * interestRate * days / (100 * 360)).toFixed(2);
            finalBalance = parseFloat(finalBalance) + parseFloat(interest);
        }
        if (isAddition) {
            finalBalance += amount;
        } else {
            finalBalance -= amount;
        }
        prevDate = operationDate;
        if (operationDate >= specificDate) {
            break;
        }
    }
    const daysToSpecificDate = (specificDate - prevDate) / (24 * 60 * 60 * 1000);
    const finalInterest = ((finalBalance) * interestRate * daysToSpecificDate / (100 * 360)).toFixed(2);
    finalBalance = parseFloat(finalBalance) + parseFloat(finalInterest);
    const finalBalanceResult = document.getElementById("finalBalanceResult");
    finalBalanceResult.innerHTML = `En ${specificDate.toDateString()} vous avez : ${finalBalance.toFixed(2)}`;
}









// Function to generate the table
function generateTable() {
    const initialAmount = parseFloat(document.getElementById("initialAmount").value);
    const creationDate = new Date(document.getElementById("creationDate").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;

    const operationsContainer = document.getElementById("operationsContainer");
    const operationInputs = Array.from(operationsContainer.getElementsByClassName("operation"));
    const sortedOperations = operationInputs.sort((a, b) => {
        const dateA = new Date(a.getElementsByClassName("operationDate")[0].value);
        const dateB = new Date(b.getElementsByClassName("operationDate")[0].value);
        return dateA - dateB;
    });
    const table = document.getElementById("resultTable");
    table.innerHTML = "";
    const headerRow = table.insertRow(0);
    headerRow.innerHTML = "<th>Date</th><th>Type</th><th>Montant</th><th>NB Jours</th><th>Intérêt</th><th>Balance</th>";
    let balance = initialAmount;
    let prevDate = creationDate;
    const initialRow = table.insertRow(1);
    initialRow.innerHTML = `<td>${creationDate.toDateString()}</td><td>Création</td><td>${initialAmount}</td><td>0</td><td>0</td><td>${initialAmount}</td>`;
    for (let i = 0; i < sortedOperations.length; i++) {
        const operationDate = new Date(sortedOperations[i].getElementsByClassName("operationDate")[0].value);
        const isAddition = sortedOperations[i].getElementsByClassName("operationType")[0].value === "addition";
        const amount = parseFloat(sortedOperations[i].getElementsByClassName("operationAmount")[0].value);



        //IMPLEMENTATION DU INTERET SIMPLE !!!
        const days = (operationDate - prevDate) / (24 * 60 * 60 * 1000);
        let interest = 0;
        if (interestRate > 0) {
            interest = ((balance + amount) * interestRate * days / (100 * 360)).toFixed(2);
            balance = parseFloat(balance) + parseFloat(interest);
        }
        if (isAddition) {
            balance += amount;
        } else {
            balance -= amount;
        }





        const newRow = table.insertRow(i + 2);
        newRow.innerHTML = `<td>${operationDate.toDateString()}</td><td>${isAddition ? "Ajout" : "Récupération"}</td><td>${amount}</td><td>${days}</td><td>${interest}</td><td>${balance.toFixed(2)}</td>`;
        newRow.classList.add(isAddition ? "addition" : "withdrawal");
        prevDate = operationDate;
    }
}