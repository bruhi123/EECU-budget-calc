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
            careerSalaryMap.set(user["Occupation"], user["Salary"]);
            const option = new Option(user["Occupation"], user["Occupation"]);
            selectCareer.add(option);
        });

        selectCareer.addEventListener('change', () => {
            salary.textContent = careerSalaryMap.get(selectCareer.value) || '';
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
    const salary = getValueOrZero('salary');
    const taxes = getValueOrZero('taxes');

    let taxesCalc = calculateFederalTax(taxes)

    // Calculate total income
    const totalIncome = salary - taxesCalc;

    // Update the total income display
    document.getElementById('income-total').textContent = `$${totalIncome.toFixed(
        2
    )}`;

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
    document.getElementById(
        'expense-total'
    ).textContent = `$${totalExpenses.toFixed(2)}`;

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




//Mobie Navigation
const incomeSecion = document.getElementById('income');
const analysisSecion = document.getElementById('analysis');
const expensesSection = document.getElementById('expenses');
const nextMobile = document.getElementById('next-mobile')


function nextBtnMobile() {
    incomeSecion.classList.add('hidden');
    incomeSecion.classList.remove('view');

    //Make anaylsis apear
}

nextMobile.addEventListener('click', () => {
    nextBtnMobile();
})