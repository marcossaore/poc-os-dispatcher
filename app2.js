import FirestoreAdapter from './firestoreAdapter.js'
const firestoreAdapterInstance = FirestoreAdapter.instance();

const collection = 'orders'

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

const min = 1;
const user = users[Math.floor(Math.random() * (users.length - min + 1)) + min - 1];

document.getElementById('person').innerHTML = `
    <image src="${user.id}.png" style="height: 80px; width: 80px; border-radius: 50%;"></image>
    <p>${user.name}</p>
`

const driveTo = async (ref) => {
    const data = {
        ...user,
        status: 'driving'
    }
    await firestoreAdapterInstance.updateDocument(collection, ref, data)
}

const initWork = async (ref) => {
    const data = {
        ...user,
        status: 'in-task'
    }
    await firestoreAdapterInstance.updateDocument(collection, ref, data)
}

const finishWork = async (ref) => {
    await firestoreAdapterInstance.deleteDocument(collection, ref)
    document.getElementById('content').innerHTML = `<span>Nenhum Serviço</span>`
}

const whenReceiveJob = (typeChange, data, ref) => {
    if (typeChange === "added") {
        const { id, order } = data;
        if (user.id === id) {
            const content = document.getElementById('content');
            content.innerHTML = `
                <span>
                    Nova OS em: ${order.address}
                </span>
                <button id="drive">Dirigir até o local</button>
                <br>
                <button id="init">Iniciar Serviço</button>
                <br>
                <br>
                <button id="finish">Finalizar Serviço</button>
            `
            document.getElementById('drive').addEventListener('click', () => driveTo(ref))
            document.getElementById('init').addEventListener('click', () => initWork(ref))
            document.getElementById('finish').addEventListener('click', () => finishWork(ref))
        }
    }
}

firestoreAdapterInstance.onSnap(collection, "date", whenReceiveJob)