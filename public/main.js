// const withdrawBtn = document.querySelectorAll('.withdraw');
// const depositBtn = document.querySelectorAll('.deposit');
// const deleteBtn = document.querySelectorAll('.delete');

const sectionOne = document.querySelector('.sectionOne');
const sectionTwo = document.querySelector('.sectionTwo');

const accountSection = document.querySelector('.accountSection');
const formSection = document.querySelector('.formSection');
const h1 = document.querySelector('h1.h1');

let accounts = [];

// rendera alla accounts:
const renderAcc = async () => {
    await fetch('http://localhost:5000/api/accounts')
    .then(response => response.json())
    .then(data => {

        accountSection.innerHTML = '';

        data.forEach(account => {
            let accDiv = `
            <div class="account flex-col">
                <div class="flex-col">
                    <h2 class="small">${account.accountName}</h2>
                    <p class="accountId">${account._id}</p>
                    <p class="amount">${account.amount} kr</p>
                </div>
                <div class="flex-row">
                    <button class="withdraw btn yellow-btn" data-function="withdraw" data-postid="${account._id}">Ta ut</button>
                    <button class="deposit btn green-btn" data-function="deposit" data-postid="${account._id}">Sätt in</button>
                    <button class="delete btn red-btn" data-function="delete" data-postid="${account._id}">Radera</button>
                </div>
            </div>
            `;

            accountSection.innerHTML += accDiv;
        });

        document.querySelectorAll('[data-function="withdraw"]').forEach(btn => btn.addEventListener('click', widtrawAcc));
        document.querySelectorAll('[data-function="deposit"]').forEach(btn => btn.addEventListener('click', depositAcc));
        document.querySelectorAll('[data-function="delete"]').forEach(btn => btn.addEventListener('click', deleteAcc));
    })
    .catch(error => {
        console.error('Något gick fel:', error);
    });
};

// rendera form:
const renderForm = () => {
    h1.innerText = 'Skapa konto';

    let createAccForm = `
    <form id="myForm">
        <div class="accountForm">
            <div class="inputSection flex-col">
                <label for="accountName">Kontonamn:</label>
                <input type="text" id="accountName" name="accountName" placeholder="Vad ska ditt konto heta?" required>
            </div>
            <div class="inputSection flex-col">
                <label for="amount">Insättning:</label>
                <input type="number" id="amount" name="amount" min="0" max="100000" placeholder="Endast heltal (minst 0, max 100000)" required>
            </div>
            <button class="btn btn-green" type="submit">Skapa</button>
        </div>
    </form>
    `;

    formSection.innerHTML = createAccForm;

    // skapa konto
    document.querySelector('#myForm').addEventListener('submit', createAcc);
};

// skicka data från form till API:
const createAcc = async (event) => {
    event.preventDefault();

    await fetch('http://localhost:5000/api/accounts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            accountName: accountName.value,
            amount: amount.value
        })
    })
    .then(response => response.json())
    .then(() => {
        renderPage();
    })
    .catch(error => {
        console.error('Något gick fel:', error);
    });

};

// ta bort account
const deleteAcc = async (e) => { 
    let accountId = e.target.dataset.postid;

    await fetch(`http://localhost:5000/api/accounts/${accountId}`, {
        method: 'DELETE',
    });

    renderPage();
};

// ta ut pengar
const widtrawAcc = async (e) => {
    h1.innerText = 'Uttag';
    let accountId = e.target.dataset.postid;

    await fetch(`http://localhost:5000/api/accounts/${accountId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        let widtrawForm = `
        <form id="myForm">
            <div class="accountForm">
                <div class="inputSection flex-col">
                    <label for="widtrawAmount">Ange belopp från "${data.accountName}":</label>
                    <input type="number" id="widtrawAmount" name="widtrawAmount" min="0" max="100000" placeholder="Endast heltal (minst 0, max 100000)" required>
                </div>
                <button class="btn btn-green" type="submit">Bekräfta uttag</button>
            </div>
        </form>
        `;
        formSection.innerHTML = widtrawForm;

        let amount = parseInt(data.amount);
        
        document.querySelector('#myForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            let widtraw = parseInt(widtrawAmount.value);
            let sum = amount - widtraw;

            if(sum < 0){
                alert(`Du kan inte ta ut mer pengar än vad du har på bankkontot. Prova att göra ett uttag på ${amount} kr eller mindre.`);
            }
            else{
                // vad ska hända när man trycker på "bekräfta uttag?"
                await fetch(`http://localhost:5000/api/accounts/${accountId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: sum
                    })
                })
                .then(response => response.json())
                .then(() => {
                    renderPage();
                })
                .catch(error => console.log(error))
            }
        });

    })
    .catch(error => {
        console.log(error);
    });
};

// sätt in pengar
const depositAcc = async (e) => { 
    h1.innerText = 'Insättning';
    let accountId = e.target.dataset.postid;

    await fetch(`http://localhost:5000/api/accounts/${accountId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        let depositForm = `
        <form id="myForm">
            <div class="accountForm">
                <div class="inputSection flex-col">
                    <label for="depositAmount">Ange belopp till "${data.accountName}":</label>
                    <input type="number" id="depositAmount" name="depositAmount" min="0" max="100000" placeholder="Endast heltal (minst 0, max 100000)" required>
                </div>
                <button class="btn btn-green" type="submit">Bekräfta insättning</button>
            </div>
        </form>
        `;
        formSection.innerHTML = depositForm;

        let amount = parseFloat(data.amount);
        
        document.querySelector('#myForm').addEventListener('submit', async (e) => {
            e.preventDefault();

            let deposit = parseFloat(depositAmount.value);
            let sum = amount + deposit;
            
                // vad ska hända när man trycker på "bekräfta insättning?"
                await fetch(`http://localhost:5000/api/accounts/${accountId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        amount: sum
                    })
                })
                .then(response => response.json())
                .then(() => {
                    renderPage();
                })
                .catch(error => console.log(error))
        });

    })
    .catch(error => {
        console.log(error);
    });
};


// rendera page
const renderPage = (() => {
    // render accounts
    renderAcc();
    // render form
    renderForm();
});
renderPage();