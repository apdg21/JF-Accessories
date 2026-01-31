// Admin Form JavaScript
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
    const imageBaseNameInput = document.getElementById('image-base-name');
    const imagesPreview = document.getElementById('images-preview');
    const jsonOutput = document.getElementById('json-output');
    const copyJsonBtn = document.getElementById('copy-json-btn');
    const downloadJsonBtn = document.getElementById('download-json-btn');
    
    // Initialize earings data
    let earings = loadEaringsFromStorage();
    
    // Generate image previews when base name changes
    imageBaseNameInput.addEventListener('input', updateImagePreviews);
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        saveEaring();
    });
    
    // Form reset
    form.addEventListener('reset', function() {
        imagesPreview.innerHTML = '';
    });
    
    // Copy JSON button
    copyJsonBtn.addEventListener('click', copyJSON);
    
    // Download JSON button
    downloadJsonBtn.addEventListener('click', downloadJSON);
    
    // Initial load
    updateImagePreviews();
    loadEaringsList();
    
    // Functions
    function updateImagePreviews() {
        const baseName = imageBaseNameInput.value.trim();
        imagesPreview.innerHTML = '';
        
        if (!baseName) return;
        
        // Generate up to 5 image previews (a-e)
        const letters = ['a', 'b', 'c', 'd', 'e'];
        
        letters.forEach(letter => {
            const imageName = `${baseName}${letter}.jpg`;
            const imagePath = `assets/earings/${imageName}`;
            
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            
            // Check if image exists (using placeholder for demo)
            const img = new Image();
            img.src = imagePath;
            
            img.onload = function() {
                imageItem.innerHTML = `
                    <img src="${imagePath}" class="image-preview" alt="${imageName}">
                    <button class="remove-image" title="Remove image">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            };
            
            img.onerror = function() {
                imageItem.innerHTML = `
                    <div class="image-placeholder">
                        <i class="fas fa-image"></i>
                        <span>${imageName}</span>
                        <small>(Image not found)</small>
                    </div>
                    <button class="remove-image" title="Remove image">
                        <i class="fas fa-times"></i>
                    </button>
                `;
            };
            
            imagesPreview.appendChild(imageItem);
        });
    }
    
    function saveEaring() {
        // Get form values
        const name = document.getElementById('earing-name').value.trim();
        const price = document.getElementById('earing-price').value.trim();
        const description = document.getElementById('earing-description').value.trim();
        const material = document.getElementById('earing-material').value.trim();
        const size = document.getElementById('earing-size').value.trim();
        const weight = document.getElementById('earing-weight').value.trim();
        const closure = document.getElementById('earing-closure').value;
        const hypoallergenic = document.getElementById('earing-hypoallergenic').value;
        const care = document.getElementById('earing-care').value.trim();
        const category = document.getElementById('earing-category').value;
        const baseName = document.getElementById('image-base-name').value.trim();
        
        // Validate required fields
        if (!name || !price || !description || !material || !size || !category || !baseName) {
            showNotification('Please fill in all required fields.', 'error');
            return;
        }
        
        // Generate image array based on base name
        const images = [];
        const letters = ['a', 'b', 'c', 'd', 'e'];
        
        letters.forEach(letter => {
            const imageName = `${baseName}${letter}.jpg`;
            images.push(`assets/earings/${imageName}`);
        });
        
        // Create new earring object
        const newEaring = {
            id: earings.length > 0 ? Math.max(...earings.map(e => e.id)) + 1 : 1,
            name,
            price,
            description,
            material,
            size,
            weight: weight || '',
            closure,
            hypoallergenic,
            care: care || '',
            category,
            popularity: 3, // Default popularity
            inStock: true,
            images: images.filter(img => {
                // Remove images that don't exist (optional)
                return true; // For now, include all
            })
        };
        
        // Add to earings array
        earings.push(newEaring);
        
        // Save to localStorage
        saveEaringsToStorage(earings);
        
        // Reset form
        form.reset();
        imagesPreview.innerHTML = '';
        
        // Show success message
        showNotification(`"${name}" added successfully!`, 'success');
        
        // Switch to view tab
        document.querySelector('[data-tab="view-earings"]').click();
    }
    
    function loadEaringsList() {
        const container = document.getElementById('earings-list-container');
        
        if (earings.length === 0) {
            container.innerHTML = '<p>No earrings found. Add your first earring!</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="earings-list">
                ${earings.map(earing => `
                    <div class="earing-item" data-id="${earing.id}">
                        <div class="earing-image" style="background-image: url('${earing.images[0] || 'https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}')"></div>
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
        
        // Extract base name from first image
        if (earing.images && earing.images.length > 0) {
            const firstImage = earing.images[0];
            const baseName = firstImage.replace('assets/earings/', '').replace('a.jpg', '');
            document.getElementById('image-base-name').value = baseName;
            updateImagePreviews();
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
        const saved = localStorage.getItem('jfEarings');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Try to load from JSON file
        return fetchEaringsData();
    }
    
    async function fetchEaringsData() {
        try {
            const response = await fetch('earings-data.json');
            if (response.ok) {
                const data = await response.json();
                return data.earings || [];
            }
        } catch (error) {
            console.log('Could not load JSON file:', error);
        }
        return [];
    }
    
    function saveEaringsToStorage(earingsData) {
        localStorage.setItem('jfEarings', JSON.stringify(earingsData));
        updateJSONOutput();
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
