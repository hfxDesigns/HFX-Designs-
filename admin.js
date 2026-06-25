/* ===========================
   HFX DESIGNS — ADMIN SCRIPT
   =========================== */

const CREDS = { user: 'HFX Designs', pass: 'Finazhafiz@01' };
const KEY = 'hfx_projects';
const AUTH_KEY = 'hfx_auth';

// ── Auth Check ───────────────────────────────────────────
(function checkAuth() {
  const isAuth = sessionStorage.getItem(AUTH_KEY) || localStorage.getItem(AUTH_KEY);
  if (isAuth) showDashboard();
})();

// ── Login ────────────────────────────────────────────────
const loginForm = document.getElementById('loginForm');
loginForm && loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const err = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');
  btn.textContent = 'Signing in…';
  setTimeout(() => {
    if (u === CREDS.user && p === CREDS.pass) {
      if (document.getElementById('rememberMe').checked) {
        localStorage.setItem(AUTH_KEY, '1');
      } else {
        sessionStorage.setItem(AUTH_KEY, '1');
      }
      showDashboard();
    } else {
      err.classList.add('show');
      btn.textContent = 'Sign In';
      setTimeout(() => err.classList.remove('show'), 3500);
    }
  }, 700);
});

// Password toggle
document.getElementById('pwToggle') && document.getElementById('pwToggle').addEventListener('click', () => {
  const inp = document.getElementById('loginPass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
});

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminLayout').style.display = 'grid';
  document.getElementById('body').classList.remove('login-page');
  initAdmin();
}

// ── Logout ───────────────────────────────────────────────
function logout() {
  sessionStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_KEY);
  window.location.reload();
}
document.getElementById('logoutBtn') && document.getElementById('logoutBtn').addEventListener('click', logout);
document.getElementById('logoutBtnMob') && document.getElementById('logoutBtnMob').addEventListener('click', logout);

// ── Sidebar Navigation ────────────────────────────────────
function initAdmin() {
  document.querySelectorAll('.sidebar-link[data-tab]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      switchTab(link.dataset.tab);
    });
  });

  document.getElementById('goAddBtn') && document.getElementById('goAddBtn').addEventListener('click', () => switchTab('add'));
  document.getElementById('addFirstLink') && document.getElementById('addFirstLink').addEventListener('click', e => { e.preventDefault(); switchTab('add'); });

  // Mobile menu
  document.getElementById('mobMenuBtn') && document.getElementById('mobMenuBtn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });

  initProjectForm();
  initDeleteModal();
  initSearch();
  loadDashboard();
  loadProjectsTable();
}

function switchTab(name) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar-link[data-tab]').forEach(l => l.classList.remove('active'));
  const tab = document.getElementById('tab-' + name);
  if (tab) tab.classList.add('active');
  const link = document.querySelector(`.sidebar-link[data-tab="${name}"]`);
  if (link) link.classList.add('active');
  document.getElementById('sidebar').classList.remove('open');

  if (name === 'dashboard') loadDashboard();
  if (name === 'projects') loadProjectsTable();
  if (name === 'add') resetForm();
}

// ── Data Helpers ─────────────────────────────────────────
function getProjects() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}
function saveProjects(arr) {
  localStorage.setItem(KEY, JSON.stringify(arr));
}
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2); }

