// Admin Form JavaScript - Simplified with fixed save
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.admin-form-page')) return;
    
    initAdminForm();
});

function initAdminForm() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
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
    
    // Form elements
    const form = document.getElementById('earing-form');
    const jsonOutput = document.getElementById('json-output');
    const copyJsonBtn = document.getElementById('copy-json-btn');
    const downloadJsonBtn = document.getElementById('download-json-btn');
    
    // Initialize earings data
    let earings = loadEaringsFromStorage();
    
    // Set up image previews
    setupImagePreviews();
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Form submitted');
        saveEaring();
    });
    
    // Copy JSON button
    copyJsonBtn.addEventListener('click', copyJSON);
    
    // Download JSON button
    downloadJsonBtn.addEventListener('click', downloadJSON);
    
    // Initial load
    loadEaringsList();
    updateJSONOutput();
    
    // Functions
    function setupImagePreviews() {
        // Setup preview for each image input
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
        
        // For local testing, we'll use a placeholder
        // In production, this would check the actual file
        const img = new Image();
        const testPath = `assets/earings/${imageName}`;
        
        img.onload = function() {
            previewElement.innerHTML = `<img src="${testPath}" class="image-preview" alt="${imageName}">`;
        };
        
        img.onerror = function() {
            previewElement.innerHTML = `
                <div class="image-placeholder">
                    <i class="fas fa-question-circle"></i><br>
                    ${imageName}<br>
                    <small>(File not found)</small>
                </div>
            `;
        };
        
        img.src = testPath;
    }
    
    function saveEaring() {
        console.log('Starting save process...');
        
        // Get form values - only name, price, description are required
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
                // Add the full path for the image
                images.push(`assets/earings/${imageName}`);
            }
        });
        
        // Create new earring object with sensible defaults
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
            popularity: 3, // Default popularity
            inStock: true,
            images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80']
        };
        
        console.log('New earring object:', newEaring);
        
        // Add to earings array
        earings.push(newEaring);
        
        // Save to localStorage
        saveEaringsToStorage(earings);
        
        // Reset form
        form.reset();
        
        // Update views
        loadEaringsList();
        updateJSONOutput();
        
        // Show success message
        showNotification(`"${name}" added successfully!`, 'success');
        
        // Switch to view tab
        setTimeout(() => {
            document.querySelector('[data-tab="view-earings"]').click();
        }, 1000);
    }
    
    function loadEaringsList() {
        const container = document.getElementById('earings-list-container');
        
        if (!earings || earings.length === 0) {
            container.innerHTML = '<p>No earrings found. Add your first earring!</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="earings-list">
                ${earings.map(earing => `
                    <div class="earing-item" data-id="${earing.id}">
                        <div class="earing-image" style="background-image: url('${earing.images[0] || getDefaultImage()}')"></div>
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
    }
    
    function editEaring(id) {
        const earing = earings.find(e => e.id === id);
        if (!earing) return;
        
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
        
        // Fill image inputs
        if (earing.images && earing.images.length > 0) {
            // Extract just the filenames from the paths
            for (let i = 0; i < Math.min(earing.images.length, 5); i++) {
                const imagePath = earing.images[i];
                const imageName = imagePath.replace('assets/earings/', '');
                const letter = ['a', 'b', 'c', 'd', 'e'][i];
                
                const input = document.getElementById(`image-${letter}`);
                if (input) {
                    input.value = imageName;
                    updateImagePreview(imageName, document.getElementById(`preview-${letter}`));
                }
            }
        }
        
        // Switch to add tab
        document.querySelector('[data-tab="add-earing"]').click();
        
        // Show message
        showNotification(`Editing "${earing.name}" - make changes and save to update.`, 'success');
        
        // Scroll to form
        document.getElementById('earing-form').scrollIntoView({ behavior: 'smooth' });
    }
    
    function deleteEaring(id) {
        if (!confirm('Are you sure you want to delete this earring?')) return;
        
        earings = earings.filter(e => e.id !== id);
        saveEaringsToStorage(earings);
        loadEaringsList();
        updateJSONOutput();
        
        showNotification('Earring deleted successfully!', 'success');
    }
    
    function updateJSONOutput() {
        const jsonData = {
            earings: earings
        };
        jsonOutput.value = JSON.stringify(jsonData, null, 2);
    }
    
    function copyJSON() {
        jsonOutput.select();
        document.execCommand('copy');
        showNotification('JSON copied to clipboard!', 'success');
    }
    
    function downloadJSON() {
        const jsonData = {
            earings: earings
        };
        const dataStr = JSON.stringify(jsonData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'earings-data.json');
        linkElement.click();
        
        showNotification('JSON file downloaded!', 'success');
    }
    
    function loadEaringsFromStorage() {
        // Try to load from localStorage
        try {
            const saved = localStorage.getItem('jfEarings');
            if (saved) {
                const parsed = JSON.parse(saved);
                console.log('Loaded from localStorage:', parsed.length, 'earings');
                return parsed;
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        
        console.log('No data in localStorage, returning empty array');
        return [];
    }
    
    function saveEaringsToStorage(earingsData) {
        try {
            localStorage.setItem('jfEarings', JSON.stringify(earingsData));
            console.log('Saved to localStorage:', earingsData.length, 'earings');
            updateJSONOutput();
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            showNotification('Error saving data. Please try again.', 'error');
        }
    }
    
    function getDefaultImage() {
        return 'https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification';
        notification.classList.add(type, 'show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
}
