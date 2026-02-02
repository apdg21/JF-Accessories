// Admin Form JavaScript - Fixed Edit & Save Issues
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
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const editStatus = document.getElementById('edit-status');
    const saveBtn = document.querySelector('.btn-save');
    
    // Check if elements exist
    if (!form) {
        console.error('Form not found!');
        return;
    }
    
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
        console.log('Editing ID:', editingId);
        saveEaring();
    });
    
    // Form reset
    form.addEventListener('reset', function() {
        console.log('Form reset');
        clearEditState();
    });
    
    // Copy JSON button
    copyJsonBtn.addEventListener('click', copyJSON);
    
    // Download JSON button
    downloadJsonBtn.addEventListener('click', downloadJSON);
    
    // Cancel edit button
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', function() {
            console.log('Cancel edit clicked');
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
        console.log('=== SAVE FUNCTION START ===');
        console.log('Current editing ID:', editingId);
        
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
        
        let isEditing = editingId !== null;
        console.log('Is editing mode?', isEditing);
        
        if (isEditing) {
            console.log('UPDATING existing earring ID:', editingId);
            
            // Find the earring to update
            const existingIndex = earings.findIndex(e => e.id === editingId);
            console.log('Found at index:', existingIndex);
            
            if (existingIndex === -1) {
                showNotification('Earring not found. Creating new one.', 'error');
                clearEditState();
                // Continue as new earring
                isEditing = false;
            } else {
                // Update existing earring
                const updatedEaring = {
                    id: editingId, // Keep the same ID
                    name: name,
                    price: price,
                    description: description,
                    material: material || earings[existingIndex].material || 'Not specified',
                    size: size || earings[existingIndex].size || 'Not specified',
                    weight: weight || earings[existingIndex].weight || '',
                    closure: closure || earings[existingIndex].closure || 'Butterfly Back',
                    hypoallergenic: hypoallergenic || earings[existingIndex].hypoallergenic || 'Yes',
                    care: care || earings[existingIndex].care || 'Keep dry and clean',
                    category: category || earings[existingIndex].category || 'stud',
                    popularity: earings[existingIndex].popularity || 3,
                    inStock: earings[existingIndex].inStock !== undefined ? earings[existingIndex].inStock : true,
                    images: images.length > 0 ? images : (earings[existingIndex].images || ['default.jpg'])
                };
                
                console.log('Updated earring data:', updatedEaring);
                
                // Replace the old earring
                earings[existingIndex] = updatedEaring;
                console.log('Replaced at index:', existingIndex);
            }
        }
        
        if (!isEditing) {
            console.log('CREATING new earring');
            
            // Create new earring
            const newEaring = {
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
            
            console.log('New earring:', newEaring);
            earings.push(newEaring);
        }
        
        console.log('Total earings after save:', earings.length);
        
        // Save to localStorage
        try {
            localStorage.setItem('jfEarings', JSON.stringify(earings));
            console.log('Saved to localStorage successfully');
            
            // Verify save
            const savedData = JSON.parse(localStorage.getItem('jfEarings'));
            console.log('Verification - saved items:', savedData.length);
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            showNotification('Error saving data. Please try again.', 'error');
            return;
        }
        
        // Clear form and editing state
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
        
        // Switch to view tab
        setTimeout(() => {
            const viewTab = document.querySelector('[data-tab="view-earings"]');
            if (viewTab) {
                viewTab.click();
            }
        }, 1000);
        
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
                console.log('Edit button clicked for ID:', id);
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
    }
    
    function editEaring(id) {
        console.log('=== EDIT FUNCTION START ===');
        console.log('Editing earring ID:', id);
        
        const earing = earings.find(e => e.id === id);
        if (!earing) {
            console.error('Earring not found:', id);
            showNotification('Earring not found.', 'error');
            return;
        }
        
        console.log('Found earring:', earing);
        
        // Set editing mode
        editingId = id;
        console.log('Set editingId to:', editingId);
        
        // Update UI for edit mode
        setEditMode(true);
        
        // Fill form with earring data
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
            console.log('Loading images:', earing.images);
            earing.images.forEach((imagePath, index) => {
                if (index < 5) {
                    const letter = ['a', 'b', 'c', 'd', 'e'][index];
                    const input = document.getElementById(`image-${letter}`);
                    const preview = document.getElementById(`preview-${letter}`);
                    
                    if (input && preview) {
                        // Extract just the filename
                        const fileName = imagePath.split('/').pop();
                        console.log(`Setting image ${letter} to:`, fileName);
                        input.value = fileName;
                        updateImagePreview(fileName, preview);
                    }
                }
            });
        }
        
        // Switch to add tab
        const addTab = document.querySelector('[data-tab="add-earing"]');
        if (addTab) {
            addTab.click();
        }
        
        // Show message
        showNotification(`✏️ Editing "${earing.name}" - Make changes and click "Update Earring"`, 'info');
        
        // Scroll to form
        setTimeout(() => {
            const formElement = document.getElementById('earing-form');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
        
        console.log('=== EDIT FUNCTION END ===');
    }
    
    function setEditMode(isEditing) {
        console.log('Setting edit mode to:', isEditing);
        
        if (saveBtn) {
            saveBtn.innerHTML = isEditing ? 
                '<i class="fas fa-save"></i> Update Earring' : 
                '<i class="fas fa-save"></i> Save Earring';
            console.log('Button text changed');
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
        console.log('JSON output updated with', earings.length, 'earings');
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
    
    // Debug helper
    window.debugAdmin = {
        clearData: function() {
            localStorage.removeItem('jfEarings');
            earings = [];
            loadEaringsList();
            updateJSONOutput();
            showNotification('Data cleared', 'info');
        },
        showData: function() {
            console.log('=== DEBUG INFO ===');
            console.log('Current earings:', earings);
            console.log('localStorage:', JSON.parse(localStorage.getItem('jfEarings') || '[]'));
            console.log('Editing ID:', editingId);
            console.log('Earings count:', earings.length);
            console.log('=== END DEBUG ===');
        },
        testEdit: function(id) {
            if (id) {
                editEaring(id);
            } else if (earings.length > 0) {
                editEaring(earings[0].id);
            } else {
                console.log('No earrings to edit');
            }
        }
    };
    
    console.log('Admin form ready. Debug commands:');
    console.log('- debugAdmin.clearData() - Clear all');
    console.log('- debugAdmin.showData() - Show data');
    console.log('- debugAdmin.testEdit() - Test edit');
}
