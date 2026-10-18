// --- DADOS INICIAIS DO RPG (Com URLs de imagens online ativas) ---
const defaultData = {
    classes: [
        {
            id: 'c1',
            name: 'O Tecelão da Realidade',
            image: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?q=80&w=600&auto=format&fit=crop',
            summary: 'Mago focado em Intelecto (INT) que replica o mundo real no Reverso.',
            description: 'ATRIBUTO CHAVE: Intelecto (INT).\n\nO Tecelão da realidade replica o mundo real no Reverso através de anotações táteis de seu caderno, lançando liminares através de gatilhos mentais. Especialista em usar a lógica contra o caos do Mundo dos Sonhos.'
        },
        {
            id: 'c2',
            name: 'O Andarilho da Fenda',
            image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=600&auto=format&fit=crop',
            summary: 'Ladino Ágil focado em Agilidade (AGI). Usa falhas de renderização.',
            description: 'ATRIBUTO CHAVE: Agilidade (AGI).\n\nCombatente de velocidade que usa as falhas de renderização para dar micro-teletransportes e aplicar o Ataque de Noclip. Ignora a armadura do monstro se flanquear. Perfeito para infiltração nas COREs.'
        },
        {
            id: 'c3',
            name: 'Ordinário: Setor de Segurança',
            image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=600&auto=format&fit=crop',
            summary: 'Policial, Bombeiro ou Guarda. Bônus em Iniciativa e Atletismo.',
            description: 'AÇÃO BRUTA. Vida Inicial: 24 + Vigor(d6).\nMecânica - Adrenalina: Ganham pontos sob estresse para realizar ações desesperadas, protegendo a mente do colapso. O policial ganha uma pistola no começo do jogo como arma arcaica e tem +1 em teste de combate e percepção.'
        }
    ],
    itens: [
        {
            id: 'i1',
            name: 'Garrafa de Café da I.T.A.C.',
            image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
            summary: 'Ocupa 1 slot. Recupera Lucidez, mas vicia e causa ansiedade.',
            description: 'TIPO: Consumível (1 Slot).\n\nRecupera 1d6 de Lucidez. Possui três doses. Caso tome a terceira dose na mesma cena, recupera somente 1d4 de lucidez e o personagem fica ansioso pelo resto da cena até descansar corretamente por no mínimo 8 horas.'
        },
        {
            id: 'i2',
            name: 'A Pílula',
            image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop',
            summary: 'Sintoniza o esquadrão no Reverso. Cuidado com o Abuso REM.',
            description: 'TIPO: Transe Químico.\n\nCusta 1 turno (Ação Padrão) e sintoniza o esquadrão unido no mesmo ponto, mas dura apenas 1 hora no mundo real (dilatada para 2 horas ou 20 rodadas de combate no Reverso). Tomar uma segunda pílula seguida causa a Síndrome da Estagnação REM.'
        }
    ],
    monstros: [
        {
            id: 'm1',
            name: 'Sussurro do Isolamento',
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
            summary: 'Pesadelo GDR 2 | IVH 2. Ataca diretamente a mente do alvo.',
            description: 'CLASSIFICAÇÃO: Pesadelo (GDR 2, IVH 2 - Reativo/Territorial)\n\nNasce do abandono. Módulo Customizado: Causa 2d8 de dano direto na barra de Lucidez do jogador em vez de dano na vida física. Recomenda-se o uso de Wonders Defensivas com Aura de Ancoragem para enfrentá-lo.'
        },
        {
            id: 'm2',
            name: 'Manequim Dissonante',
            image: 'https://images.unsplash.com/photo-1508873696983-2df515122519?q=80&w=600&auto=format&fit=crop',
            summary: 'Trauma Físico GDR 1 | IVH 3. Caçador ativo e letal.',
            description: 'CLASSIFICAÇÃO: Trauma (GDR 1, IVH 3 - Predatório)\n\nUm trauma coletivo urbano formado pela apatia das grandes cidades. Ataca com lâminas invisíveis geradas por estática. Combate puramente letal de alta escala física.'
        }
    ]
};

let db = {};
let currentCategory = 'classes';
let isAdmin = false;
const ADMIN_PASSWORD = 'rem123';

function initDB() {
    const saved = localStorage.getItem('frequenciaREM_DB');
    if (saved) {
        db = JSON.parse(saved);
    } else {
        db = JSON.parse(JSON.stringify(defaultData));
        saveDB();
    }
    renderCards(currentCategory);
}

function saveDB() {
    localStorage.setItem('frequenciaREM_DB', JSON.stringify(db));
}

