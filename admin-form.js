// Admin Form JavaScript - Ultra Simplified Guaranteed Working Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loaded');
    initAdminForm();
});

function initAdminForm() {
    console.log('Initializing admin form...');
    
    // Data
    let earings = [];
    let editingId = null;
    
    // Try to load saved data
    try {
        const saved = localStorage.getItem('jfEarings');
        if (saved) {
            earings = JSON.parse(saved);
            console.log('Loaded', earings.length, 'earrings from localStorage');
        }
    } catch (e) {
        console.error('Error loading data:', e);
    }
    
    // Setup tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Clear edit mode when switching tabs
            editingId = null;
            updateButtonText();
            
            // Update tabs
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
            
            // Load data if needed
            if (tabId === 'view-earings') {
                loadEaringsList();
            } else if (tabId === 'export-data') {
                updateJSONOutput();
            }
        });
    });
    
    // Form submit
    document.getElementById('earing-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveEaring();
    });
    
    // Cancel edit button
    document.getElementById('cancel-edit-btn').addEventListener('click', function() {
        editingId = null;
        document.getElementById('earing-form').reset();
        updateButtonText();
        showMessage('Edit cancelled', 'info');
    });
    
    // Copy JSON button
    document.getElementById('copy-json-btn').addEventListener('click', function() {
        const textarea = document.getElementById('json-output');
        textarea.select();
        document.execCommand('copy');
        showMessage('JSON copied to clipboard!', 'success');
    });
    
    // Download JSON button
    document.getElementById('download-json-btn').addEventListener('click', function() {
        const data = { earings: earings };
        const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'earings-data.json';
        a.click();
        URL.revokeObjectURL(url);
        showMessage('JSON file downloaded!', 'success');
    });
    
    // Initial load
    loadEaringsList();
    updateJSONOutput();
    
    // Helper function to update button text
    function updateButtonText() {
        const saveButton = document.querySelector('button.btn-save');
        if (!saveButton) {
            console.error('Save button not found! Check HTML for class="btn-save"');
            return;
        }
        
        const icon = '<i class="fas fa-save"></i> ';
        saveButton.innerHTML = editingId ? icon + 'Update Earring' : icon + 'Save Earring';
        
        // Show/hide edit status and cancel button
        const editStatus = document.getElementById('edit-status');
        const cancelBtn = document.getElementById('cancel-edit-btn');
        
        if (editStatus) editStatus.style.display = editingId ? 'block' : 'none';
        if (cancelBtn) cancelBtn.style.display = editingId ? 'inline-block' : 'none';
        
        console.log('Button updated:', editingId ? 'Update Earring' : 'Save Earring');
    }
    
    // Save earring function
    function saveEaring() {
        console.log('Saving earring, editingId:', editingId);
        
        // Get form values
        const name = document.getElementById('earing-name').value.trim();
        const price = document.getElementById('earing-price').value.trim();
        const description = document.getElementById('earing-description').value.trim();
        
        // Validate
        if (!name || !price || !description) {
            showMessage('Please fill Name, Price, and Description', 'error');
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
            if (input && input.value.trim()) {
                const cleanName = input.value.trim().split('/').pop().split('\\').pop();
                images.push(cleanName);
            }
        });
        
        // Check if editing
        if (editingId !== null) {
            console.log('Updating earring ID:', editingId);
            const index = earings.findIndex(e => e.id === editingId);
            
            if (index !== -1) {
                // Update existing
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
                
                showMessage(`"${name}" updated successfully!`, 'success');
            } else {
                console.warn('Earring not found, creating new');
                editingId = null;
                // Continue to create new
            }
        }
        
        // If not editing, create new
        if (editingId === null) {
            console.log('Creating new earring');
            const newId = earings.length > 0 ? Math.max(...earings.map(e => e.id)) + 1 : 1;
            
            earings.push({
                id: newId,
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
            });
            
            showMessage(`"${name}" added successfully!`, 'success');
        }
        
        // Save to localStorage
        localStorage.setItem('jfEarings', JSON.stringify(earings));
        
        // Reset form
        document.getElementById('earing-form').reset();
        editingId = null;
        updateButtonText();
        
        // Update views
        loadEaringsList();
        updateJSONOutput();
        
        // Switch to view tab
        setTimeout(() => {
            document.querySelector('[data-tab="view-earings"]').click();
        }, 1000);
    }
    
    // Load earings list
    function loadEaringsList() {
        const container = document.getElementById('earings-list-container');
        if (!container) return;
        
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
                            <h3>${earing.name}</h3>
                            <p class="earing-price">${earing.price}</p>
                            <p><strong>Material:</strong> ${earing.material}</p>
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
        
        // Add event listeners for edit and delete
        container.addEventListener('click', function(e) {
            const editBtn = e.target.closest('.btn-edit');
            const deleteBtn = e.target.closest('.btn-delete');
            
            if (editBtn) {
                const id = parseInt(editBtn.getAttribute('data-id'));
                editEaring(id);
            }
            
            if (deleteBtn) {
                const id = parseInt(deleteBtn.getAttribute('data-id'));
                if (confirm('Delete this earring?')) {
                    earings = earings.filter(e => e.id !== id);
                    localStorage.setItem('jfEarings', JSON.stringify(earings));
                    loadEaringsList();
                    updateJSONOutput();
                    showMessage('Earring deleted', 'success');
                }
            }
        });
    }
    
    // Edit earring
    function editEaring(id) {
        console.log('Editing earring ID:', id);
        
        const earing = earings.find(e => e.id === id);
        if (!earing) {
            showMessage('Earring not found', 'error');
            return;
        }
        
        editingId = id;
        
        // Fill form
        document.getElementById('earing-name').value = earing.name;
        document.getElementById('earing-price').value = earing.price;
        document.getElementById('earing-description').value = earing.description;
        document.getElementById('earing-material').value = earing.material;
        document.getElementById('earing-size').value = earing.size;
        document.getElementById('earing-weight').value = earing.weight;
        document.getElementById('earing-closure').value = earing.closure;
        document.getElementById('earing-hypoallergenic').value = earing.hypoallergenic;
        document.getElementById('earing-care').value = earing.care;
        document.getElementById('earing-category').value = earing.category;
        
        // Clear and fill images
        ['a', 'b', 'c', 'd', 'e'].forEach(letter => {
            const input = document.getElementById(`image-${letter}`);
            const preview = document.getElementById(`preview-${letter}`);
            if (input) input.value = '';
            if (preview) preview.innerHTML = '<div class="image-placeholder"><i class="fas fa-image"></i><br>No Image</div>';
        });
        
        earing.images.forEach((img, index) => {
            if (index < 5) {
                const letter = ['a', 'b', 'c', 'd', 'e'][index];
                const input = document.getElementById(`image-${letter}`);
                if (input) {
                    const fileName = img.split('/').pop();
                    input.value = fileName;
                }
            }
        });
        
        // Update button text
        updateButtonText();
        
        // Switch to add tab
        document.querySelector('[data-tab="add-earing"]').click();
        
        showMessage(`Editing "${earing.name}" - Click "Update Earring" to save changes`, 'info');
    }
    
    // Update JSON output
    function updateJSONOutput() {
        const output = document.getElementById('json-output');
        if (output) {
            output.value = JSON.stringify({ earings: earings }, null, 2);
        }
    }
    
    // Get image URL
    function getImageUrl(imageName) {
        if (!imageName || imageName === 'default.jpg') {
            return 'https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
        }
        return imageName.startsWith('http') ? imageName : `assets/earings/${imageName}`;
    }
    
    // Show message
    function showMessage(text, type) {
        const notification = document.getElementById('notification');
        if (notification) {
            notification.textContent = text;
            notification.className = `notification ${type} show`;
            setTimeout(() => notification.classList.remove('show'), 3000);
        }
        console.log(type + ':', text);
    }
    
    console.log('✅ Admin form ready');
}
