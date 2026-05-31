document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. DATASETS & STATE
  // =========================================================================
  const PRELOADED_SHORTCUTS = {
    "Telegram": [
      { category: "Window Controls", action: "Lock application with pass", keys: "Ctrl + L" },
      { category: "Window Controls", action: "Minimize window", keys: "Ctrl + M" },
      { category: "Window Controls", action: "Close window", keys: "Ctrl + W" },
      { category: "Window Controls", action: "Quit application", keys: "Ctrl + Q" },
      { category: "Search & Find", action: "Search current chat messages", keys: "Ctrl + F" },
      { category: "Chat Navigation", action: "Go to previous chat", keys: "Alt + Up" },
      { category: "Chat Navigation", action: "Go to next chat", keys: "Alt + Down" },
      { category: "Chat Navigation", action: "Open Saved Messages", keys: "Ctrl + 0" },
      { category: "Chat Navigation", action: "Go to pinned chat #1 to #8", keys: "Ctrl + 1 ... Ctrl + 8" },
      { category: "Chat Navigation", action: "Open Archived chats folder", keys: "Ctrl + 9" },
      { category: "Chat Actions", action: "Mark chat as read", keys: "Ctrl + R" },
      { category: "Chat Actions", action: "Record voice / video message", keys: "Ctrl + R" },
      { category: "Chat Actions", action: "Open contacts list panel", keys: "Ctrl + J" },
      { category: "Media Controls", action: "Play / Pause active media", keys: "Space" }
    ],
    "PC / Laptop": [
      { category: "System Actions", action: "Copy selected item", keys: "Ctrl + C" },
      { category: "System Actions", action: "Paste copied item", keys: "Ctrl + V" },
      { category: "System Actions", action: "Cut selected item", keys: "Ctrl + X" },
      { category: "System Actions", action: "Undo last command", keys: "Ctrl + Z" },
      { category: "System Actions", action: "Redo undone command", keys: "Ctrl + Y" },
      { category: "System Actions", action: "Select all elements in focus", keys: "Ctrl + A" },
      { category: "Window Control", action: "Switch between active windows", keys: "Alt + Tab" },
      { category: "Window Control", action: "Close active application", keys: "Alt + F4" },
      { category: "Window Control", action: "Lock PC user workspace", keys: "Win + L" },
      { category: "Window Control", action: "Show or hide Desktop workspace", keys: "Win + D" },
      { category: "Utility Tools", action: "Open File Explorer window", keys: "Win + E" },
      { category: "Utility Tools", action: "Open System Settings window", keys: "Win + I" },
      { category: "Utility Tools", action: "Launch Task Manager utility", keys: "Ctrl + Shift + Esc" },
      { category: "Utility Tools", action: "Open screen snip utility", keys: "Win + Shift + S" }
    ],
    "VS Code": [
      { category: "General Editor", action: "Show Command Palette launcher", keys: "Ctrl + Shift + P" },
      { category: "General Editor", action: "Quick Open, Go to File...", keys: "Ctrl + P" },
      { category: "General Editor", action: "Open Editor Preferences", keys: "Ctrl + ," },
      { category: "Line Editing", action: "Cut entire active line", keys: "Ctrl + X" },
      { category: "Line Editing", action: "Copy entire active line", keys: "Ctrl + C" },
      { category: "Line Editing", action: "Move selected lines up/down", keys: "Alt + Up / Down" },
      { category: "Line Editing", action: "Copy selected lines up/down", keys: "Shift + Alt + Up / Down" },
      { category: "Line Editing", action: "Insert new line below/above", keys: "Ctrl + Enter / Ctrl + Shift + Enter" },
      { category: "Navigation", action: "Find matching bracket", keys: "Ctrl + Shift + \\" },
      { category: "Navigation", action: "Toggle primary sidebar view", keys: "Ctrl + B" },
      { category: "Navigation", action: "Show project global Search panel", keys: "Ctrl + Shift + F" }
    ],
    "Figma": [
      { category: "Design Tools", action: "Select Move Tool option", keys: "V" },
      { category: "Design Tools", action: "Select Frame Tool option", keys: "F" },
      { category: "Design Tools", action: "Select Rectangle Tool shape", keys: "R" },
      { category: "Design Tools", action: "Select Pen Tool pathing", keys: "P" },
      { category: "Design Tools", action: "Select Text Tool editor", keys: "T" },
      { category: "Arrangement", action: "Bring element to front layer", keys: "]" },
      { category: "Arrangement", action: "Send element to back layer", keys: "[" },
      { category: "Arrangement", action: "Group selected layers/shapes", keys: "Ctrl + G" },
      { category: "Arrangement", action: "Ungroup active elements", keys: "Ctrl + Shift + G" },
      { category: "Arrangement", action: "Align selection Top", keys: "Alt + W" },
      { category: "Arrangement", action: "Align selection Center Vertical", keys: "Alt + H" }
    ],
    "Chrome": [
      { category: "Tab Control", action: "Open new browser tab", keys: "Ctrl + T" },
      { category: "Tab Control", action: "Reopen last closed tab", keys: "Ctrl + Shift + T" },
      { category: "Tab Control", action: "Close current active tab", keys: "Ctrl + W" },
      { category: "Tab Control", action: "Go to next open tab", keys: "Ctrl + Tab" },
      { category: "Tab Control", action: "Go to previous open tab", keys: "Ctrl + Shift + Tab" },
      { category: "Navigation", action: "Focus address bar URL", keys: "Ctrl + L" },
      { category: "Navigation", action: "Reload current website page", keys: "Ctrl + R" },
      { category: "Navigation", action: "Hard reload (ignore cache)", keys: "Ctrl + Shift + R" },
      { category: "Navigation", action: "Go back in tab history", keys: "Alt + Left" },
      { category: "Navigation", action: "Go forward in tab history", keys: "Alt + Right" }
    ]
  };

  let activeTab = "Telegram";
  let shortcutStore = {};
  let deletedApps = [];
  let isAdmin = false;

  function checkAdminStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'priyalalju') {
      localStorage.setItem('isAdmin_v1', 'true');
      urlParams.delete('admin');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState({}, '', newUrl);
    }
    isAdmin = localStorage.getItem('isAdmin_v1') === 'true';
  }

  // Retrieve user customized shortcuts from Cloud Database
  async function loadShortcuts() {
    try {
      const shortcutsRes = await fetch('https://kvdb.io/5FYh9Y191oKiuEJcEPTAGC/shortcuts');
      if (shortcutsRes.ok) {
        shortcutStore = await shortcutsRes.json();
        localStorage.setItem('custom_shortcuts_v1', JSON.stringify(shortcutStore));
      } else if (shortcutsRes.status === 404) {
        shortcutStore = {};
      }
    } catch (e) {
      console.warn("Failed to load shortcuts from cloud:", e);
    }
    
    try {
      const deletedRes = await fetch('https://kvdb.io/5FYh9Y191oKiuEJcEPTAGC/deleted_apps');
      if (deletedRes.ok) {
        deletedApps = await deletedRes.json();
        localStorage.setItem('deleted_apps_v1', JSON.stringify(deletedApps));
      } else if (deletedRes.status === 404) {
        deletedApps = [];
      }
    } catch (e) {
      console.warn("Failed to load deleted apps from cloud:", e);
    }
  }

  // Save changes back to LocalStorage & Cloud Database
  async function saveShortcuts() {
    localStorage.setItem('custom_shortcuts_v1', JSON.stringify(shortcutStore));
    if (isAdmin) {
      try {
        await fetch('https://kvdb.io/5FYh9Y191oKiuEJcEPTAGC/shortcuts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(shortcutStore)
        });
      } catch (e) {
        console.error("Failed to sync shortcuts to cloud:", e);
      }
    }
  }

  async function saveDeletedApps() {
    localStorage.setItem('deleted_apps_v1', JSON.stringify(deletedApps));
    if (isAdmin) {
      try {
        await fetch('https://kvdb.io/5FYh9Y191oKiuEJcEPTAGC/deleted_apps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(deletedApps)
        });
      } catch (e) {
        console.error("Failed to sync deleted apps to cloud:", e);
      }
    }
  }

  // Combine preloaded and custom user shortcuts
  function getShortcutsForApp(app) {
    const preloaded = PRELOADED_SHORTCUTS[app] || [];
    const custom = shortcutStore[app] || [];
    return [...preloaded, ...custom];
  }

  // Get list of all available apps
  function getAppList() {
    const preloadedApps = Object.keys(PRELOADED_SHORTCUTS);
    const customApps = Object.keys(shortcutStore);
    const all = Array.from(new Set([...preloadedApps, ...customApps]));
    // Filter out deleted workspaces
    return all.filter(app => !deletedApps.includes(app));
  }

  // =========================================================================
  // 2. RENDER CONTROLS
  // =========================================================================
  const appTabsContainer = document.getElementById('app-tabs');
  const shortcutsDisplayArea = document.getElementById('shortcuts-display-area');
  const addShortcutPanel = document.getElementById('add-shortcut-panel');
  const searchSection = document.getElementById('search-section');
  const appSelect = document.getElementById('app-select');

  const searchInput = document.getElementById('search-input');

  function renderTabs() {
    if (!appTabsContainer) return;
    appTabsContainer.innerHTML = '';
    
    const apps = getAppList();
    
    // Create tab elements for each app
    apps.forEach(app => {
      const btn = document.createElement('button');
      btn.className = `tab-button ${app === activeTab ? 'active' : ''}`;
      btn.textContent = `${app} Shortcuts`;
      btn.addEventListener('click', () => selectApp(app));
      appTabsContainer.appendChild(btn);
    });

    // Add Special "+ Add Tab" Button
    if (isAdmin) {
      const newTabBtn = document.createElement('button');
      newTabBtn.className = `tab-button add-tab-btn`;
      newTabBtn.textContent = '+ Create App Tab';
      newTabBtn.addEventListener('click', () => createNewTabPrompt());
      appTabsContainer.appendChild(newTabBtn);

      // Add Special "+ Add Shortcut" Tab
      const addBtn = document.createElement('button');
      addBtn.className = `tab-button add-tab-btn ${activeTab === 'ADD_MORE_PANEL' ? 'active' : ''}`;
      addBtn.textContent = '+ Add Shortcut';
      addBtn.addEventListener('click', () => selectApp('ADD_MORE_PANEL'));
      appTabsContainer.appendChild(addBtn);
    }


  }

  function createNewTabPrompt() {
    const name = prompt("Enter the name for the new Application Tab:");
    if (!name) return;
    const cleanName = name.trim();
    if (cleanName === '' || cleanName === 'CREATE_NEW' || cleanName === 'ADD_MORE_PANEL') return;
    
    // If it was previously deleted, undelete it
    if (deletedApps.includes(cleanName)) {
      deletedApps = deletedApps.filter(a => a !== cleanName);
      saveDeletedApps();
    }
    
    if (!shortcutStore[cleanName]) {
      shortcutStore[cleanName] = [];
      saveShortcuts();
    }
    showToast(`Created new App Tab: ${cleanName}`);
    initForm();
    selectApp(cleanName);
  }

  function deleteCurrentAppTab() {
    if (activeTab === 'ADD_MORE_PANEL') return;
    const confirmDelete = confirm(`Are you sure you want to remove the "${activeTab}" tab and delete all its shortcuts?`);
    if (!confirmDelete) return;

    // Add to deleted apps list
    if (!deletedApps.includes(activeTab)) {
      deletedApps.push(activeTab);
      saveDeletedApps();
    }

    // Clean from custom stores
    if (shortcutStore[activeTab]) {
      delete shortcutStore[activeTab];
      saveShortcuts();
    }

    showToast(`Removed "${activeTab}" App Tab`);
    
    // Switch to first available tab
    const remaining = getAppList();
    initForm();
    if (remaining.length > 0) {
      selectApp(remaining[0]);
    } else {
      selectApp('ADD_MORE_PANEL');
    }
  }

  function renderShortcuts() {
    if (!shortcutsDisplayArea) return;
    shortcutsDisplayArea.innerHTML = '';
    
    if (activeTab === 'ADD_MORE_PANEL') {
      shortcutsDisplayArea.style.display = 'none';
      searchSection.style.display = 'none';
      addShortcutPanel.classList.add('active');
      return;
    }

    addShortcutPanel.classList.remove('active');
    shortcutsDisplayArea.style.display = 'block';
    searchSection.style.display = 'block';

    // RENDER HEADER ACTIONS (Delete App Tab, Edit All JSON)
    const headerControls = document.createElement('div');
    headerControls.className = 'app-header-controls';
    
    const titleHeader = document.createElement('h2');
    titleHeader.className = 'section-title';
    titleHeader.textContent = `${activeTab} Workspace`;
    headerControls.appendChild(titleHeader);

    if (isAdmin) {
      const actionGroup = document.createElement('div');
      actionGroup.className = 'app-actions-group';

      // "Edit All JSON" Trigger
      const editAllBtn = document.createElement('button');
      editAllBtn.className = 'btn-action-outline';
      editAllBtn.textContent = 'Edit JSON Config';
      editAllBtn.addEventListener('click', () => openJsonEditor(activeTab));
      actionGroup.appendChild(editAllBtn);

      // "Delete Tab" Trigger
      const deleteTabBtn = document.createElement('button');
      deleteTabBtn.className = 'btn-action-outline danger';
      deleteTabBtn.textContent = 'Delete Tab';
      deleteTabBtn.addEventListener('click', () => deleteCurrentAppTab());
      actionGroup.appendChild(deleteTabBtn);

      headerControls.appendChild(actionGroup);
    }
    shortcutsDisplayArea.appendChild(headerControls);

    const list = getShortcutsForApp(activeTab);

    if (list.length === 0) {
      const welcomeCard = document.createElement('div');
      welcomeCard.className = 'welcome-card';
      welcomeCard.style.padding = '40px 20px';
      welcomeCard.style.marginBottom = '25px';
      welcomeCard.innerHTML = `
        <h2>No shortcuts registered</h2>
        <p>Add a shortcut in this tab using the quick form below.</p>
      `;
      shortcutsDisplayArea.appendChild(welcomeCard);
      // Render quick inline add form anyway
      renderInlineAddForm(shortcutsDisplayArea);
      return;
    }

    // Group shortcuts by Category
    const groups = {};
    list.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });

    // Render grouped tables
    Object.keys(groups).forEach(category => {
      const section = document.createElement('div');
      section.className = 'section-group';

      const caption = document.createElement('div');
      caption.className = 'section-caption-block';
      caption.textContent = 'Category';
      section.appendChild(caption);

      const title = document.createElement('h2');
      title.className = 'section-title';
      title.textContent = category;
      section.appendChild(title);

      const tableCard = document.createElement('div');
      tableCard.className = 'table-card';

      const table = document.createElement('table');
      const thead = document.createElement('thead');
      thead.innerHTML = `
        <tr>
          <th>Action</th>
          <th>Shortcut Keycaps</th>
        </tr>
      `;
      table.appendChild(thead);

      const tbody = document.createElement('tbody');
      groups[category].forEach(item => {
        const row = document.createElement('tr');
        
        const actionTd = document.createElement('td');
        actionTd.className = 'shortcut-action-td';
        actionTd.textContent = item.action;
        row.appendChild(actionTd);

        const keysTd = document.createElement('td');
        
        // Parse keys (split by +, space etc. to render physical codes)
        const keysArr = item.keys.split(' ');
        keysArr.forEach(part => {
          if (part.toLowerCase() === '+' || part.toLowerCase() === '...') {
            keysTd.appendChild(document.createTextNode(` ${part} `));
          } else if (part.trim() !== '') {
            const code = document.createElement('code');
            code.textContent = part.trim();
            keysTd.appendChild(code);
          }
        });
        row.appendChild(keysTd);
        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      tableCard.appendChild(table);
      section.appendChild(tableCard);
      shortcutsDisplayArea.appendChild(section);
    });

    // RENDER QUICK INLINE ADD FORM AT THE BOTTOM OF THE TAB VIEW
    if (isAdmin) {
      renderInlineAddForm(shortcutsDisplayArea);
    }

    // Rebind mouse enter/leave listeners to new elements for custom cursor scaling
    bindCursorHoverEvents();
  }

  function renderInlineAddForm(container) {
    const inlineContainer = document.createElement('div');
    inlineContainer.className = 'section-group';
    inlineContainer.style.marginTop = '40px';

    const caption = document.createElement('div');
    caption.className = 'section-caption-block';
    caption.textContent = 'Action';
    inlineContainer.appendChild(caption);

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.textContent = 'Add Shortcut to this Tab';
    inlineContainer.appendChild(title);

    const formWrapper = document.createElement('div');
    formWrapper.className = 'table-card table-add-row-container';

    const form = document.createElement('form');
    form.className = 'inline-add-form';
    form.innerHTML = `
      <div class="inline-add-field">
        <input type="text" class="inline-add-input" id="inline-category" placeholder="Category (e.g. Navigation)" required>
      </div>
      <div class="inline-add-field">
        <input type="text" class="inline-add-input" id="inline-action" placeholder="Action Command" required>
      </div>
      <div class="inline-add-field">
        <input type="text" class="inline-add-input" id="inline-keys" placeholder="Keys (e.g. Ctrl + F)" required>
      </div>
      <button type="submit" class="btn-inline-add">+ Add</button>
    `;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const cat = document.getElementById('inline-category').value.trim();
      const act = document.getElementById('inline-action').value.trim();
      const keys = document.getElementById('inline-keys').value.trim();

      if (!cat || !act || !keys) return;

      // Add to custom store
      if (!shortcutStore[activeTab]) {
        shortcutStore[activeTab] = [];
      }
      
      // If it is a preloaded app, copy preloaded ones to custom store first so they can coexist and be saved
      const preloadedCount = PRELOADED_SHORTCUTS[activeTab] ? PRELOADED_SHORTCUTS[activeTab].length : 0;
      const customCount = shortcutStore[activeTab].length;
      
      if (preloadedCount > 0 && customCount === 0) {
        shortcutStore[activeTab] = [...PRELOADED_SHORTCUTS[activeTab]];
      }

      shortcutStore[activeTab].push({ category: cat, action: act, keys: keys });
      saveShortcuts();

      showToast(`Added shortcut to ${activeTab}!`);
      renderShortcuts();
    });

    formWrapper.appendChild(form);
    inlineContainer.appendChild(formWrapper);
    container.appendChild(inlineContainer);
  }

  function selectApp(app) {
    if (app === 'ADD_MORE_PANEL' && !isAdmin) {
      app = getAppList()[0] || 'Telegram';
    }
    activeTab = app;
    searchInput.value = '';
    renderTabs();
    renderShortcuts();
  }

  // =========================================================================
  // 3. ADD SHORTCUT FORM LOGIC (+ ADD TAB VIEW)
  // =========================================================================
  const newAppGroup = document.getElementById('new-app-group');
  const shortcutCreatorForm = document.getElementById('shortcut-creator-form');
  const ctaAddShortcutBtn = document.getElementById('cta-add-shortcut-btn');
  const navAddBtn = document.getElementById('nav-add-btn');
  const navHomeBtn = document.getElementById('nav-home-btn');

  function initForm() {
    if (!appSelect) return;
    appSelect.innerHTML = '';
    
    const apps = getAppList();
    
    // Fill select input
    apps.forEach(app => {
      const opt = document.createElement('option');
      opt.value = app;
      opt.textContent = app;
      appSelect.appendChild(opt);
    });

    const dividerOpt = document.createElement('option');
    dividerOpt.disabled = true;
    dividerOpt.textContent = "──────────";
    appSelect.appendChild(dividerOpt);

    const newOpt = document.createElement('option');
    newOpt.value = "CREATE_NEW";
    newOpt.textContent = "+ Create New App Tab...";
    appSelect.appendChild(newOpt);

    // Toggle custom app field visibility
    appSelect.addEventListener('change', (e) => {
      if (e.target.value === 'CREATE_NEW') {
        newAppGroup.style.display = 'flex';
        document.getElementById('new-app-name').setAttribute('required', 'required');
      } else {
        newAppGroup.style.display = 'none';
        document.getElementById('new-app-name').removeAttribute('required');
      }
    });
  }

  // Navigation Links Binding
  if (ctaAddShortcutBtn) {
    ctaAddShortcutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectApp('ADD_MORE_PANEL');
    });
  }
  if (navAddBtn) {
    navAddBtn.addEventListener('click', (e) => {
      e.preventDefault();
      selectApp('ADD_MORE_PANEL');
    });
  }
  if (navHomeBtn) {
    navHomeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (getAppList().includes('Telegram')) {
        selectApp('Telegram');
      } else if (getAppList().length > 0) {
        selectApp(getAppList()[0]);
      } else {
        selectApp('ADD_MORE_PANEL');
      }
    });
  }

  // Form submission handler
  if (shortcutCreatorForm) {
    shortcutCreatorForm.addEventListener('submit', (e) => {
      e.preventDefault();

      let targetApp = appSelect.value;
      const newAppNameInput = document.getElementById('new-app-name');
      const categoryInput = document.getElementById('shortcut-category');
      const actionInput = document.getElementById('shortcut-action');
      const keysInput = document.getElementById('shortcut-keys');

      if (targetApp === 'CREATE_NEW') {
        targetApp = newAppNameInput.value.trim();
        if (!targetApp) return;
        
        if (deletedApps.includes(targetApp)) {
          deletedApps = deletedApps.filter(a => a !== targetApp);
          saveDeletedApps();
        }
      }

      const category = categoryInput.value.trim();
      const action = actionInput.value.trim();
      const keys = keysInput.value.trim();

      if (!category || !action || !keys) return;

      // Add to store
      if (!shortcutStore[targetApp]) {
        shortcutStore[targetApp] = [];
      }
      
      const preloadedCount = PRELOADED_SHORTCUTS[targetApp] ? PRELOADED_SHORTCUTS[targetApp].length : 0;
      const customCount = shortcutStore[targetApp].length;
      if (preloadedCount > 0 && customCount === 0) {
        shortcutStore[targetApp] = [...PRELOADED_SHORTCUTS[targetApp]];
      }

      shortcutStore[targetApp].push({ category, action, keys });
      saveShortcuts();

      // Show toast alert
      showToast(`Added shortcut to ${targetApp}!`);

      // Reset form
      shortcutCreatorForm.reset();
      newAppGroup.style.display = 'none';
      newAppNameInput.removeAttribute('required');

      // Re-initialize select boxes & transition to the app
      initForm();
      selectApp(targetApp);
    });
  }

  // Toast indicator controller
  function showToast(message) {
    const toast = document.getElementById('toast-notification');
    const toastText = toast?.querySelector('.toast-text');
    if (toast && toastText) {
      toastText.textContent = message;
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 3000);
    }
  }

  // =========================================================================
  // 4. MANUAL JSON SHORTCUTS EDITOR MODAL ENGINE
  // =========================================================================
  const jsonModal = document.getElementById('json-editor-modal');
  const jsonTitle = document.getElementById('json-editor-title');
  const jsonTextarea = document.getElementById('json-editor-textarea');
  const jsonErrorMsg = document.getElementById('json-error-msg');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const cancelJsonBtn = document.getElementById('cancel-json-btn');
  const saveJsonBtn = document.getElementById('save-json-btn');
  let currentEditingApp = '';

  function openJsonEditor(app) {
    currentEditingApp = app;
    if (!jsonModal || !jsonTextarea || !jsonTitle) return;

    jsonTitle.textContent = `Edit "${app}" Shortcuts Configuration`;
    
    // Read combined list
    const list = getShortcutsForApp(app);
    jsonTextarea.value = JSON.stringify(list, null, 2);
    jsonErrorMsg.style.display = 'none';
    jsonModal.classList.add('active');

    // Remove cursor classes temporarily to allow standard pointer inside json modal if hover fine
    document.body.classList.add('modal-open');
  }

  function closeJsonEditor() {
    if (!jsonModal) return;
    jsonModal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeJsonEditor);
  if (cancelJsonBtn) cancelJsonBtn.addEventListener('click', closeJsonEditor);
  
  if (saveJsonBtn) {
    saveJsonBtn.addEventListener('click', () => {
      const text = jsonTextarea.value;
      try {
        const parsed = JSON.parse(text);
        
        // Basic schema validator
        if (!Array.isArray(parsed)) {
          throw new Error("Must be an array of shortcuts");
        }

        parsed.forEach(item => {
          if (typeof item.category !== 'string' || typeof item.action !== 'string' || typeof item.keys !== 'string') {
            throw new Error("Invalid structure, missing keys");
          }
        });

        // Valid configuration, save to custom store
        shortcutStore[currentEditingApp] = parsed;
        
        // Remove from deletedApps if it was deleted
        if (deletedApps.includes(currentEditingApp)) {
          deletedApps = deletedApps.filter(a => a !== currentEditingApp);
          saveDeletedApps();
        }

        saveShortcuts();
        showToast(`Saved shortcut configuration for ${currentEditingApp}`);
        closeJsonEditor();
        renderShortcuts();
      } catch (e) {
        jsonErrorMsg.style.display = 'block';
        jsonErrorMsg.textContent = `Invalid structure: ${e.message}. Please use valid JSON.`;
      }
    });
  }

  // =========================================================================
  // 5. LIVE INTERACTIVE SEARCH FILTER
  // =========================================================================
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();

      const groups = shortcutsDisplayArea.querySelectorAll('.section-group');
      if (!query) {
        // Reset original texts and display properties
        groups.forEach(group => {
          group.style.display = '';
          const rows = group.querySelectorAll('tbody tr');
          rows.forEach(row => {
            row.style.display = '';
            const actionTd = row.querySelector('.shortcut-action-td');
            if (actionTd && actionTd.dataset.original) {
              actionTd.innerHTML = actionTd.dataset.original;
              delete actionTd.dataset.original;
            }
          });
        });
        return;
      }

      groups.forEach(group => {
        const rows = group.querySelectorAll('tbody tr');
        let visibleRows = 0;

        rows.forEach(row => {
          const actionTd = row.querySelector('.shortcut-action-td');
          const actionText = actionTd ? actionTd.textContent.toLowerCase() : '';
          const keyCodesText = Array.from(row.querySelectorAll('code'))
            .map(code => code.textContent.toLowerCase())
            .join(' ');

          const isMatched = actionText.includes(query) || keyCodesText.includes(query);

          if (isMatched) {
            row.style.display = '';
            visibleRows++;

            // Highlight matches
            if (actionTd) {
              if (!actionTd.dataset.original) {
                actionTd.dataset.original = actionTd.innerHTML;
              }
              const originalText = actionTd.dataset.original;
              const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
              actionTd.innerHTML = originalText.replace(regex, '<span class="search-highlight">$1</span>');
            }
          } else {
            row.style.display = 'none';
          }
        });

        // Hide group if no row matched
        if (visibleRows === 0) {
          group.style.display = 'none';
        } else {
          group.style.display = '';
        }
      });
    });
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }



  // =========================================================================
  // 7. PREMIUM GLOWING CUSTOM CURSOR (CENTER ALIGNED)
  // =========================================================================
  const cursorDot = document.querySelector('.cursor-pointer-dot');
  const cursorGlow = document.querySelector('.cursor-pointer-glow');
  const cursorWrapper = document.querySelector('.cursor-pointer-dot-wrapper');

  if (cursorDot && cursorGlow && cursorWrapper) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    let dotX = mouseX;
    let dotY = mouseY;
    let glowX = mouseX;
    let glowY = mouseY;

    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      // Make cursor visible when moving
      if (!isVisible) {
        cursorWrapper.style.opacity = '1';
        isVisible = true;
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener('mouseout', () => {
      cursorWrapper.style.opacity = '0';
      isVisible = false;
    });

    function animateCursor() {
      // Single ease rate to prevent the dot from moving away from the center of the outer ring
      const ease = 0.22;

      dotX += (mouseX - dotX) * ease;
      dotY += (mouseY - dotY) * ease;

      // Both components use the same dot coordinates to keep the dot perfectly centered in the circle
      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
      cursorGlow.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;

      requestAnimationFrame(animateCursor);
    }
    animateCursor();
  }

  // Bind scale-up expand classes when mouse hovers over clickable items
  function bindCursorHoverEvents() {
    if (!cursorDot || !cursorGlow) return;
    
    // Select all interactive targets
    const hoverTargets = document.querySelectorAll(
      'a, button, select, input, textarea, code, tr, th, .tab-button, .logo-icon, .logo-text, .btn-action-outline, .btn-inline-add'
    );

    hoverTargets.forEach(target => {
      // Remove any existing event listeners to avoid duplicates
      target.removeEventListener('mouseenter', onMouseEnterHover);
      target.removeEventListener('mouseleave', onMouseLeaveHover);
      
      // Bind new listeners
      target.addEventListener('mouseenter', onMouseEnterHover);
      target.addEventListener('mouseleave', onMouseLeaveHover);
    });
  }

  function onMouseEnterHover() {
    cursorDot?.classList.add('hovered');
    cursorGlow?.classList.add('hovered');
  }

  function onMouseLeaveHover() {
    cursorDot?.classList.remove('hovered');
    cursorGlow?.classList.remove('hovered');
  }

  // =========================================================================
  // 8. BOOTSTRAP INITIALIZATION
  // =========================================================================
  checkAdminStatus();

  // Load cached settings immediately for fast layout loading
  const savedCached = localStorage.getItem('custom_shortcuts_v1');
  if (savedCached) {
    try {
      shortcutStore = JSON.parse(savedCached);
    } catch (e) {}
  }
  const savedDeletedCached = localStorage.getItem('deleted_apps_v1');
  if (savedDeletedCached) {
    try {
      deletedApps = JSON.parse(savedDeletedCached);
    } catch (e) {}
  }

  // Toggle Admin Portal Login trigger
  const adminTrigger = document.getElementById('admin-login-trigger');
  if (adminTrigger) {
    if (isAdmin) {
      adminTrigger.textContent = "Logout Admin";
      adminTrigger.addEventListener('click', () => {
        localStorage.removeItem('isAdmin_v1');
        showToast("Logged out of Admin Portal!");
        setTimeout(() => window.location.reload(), 1000);
      });
    } else {
      adminTrigger.addEventListener('click', () => {
        const pass = prompt("Enter Admin Password:");
        if (pass === 'priyalalju') {
          localStorage.setItem('isAdmin_v1', 'true');
          showToast("Logged in as Admin!");
          setTimeout(() => window.location.reload(), 1000);
        } else if (pass !== null) {
          showToast("Incorrect Password!");
        }
      });
    }
  }

  // Toggle Admin visibility elements
  if (ctaAddShortcutBtn) ctaAddShortcutBtn.style.display = isAdmin ? 'inline-block' : 'none';
  if (navAddBtn) navAddBtn.style.display = isAdmin ? 'inline-block' : 'none';

  renderTabs();
  renderShortcuts();
  initForm();

  // Fetch fresh data from KVDB database in background and re-render
  loadShortcuts().then(() => {
    const apps = getAppList();
    if (!apps.includes(activeTab) && activeTab !== 'ADD_MORE_PANEL') {
      activeTab = apps[0] || 'ADD_MORE_PANEL';
    }
    renderTabs();
    renderShortcuts();
    initForm();
  });
  
  // Connect branding link home button
  const brandLink = document.getElementById('nav-brand-link');
  if (brandLink) {
    brandLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (getAppList().includes('Telegram')) {
        selectApp('Telegram');
      } else if (getAppList().length > 0) {
        selectApp(getAppList()[0]);
      }
    });
  }

  // =========================================================================
  // 8. PARALLAX LIQUID SCROLL EFFECT
  // =========================================================================
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');
    const blob3 = document.querySelector('.blob-3');
    const blob4 = document.querySelector('.blob-4');

    if (blob1) blob1.style.transform = `translate3d(0, ${scrolled * 0.22}px, 0)`;
    if (blob2) blob2.style.transform = `translate3d(0, ${scrolled * -0.15}px, 0)`;
    if (blob3) blob3.style.transform = `translate3d(0, ${scrolled * 0.12}px, 0)`;
    if (blob4) blob4.style.transform = `translate3d(0, ${scrolled * 0.28}px, 0)`;
  });

  // Initial trigger for cursor scaling events
  bindCursorHoverEvents();
});
