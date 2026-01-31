// Simple Admin for JSON Management
document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.admin-simple')) return;
    
    initAdminSimple();
});

function initAdminSimple() {
    const jsonEditor = document.getElementById('json-editor');
    const loadBtn = document.getElementById('load-btn');
    const validateBtn = document.getElementById('validate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const downloadBtn = document.getElementById('download-btn');
    const addSampleBtn = document.getElementById('add-sample-btn');
    const previewContainer = document.getElementById('preview-container');
    const notification = document.getElementById('notification');
    
    // Default JSON structure
    const defaultJSON = {
        "earings": [
            {
                "id": 1,
                "name": "Pearl Drops",
                "price": "₱299",
                "description": "Elegant freshwater pearl drops that add a touch of sophistication to any outfit.",
                "material": "Freshwater Pearls with Sterling Silver",
                "size": "2.5 cm length",
                "weight": "Lightweight (approx. 4g per pair)",
                "closure": "Butterfly Back",
                "hypoallergenic": "Yes",
                "care": "Wipe with soft cloth after use",
                "category": "dangle",
                "popularity": 5,
                "inStock": true,
                "images": [
                    "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                ]
            }
        ]
    };
    
    // Load current data from JSON file or use default
    loadBtn.addEventListener('click', loadCurrentData);
    validateBtn.addEventListener('click', validateJSON);
    copyBtn.addEventListener('click', copyJSON);
    downloadBtn.addEventListener('click', downloadJSON);
    addSampleBtn.addEventListener('click', addSampleEaring);
    
    // Auto-save when typing (optional)
    jsonEditor.addEventListener('input', debounce(updatePreview, 1000));
    
    // Initial load
    loadCurrentData();
    
    function loadCurrentData() {
        // Try to load from the actual JSON file
        fetch('earings-data.json')
            .then(response => {
                if (response.ok) return response.json();
                throw new Error('File not found, using default');
            })
            .then(data => {
                jsonEditor.value = JSON.stringify(data, null, 2);
                updatePreview();
                showNotification('Data loaded successfully!', 'success');
            })
            .catch(error => {
                console.log('Using default data:', error.message);
                jsonEditor.value = JSON.stringify(defaultJSON, null, 2);
                updatePreview();
                showNotification('Using default data. Create earings-data.json file for persistence.', 'info');
            });
    }
    
    function validateJSON() {
        try {
            const jsonData = JSON.parse(jsonEditor.value);
            if (!jsonData.earings || !Array.isArray(jsonData.earings)) {
                throw new Error('JSON must have "earings" array');
            }
            
            // Validate each earring
            jsonData.earings.forEach((earing, index) => {
                if (!earing.id || !earing.name || !earing.price) {
                    throw new Error(`Earring ${index + 1} missing required fields (id, name, price)`);
                }
            });
            
            showNotification('✅ JSON is valid!', 'success');
            return true;
        } catch (error) {
            showNotification(`❌ Invalid JSON: ${error.message}`, 'error');
            return false;
        }
    }
    
    function copyJSON() {
        if (!validateJSON()) return;
        
        jsonEditor.select();
        document.execCommand('copy');
        
        // Show copied notification
        showNotification('✅ JSON copied to clipboard!', 'success');
    }
    
    function downloadJSON() {
        if (!validateJSON()) return;
        
        const jsonData = JSON.parse(jsonEditor.value);
        const dataStr = JSON.stringify(jsonData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'earings-data.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('✅ JSON file downloaded!', 'success');
    }
    
    function addSampleEaring() {
        try {
            const jsonData = JSON.parse(jsonEditor.value);
            const lastId = jsonData.earings.length > 0 
                ? Math.max(...jsonData.earings.map(e => e.id)) 
                : 0;
            
            const newEaring = {
                "id": lastId + 1,
                "name": `New Earring ${lastId + 1}`,
                "price": "₱299",
                "description": "Beautiful handcrafted earrings.",
                "material": "Sterling Silver",
                "size": "2.5 cm",
                "weight": "Lightweight",
                "closure": "Butterfly Back",
                "hypoallergenic": "Yes",
                "care": "Keep dry and clean",
                "category": "stud",
                "popularity": 3,
                "inStock": true,
                "images": [
                    "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                ]
            };
            
            jsonData.earings.push(newEaring);
            jsonEditor.value = JSON.stringify(jsonData, null, 2);
            updatePreview();
            
            showNotification('✅ Sample earring added!', 'success');
        } catch (error) {
            showNotification('❌ Error adding sample: ' + error.message, 'error');
        }
    }
    
    function updatePreview() {
        try {
            const jsonData = JSON.parse(jsonEditor.value);
            const previewEarings = jsonData.earings.slice(0, 4); // Show first 4
            
            previewContainer.innerHTML = previewEarings.map(earing => `
                <div class="product-card">
                    <div class="product-image" style="background-image: url('${earing.images[0] || 'https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80'}')"></div>
                    <h3>${earing.name}</h3>
                    <p class="price">${earing.price}</p>
                    <p class="preview-material"><small>${earing.material}</small></p>
                </div>
            `).join('');
        } catch (error) {
            previewContainer.innerHTML = `<p class="error">Invalid JSON format</p>`;
        }
    }
    
    function showNotification(message, type = 'info') {
        notification.textContent = message;
        notification.className = 'notification';
        
        // Add color based on type
        if (type === 'success') {
            notification.style.backgroundColor = '#4CAF50';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
        } else {
            notification.style.backgroundColor = '#2196F3';
        }
        
        notification.classList.add('show');
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Utility function for debouncing
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
