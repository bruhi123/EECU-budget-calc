//fetch API

async function jobSelector() {
    const selectCareer = document.getElementById('selectJob');
    const careerSalaryMap = new Map();
    try {
        const response = await fetch('https://eecu-data-server.vercel.app/data');
        if (!response.ok) {
            throw new Error('Network response was not okay');
        }

        const users = await response.json();

        users.forEach(user => {
            const monthlySalary = Math.round(parseFloat(user["Salary"]) / 12);
            careerSalaryMap.set(user["Occupation"], monthlySalary);
            const option = new Option(user["Occupation"], user["Occupation"]);
            selectCareer.add(option);
        });

        selectCareer.addEventListener('change', () => {
            const salaryValue = careerSalaryMap.get(selectCareer.value) || 0;

            document.getElementById("salary").textContent = salaryValue;

            updateNumbers();
        })
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

jobSelector();

//-- Changeable text//
const incomeTotalText = document.getElementById('income-total');
const expensesTotalText = document.getElementById('expense-total');
const netTotalText = document.getElementById('net-total');

//-- Displaying the totals//
function updateNumbers() {
    // Helper function to get the value or return 0 if empty
    const getValueOrZero = id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with id "${id}" not found.`);
            return 0; // Return 0 if the element does not exist
        }
        const value = element.value;
        return value === '' ? 0 : parseFloat(value) || 0; // Return 0 if empty or invalid
    };


    // taxes systemn calculation
    function calculateFederalTax(taxableIncome) {
        let tax = 0;

        if (taxableIncome <= 12400) {
            tax = taxableIncome * 0.10;
        }
        else if (taxableIncome <= 50400) {
            tax = (12400 * 0.10) +
                ((taxableIncome - 12400) * 0.12);
        }
        else {
            tax = (12400 * 0.10) +
                ((50400 - 12400) * 0.12) +
                ((taxableIncome - 50400) * 0.22);
        }
        return tax;
    }

    // Get values from income
    const salary = parseFloat(document.getElementById("salary").textContent) || 0;

    let taxesCalc = calculateFederalTax(salary)

    document.getElementById("taxes").textContent = taxesCalc.toFixed(2);

    // Calculate total income
    const totalIncome = salary - taxesCalc;

    //-- Expenses//
    const housing = getValueOrZero('housing');
    const utilities = getValueOrZero('utilities');
    const groceries = getValueOrZero('groceries');
    const transportation = getValueOrZero('transportation');
    const shopping = getValueOrZero('shopping');
    const entertainment = getValueOrZero('entertainment');
    const subscriptions = getValueOrZero('subscriptions');
    const health = getValueOrZero('health');
    const internet = getValueOrZero('internet');
    const education = getValueOrZero('education');
    const saving = getValueOrZero('savings');
    const travel = getValueOrZero('travel');
    const totalExpenses =
        housing +
        utilities +
        groceries +
        transportation +
        shopping +
        entertainment +
        subscriptions +
        health +
        internet +
        education +
        saving +
        travel;

    // Update the total income display
    document.getElementById('income-total').textContent = `$${totalIncome.toFixed(
        2
    )}`;
    document.getElementById('analysis-income').textContent = `$${totalIncome.toFixed(
        2
    )}`;

    // Update the total expense display
    document.getElementById('expense-total').textContent = `$${totalExpenses.toFixed(
        2
    )}`;
    document.getElementById('analysis-expenses').textContent = `$${totalExpenses.toFixed(
        2
    )}`;

    //-- Net Total//
    const netTotal = totalIncome - totalExpenses;
    document.getElementById('net-total').textContent = `$${netTotal.toFixed(
        2
    )}`;
}

//-- Format to chart data//

function updateChart() {
    const getValueOrZero = id => {
        const element = document.getElementById(id);
        if (!element) {
            console.error(`Element with id "${id}" not found.`);
            return 0; // Return 0 if the element does not exist
        }
        const value = element.value;
        return value === '' ? 0 : parseFloat(value) || 0; // Return 0 if empty or invalid
    };

    const housing = getValueOrZero('housing');
    const utilities = getValueOrZero('utilities');
    const groceries = getValueOrZero('groceries');
    const transportation = getValueOrZero('transportation');
    const shopping = getValueOrZero('shopping');
    const entertainment = getValueOrZero('entertainment');
    const subscriptions = getValueOrZero('subscriptions');
    const health = getValueOrZero('health');
    const internet = getValueOrZero('internet');
    const education = getValueOrZero('education');
    const saving = getValueOrZero('savings');
    const travel = getValueOrZero('travel');

    return [
        saving,
        transportation,
        groceries,
        education,
        utilities,
        health,
        travel,
        shopping,
        internet,
        entertainment,
        housing,
        subscriptions
    ];
}

const all_labels = [
    'Savings',
    'Transportation',
    'Groceries',
    'Education',
    'Utilities',
    'Health',
    'Travel',
    'Shopping',
    'Internet',
    'Entertainment',
    'Housing',
    'Subscriptions'
];

function update() {
    current_chart?.destroy();
    const values = updateChart();
    const labels = all_labels.filter((_, i) => values[i] !== 0);
    current_chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [
                {
                    label: 'Money spent (USD)',
                    data: values.every(value => value === 0)
                        ? Array(values.length).fill(100)
                        : values.filter(value => value !== 0),
                    borderWidth: 1,
                    ...(values.every(value => value === 0)
                        ? {
                            backgroundColor: Array(values.length).fill(
                                'rgb(150, 150, 150)'
                            ),
                            borderColor: 'rgb(150, 150, 150)'
                        }
                        : {})
                }
            ]
        }
    });
    for (const label of labels) {
        const dot = /** @type {HTMLLIElement} */ (
            document.querySelector(
                `li:has(input[name=${label.toLowerCase()}]) > :first-child`
            )
        );
        if (!dot) {
            continue;
        }
        dot.style.backgroundColor =
            current_chart.data.datasets[0].backgroundColor[
            labels.indexOf(label)
            ];
    }
    for (const label of all_labels.filter(label => !labels.includes(label))) {
        const dot = /** @type {HTMLLIElement} */ (
            document.querySelector(
                `li:has(input[name=${label.toLowerCase()}]) > :first-child`
            )
        );
        if (!dot) {
            continue;
        }
        dot.style.backgroundColor = 'rgb(150, 150, 150)';
    }
    console.log(current_chart);
    updateNumbers();
}
//-- Chart//
const ctx = document.getElementById('pie-chart');

let current_chart = null;
const show_results = document.querySelector('#review');
show_results.addEventListener('click', update);

update();

//sections
const incomeSection = document.getElementById('income');
const analysisSection = document.getElementById('analysis');
const expensesSection = document.getElementById('expenses');

// buttons
const nextButton = document.getElementById('next-mobile');
const viewResultsButton = document.getElementById('view-results');
const goBackButton = document.getElementById('go-back');
const menuButton = document.getElementById("menu-button");
const backNav = document.getElementById("back-nav");

// steps
const step1 = document.getElementById('step1');
const step2 = document.getElementById('step2');
const step3 = document.getElementById('step3');

// shows the expenses section
function showExpenses() {
    incomeSection.classList.add('hidden');
    expensesSection.classList.remove('hidden');
    step1.classList.remove("active");
    step1.classList.add("complete");
    step2.classList.add("active");
    backNav.classList.remove("hidden");
    menuButton.classList.add("hidden");
}

// shows the analysis section
function showResults() {
    expensesSection.classList.add("hidden");
    analysisSection.classList.remove("hidden");
    step2.classList.remove("active");
    step2.classList.add("complete");
    step3.classList.add("active");
    backNav.classList.add("hidden");
    menuButton.classList.remove("hidden");
    update();
}

// goes back to the expenses section
function goBack() {
    analysisSection.classList.add("hidden");
    expensesSection.classList.remove("hidden");
    step3.classList.remove("active");
    step3.classList.remove("complete");
    step2.classList.add("active");
    step2.classList.remove("complete");
    backNav.classList.remove("hidden");
    menuButton.classList.add("hidden");
}

// goes back to the income section
function goBackToIncome() {
    expensesSection.classList.add("hidden");
    incomeSection.classList.remove("hidden");
    step2.classList.remove("active");
    step2.classList.remove("complete");
    step1.classList.add("active");
    step1.classList.remove("complete");
    backNav.classList.add("hidden");
    menuButton.classList.remove("hidden");
}

// when clicked buttons it displays the functions
nextButton.addEventListener("click", showExpenses);
viewResultsButton.addEventListener("click", showResults);
goBackButton.addEventListener("click", goBack);
backNav.addEventListener("click", goBackToIncome);

// hide buttons and back button in the desktop version
function buttonHide() {
    const buttonsHide = [
        document.getElementById('next-mobile'),
        document.getElementById('view-results'),
        document.getElementById('go-back'),
        document.getElementById('back-nav'),
    ].filter(Boolean);

    const shouldHide = window.innerWidth > 600;
    buttonsHide.forEach(button => {
        button.style.display = shouldHide ? 'none' : '';
    });
}
window.addEventListener('resize', buttonHide);
buttonHide();

const saving = getValueOrZero('savings');
const reminder = document.querySelector('#expensesList p')
console.log(reminder)
if (saving < totalIncome / 10) {
    reminder.style.display = 'block';
}
else if (saving > totalIncome / 10) {
    reminder.style.display = 'none';
}



