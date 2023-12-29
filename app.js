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
            <option value="addition">Addition</option>
            <option value="withdrawal">Withdrawal</option>
        </select>

        <label>Amount:</label>
        <input type="number" class="operationAmount">
    `;

    operationsContainer.appendChild(operationDiv);

    // Automatically generate the table when a new operation is added
    generateTable();
}

// Function to calculate and display the final balance at a specific date
function calculateFinalBalance() {
    const specificDate = new Date(document.getElementById("specificDate").value);

    // Ensure the specific date is valid
    if (isNaN(specificDate)) {
        alert("Please enter a valid specific date.");
        return;
    }

    const initialAmount = parseFloat(document.getElementById("initialAmount").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;

    const operationsContainer = document.getElementById("operationsContainer");
    const operationInputs = Array.from(operationsContainer.getElementsByClassName("operation"));

    // Sort the operations based on date
    const sortedOperations = operationInputs.sort((a, b) => {
        const dateA = new Date(a.getElementsByClassName("operationDate")[0].value);
        const dateB = new Date(b.getElementsByClassName("operationDate")[0].value);
        return dateA - dateB;
    });

    let finalBalance = initialAmount;
    let prevDate = new Date(document.getElementById("creationDate").value);

    // Iterate through the sorted operations
    for (let i = 0; i < sortedOperations.length; i++) {
        const operationDate = new Date(sortedOperations[i].getElementsByClassName("operationDate")[0].value);
        const isAddition = sortedOperations[i].getElementsByClassName("operationType")[0].value === "addition";
        const amount = parseFloat(sortedOperations[i].getElementsByClassName("operationAmount")[0].value);

        // Check if the amount is a valid number
        if (isNaN(amount)) {
            continue;
        }

        // Calculate the number of days since the previous operation
        const days = (operationDate - prevDate) / (24 * 60 * 60 * 1000);

        let interest = 0;

        if (interestRate > 0) {
            // Calculate interest based on the simple interest formula
            interest = ((finalBalance + amount) * interestRate * days / (100 * 360)).toFixed(2);

            // Update the final balance considering the interest
            finalBalance = parseFloat(finalBalance) + parseFloat(interest);
        }

        if (isAddition) {
            finalBalance += amount;
        } else {
            finalBalance -= amount;
        }

        prevDate = operationDate;

        // If the operation date is on or after the specific date, stop calculating
        if (operationDate >= specificDate) {
            break;
        }
    }

    // Calculate interest for the time between the last operation date and the specified date
    const daysToSpecificDate = (specificDate - prevDate) / (24 * 60 * 60 * 1000);
    const finalInterest = ((finalBalance) * interestRate * daysToSpecificDate / (100 * 360)).toFixed(2);
    finalBalance = parseFloat(finalBalance) + parseFloat(finalInterest);

    // Display the final balance
    const finalBalanceResult = document.getElementById("finalBalanceResult");
    finalBalanceResult.innerHTML = `Final Balance at ${specificDate.toDateString()}: ${finalBalance.toFixed(2)}`;
}




// Function to generate the table
function generateTable() {
    const initialAmount = parseFloat(document.getElementById("initialAmount").value);
    const creationDate = new Date(document.getElementById("creationDate").value);
    const interestRate = parseFloat(document.getElementById("interestRate").value) || 0;

    const operationsContainer = document.getElementById("operationsContainer");
    const operationInputs = Array.from(operationsContainer.getElementsByClassName("operation"));

    // Sort the operations based on date
    const sortedOperations = operationInputs.sort((a, b) => {
        const dateA = new Date(a.getElementsByClassName("operationDate")[0].value);
        const dateB = new Date(b.getElementsByClassName("operationDate")[0].value);
        return dateA - dateB;
    });

    const table = document.getElementById("resultTable");
    table.innerHTML = "";

    const headerRow = table.insertRow(0);
    headerRow.innerHTML = "<th>Date</th><th>Type</th><th>Amount</th><th>Days</th><th>Interest</th><th>Balance</th>";

    let balance = initialAmount;
    let prevDate = creationDate;

    // Add the initial state as the first row
    const initialRow = table.insertRow(1);
    initialRow.innerHTML = `<td>${creationDate.toDateString()}</td><td>Creation</td><td>${initialAmount}</td><td>0</td><td>0</td><td>${initialAmount}</td>`;

    for (let i = 0; i < sortedOperations.length; i++) {
        const operationDate = new Date(sortedOperations[i].getElementsByClassName("operationDate")[0].value);
        const isAddition = sortedOperations[i].getElementsByClassName("operationType")[0].value === "addition";
        const amount = parseFloat(sortedOperations[i].getElementsByClassName("operationAmount")[0].value);

        // Calculate the number of days since the previous operation or creation
        const days = (operationDate - prevDate) / (24 * 60 * 60 * 1000);

        let interest = 0;

        if (interestRate > 0) {
            // Calculate interest based on the simple interest formula
            interest = ((balance + amount) * interestRate * days / (100 * 360)).toFixed(2);

            // Update the balance considering the interest
            balance = parseFloat(balance) + parseFloat(interest);
        }

        if (isAddition) {
            balance += amount;
        } else {
            balance -= amount;
        }

        // Insert rows starting from index 2 (header + initial row)
        const newRow = table.insertRow(i + 2);
        newRow.innerHTML = `<td>${operationDate.toDateString()}</td><td>${isAddition ? "Addition" : "Withdrawal"}</td><td>${amount}</td><td>${days}</td><td>${interest}</td><td>${balance.toFixed(2)}</td>`;

        // Add class to highlight the row based on operation type
        newRow.classList.add(isAddition ? "addition" : "withdrawal");

        prevDate = operationDate;
    }
}