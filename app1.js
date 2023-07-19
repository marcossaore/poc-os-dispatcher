import FirestoreAdapter from './firestoreAdapter.js'

const firestoreAdapterInstance = FirestoreAdapter.instance();

const collection = "orders"

const users = [
    {
        id: 1,
        name: 'Ramon Diniz',
        status: 'no-task',
    },
    {
        id: 3,
        name: 'Euclides Cunha',
        status: 'almost-finishing',
    },
    {
        id: 2,
        name: 'Moacyr Vitorino',
        status: 'in-task',
    },
    {
        id: 4,
        name: 'Sinval Albino',
        status: 'in-task',
    }
];


const workers = document.getElementById('workers')
for (const { id, name, status } of users) {
    const image = `<image src="${id}.png" style="height: 80px; width: 80px; border-radius: 50%;"></image>`

    const div = document.createElement('div')
    const nameSpan = document.createElement('span')
    nameSpan.className = 'worker-name'
    nameSpan.textContent = name
    const statusSpan = document.createElement('span')
    statusSpan.textContent = status

    statusSpan.classList.add('worker-status')

    statusSpan.classList.add(status)

    div.append(nameSpan)
    div.append(statusSpan)

    const li = document.createElement('li')
    li.id = `user-${id}`;

    li.innerHTML = image
    li.append(div)

    const button = document.createElement('button')
    button.classList.add('btn')
    button.classList.add('btn-info')

    button.textContent = 'Despachar OS'

    button.dataset.id = id

    button.addEventListener('click', (event) => {
        const user = users.filter((item) => item.id === parseInt(event.target.dataset.id))[0]
        dispatchOS(user)
    })

    li.append(button)

    workers.append(li) 
}

const dispatchOS = (user) => {
    const data = {
        ...user,
        date: new Date(),
        status: 'created',
        order: {
            id: 5,
            address: 'Rua desembargador Lima Andrade, 1025, Belo Horizonte - MG'
        }
    }
    firestoreAdapterInstance.addDocument(collection, data)
}

const whenCreateJob = (typeChange, data) => {
    if (typeChange === "modified" || typeChange === "removed") {
        const { id, status } = data;
        const user = users.filter((item) => item.id === id)[0];

        const spanWorker = document.querySelector(`#user-${id} .worker-status`);
        spanWorker.classList.remove(user.status)

        user.status = typeChange === 'removed' ? 'no-task': status;

        spanWorker.classList.add(user.status)
        spanWorker.textContent = user.status
    }
}

firestoreAdapterInstance.onSnap(collection, "date", whenCreateJob)