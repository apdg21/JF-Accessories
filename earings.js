// Earings Page JavaScript - Separate file for pagination functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run on earings page
    if (!document.querySelector('.earings-page')) return;
    
    // Initialize earings page
    initEaringsPage();
});

function initEaringsPage() {
    // Product data
    const earings = [
        { id: 1, name: "Pearl Drops", price: "₱299", images: ["earing1_1.jpg", "earing1_2.jpg", "earing1_3.jpg"], category: "dangle" },
        { id: 2, name: "Gold Hoops", price: "₱349", images: ["earing2_1.jpg", "earing2_2.jpg", "earing2_3.jpg"], category: "hoop" },
        { id: 3, name: "Statement Studs", price: "₱399", images: ["earing3_1.jpg", "earing3_2.jpg", "earing3_3.jpg"], category: "stud" },
        { id: 4, name: "Crystal Dangles", price: "₱329", images: ["earing4_1.jpg", "earing4_2.jpg", "earing4_3.jpg"], category: "dangle" },
        { id: 5, name: "Silver Hoops", price: "₱279", images: ["earing5_1.jpg", "earing5_2.jpg", "earing5_3.jpg"], category: "hoop" },
        { id: 6, name: "Rose Gold Studs", price: "₱359", images: ["earing6_1.jpg", "earing6_2.jpg", "earing6_3.jpg"], category: "stud" },
        { id: 7, name: "Geometric Earrings", price: "₱319", images: ["earing7_1.jpg", "earing7_2.jpg", "earing7_3.jpg"], category: "dangle" },
        { id: 8, name: "Floral Drops", price: "₱369", images: ["earing8_1.jpg", "earing8_2.jpg", "earing8_3.jpg"], category: "dangle" },
        { id: 9, name: "Minimalist Hoops", price: "₱259", images: ["earing9_1.jpg", "earing9_2.jpg", "earing9_3.jpg"], category: "hoop" },
        { id: 10, name: "Bold Statement", price: "₱429", images: ["earing10_1.jpg", "earing10_2.jpg", "earing10_3.jpg"], category: "statement" },
        { id: 11, name: "Moon & Stars", price: "₱389", images: ["earing11_1.jpg", "earing11_2.jpg", "earing11_3.jpg"], category: "dangle" },
        { id: 12, name: "Feather Dangles", price: "₱339", images: ["earing12_1.jpg", "earing12_2.jpg", "earing12_3.jpg"], category: "dangle" },
        { id: 13, name: "Pearl Cluster", price: "₱379", images: ["earing13_1.jpg", "earing13_2.jpg", "earing13_3.jpg"], category: "stud" },
        { id: 14, name: "Gold Bar", price: "₱299", images: ["earing14_1.jpg", "earing14_2.jpg", "earing14_3.jpg"], category: "hoop" },
        { id: 15, name: "Diamond Studs", price: "₱449", images: ["earing15_1.jpg", "earing15_2.jpg", "earing15_3.jpg"], category: "stud" },
        { id: 16, name: "Silver Leaves", price: "₱329", images: ["earing16_1.jpg", "earing16_2.jpg", "earing16_3.jpg"], category: "dangle" },
        { id: 17, name: "Turquoise Drops", price: "₱399", images: ["earing17_1.jpg", "earing17_2.jpg", "earing17_3.jpg"], category: "dangle" },
        { id: 18, name: "Crystal Hoops", price: "₱369", images: ["earing18_1.jpg", "earing18_2.jpg", "earing18_3.jpg"], category: "hoop" },
        { id: 19, name: "Ruby Red", price: "₱419", images: ["earing19_1.jpg", "earing19_2.jpg", "earing19_3.jpg"], category: "stud" },
        { id: 20, name: "Sapphire Blue", price: "₱439", images: ["earing20_1.jpg", "earing20_2.jpg", "earing20_3.jpg"], category: "stud" },
        { id: 21, name: "Emerald Green", price: "₱429", images: ["earing21_1.jpg", "earing21_2.jpg", "earing21_3.jpg"], category: "stud" },
        { id: 22, name: "Amethyst Drops", price: "₱389", images: ["earing22_1.jpg", "earing22_2.jpg", "earing22_3.jpg"], category: "dangle" },
        { id: 23, name: "Citrine Studs", price: "₱359", images: ["earing23_1.jpg", "earing23_2.jpg", "earing23_3.jpg"], category: "stud" },
        { id: 24, name: "Opal Dreams", price: "₱469", images: ["earing24_1.jpg", "earing24_2.jpg", "earing24_3.jpg"], category: "statement" }
    ];
    
    // DOM elements
    const earingsContainer = document.getElementById('earings-container');
    const paginationContainer = document.getElementById('pagination');
    
    // Pagination settings
    const itemsPerPage = 12; // 4 columns × 3 rows = 12 items per page
    let currentPage = 1;
    
    // Initialize the page
    displayEarings(currentPage);
    setupEventListeners();
    
    // Display earings for a specific page
    function displayEarings(page) {
        // Calculate start and end index
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageEarings = earings.slice(startIndex, endIndex);
        
        // Clear current earings
        earingsContainer.innerHTML = '';
        
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
            <div class="product-image" style="background-image: url('https://images.unsplash.com/photo-${150000 + earing.id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')"></div>
            <h3>${earing.name}</h3>
            <p class="price">${earing.price}</p>
            <button class="btn-secondary view-details" data-id="${earing.id}">View Details</button>
        `;
        
        // Add click event to view details button
        const viewBtn = card.querySelector('.view-details');
        viewBtn.addEventListener('click', () => openGallery(earing));
        
        return card;
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
        window.scrollTo({
            top: earingsContainer.offsetTop - 100,
            behavior: 'smooth'
        });
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
                <div class="gallery-main">
                    <div class="main-image" style="background-image: url('https://images.unsplash.com/photo-${150000 + earing.id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')"></div>
                </div>
                <div class="gallery-thumbnails">
                    ${[1, 2, 3].map((index) => `
                        <div class="thumbnail ${index === 1 ? 'active' : ''}" 
                             style="background-image: url('https://images.unsplash.com/photo-${150000 + earing.id + (index-1)*10}?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80')" 
                             data-index="${index}"></div>
                    `).join('')}
                </div>
                <p class="modal-description">Beautiful ${earing.name.toLowerCase()} earrings, handcrafted with attention to detail. Perfect for both casual and formal occasions.</p>
                <div class="modal-actions">
                    <a href="https://facebook.com" target="_blank" class="btn-primary"><i class="fab fa-facebook-messenger"></i> Order on Facebook</a>
                    <button class="btn-secondary chat-btn"><i class="fas fa-shopping-cart"></i> Chat to Order</button>
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
                background-color: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                padding: 20px;
            }
            
            .modal-content {
                background-color: white;
                border-radius: 20px;
                max-width: 600px;
                width: 100%;
                padding: 2rem;
                position: relative;
                max-height: 90vh;
                overflow-y: auto;
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
            }
            
            .modal-content h2 {
                margin-bottom: 0.5rem;
                text-align: center;
            }
            
            .modal-price {
                color: var(--secondary-color);
                font-weight: 600;
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
                text-align: center;
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
                background-color: var(--light-pink);
            }
            
            .gallery-thumbnails {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1.5rem;
                justify-content: center;
            }
            
            .thumbnail {
                width: 70px;
                height: 70px;
                background-size: cover;
                background-position: center;
                border-radius: 5px;
                cursor: pointer;
                border: 2px solid transparent;
            }
            
            .thumbnail.active {
                border-color: var(--primary-color);
            }
            
            .modal-description {
                margin-bottom: 1.5rem;
                text-align: center;
                line-height: 1.6;
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
            
            .pagination-ellipsis {
                display: flex;
                align-items: center;
                padding: 0 5px;
                color: var(--dark-color);
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
                mainImage.style.backgroundImage = `url('https://images.unsplash.com/photo-${150000 + earing.id + (parseInt(index)-1)*10}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`;
            });
        });
        
        // Chat button
        modal.querySelector('.chat-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            
            // Open chat widget
            const chatWidget = document.querySelector('.chat-widget');
            if (chatWidget) {
                chatWidget.classList.add('active');
                
                // Add a pre-filled message
                const chatInput = document.querySelector('.chat-input textarea');
                if (chatInput) {
                    chatInput.value = `Hi Jean! I'm interested in ordering the ${earing.name}. Can you tell me more about it?`;
                }
            }
        });
        
        // Close when clicking outside modal
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
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
}
