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

    // Get values from inputs
    const salary = getValueOrZero('salary');
    const investments = getValueOrZero('investments');
    const business = getValueOrZero('business');
    const other = getValueOrZero('other');

    // Calculate total income
    const totalIncome = salary + investments + business + other;

    // Update the total income display
    document.getElementById(
        'income-total'
    ).textContent = `$${totalIncome.toFixed(2)}`;

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
    const saving = getValueOrZero('save');
    const travel = getValueOrZero('trav');
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
    const saving = getValueOrZero('save');
    const travel = getValueOrZero('trav');
    // const salary = getValueOrZero('salary');
    // const investments = getValueOrZero('investments');
    // const business = getValueOrZero('business');
    // const other = getValueOrZero('other');
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
        // salary,
        // investments,
        // business,
        // other
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

// const menu_btn = /** @type {HTMLButtonElement} */ (document.querySelector('.menu'));
