// Dados simulados expandidos com suporte a personagens
const defaultData = {
    classes: [
        { id: 'c1', group: 'Sonhadores', name: 'Tecelão da Realidade', image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=600&auto=format&fit=crop', summary: 'Moldam a geografia onírica através de Intelecto.', description: 'Especialistas em geometria sagrada.' }
    ],
    itens: [
        { id: 'i1', group: 'Consumíveis', name: 'Água de Amêndoa Refinada', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop', summary: 'Estabiliza a sanidade.', description: 'Cura 2d4 de Estresse Mental.' }
    ],
    monstros: [
        { id: 'm1', group: 'VDT', name: 'O Rosto na Estática', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop', summary: 'Corrompe eletrônicos.', description: 'Assombra transmissões de rádio.' }
    ],
    fichas: [
        { id: 'f1', name: 'Elias', classe: 'Andarilho da Fenda', hp: '24/24', lucidez: '12/15', image: 'https://via.placeholder.com/400x300/1a1a2e/33ccff?text=Ficha+Elias' }
    ]
};

let db = {};
let currentCategory = 'classes';
let isAdmin = false;

function initDB() {
    const saved = localStorage.getItem('frequenciaREM_v3');
    if (saved) db = JSON.parse(saved);
    else { db = JSON.parse(JSON.stringify(defaultData)); saveDB(); }
    switchMainTab('mestres');
}

function saveDB() { localStorage.setItem('frequenciaREM_v3', JSON.stringify(db)); }

// Controle das Abas Principais (Topo)
function switchMainTab(tab) {
    document.querySelectorAll('.main-tabs button').forEach(b => b.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    
    document.querySelectorAll('.view-section').forEach(v => v.classList.add('hidden'));
    document.getElementById('view-' + tab).classList.remove('hidden');

    const sidebar = document.getElementById('sidebar');
    
    if(tab === 'mestres') {
        sidebar.style.display = 'flex'; // Mostra sidebar no modo Mestres
        changeSubTab(currentCategory);
    } else if (tab === 'jogadores') {
        sidebar.style.display = 'none'; // Esconde sidebar
        document.body.className = 'theme-blue';
        renderFichas();
    } else if (tab === 'mundo') {
        sidebar.style.display = 'none'; // Esconde sidebar
        document.body.className = 'theme-purple';
    }
}

// Controle do Sidebar (Menu Retrátil)
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('collapsed');
}

// Controle das Sub-Abas do Banco de Dados (Mestres)
function changeSubTab(category) {
    currentCategory = category;
    const bodyObj = document.body;
    bodyObj.className = ''; 
    
    document.querySelectorAll('.sidebar-nav button').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-' + category).classList.add('active');

    const titles = { 'classes': 'Arquivos de Pessoal', 'itens': 'Inventário Clínico', 'monstros': 'Registro de Anomalias' };
    document.getElementById('section-title').innerText = titles[category];

    if(category === 'classes') bodyObj.classList.add('theme-blue');
    if(category === 'itens') bodyObj.classList.add('theme-white');
    if(category === 'monstros') bodyObj.classList.add('theme-purple');
    
    document.getElementById('list-view').classList.remove('hidden');
    document.getElementById('detail-view').classList.add('hidden');
    
    renderCards(category);
}

// Renderiza Itens do Banco de Dados (Mestres)
function renderCards(category) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    
    const groupedData = {};
    if(db[category]){
        db[category].forEach(item => {
            const g = item.group || 'Geral';
            if(!groupedData[g]) groupedData[g] = [];
            groupedData[g].push(item);
        });
    }

    if (isAdmin) {
        const createBtn = document.createElement('button');
        createBtn.className = "btn-primary";
        createBtn.innerText = "+ Adicionar Novo Arquivo";
        createBtn.style.marginBottom = "20px";
        createBtn.onclick = () => openAdminForm(null, category);
        container.appendChild(createBtn);
    }

    for (const [groupName, items] of Object.entries(groupedData)) {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'category-group';
        groupDiv.innerHTML = `<h3 class="category-title">${groupName}</h3>`;
        
        const gridDiv = document.createElement('div');
        gridDiv.className = 'grid-container';
        
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <img src="${item.image}" onerror="this.src='https://via.placeholder.com/400x300/111/fff?text=Registro'">
                <div class="card-content">
                    <h3>${item.name}</h3>
                    <p>${item.summary}</p>
                </div>
            `;
            if (isAdmin) {
                const editBtn = document.createElement('button');
                editBtn.innerText = "Editar";
                editBtn.style = "position:absolute; top:10px; right:10px; background:#000; color:#fff; padding:5px 10px; border:1px solid #fff;";
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

// Renderiza Fichas de Jogadores
function renderFichas() {
    const container = document.getElementById('fichas-container');
    container.innerHTML = '';
    
    if(!db.fichas) db.fichas = [];
    
    db.fichas.forEach(f => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${f.image}" onerror="this.src='https://via.placeholder.com/400x300/111/fff?text=Ficha'">
            <div class="card-content">
                <h3>${f.name}</h3>
                <p style="color:var(--accent-color)">${f.classe}</p>
                <div class="ficha-status">
                    <span style="color:#ff4d4d">❤️ PV: ${f.hp}</span>
                    <span style="color:#4da6ff">🧠 LUC: ${f.lucidez}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function openFichaForm() {
    const nome = prompt("Nome do Personagem:");
    if(!nome) return;
    const classe = prompt("Classe/Arquétipo:");
    
    if(!db.fichas) db.fichas = [];
    db.fichas.push({
        id: 'f_' + Date.now(),
        name: nome,
        classe: classe || 'Desconhecido',
        hp: '20/20',
        lucidez: '10/10',
        image: 'https://via.placeholder.com/400x300/111/fff?text=Ficha'
    });
    saveDB();
    renderFichas();
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
}

function closeDetails() { document.getElementById('detail-view').classList.add('hidden'); document.getElementById('list-view').classList.remove('hidden'); }

// Autenticação Mestre (Painel Admin)
function openAdminLogin() {
    if (isAdmin) { 
        isAdmin = false; 
        document.getElementById('auth-btn').innerText = "Modo Mestre: OFF";
        document.getElementById('auth-btn').style.background = "transparent";
        renderCards(currentCategory); 
    } else { 
        document.getElementById('login-modal').classList.remove('hidden'); 
        document.getElementById('login-error').classList.add('hidden'); 
    }
}

function checkPassword() {
    if (document.getElementById('admin-password').value === 'rem123') {
        isAdmin = true; 
        closeModals(); 
        document.getElementById('auth-btn').innerText = "Modo Mestre: ON";
        document.getElementById('auth-btn').style.background = "var(--accent-color)";
        document.getElementById('auth-btn').style.color = "var(--bg-color)";
        renderCards(currentCategory);
    } else { document.getElementById('login-error').classList.remove('hidden'); }
}

function closeModals() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

// Formulário de Criação (Banco de Dados)
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
    if(confirm("Excluir arquivo permanentemente?")) {
        const cat = document.getElementById('edit-category').value;
        db[cat] = db[cat].filter(i => i.id !== document.getElementById('edit-id').value);
        saveDB(); closeModals(); renderCards(currentCategory);
    }
}

window.onload = initDB;