// earings.js - Complete earrings page functionality with pagination
let earings = [];
let currentPage = 1;
const itemsPerPage = 12; // 4 columns × 3 rows = 12 items per page

document.addEventListener('DOMContentLoaded', function() {
    if (!document.querySelector('.earings-page')) return;
    
    // Load earings data
    loadEaringsData()
        .then(data => {
            earings = data;
            initEaringsPage();
        })
        .catch(error => {
            console.error('Error loading earings data:', error);
            earings = getDefaultEarings();
            initEaringsPage();
        });
});

async function loadEaringsData() {
    // First try to load from localStorage (admin saves here)
    const saved = localStorage.getItem('jfEarings');
    if (saved) {
        console.log('Loading earings from localStorage');
        return JSON.parse(saved);
    }
    
    // Fallback to JSON file
    try {
        console.log('Loading earings from JSON file');
        const response = await fetch('earings-data.json');
        if (!response.ok) throw new Error('Failed to load JSON file');
        const data = await response.json();
        return data.earings || [];
    } catch (error) {
        console.log('Using default earings data');
        return getDefaultEarings();
    }
}

function getDefaultEarings() {
    return [
        {
            id: 1,
            name: "Pearl Drops",
            price: "₱299",
            description: "Elegant freshwater pearl drops that add a touch of sophistication to any outfit. Perfect for weddings, parties, or everyday elegance.",
            material: "Freshwater Pearls with Sterling Silver",
            size: "2.5 cm length",
            weight: "Lightweight (approx. 4g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Wipe with soft cloth after use, avoid water and chemicals",
            category: "dangle",
            popularity: 5,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 2,
            name: "Gold Hoops",
            price: "₱349",
            description: "Classic gold hoops that never go out of style. Versatile enough for both casual and formal occasions.",
            material: "18K Gold Plated Brass",
            size: "3 cm diameter",
            weight: "Medium weight (approx. 8g per pair)",
            closure: "Hinged Snap Closure",
            hypoallergenic: "Yes",
            care: "Store in jewelry box, avoid scratching",
            category: "hoop",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 3,
            name: "Statement Studs",
            price: "₱399",
            description: "Bold statement studs that make a perfect accent to any outfit. Eye-catching and elegant.",
            material: "Crystal with Rhodium Plating",
            size: "1.8 cm diameter",
            weight: "Lightweight (approx. 3g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Clean with soft cloth only",
            category: "stud",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1602173574767-2ac316656e84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 4,
            name: "Crystal Dangles",
            price: "₱329",
            description: "Sparkling crystal dangles that catch the light beautifully. Perfect for evening events.",
            material: "Swarovski Crystals with Sterling Silver",
            size: "3.2 cm length",
            weight: "Medium weight (approx. 6g per pair)",
            closure: "Hook",
            hypoallergenic: "Yes",
            care: "Avoid contact with water and chemicals",
            category: "dangle",
            popularity: 3,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 5,
            name: "Silver Hoops",
            price: "₱279",
            description: "Minimalist silver hoops for everyday wear. Simple, elegant, and timeless.",
            material: "925 Sterling Silver",
            size: "2.5 cm diameter",
            weight: "Lightweight (approx. 5g per pair)",
            closure: "Hinged Snap",
            hypoallergenic: "Yes",
            care: "Use silver polishing cloth regularly",
            category: "hoop",
            popularity: 5,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 6,
            name: "Rose Gold Studs",
            price: "₱359",
            description: "Delicate rose gold studs with a modern twist. Perfect for sensitive ears.",
            material: "Rose Gold Plated Surgical Steel",
            size: "0.8 cm diameter",
            weight: "Very lightweight (approx. 2g per pair)",
            closure: "Screw Back",
            hypoallergenic: "Yes",
            care: "Safe for sensitive skin, wipe clean",
            category: "stud",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1602173574767-2ac316656e84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 7,
            name: "Geometric Earrings",
            price: "₱319",
            description: "Modern geometric design earrings for the fashion-forward individual.",
            material: "Brass with Gold Plating",
            size: "2.8 cm length",
            weight: "Medium weight (approx. 7g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Keep in dry place",
            category: "dangle",
            popularity: 3,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 8,
            name: "Floral Drops",
            price: "₱369",
            description: "Delicate floral design earrings with intricate details. Feminine and charming.",
            material: "Brass with Enamel Details",
            size: "2.2 cm length",
            weight: "Lightweight (approx. 4g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Avoid moisture to protect enamel",
            category: "dangle",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 9,
            name: "Minimalist Hoops",
            price: "₱259",
            description: "Tiny minimalist hoops for a subtle, sophisticated look.",
            material: "Surgical Steel",
            size: "1.2 cm diameter",
            weight: "Very lightweight (approx. 1.5g per pair)",
            closure: "Hinged Snap",
            hypoallergenic: "Yes",
            care: "Easy to clean and maintain",
            category: "hoop",
            popularity: 5,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 10,
            name: "Bold Statement",
            price: "₱429",
            description: "Large statement earrings for making a fashion statement. Perfect for special occasions.",
            material: "Acrylic with Metal Details",
            size: "4.5 cm length",
            weight: "Lightweight (approx. 5g per pair)",
            closure: "Hook",
            hypoallergenic: "Yes",
            care: "Wipe clean with dry cloth",
            category: "statement",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1602173574767-2ac316656e84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 11,
            name: "Moon & Stars",
            price: "₱389",
            description: "Celestial-themed earrings featuring moon and star charms. Magical and whimsical.",
            material: "Sterling Silver with Gold Accents",
            size: "3.5 cm length",
            weight: "Medium weight (approx. 6g per pair)",
            closure: "Hook",
            hypoallergenic: "Yes",
            care: "Store in anti-tarnish pouch",
            category: "dangle",
            popularity: 5,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 12,
            name: "Feather Dangles",
            price: "₱339",
            description: "Lightweight feather design earrings that move gracefully with every step.",
            material: "Brass with Feather Details",
            size: "3.8 cm length",
            weight: "Very lightweight (approx. 3g per pair)",
            closure: "Hook",
            hypoallergenic: "Yes",
            care: "Avoid pulling on feathers",
            category: "dangle",
            popularity: 3,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 13,
            name: "Pearl Cluster",
            price: "₱379",
            description: "Cluster of pearls creating a beautiful floral-like design. Elegant and timeless.",
            material: "Freshwater Pearls with Gold Plating",
            size: "2.0 cm diameter",
            weight: "Lightweight (approx. 4g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Wipe pearls gently after wear",
            category: "stud",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 14,
            name: "Gold Bar",
            price: "₱299",
            description: "Minimalist gold bar earrings for a modern, sleek look.",
            material: "Gold Plated Brass",
            size: "2.0 cm length",
            weight: "Lightweight (approx. 3g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Avoid contact with perfumes",
            category: "stud",
            popularity: 3,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 15,
            name: "Diamond Studs",
            price: "₱449",
            description: "Classic diamond studs that sparkle with every movement. Timeless elegance.",
            material: "Cubic Zirconia with Sterling Silver",
            size: "0.6 cm diameter",
            weight: "Very lightweight (approx. 1.5g per pair)",
            closure: "Screw Back",
            hypoallergenic: "Yes",
            care: "Clean with jewelry cleaning solution",
            category: "stud",
            popularity: 5,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1602173574767-2ac316656e84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 16,
            name: "Silver Leaves",
            price: "₱329",
            description: "Nature-inspired leaf design earrings in beautiful sterling silver.",
            material: "925 Sterling Silver",
            size: "2.3 cm length",
            weight: "Lightweight (approx. 4g per pair)",
            closure: "Hook",
            hypoallergenic: "Yes",
            care: "Polish with silver cloth regularly",
            category: "dangle",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 17,
            name: "Turquoise Drops",
            price: "₱399",
            description: "Vibrant turquoise stone drops that add a pop of color to any outfit.",
            material: "Turquoise Stone with Sterling Silver",
            size: "2.7 cm length",
            weight: "Medium weight (approx. 6g per pair)",
            closure: "Hook",
            hypoallergenic: "Yes",
            care: "Avoid chemicals to protect stone",
            category: "dangle",
            popularity: 3,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 18,
            name: "Crystal Hoops",
            price: "₱369",
            description: "Hoop earrings adorned with sparkling crystals for extra glamour.",
            material: "Metal with Crystal Accents",
            size: "3.0 cm diameter",
            weight: "Medium weight (approx. 7g per pair)",
            closure: "Hinged Snap",
            hypoallergenic: "Yes",
            care: "Clean crystals gently with soft brush",
            category: "hoop",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 19,
            name: "Ruby Red",
            price: "₱419",
            description: "Bold red stone earrings that command attention and exude confidence.",
            material: "Red Crystal with Gold Plating",
            size: "1.5 cm diameter",
            weight: "Lightweight (approx. 4g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Wipe gently with soft cloth",
            category: "stud",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1602173574767-2ac316656e84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 20,
            name: "Sapphire Blue",
            price: "₱439",
            description: "Deep blue sapphire-like earrings for a regal, sophisticated look.",
            material: "Blue Crystal with Silver Plating",
            size: "1.2 cm diameter",
            weight: "Lightweight (approx. 3g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Store separately to avoid scratches",
            category: "stud",
            popularity: 3,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 21,
            name: "Emerald Green",
            price: "₱429",
            description: "Rich green emerald-inspired studs for a touch of luxury.",
            material: "Green Crystal with Gold Setting",
            size: "1.0 cm diameter",
            weight: "Lightweight (approx. 3g per pair)",
            closure: "Screw Back",
            hypoallergenic: "Yes",
            care: "Clean with mild soap and water",
            category: "stud",
            popularity: 4,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 22,
            name: "Amethyst Drops",
            price: "₱389",
            description: "Beautiful purple amethyst drops that combine elegance with spiritual energy.",
            material: "Amethyst Stone with Sterling Silver",
            size: "3.0 cm length",
            weight: "Medium weight (approx. 6g per pair)",
            closure: "Hook",
            hypoallergenic: "Yes",
            care: "Clean stones with soft, dry cloth",
            category: "dangle",
            popularity: 3,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 23,
            name: "Citrine Studs",
            price: "₱359",
            description: "Sunny yellow citrine studs that bring warmth and positivity to your look.",
            material: "Citrine Crystal with Gold Plating",
            size: "0.9 cm diameter",
            weight: "Lightweight (approx. 2.5g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Avoid direct sunlight for long periods",
            category: "stud",
            popularity: 3,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        },
        {
            id: 24,
            name: "Opal Dreams",
            price: "₱469",
            description: "Iridescent opal-like earrings that change colors with the light. Truly magical.",
            material: "Opalite Stone with Silver Setting",
            size: "1.8 cm diameter",
            weight: "Lightweight (approx. 4g per pair)",
            closure: "Butterfly Back",
            hypoallergenic: "Yes",
            care: "Handle gently, opalite can be delicate",
            category: "statement",
            popularity: 5,
            inStock: true,
            images: [
                "https://images.unsplash.com/photo-1602173574767-2ac316656e84?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
            ]
        }
    ];
}

