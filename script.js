// Dados refatorados para incluir a hierarquia (inspirado em sites de raças/classes RPG)
const defaultData = {
    classes: [
        {
            id: 'c1',
            group: 'Sonhadores (Incursores Lúcidos)',
            name: 'O Tecelão da Realidade',
            image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=600&auto=format&fit=crop',
            summary: 'Moldam a geografia onírica através de Intelecto.',
            description: 'ATRIBUTO CHAVE: Intelecto (INT).\n\nCOMO AGEM:\nUsam geometria sagrada e lógica para encurralar Anomalias. Eles "editam" a planta do ambiente.\n\nHABILIDADE PRINCIPAL - Renderização Forçada:\nPode alterar portas, paredes ou escadas dentro do Reverso gastando 1d4 de Lucidez.'
        },
        {
            id: 'c2',
            group: 'Sonhadores (Incursores Lúcidos)',
            name: 'O Andarilho da Fenda',
            image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop',
            summary: 'Ladino que usa falhas da matrix onírica.',
            description: 'ATRIBUTO CHAVE: Agilidade (AGI).\n\nCOMO AGEM:\nSe movem pelo "código quebrado" dos sonhos, explorando o Noclip.\n\nHABILIDADE PRINCIPAL - Salto Liminal:\nPermite atravessar matéria sólida uma vez por cena para flanquear entidades.'
        },
        {
            id: 'c3',
            group: 'Equipe de Ancoragem (Apoio Tático)',
            name: 'Guardião de Frequência',
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
            summary: 'Mantém o esquadrão são usando emissores.',
            description: 'ATRIBUTO CHAVE: Vigor (VIG).\n\nCOMO AGEM:\nFicam na retaguarda física no mundo real ou geram zonas de segurança no sonho.\n\nHABILIDADE PRINCIPAL - Barreira Estática:\nReduz todo dano mental da equipe em 2 pontos enquanto o Guardião mantiver concentração.'
        }
    ],
    itens: [
        {
            id: 'i1',
            group: 'Consumíveis I.T.A.C.',
            name: 'Água de Amêndoa Refinada',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
            summary: 'Estabiliza a sanidade. Cheiro de hospital.',
            description: 'USO: Padrão.\n\nEFEITO:\nCura 2d4 de Estresse Mental. Desenvolvido nos laboratórios clínicos da organização. Possui um gosto estéril e sintético.'
        }
    ],
    monstros: [
        {
            id: 'm1',
            group: 'Ameaças Paranormais - Nível VDT',
            name: 'O Rosto na Estática',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
            summary: 'Manifestação do Medo do Desconhecido. Corrompe eletrônicos.',
            description: 'TIPO: Medo Enraizado.\n\nCOMPORTAMENTO:\nAssombra transmissões de rádio e visões periféricas. Exige testes rigorosos de Vontade para não causar paralisia investigativa.'
        }
    ]
};

let db = {};
let currentCategory = 'classes';
let isAdmin = false;

function initDB() {
    const saved = localStorage.getItem('frequenciaREM_v2');
    if (saved) db = JSON.parse(saved);
    else { db = JSON.parse(JSON.stringify(defaultData)); saveDB(); }
    changeTab('classes');
}

function saveDB() { localStorage.setItem('frequenciaREM_v2', JSON.stringify(db)); }

function changeTab(category) {
    currentCategory = category;
    
    // Configura o visual com base no tipo de página (Inspirado no pedido do usuário)
    const bodyObj = document.body;
    bodyObj.className = ''; 
    
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + category).classList.add('active');

    const titles = {
        'classes': 'Arquivos de Pessoal (Classes)',
        'itens': 'Banco de Dados Clínico (Itens)',
        'monstros': 'Ordem de Contenção (Anomalias)'
    };
    
    document.getElementById('section-title').innerText = titles[category];

    if(category === 'classes') bodyObj.classList.add('theme-blue');     // Fantasia Mística (Eldoria)
    if(category === 'itens') bodyObj.classList.add('theme-white');      // Estéril/Liminal (Backrooms)
    if(category === 'monstros') bodyObj.classList.add('theme-purple');  // Sombrio/Investigação (Ordem Paranormal)
    
    document.getElementById('list-view').classList.remove('hidden');
    document.getElementById('detail-view').classList.add('hidden');
    
    renderCards(category);
}

