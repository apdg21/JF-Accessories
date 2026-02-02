// Admin Form JavaScript - Simplified with working Edit
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.admin-form-page')) return;
    
    initAdminForm();
});

function initAdminForm() {
    console.log('Admin form initialized');
    
    // Initialize earings data and editing state
    let earings = [];
    let editingId = null;
    
    // Load data immediately
    loadInitialData().then(data => {
        earings = data;
        console.log('Initial data loaded:', earings.length, 'earings');
        loadEaringsList();
        updateJSONOutput();
    });
    
    // DOM Elements
    const form = document.getElementById('earing-form');
    const saveBtn = document.querySelector('.btn-save');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editStatus = document.getElementById('edit-status');
    const jsonOutput = document.getElementById('json-output');
    
    // Check if elements exist
    if (!form || !saveBtn) {
        console.error('Form or Save button not found!');
        return;
    }
    
    console.log('Save button found:', saveBtn);
    console.log('Cancel button found:', cancelEditBtn);
    console.log('Edit status found:', editStatus);
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = button.getAttribute('data-tab');
            
            // Clear editing state when switching tabs
            clearEditState();
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
            
            // Load data for specific tabs
            if (tabId === 'view-earings') {
                loadEaringsList();
            } else if (tabId === 'export-data') {
                updateJSONOutput();
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submit triggered');
        console.log('Current editingId:', editingId);
        saveEaring();
    });
    
    // Cancel edit button
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            console.log('Cancel edit clicked');
            clearEditState();
            form.reset();
            showNotification('Edit cancelled.', 'info');
        });
    }
    
    // Form reset
    form.addEventListener('reset', function() {
        console.log('Form reset');
        clearEditState();
    });
    
    // Copy JSON button
    document.getElementById('copy-json-btn').addEventListener('click', copyJSON);
    
    // Download JSON button
    document.getElementById('download-json-btn').addEventListener('click', downloadJSON);
    
    // Image preview setup
    setupImagePreviews();
    
    // FUNCTIONS
    async function loadInitialData() {
        console.log('Loading initial data...');
        
        // First try localStorage
        try {
            const saved = localStorage.getItem('jfEarings');
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('Loaded from localStorage:', parsed.length, 'items');
                return Array.isArray(parsed) ? parsed : [];
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        
        // Try JSON file as fallback
        try {
            const response = await fetch('earings-data.json');
            if (response.ok) {
                const data = await response.json();
                console.log('Loaded from JSON file:', data.earings?.length || 0, 'items');
                return data.earings || [];
            }
        } catch (error) {
            console.log('No JSON file found or error:', error);
        }
        
        console.log('No data found, starting with empty array');
        return [];
    }
    
    function setupImagePreviews() {
        const letters = ['a', 'b', 'c', 'd', 'e'];
        letters.forEach(letter => {
            const input = document.getElementById(`image-${letter}`);
            const preview = document.getElementById(`preview-${letter}`);
            
            if (input && preview) {
                input.addEventListener('input', function() {
                    const imageName = this.value.trim();
                    if (!imageName) {
                        preview.innerHTML = `
                            <div class="image-placeholder">
                                <i class="fas fa-image"></i><br>
                                No Image
                            </div>
                        `;
                        return;
                    }
                    
                    const cleanName = imageName.split('/').pop().split('\\').pop();
                    const img = new Image();
                    img.onload = function() {
                        preview.innerHTML = `<img src="assets/earings/${cleanName}" class="image-preview" alt="${cleanName}">`;
                    };
                    img.onerror = function() {
                        preview.innerHTML = `
                            <div class="image-placeholder">
                                <i class="fas fa-question-circle"></i><br>
                                ${cleanName}<br>
                                <small>(Will work when uploaded)</small>
                            </div>
                        `;
                    };
                    img.src = `assets/earings/${cleanName}`;
                });
            }
        });
    }
    
    function saveEaring() {
        console.log('=== SAVE FUNCTION START ===');
        
        // Get form values
        const name = document.getElementById('earing-name').value.trim();
        const price = document.getElementById('earing-price').value.trim();
        const description = document.getElementById('earing-description').value.trim();
        
        // Validate
        if (!name || !price || !description) {
            showNotification('Please fill all required fields (Name, Price, Description).', 'error');
            return;
        }
        
        // Get other values
        const material = document.getElementById('earing-material').value.trim();
        const size = document.getElementById('earing-size').value.trim();
        const weight = document.getElementById('earing-weight').value.trim();
        const closure = document.getElementById('earing-closure').value;
        const hypoallergenic = document.getElementById('earing-hypoallergenic').value;
        const care = document.getElementById('earing-care').value.trim();
        const category = document.getElementById('earing-category').value;
        
        // Get images
        const images = [];
        ['a', 'b', 'c', 'd', 'e'].forEach(letter => {
            const input = document.getElementById(`image-${letter}`);
            const value = input ? input.value.trim() : '';
            if (value) {
                const cleanName = value.split('/').pop().split('\\').pop();
                images.push(cleanName);
            }
        });
        
        // Check if editing or adding new
        if (editingId !== null) {
            console.log('UPDATING earring ID:', editingId);
            
            // Find and update existing earring
            const index = earings.findIndex(e => e.id === editingId);
            if (index !== -1) {
                earings[index] = {
                    ...earings[index],
                    name,
                    price,
                    description,
                    material: material || 'Not specified',
                    size: size || 'Not specified',
                    weight: weight || '',
                    closure: closure || 'Butterfly Back',
                    hypoallergenic: hypoallergenic || 'Yes',
                    care: care || 'Keep dry and clean',
                    category: category || 'stud',
                    images: images.length > 0 ? images : earings[index].images || ['default.jpg']
                };
                
                console.log('Updated earring at index:', index);
                showNotification(`✅ "${name}" updated successfully!`, 'success');
            } else {
                showNotification('Earring not found. Creating new one.', 'error');
                editingId = null;
                return saveEaring(); // Retry as new
            }
        } else {
            console.log('CREATING new earring');
            
            // Create new earring
            const newEaring = {
                id: earings.length > 0 ? Math.max(...earings.map(e => e.id)) + 1 : 1,
                name,
                price,
                description,
                material: material || 'Not specified',
                size: size || 'Not specified',
                weight: weight || '',
                closure: closure || 'Butterfly Back',
                hypoallergenic: hypoallergenic || 'Yes',
                care: care || 'Keep dry and clean',
                category: category || 'stud',
                popularity: 3,
                inStock: true,
                images: images.length > 0 ? images : ['default.jpg']
            };
            
            earings.push(newEaring);
            console.log('Added new earring. Total:', earings.length);
            showNotification(`✅ "${name}" added successfully!`, 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('jfEarings', JSON.stringify(earings));
        
        // Reset form
        form.reset();
        clearEditState();
        
        // Update views
        loadEaringsList();
        updateJSONOutput();
        
        // Switch to view tab after delay
        setTimeout(() => {
            document.querySelector('[data-tab="view-earings"]').click();
        }, 1000);
        
        console.log('=== SAVE COMPLETE ===');
    }
    
    function loadEaringsList() {
        const container = document.getElementById('earings-list-container');
        const countElement = document.getElementById('earings-count');
        
        if (!container) return;
        
        if (countElement) {
            countElement.textContent = earings.length;
        }
        
        if (earings.length === 0) {
            container.innerHTML = '<p>No earrings found. Add your first earring!</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="earings-list">
                ${earings.map(earing => `
                    <div class="earing-item">
                        <div class="earing-image" style="background-image: url('${getImageUrl(earing.images[0])}')"></div>
                        <div class="earing-info">
                            <h3 class="earing-name">${earing.name}</h3>
                            <p class="earing-price">${earing.price}</p>
                            <div class="earing-actions">
                                <button class="btn-edit" data-id="${earing.id}">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn-delete" data-id="${earing.id}">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add event listeners
        container.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editEaring(id);
            });
        });
        
        container.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                if (confirm('Delete this earring?')) {
                    earings = earings.filter(e => e.id !== id);
                    localStorage.setItem('jfEarings', JSON.stringify(earings));
                    loadEaringsList();
                    updateJSONOutput();
                    showNotification('Earring deleted.', 'success');
                }
            });
        });
    }
    
    function editEaring(id) {
        console.log('=== EDIT FUNCTION START ===');
        console.log('Editing earring ID:', id);
        
        const earing = earings.find(e => e.id === id);
        if (!earing) {
            console.error('Earring not found');
            return;
        }
        
        // Set editing mode
        editingId = id;
        console.log('Set editingId to:', editingId);
        
        // Update UI for edit mode
        setEditMode(true);
        console.log('Edit mode set to true');
        
        // Fill form
        document.getElementById('earing-name').value = earing.name || '';
        document.getElementById('earing-price').value = earing.price || '';
        document.getElementById('earing-description').value = earing.description || '';
        document.getElementById('earing-material').value = earing.material || '';
        document.getElementById('earing-size').value = earing.size || '';
        document.getElementById('earing-weight').value = earing.weight || '';
        document.getElementById('earing-closure').value = earing.closure || '';
        document.getElementById('earing-hypoallergenic').value = earing.hypoallergenic || '';
        document.getElementById('earing-care').value = earing.care || '';
        document.getElementById('earing-category').value = earing.category || '';
        
        // Clear image inputs
        ['a', 'b', 'c', 'd', 'e'].forEach(letter => {
            const input = document.getElementById(`image-${letter}`);
            const preview = document.getElementById(`preview-${letter}`);
            if (input) input.value = '';
            if (preview) {
                preview.innerHTML = `
                    <div class="image-placeholder">
                        <i class="fas fa-image"></i><br>
                        No Image
                    </div>
                `;
            }
        });
        
        // Fill images
        if (earing.images && earing.images.length > 0) {
            earing.images.forEach((img, index) => {
                if (index < 5) {
                    const letter = ['a', 'b', 'c', 'd', 'e'][index];
                    const input = document.getElementById(`image-${letter}`);
                    const preview = document.getElementById(`preview-${letter}`);
                    if (input && preview) {
                        const fileName = img.split('/').pop();
                        input.value = fileName;
                        // Trigger preview update
                        const event = new Event('input');
                        input.dispatchEvent(event);
                    }
                }
            });
        }
        
        // Switch to add tab
        document.querySelector('[data-tab="add-earing"]').click();
        
        // Scroll to form
        setTimeout(() => {
            form.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        
        showNotification(`Editing "${earing.name}" - Make changes and click "Update Earring"`, 'info');
        console.log('=== EDIT FUNCTION END ===');
    }
    
    function setEditMode(isEditing) {
        console.log('Setting edit mode to:', isEditing);
        console.log('Save button:', saveBtn);
        console.log('Save button innerHTML before:', saveBtn.innerHTML);
        
        if (saveBtn) {
            saveBtn.innerHTML = isEditing ? 
                '<i class="fas fa-save"></i> Update Earring' : 
                '<i class="fas fa-save"></i> Save Earring';
            console.log('Save button innerHTML after:', saveBtn.innerHTML);
        }
        
        if (editStatus) {
            editStatus.style.display = isEditing ? 'block' : 'none';
            console.log('Edit status display:', editStatus.style.display);
        }
        
        if (cancelEditBtn) {
            cancelEditBtn.style.display = isEditing ? 'inline-block' : 'none';
            console.log('Cancel button display:', cancelEditBtn.style.display);
        }
    }
    
    function clearEditState() {
        console.log('Clearing edit state');
        editingId = null;
        setEditMode(false);
    }
    
    function updateJSONOutput() {
        if (!jsonOutput) return;
        const jsonData = { earings: earings };
        jsonOutput.value = JSON.stringify(jsonData, null, 2);
    }
    
    function copyJSON() {
        if (!jsonOutput || !jsonOutput.value.trim()) {
            showNotification('No data to copy.', 'error');
            return;
        }
        
        jsonOutput.select();
        document.execCommand('copy');
        showNotification('JSON copied to clipboard!', 'success');
    }
    
    function downloadJSON() {
        if (!jsonOutput || !jsonOutput.value.trim()) {
            showNotification('No data to download.', 'error');
            return;
        }
        
        const jsonData = { earings: earings };
        const dataStr = JSON.stringify(jsonData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const link = document.createElement('a');
        link.href = dataUri;
        link.download = 'earings-data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showNotification('JSON file downloaded!', 'success');
    }
    
    function getImageUrl(imageName) {
        if (!imageName || imageName === 'default.jpg') {
            return 'https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
        }
        return imageName.startsWith('http') ? imageName : `assets/earings/${imageName}`;
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        notification.textContent = message;
        notification.className = `notification ${type} show`;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Debug
    console.log('Admin form ready. Open console and check:');
    console.log('1. Is saveBtn found?', !!saveBtn);
    console.log('2. Is editStatus found?', !!editStatus);
    console.log('3. Is cancelEditBtn found?', !!cancelEditBtn);
}