function changeTab(category) {
    currentCategory = category;
    
    const titles = {
        'classes': 'Classes & Arquétipos',
        'itens': 'Arsenal & Itens I.T.A.C.',
        'monstros': 'Anomalias Registradas'
    };
    document.getElementById('section-title').innerText = titles[category];
    
    document.getElementById('list-view').classList.remove('hidden');
    document.getElementById('detail-view').classList.add('hidden');
    
    renderCards(category);
}

function renderCards(category) {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';

    if (isAdmin) {
        const createCard = document.createElement('div');
        createCard.className = 'card';
        createCard.style.display = 'flex';
        createCard.style.alignItems = 'center';
        createCard.style.justifyContent = 'center';
        createCard.style.minHeight = '220px';
        createCard.style.border = '2px dashed #a81c1c';
        createCard.innerHTML = `<h3 style="color:#a81c1c;">+ Adicionar Registro</h3>`;
        createCard.onclick = () => openAdminForm(null, category);
        container.appendChild(createCard);
    }

    db[category].forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        
        let adminBtn = '';
        if (isAdmin) {
            adminBtn = `<button class="btn-edit-card" onclick="event.stopPropagation(); openAdminForm('${item.id}', '${category}')">EDITAR</button>`;
        }

        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'">
            ${adminBtn}
            <div class="card-content">
                <h3>${item.name}</h3>
                <p>${item.summary}</p>
            </div>
        `;
        
        card.onclick = () => showDetails(item);
        container.appendChild(card);
    });
}

function showDetails(item) {
    document.getElementById('list-view').classList.add('hidden');
    const detailView = document.getElementById('detail-view');
    const detailContent = document.getElementById('detail-content');
    
    detailContent.innerHTML = `
        <div class="detail-header">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop'">
            <div class="detail-title">
                <h2>${item.name}</h2>
                <p style="color: var(--text-muted);"><i>${item.summary}</i></p>
            </div>
        </div>
        <div class="detail-body">${item.description}</div>
    `;
    
    detailView.classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeDetails() {
    document.getElementById('detail-view').classList.add('hidden');
    document.getElementById('list-view').classList.remove('hidden');
}

function openAdminLogin() {
    if (isAdmin) {
        isAdmin = false;
        alert("Sessão I.T.A.C. encerrada.");
        renderCards(currentCategory);
    } else {
        document.getElementById('login-modal').classList.remove('hidden');
        document.getElementById('admin-password').value = '';
        document.getElementById('login-error').classList.add('hidden');
    }
}

function checkPassword() {
    const pass = document.getElementById('admin-password').value;
    if (pass === ADMIN_PASSWORD) {
        isAdmin = true;
        closeModals();
        alert("Acesso I.T.A.C. Liberado.");
        renderCards(currentCategory);
    } else {
        document.getElementById('login-error').classList.remove('hidden');
    }
}

function closeModals() {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('admin-panel').classList.add('hidden');
}

function openAdminForm(id, category) {
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('edit-category').value = category;
    
    const btnDelete = document.getElementById('btn-delete');
    
    if (id) {
        document.getElementById('admin-title').innerText = "Editar Registro";
        document.getElementById('edit-id').value = id;
        
        const item = db[category].find(i => i.id === id);
        document.getElementById('form-name').value = item.name;
        document.getElementById('form-image').value = item.image;
        document.getElementById('form-summary').value = item.summary;
        document.getElementById('form-description').value = item.description;
        
        btnDelete.classList.remove('hidden');
    } else {
        document.getElementById('admin-title').innerText = "Novo Registro";
        document.getElementById('edit-id').value = '';
        document.getElementById('form-name').value = '';
        document.getElementById('form-image').value = '';
        document.getElementById('form-summary').value = '';
        document.getElementById('form-description').value = '';
        
        btnDelete.classList.add('hidden');
    }
}

function saveItem() {
    const category = document.getElementById('edit-category').value;
    const id = document.getElementById('edit-id').value;
    
    const newItem = {
        id: id || 'id_' + Date.now(),
        name: document.getElementById('form-name').value,
        image: document.getElementById('form-image').value,
        summary: document.getElementById('form-summary').value,
        description: document.getElementById('form-description').value
    };
    
    if (id) {
        const index = db[category].findIndex(i => i.id === id);
        db[category][index] = newItem;
    } else {
        db[category].push(newItem);
    }
    
    saveDB();
    closeModals();
    renderCards(currentCategory);
}

function deleteItem() {
    if(confirm("Confirmar a exclusão permanente deste registro do banco de dados I.T.A.C.?")) {
        const category = document.getElementById('edit-category').value;
        const id = document.getElementById('edit-id').value;
        
        db[category] = db[category].filter(i => i.id !== id);
        
        saveDB();
        closeModals();
        renderCards(currentCategory);
    }
}

window.onload = initDB;