function renderCards(category) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    
    // Sistema de separação hierárquica (Agrupar itens por 'group')
    const groupedData = {};
    db[category].forEach(item => {
        const g = item.group || 'Geral';
        if(!groupedData[g]) groupedData[g] = [];
        groupedData[g].push(item);
    });

    if (isAdmin) {
        const createBtn = document.createElement('button');
        createBtn.innerText = "+ Adicionar Novo Arquivo";
        createBtn.style.marginBottom = "20px";
        createBtn.style.width = "100%";
        createBtn.style.padding = "15px";
        createBtn.onclick = () => openAdminForm(null, category);
        container.appendChild(createBtn);
    }

    for (const [groupName, items] of Object.entries(groupedData)) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'category-group';
        
        const groupTitle = document.createElement('h3');
        groupTitle.className = 'category-title';
        groupTitle.innerText = groupName;
        groupDiv.appendChild(groupTitle);
        
        const gridDiv = document.createElement('div');
        gridDiv.className = 'grid-container';
        
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${item.image}" onerror="this.src='https://via.placeholder.com/400x300/111/fff?text=Sem+Imagem'">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.summary}</p>
                </div>
            `;
            if (isAdmin) {
                const editBtn = document.createElement('button');
                editBtn.innerText = "Editar";
                editBtn.style.position = "absolute"; editBtn.style.top = "10px"; editBtn.style.right = "10px";
                editBtn.onclick = (e) => { e.stopPropagation(); openAdminForm(item.id, category); };
                card.appendChild(editBtn);
            }
            card.onclick = () => showDetails(item);
            gridDiv.appendChild(card);
        });
        
        groupDiv.appendChild(gridDiv);
        container.appendChild(groupDiv);
    }
}

function showDetails(item) {
    document.getElementById('list-view').classList.add('hidden');
    const dContent = document.getElementById('detail-content');
    
    dContent.innerHTML = `
        <div class="detail-header">
            <img src="${item.image}" onerror="this.src='https://via.placeholder.com/300x400/111/fff?text=Registro'">
            <div class="detail-title">
                <h2>${item.name}</h2>
                <p>${item.group || 'Arquivo Desconhecido'} | <i>${item.summary}</i></p>
            </div>
        </div>
        <div class="detail-body">${item.description}</div>
    `;
    
    document.getElementById('detail-view').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeDetails() { changeTab(currentCategory); }

function openAdminLogin() {
    if (isAdmin) { isAdmin = false; renderCards(currentCategory); }
    else { document.getElementById('login-modal').classList.remove('hidden'); document.getElementById('login-error').classList.add('hidden'); }
}

function checkPassword() {
    if (document.getElementById('admin-password').value === 'rem123') {
        isAdmin = true; closeModals(); renderCards(currentCategory);
    } else { document.getElementById('login-error').classList.remove('hidden'); }
}

function closeModals() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

function openAdminForm(id, category) {
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('edit-category').value = category;
    
    if (id) {
        const item = db[category].find(i => i.id === id);
        document.getElementById('edit-id').value = id;
        document.getElementById('form-group').value = item.group || '';
        document.getElementById('form-name').value = item.name;
        document.getElementById('form-image').value = item.image;
        document.getElementById('form-summary').value = item.summary;
        document.getElementById('form-description').value = item.description;
        document.getElementById('btn-delete').classList.remove('hidden');
    } else {
        document.getElementById('edit-id').value = '';
        document.getElementById('form-group').value = '';
        document.getElementById('form-name').value = '';
        document.getElementById('form-image').value = '';
        document.getElementById('form-summary').value = '';
        document.getElementById('form-description').value = '';
        document.getElementById('btn-delete').classList.add('hidden');
    }
}

function saveItem() {
    const category = document.getElementById('edit-category').value;
    const id = document.getElementById('edit-id').value || 'id_' + Date.now();
    const newItem = {
        id: id,
        group: document.getElementById('form-group').value || 'Geral',
        name: document.getElementById('form-name').value,
        image: document.getElementById('form-image').value,
        summary: document.getElementById('form-summary').value,
        description: document.getElementById('form-description').value
    };
    
    const index = db[category].findIndex(i => i.id === id);
    if (index > -1) db[category][index] = newItem; else db[category].push(newItem);
    
    saveDB(); closeModals(); renderCards(currentCategory);
}

function deleteItem() {
    if(confirm("Excluir arquivo definitivamente?")) {
        const cat = document.getElementById('edit-category').value;
        db[cat] = db[cat].filter(i => i.id !== document.getElementById('edit-id').value);
        saveDB(); closeModals(); renderCards(currentCategory);
    }
}

window.onload = initDB;