// ── Dashboard ─────────────────────────────────────────────
function loadDashboard() {
  const projects = getProjects();
  document.getElementById('statTotal').textContent = projects.length;
  const cats = [...new Set(projects.map(p => p.category))];
  document.getElementById('statCats').textContent = cats.length;
  const thisMonth = projects.filter(p => {
    if (!p.createdAt) return false;
    const d = new Date(p.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  document.getElementById('statRecent').textContent = thisMonth;

  const list = document.getElementById('recentList');
  const recent = [...projects].reverse().slice(0, 5);
  list.innerHTML = recent.length ? recent.map(p => `
    <div class="recent-item">
      <div class="recent-thumb">
        ${p.image ? `<img src="${p.image}" alt="${p.title}">` : '◈'}
      </div>
      <div class="recent-info">
        <strong>${p.title}</strong>
        <span>${p.category || '—'}</span>
      </div>
    </div>`).join('') : '<p style="color:var(--gray);font-size:0.88rem">No projects yet.</p>';
}

// ── Projects Table ────────────────────────────────────────
function loadProjectsTable(filter = '') {
  const projects = getProjects();
  const tbody = document.getElementById('projectsTableBody');
  const empty = document.getElementById('tableEmpty');
  const filtered = filter ? projects.filter(p =>
    p.title.toLowerCase().includes(filter) ||
    (p.category || '').toLowerCase().includes(filter)
  ) : projects;

  tbody.innerHTML = '';
  if (!filtered.length) {
    empty.classList.add('show');
    return;
  }
  empty.classList.remove('show');

  filtered.reverse().forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="table-thumb">
          ${p.image ? `<img src="${p.image}" alt="${p.title}">` : '◈'}
        </div>
      </td>
      <td>${p.title}</td>
      <td><span class="table-cat">${p.category || '—'}</span></td>
      <td>
        <div class="table-actions">
          <button class="btn-edit" data-id="${p.id}">Edit</button>
          <button class="btn-del" data-id="${p.id}">Delete</button>
        </div>
      </td>`;
    tr.querySelector('.btn-edit').addEventListener('click', () => editProject(p.id));
    tr.querySelector('.btn-del').addEventListener('click', () => openDeleteModal(p.id));
    tbody.appendChild(tr);
  });
}

// ── Search ────────────────────────────────────────────────
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) return;
  searchInput.addEventListener('input', () => {
    loadProjectsTable(searchInput.value.trim().toLowerCase());
  });
}

// ── Project Form ─────────────────────────────────────────
let imageDataUrl = '';

function initProjectForm() {
  const form = document.getElementById('projectForm');
  const uploadArea = document.getElementById('uploadArea');
  const imageInput = document.getElementById('imageInput');
  const previewWrap = document.getElementById('imagePreviewWrap');
  const preview = document.getElementById('imagePreview');
  const uploadInner = document.getElementById('uploadInner');
  const removeImg = document.getElementById('removeImg');
  const cancelBtn = document.getElementById('cancelEdit');

  uploadArea.addEventListener('click', () => imageInput.click());
  imageInput.addEventListener('change', () => handleFile(imageInput.files[0]));

  uploadArea.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
  uploadArea.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
  uploadArea.addEventListener('drop', e => {
    e.preventDefault(); uploadArea.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      imageDataUrl = ev.target.result;
      preview.src = imageDataUrl;
      uploadInner.style.display = 'none';
      previewWrap.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  removeImg && removeImg.addEventListener('click', e => {
    e.stopPropagation();
    imageDataUrl = '';
    preview.src = '';
    imageInput.value = '';
    uploadInner.style.display = 'block';
    previewWrap.style.display = 'none';
  });

  cancelBtn && cancelBtn.addEventListener('click', () => {
    resetForm();
    switchTab('projects');
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    saveProject();
  });
}

function resetForm() {
  document.getElementById('editId').value = '';
  document.getElementById('pTitle').value = '';
  document.getElementById('pCategory').value = '';
  document.getElementById('pDesc').value = '';
  document.getElementById('pBehance').value = '';
  document.getElementById('pDribbble').value = '';
  imageDataUrl = '';
  const preview = document.getElementById('imagePreview');
  preview.src = '';
  document.getElementById('imageInput').value = '';
  document.getElementById('uploadInner').style.display = 'block';
  document.getElementById('imagePreviewWrap').style.display = 'none';
  document.getElementById('formTabTitle').textContent = 'Add Project';
  document.getElementById('saveBtn').textContent = 'Save Project';
  document.getElementById('formMsg').className = 'form-msg';
  document.getElementById('formMsg').textContent = '';
}

function saveProject() {
  const title = document.getElementById('pTitle').value.trim();
  const cat = document.getElementById('pCategory').value;
  const msg = document.getElementById('formMsg');

  if (!title) { showMsg('error', 'Project title is required.'); return; }
  if (!cat) { showMsg('error', 'Please select a category.'); return; }

  const id = document.getElementById('editId').value;
  const projects = getProjects();

  const projectData = {
    id: id || genId(),
    title,
    category: cat,
    description: document.getElementById('pDesc').value.trim(),
    behance: document.getElementById('pBehance').value.trim(),
    dribbble: document.getElementById('pDribbble').value.trim(),
    image: imageDataUrl || (id ? (projects.find(p => p.id === id) || {}).image || '' : ''),
    createdAt: id ? (projects.find(p => p.id === id) || {}).createdAt || new Date().toISOString() : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  if (id) {
    const idx = projects.findIndex(p => p.id === id);
    if (idx !== -1) projects[idx] = projectData;
    else projects.push(projectData);
  } else {
    projects.push(projectData);
  }

  saveProjects(projects);
  showMsg('success', id ? 'Project updated successfully!' : 'Project added successfully!');
  resetForm();
  setTimeout(() => switchTab('projects'), 1200);
}

function showMsg(type, text) {
  const msg = document.getElementById('formMsg');
  msg.className = 'form-msg ' + type;
  msg.textContent = text;
  setTimeout(() => { msg.className = 'form-msg'; msg.textContent = ''; }, 4000);
}

function editProject(id) {
  const p = getProjects().find(x => x.id === id);
  if (!p) return;
  switchTab('add');
  document.getElementById('editId').value = p.id;
  document.getElementById('pTitle').value = p.title || '';
  document.getElementById('pCategory').value = p.category || '';
  document.getElementById('pDesc').value = p.description || '';
  document.getElementById('pBehance').value = p.behance || '';
  document.getElementById('pDribbble').value = p.dribbble || '';
  document.getElementById('formTabTitle').textContent = 'Edit Project';
  document.getElementById('saveBtn').textContent = 'Update Project';
  if (p.image) {
    imageDataUrl = p.image;
    document.getElementById('imagePreview').src = p.image;
    document.getElementById('uploadInner').style.display = 'none';
    document.getElementById('imagePreviewWrap').style.display = 'block';
  }
}

// ── Delete Modal ──────────────────────────────────────────
let deleteTargetId = null;

function initDeleteModal() {
  document.getElementById('cancelDelete') && document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);
  document.getElementById('confirmDelete') && document.getElementById('confirmDelete').addEventListener('click', () => {
    if (!deleteTargetId) return;
    const projects = getProjects().filter(p => p.id !== deleteTargetId);
    saveProjects(projects);
    closeDeleteModal();
    loadProjectsTable();
    loadDashboard();
  });
}

function openDeleteModal(id) {
  deleteTargetId = id;
  document.getElementById('deleteModal').classList.add('show');
}

function closeDeleteModal() {
  deleteTargetId = null;
  document.getElementById('deleteModal').classList.remove('show');
}
