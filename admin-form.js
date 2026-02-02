// Admin Form JavaScript - Complete with working Edit functionality
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.admin-form-page')) return;
    
    initAdminForm();
});

function initAdminForm() {
    console.log('Admin form initialized');
    
    // Initialize earings data and editing state
    let earings = [];
    let editingId = null;
    
    // DOM Elements
    const form = document.getElementById('earing-form');
    const jsonOutput = document.getElementById('json-output');
    const copyJsonBtn = document.getElementById('copy-json-btn');
    const downloadJsonBtn = document.getElementById('download-json-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn') || createCancelButton();
    const editStatus = document.getElementById('edit-status') || createEditStatus();
    
    // Load data immediately
    loadInitialData().then(data => {
        earings = data;
        console.log('Initial data loaded:', earings.length, 'earings');
        loadEaringsList();
        updateJSONOutput();
    });
    
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
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
    
    // Set up image previews
    setupImagePreviews();
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('=== FORM SUBMIT START ===');
        saveEaring();
    });
    
    // Form reset
    form.addEventListener('reset', function() {
        clearEditState();
    });
    
    // Copy JSON button
    copyJsonBtn.addEventListener('click', copyJSON);
    
    // Download JSON button
    downloadJsonBtn.addEventListener('click', downloadJSON);
    
    // Cancel edit button
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            clearEditState();
            form.reset();
            showNotification('Edit cancelled.', 'info');
        });
    }
    
    // Functions
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
        const imageInputs = ['a', 'b', 'c', 'd', 'e'];
        
        imageInputs.forEach(letter => {
            const input = document.getElementById(`image-${letter}`);
            const preview = document.getElementById(`preview-${letter}`);
            
            if (input && preview) {
                input.addEventListener('input', function() {
                    updateImagePreview(this.value, preview);
                });
            }
        });
    }
    
    function updateImagePreview(imageName, previewElement) {
        if (!imageName || imageName.trim() === '') {
            previewElement.innerHTML = `
                <div class="image-placeholder">
                    <i class="fas fa-image"></i><br>
                    No Image
                </div>
            `;
            return;
        }
        
        // Clean the filename
        const cleanName = imageName.split('/').pop().split('\\').pop();
        
        const img = new Image();
        
        // Try multiple possible paths
        const testPaths = [
            `assets/earings/${cleanName}`,
            `./assets/earings/${cleanName}`,
            cleanName
        ];
        
        let currentPathIndex = 0;
        
        function tryNextPath() {
            if (currentPathIndex >= testPaths.length) {
                previewElement.innerHTML = `
                    <div class="image-placeholder">
                        <i class="fas fa-question-circle"></i><br>
                        ${cleanName}<br>
                        <small>(Will work when uploaded)</small>
                    </div>
                `;
                return;
            }
            
            const testPath = testPaths[currentPathIndex];
            img.src = testPath;
            currentPathIndex++;
        }
        
        img.onload = function() {
            previewElement.innerHTML = `<img src="${img.src}" class="image-preview" alt="${cleanName}">`;
        };
        
        img.onerror = function() {
            tryNextPath();
        };
        
        tryNextPath();
    }
    
    function saveEaring() {
        console.log('Starting save process...');
        
        // Get form values
        const name = document.getElementById('earing-name').value.trim();
        const price = document.getElementById('earing-price').value.trim();
        const description = document.getElementById('earing-description').value.trim();
        
        // Validate required fields
        if (!name) {
            showNotification('Please enter an earring name.', 'error');
            document.getElementById('earing-name').focus();
            return;
        }
        
        if (!price) {
            showNotification('Please enter a price.', 'error');
            document.getElementById('earing-price').focus();
            return;
        }
        
        if (!description) {
            showNotification('Please enter a description.', 'error');
            document.getElementById('earing-description').focus();
            return;
        }
        
        console.log('Form validation passed');
        
        // Get optional fields
        const material = document.getElementById('earing-material').value.trim();
        const size = document.getElementById('earing-size').value.trim();
        const weight = document.getElementById('earing-weight').value.trim();
        const closure = document.getElementById('earing-closure').value;
        const hypoallergenic = document.getElementById('earing-hypoallergenic').value;
        const care = document.getElementById('earing-care').value.trim();
        const category = document.getElementById('earing-category').value;
        
        // Get image filenames
        const images = [];
        const imageLetters = ['a', 'b', 'c', 'd', 'e'];
        
        imageLetters.forEach(letter => {
            const imageInput = document.getElementById(`image-${letter}`);
            const imageName = imageInput ? imageInput.value.trim() : '';
            
            if (imageName) {
                // Clean the filename
                const cleanName = imageName.split('/').pop().split('\\').pop();
                images.push(cleanName);
            }
        });
        
        let newEaring;
        let isEditing = editingId !== null;
        
        if (isEditing) {
            console.log('Updating existing earring ID:', editingId);
            
            // Find the earring to update
            const existingIndex = earings.findIndex(e => e.id === editingId);
            if (existingIndex === -1) {
                showNotification('Earring not found. Creating new one.', 'error');
                clearEditState();
                return saveEaring(); // Retry as new earring
            }
            
            // Update existing earring - preserve some properties
            const originalEaring = earings[existingIndex];
            newEaring = {
                ...originalEaring, // Preserve all original properties
                name: name,
                price: price,
                description: description,
                material: material || 'Not specified',
                size: size || 'Not specified',
                weight: weight || '',
                closure: closure || 'Butterfly Back',
                hypoallergenic: hypoallergenic || 'Yes',
                care: care || 'Keep dry and clean',
                category: category || 'stud',
                images: images.length > 0 ? images : (originalEaring.images || ['default.jpg'])
            };
            
            // Replace the old earring with updated one
            earings[existingIndex] = newEaring;
            console.log('Updated earring at index:', existingIndex);
        } else {
            console.log('Creating new earring');
            
            // Create new earring object
            newEaring = {
                id: earings.length > 0 ? Math.max(...earings.map(e => e.id)) + 1 : 1,
                name: name,
                price: price,
                description: description,
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
            
            // Add to earings array
            earings.push(newEaring);
            console.log('Added new earring. Total earings:', earings.length);
        }
        
        // Save to localStorage
        try {
            localStorage.setItem('jfEarings', JSON.stringify(earings));
            console.log('Saved to localStorage.');
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            showNotification('Error saving data. Please try again.', 'error');
            return;
        }
        
        // Reset form and editing state
        form.reset();
        clearEditState();
        
        // Update views
        loadEaringsList();
        updateJSONOutput();
        
        // Show success message
        const message = isEditing ? 
            `✅ "${name}" updated successfully!` : 
            `✅ "${name}" added successfully!`;
        showNotification(message, 'success');
        
        // Switch to view tab after a delay
        setTimeout(() => {
            document.querySelector('[data-tab="view-earings"]').click();
        }, 1500);
        
        console.log('=== SAVE COMPLETE ===');
    }
    
    function loadEaringsList() {
        const container = document.getElementById('earings-list-container');
        
        if (!container) {
            console.error('Earings list container not found');
            return;
        }
        
        console.log('Loading earings list. Total earings:', earings.length);
        
        if (!earings || earings.length === 0) {
            container.innerHTML = '<p>No earrings found. Add your first earring!</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="earings-list">
                ${earings.map(earing => `
                    <div class="earing-item" data-id="${earing.id}">
                        <div class="earing-image" style="background-image: url('${getImageUrl(earing.images[0])}')"></div>
                        <div class="earing-info">
                            <h3 class="earing-name">${earing.name}</h3>
                            <p class="earing-price">${earing.price}</p>
                            <p><strong>Material:</strong> ${earing.material}</p>
                            <p><strong>Size:</strong> ${earing.size}</p>
                            <p><strong>Category:</strong> ${earing.category}</p>
                            <div class="earing-actions">
                                <button class="btn-edit edit-earing" data-id="${earing.id}">
                                    <i class="fas fa-edit"></i> Edit
                                </button>
                                <button class="btn-delete delete-earing" data-id="${earing.id}">
                                    <i class="fas fa-trash"></i> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        
        // Add event listeners to edit buttons
        container.querySelectorAll('.edit-earing').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                editEaring(id);
            });
        });
        
        // Add event listeners to delete buttons
        container.querySelectorAll('.delete-earing').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                deleteEaring(id);
            });
        });
        
        console.log('Earings list loaded successfully');
    }
    
    function editEaring(id) {
        console.log('Editing earring ID:', id);
        const earing = earings.find(e => e.id === id);
        if (!earing) {
            console.error('Earring not found:', id);
            return;
        }
        
        // Set editing mode
        editingId = id;
        
        // Update UI for edit mode
        setEditMode(true);
        
        // Fill form with earring data
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
        
        // Clear all image inputs first
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
        
        // Fill image inputs with existing images
        if (earing.images && earing.images.length > 0) {
            earing.images.forEach((imagePath, index) => {
                if (index < 5) {
                    const letter = ['a', 'b', 'c', 'd', 'e'][index];
                    const input = document.getElementById(`image-${letter}`);
                    const preview = document.getElementById(`preview-${letter}`);
                    
                    if (input && preview) {
                        // Extract just the filename
                        const fileName = imagePath.split('/').pop();
                        input.value = fileName;
                        updateImagePreview(fileName, preview);
                    }
                }
            });
        }
        
        // Switch to add tab
        document.querySelector('[data-tab="add-earing"]').click();
        
        // Show message
        showNotification(`✏️ Editing "${earing.name}" - Make changes and click "Update Earring"`, 'info');
        
        // Scroll to form
        document.getElementById('earing-form').scrollIntoView({ behavior: 'smooth' });
    }
    
    function setEditMode(isEditing) {
        const saveBtn = document.querySelector('.btn-save');
        if (saveBtn) {
            saveBtn.innerHTML = isEditing ? 
                '<i class="fas fa-save"></i> Update Earring' : 
                '<i class="fas fa-save"></i> Save Earring';
        }
        
        if (editStatus) {
            editStatus.style.display = isEditing ? 'block' : 'none';
        }
        
        if (cancelEditBtn) {
            cancelEditBtn.style.display = isEditing ? 'inline-block' : 'none';
        }
    }
    
    function clearEditState() {
        editingId = null;
        setEditMode(false);
    }
    
    function deleteEaring(id) {
        if (!confirm('Are you sure you want to delete this earring?')) return;
        
        const beforeLength = earings.length;
        earings = earings.filter(e => e.id !== id);
        
        if (earings.length === beforeLength) {
            showNotification('Earring not found.', 'error');
            return;
        }
        
        // Save updated array
        localStorage.setItem('jfEarings', JSON.stringify(earings));
        
        loadEaringsList();
        updateJSONOutput();
        
        showNotification('🗑️ Earring deleted successfully!', 'success');
    }
    
    function updateJSONOutput() {
        const jsonData = {
            earings: earings
        };
        jsonOutput.value = JSON.stringify(jsonData, null, 2);
        console.log('JSON output updated');
    }
    
    function copyJSON() {
        if (!jsonOutput.value.trim()) {
            showNotification('No data to copy.', 'error');
            return;
        }
        
        jsonOutput.select();
        jsonOutput.setSelectionRange(0, 99999);
        
        try {
            document.execCommand('copy');
            showNotification('📋 JSON copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            showNotification('Copy failed. Please select and copy manually.', 'error');
        }
    }
    
    function downloadJSON() {
        if (!jsonOutput.value.trim()) {
            showNotification('No data to download.', 'error');
            return;
        }
        
        const jsonData = {
            earings: earings,
            exported: new Date().toISOString(),
            count: earings.length
        };
        
        const dataStr = JSON.stringify(jsonData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', `earings-data-${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(linkElement);
        linkElement.click();
        document.body.removeChild(linkElement);
        
        showNotification('💾 JSON file downloaded!', 'success');
    }
    
    function getImageUrl(imageName) {
        if (!imageName || imageName === 'default.jpg') {
            return 'https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
        }
        
        // Check if it's already a URL
        if (imageName.startsWith('http')) {
            return imageName;
        }
        
        // Assume it's a local image
        return `assets/earings/${imageName}`;
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        if (!notification) {
            console.log('Notification would show:', message);
            return;
        }
        
        notification.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type, 'show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Helper function to create cancel button if not in HTML
    function createCancelButton() {
        const formActions = document.querySelector('.form-actions');
        if (!formActions) return null;
        
        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.id = 'cancel-edit-btn';
        cancelBtn.className = 'btn-secondary';
        cancelBtn.innerHTML = '<i class="fas fa-times"></i> Cancel Edit';
        cancelBtn.style.display = 'none';
        
        formActions.appendChild(cancelBtn);
        return cancelBtn;
    }
    
    // Helper function to create edit status if not in HTML
    function createEditStatus() {
        const form = document.getElementById('earing-form');
        if (!form) return null;
        
        const editStatus = document.createElement('div');
        editStatus.id = 'edit-status';
        editStatus.style.display = 'none';
        editStatus.style.background = '#e3f2fd';
        editStatus.style.padding = '10px';
        editStatus.style.borderRadius = '5px';
        editStatus.style.marginBottom = '15px';
        editStatus.style.borderLeft = '4px solid #2196F3';
        editStatus.innerHTML = '<i class="fas fa-edit"></i> <strong>Editing Mode:</strong> You are editing an existing earring. Click "Update Earring" to save changes.';
        
        form.insertBefore(editStatus, form.firstChild);
        return editStatus;
    }
    
    // Debug helper functions
    window.debugAdmin = {
        clearData: function() {
            localStorage.removeItem('jfEarings');
            earings = [];
            loadEaringsList();
            updateJSONOutput();
            showNotification('Data cleared', 'info');
        },
        showData: function() {
            console.log('Current earings:', earings);
            console.log('localStorage:', JSON.parse(localStorage.getItem('jfEarings') || '[]'));
            console.log('Editing ID:', editingId);
        },
        addSample: function() {
            const sampleEaring = {
                id: earings.length > 0 ? Math.max(...earings.map(e => e.id)) + 1 : 1,
                name: "Sample Earring " + (earings.length + 1),
                price: "₱299",
                description: "This is a sample earring for testing.",
                material: "Test Material",
                size: "2.5 cm",
                weight: "Lightweight",
                closure: "Butterfly Back",
                hypoallergenic: "Yes",
                care: "Keep dry and clean",
                category: "stud",
                popularity: 3,
                inStock: true,
                images: ["earing" + (earings.length + 1) + "a.jpg"]
            };
            
            earings.push(sampleEaring);
            localStorage.setItem('jfEarings', JSON.stringify(earings));
            loadEaringsList();
            updateJSONOutput();
            showNotification('Sample added', 'success');
        }
    };
    
    console.log('Admin form ready. Debug commands available:');
    console.log('- debugAdmin.clearData() - Clear all earings');
    console.log('- debugAdmin.showData() - Show current data');
    console.log('- debugAdmin.addSample() - Add sample earring');
}
