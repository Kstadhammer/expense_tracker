const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const search = document.getElementById('search');
const searchBtn = document.getElementById('searchBtn');

const localStorageTransactions = JSON.parse(
    localStorage.getItem('transactions')
);

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

function addTransaction(e) {
    e.preventDefault();

    if(text.value.trim() === '' || amount.value.trim() === ''){
        alert('Please add an expense and its corresponding amount.');
    } else {
        const transaction = {
            id: generateId(),
            text: text.value,
            amount: +amount.value,
        };
        transactions.push(transaction);

        addTransactionToDOM(transaction);  // Fixed typo here
 
        updateLocalStorage();
        updateValues();

        text.value = '';
        amount.value = '';
    }
}

function addTransactionToDOM(transaction) {  // Fixed typo here
    const sign = transaction.amount < 0 ? '-' : '+';  // Removed unnecessary '+'
    const item = document.createElement('li');

    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
    item.innerHTML = `${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>`;  // Changed onClick to onclick
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(transactions => transactions.amount)
    const total  = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
                    .filter((item) => item > 0)
                    .reduce((acc, item) => (acc += item), 0)
                    .toFixed(2);
        const expense = (
            amounts
                .filter((item) => item < 0)
                .reduce((acc, item) => (acc += item), 0 ) * -1
        ).toFixed(2)
        balance.innerHTML = `${total}`
        money_plus.innerHTML = `$${income}`
        money_minus.innerHTML = `$${expense}`


}


function removeTransaction(id) {
    const originalLength = transactions.length;
    transactions = transactions.filter((transaction) => transaction.id !== id);
    
    if (transactions.length === originalLength) {
        console.warn(`Transaction with id ${id} not found.`);
    } else {
        console.log(`Transaction with id ${id} removed successfully.`);
        updateLocalStorage();
        init();
    }
}   


function updateLocalStorage() {

    localStorage.setItem('transactions', JSON.stringify(transactions));
}



function searchTransaction() {
    if(search.value.trim() === '') {
        alert('Search field must not be empty.');
    }
}

function init() {
    list.innerHTML = '';

    transactions.forEach(addTransactionToDOM)
    updateValues()



}

init()
 
function generateId() {
    return Math.floor(Math.random() * 100000000);
}

form.addEventListener('submit', addTransaction);
searchBtn.addEventListener('click', searchTransaction);