function initEaringsPage() {
    // DOM elements
    const earingsContainer = document.getElementById('earings-container');
    const paginationContainer = document.getElementById('pagination');
    const openChatBtn = document.querySelector('.open-chat-btn');
    
    if (!earingsContainer) {
        console.error('Earings container not found');
        return;
    }
    
    // Setup event listeners
    setupEventListeners();
    
    // Initial display
    displayEarings(currentPage);
    
    // Display earings for a specific page
    function displayEarings(page) {
        // Calculate start and end index
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageEarings = earings.slice(startIndex, endIndex);
        
        // Clear current earings
        earingsContainer.innerHTML = '';
        
        if (pageEarings.length === 0) {
            earingsContainer.innerHTML = '<p class="no-results">No earrings found. Check back soon!</p>';
            return;
        }
        
        // Display earings for current page
        pageEarings.forEach(earing => {
            const earingElement = createEaringCard(earing);
            earingsContainer.appendChild(earingElement);
        });
        
        // Update pagination
        updatePagination(page);
    }
    
    // Create earing card element
    function createEaringCard(earing) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image" style="background-image: url('${earing.images[0] || getDefaultImage()}')"></div>
            <h3>${earing.name}</h3>
            <p class="price">${earing.price}</p>
            <button class="btn-secondary view-details" data-id="${earing.id}">
                <i class="fas fa-search"></i> View Details
            </button>
        `;
        
        // Add click event to view details button
        const viewBtn = card.querySelector('.view-details');
        viewBtn.addEventListener('click', () => openGallery(earing));
        
        return card;
    }
    
    // Get default image if none provided
    function getDefaultImage() {
        return 'https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
    }
    
    // Update pagination controls
    function updatePagination(page) {
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(earings.length / itemsPerPage);
        paginationContainer.innerHTML = '';
        
        // Previous button
        const prevButton = createPaginationButton('<i class="fas fa-chevron-left"></i>', page > 1, () => {
            if (page > 1) {
                currentPage = page - 1;
                displayEarings(currentPage);
                scrollToEarings();
            }
        });
        paginationContainer.appendChild(prevButton);
        
        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        // Adjust if we're at the beginning
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        // First page button if not visible
        if (startPage > 1) {
            paginationContainer.appendChild(createPaginationButton('1', true, () => goToPage(1)));
            
            if (startPage > 2) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
        }
        
        // Visible page numbers
        for (let i = startPage; i <= endPage; i++) {
            const button = createPaginationButton(i.toString(), true, () => goToPage(i));
            if (i === page) button.classList.add('active');
            paginationContainer.appendChild(button);
        }
        
        // Last page button if not visible
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                const ellipsis = document.createElement('span');
                ellipsis.className = 'pagination-ellipsis';
                ellipsis.textContent = '...';
                paginationContainer.appendChild(ellipsis);
            }
            
            paginationContainer.appendChild(createPaginationButton(totalPages.toString(), true, () => goToPage(totalPages)));
        }
        
        // Next button
        const nextButton = createPaginationButton('<i class="fas fa-chevron-right"></i>', page < totalPages, () => {
            if (page < totalPages) {
                currentPage = page + 1;
                displayEarings(currentPage);
                scrollToEarings();
            }
        });
        paginationContainer.appendChild(nextButton);
    }
    
    // Create a pagination button
    function createPaginationButton(content, enabled, clickHandler) {
        const button = document.createElement('button');
        button.className = 'pagination-btn';
        button.innerHTML = content;
        button.disabled = !enabled;
        
        if (enabled) {
            button.addEventListener('click', clickHandler);
        }
        
        return button;
    }
    
    // Go to specific page
    function goToPage(pageNum) {
        currentPage = pageNum;
        displayEarings(currentPage);
        scrollToEarings();
    }
    
    // Scroll to earings section
    function scrollToEarings() {
        const earingsContainer = document.getElementById('earings-container');
        if (earingsContainer) {
            window.scrollTo({
                top: earingsContainer.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    }
    
    // Open gallery modal
    function openGallery(earing) {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal"><i class="fas fa-times"></i></button>
                <h2>${earing.name}</h2>
                <p class="modal-price">${earing.price}</p>
                
                <!-- Stock Status -->
                <div class="stock-status ${earing.inStock ? 'in-stock' : 'out-of-stock'}">
                    <i class="fas ${earing.inStock ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                    ${earing.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
                
                <!-- Product Details -->
                <div class="product-details-grid">
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-gem"></i> Material:</span>
                        <span class="detail-value">${earing.material}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-ruler"></i> Size:</span>
                        <span class="detail-value">${earing.size}</span>
                    </div>
                    ${earing.weight ? `
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-weight"></i> Weight:</span>
                        <span class="detail-value">${earing.weight}</span>
                    </div>
                    ` : ''}
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-lock"></i> Closure:</span>
                        <span class="detail-value">${earing.closure}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label"><i class="fas fa-heart"></i> Hypoallergenic:</span>
                        <span class="detail-value">${earing.hypoallergenic}</span>
                    </div>
                </div>
                
                <!-- Gallery Images -->
                <div class="gallery-main">
                    <div class="main-image" style="background-image: url('${earing.images[0] || getDefaultImage()}')"></div>
                </div>
                
                <!-- Thumbnails -->
                ${earing.images.length > 1 ? `
                <div class="gallery-thumbnails">
                    ${earing.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                             style="background-image: url('${img}')" 
                             data-index="${index}"></div>
                    `).join('')}
                </div>
                ` : ''}
                
                <!-- Description -->
                <div class="modal-description">
                    <h4><i class="fas fa-align-left"></i> Description</h4>
                    <p>${earing.description}</p>
                </div>
                
                <!-- Care Instructions -->
                ${earing.care ? `
                <div class="care-instructions">
                    <h4><i class="fas fa-info-circle"></i> Care Instructions</h4>
                    <p>${earing.care}</p>
                </div>
                ` : ''}
                
                <!-- Order Buttons -->
                <div class="modal-actions">
                    <a href="https://facebook.com" target="_blank" class="btn-primary">
                        <i class="fab fa-facebook-messenger"></i> Order on Facebook
                    </a>
                    <button class="btn-secondary chat-btn">
                        <i class="fas fa-shopping-cart"></i> Chat to Order
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles if not already present
        if (!document.querySelector('#gallery-modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'gallery-modal-styles';
            modalStyles.textContent = getModalStyles();
            document.head.appendChild(modalStyles);
        }
        
        // Add event listeners
        setupModalEvents(modal, earing);
    }
    
    // Get modal CSS styles
    function getModalStyles() {
        return `
            .gallery-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                padding: 20px;
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .modal-content {
                background-color: white;
                border-radius: 20px;
                max-width: 800px;
                width: 100%;
                padding: 2.5rem;
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: var(--dark-color);
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: var(--transition);
            }
            
            .close-modal:hover {
                background-color: var(--light-pink);
                color: var(--secondary-color);
            }
            
            .modal-content h2 {
                margin-bottom: 0.5rem;
                text-align: center;
                color: var(--secondary-color);
            }
            
            .modal-price {
                color: var(--secondary-color);
                font-weight: 600;
                font-size: 1.8rem;
                margin-bottom: 1rem;
                text-align: center;
            }
            
            .stock-status {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                border-radius: 50px;
                font-weight: 500;
                margin: 0 auto 1.5rem;
                width: fit-content;
            }
            
            .stock-status.in-stock {
                background-color: rgba(46, 204, 113, 0.1);
                color: #27ae60;
                border: 1px solid rgba(46, 204, 113, 0.3);
            }
            
            .stock-status.out-of-stock {
                background-color: rgba(231, 76, 60, 0.1);
                color: #c0392b;
                border: 1px solid rgba(231, 76, 60, 0.3);
            }
            
            .product-details-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-bottom: 1.5rem;
                background-color: var(--light-pink);
                padding: 1.5rem;
                border-radius: 10px;
            }
            
            .detail-item {
                display: flex;
                flex-direction: column;
                gap: 0.3rem;
            }
            
            .detail-label {
                font-weight: 600;
                color: var(--secondary-color);
                font-size: 0.9rem;
            }
            
            .detail-label i {
                margin-right: 0.5rem;
                color: var(--primary-color);
            }
            
            .detail-value {
                color: var(--dark-color);
            }
            
            .gallery-main {
                margin-bottom: 1rem;
            }
            
            .main-image {
                height: 300px;
                background-size: contain;
                background-position: center;
                background-repeat: no-repeat;
                border-radius: 10px;
                background-color: #f9f9f9;
                border: 1px solid #eee;
            }
            
            .gallery-thumbnails {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .thumbnail {
                width: 70px;
                height: 70px;
                background-size: cover;
                background-position: center;
                border-radius: 5px;
                cursor: pointer;
                border: 2px solid transparent;
                transition: var(--transition);
            }
            
            .thumbnail:hover {
                transform: scale(1.05);
            }
            
            .thumbnail.active {
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(248, 165, 194, 0.3);
            }
            
            .modal-description, .care-instructions {
                margin-bottom: 1.5rem;
                padding: 1rem;
                background-color: #f9f9f9;
                border-radius: 10px;
            }
            
            .modal-description h4, .care-instructions h4 {
                color: var(--secondary-color);
                margin-bottom: 0.5rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .modal-description p, .care-instructions p {
                line-height: 1.6;
                color: var(--dark-color);
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
                justify-content: center;
            }
            
            .modal-actions .btn-primary,
            .modal-actions .btn-secondary {
                min-width: 220px;
            }
            
            @media (max-width: 768px) {
                .modal-content {
                    padding: 1.5rem;
                }
                
                .modal-actions {
                    flex-direction: column;
                }
                
                .modal-actions .btn-primary,
                .modal-actions .btn-secondary {
                    width: 100%;
                }
                
                .product-details-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
    }
    
    // Setup modal event listeners
    function setupModalEvents(modal, earing) {
        // Close button
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Thumbnail click events
        modal.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                
                // Update active thumbnail
                modal.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update main image
                const mainImage = modal.querySelector('.main-image');
                mainImage.style.backgroundImage = `url('${earing.images[index]}')`;
            });
        });
        
        // Chat button
        const chatBtn = modal.querySelector('.chat-btn');
        if (chatBtn) {
            chatBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
                
                // Open chat widget
                const chatWidget = document.querySelector('.chat-widget');
                if (chatWidget) {
                    chatWidget.classList.add('active');
                    
                    // Add a pre-filled message
                    const chatInput = document.querySelector('.chat-input textarea');
                    if (chatInput) {
                        chatInput.value = `Hi Jean! I'm interested in ordering the ${earing.name} (${earing.price}). Can you tell me more about availability?`;
                        chatInput.focus();
                    }
                }
            });
        }
        
        // Close when clicking outside modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Close with Escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }
    
    // Setup event listeners for the page
    function setupEventListeners() {
        // Open chat button
        const openChatBtn = document.querySelector('.open-chat-btn');
        if (openChatBtn) {
            openChatBtn.addEventListener('click', function() {
                const chatWidget = document.querySelector('.chat-widget');
                if (chatWidget) {
                    chatWidget.classList.add('active');
                }
            });
        }
    }
    
    // Add CSS for no results
    if (!document.querySelector('#earings-styles')) {
        const styles = document.createElement('style');
        styles.id = 'earings-styles';
        styles.textContent = `
            .no-results {
                text-align: center;
                padding: 3rem;
                color: var(--dark-color);
                font-size: 1.2rem;
                grid-column: 1 / -1;
            }
        `;
        document.head.appendChild(styles);
    }
}
