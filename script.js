// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            initMobileMenu();
            setActiveNavLink();
        });
    
    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        });
    
    // Initialize chat widget
    initChatWidget();
    
    // Initialize earings page functionality if on earings page
    if (window.location.pathname.includes('earings.html')) {
        initEaringsPage();
    }
});

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Chat widget functionality
function initChatWidget() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatWidget = document.querySelector('.chat-widget');
    const closeChat = document.querySelector('.close-chat');
    const sendBtn = document.querySelector('.send-btn');
    const chatInput = document.querySelector('.chat-input textarea');
    const chatMessages = document.querySelector('.chat-messages');
    
    if (!chatToggle) return;
    
    chatToggle.addEventListener('click', function() {
        chatWidget.classList.add('active');
    });
    
    if (closeChat) {
        closeChat.addEventListener('click', function() {
            chatWidget.classList.remove('active');
        });
    }
    
    if (sendBtn && chatInput) {
        sendBtn.addEventListener('click', function() {
            sendMessage();
        });
        
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (message) {
            // Add user message
            const userMessage = document.createElement('div');
            userMessage.className = 'message user';
            userMessage.innerHTML = `<p>${message}</p>`;
            chatMessages.appendChild(userMessage);
            
            // Clear input
            chatInput.value = '';
            
            // Scroll to bottom
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate bot response after delay
            setTimeout(() => {
                const botMessage = document.createElement('div');
                botMessage.className = 'message bot';
                botMessage.innerHTML = '<p>Thank you for your message! I\'ll get back to you as soon as possible to help with your order. In the meantime, you can also message us directly on <a href="https://facebook.com" target="_blank">Facebook</a> for faster response.</p>';
                chatMessages.appendChild(botMessage);
                
                // Scroll to bottom again
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, 1000);
        }
    }
}

// Earings page functionality
function initEaringsPage() {
    // Product data - in a real site, this would come from a backend
    const earings = [
        { id: 1, name: "Pearl Drops", price: "₱299", images: ["earing1_1.jpg", "earing1_2.jpg", "earing1_3.jpg"] },
        { id: 2, name: "Gold Hoops", price: "₱349", images: ["earing2_1.jpg", "earing2_2.jpg", "earing2_3.jpg"] },
        { id: 3, name: "Statement Studs", price: "₱399", images: ["earing3_1.jpg", "earing3_2.jpg", "earing3_3.jpg"] },
        { id: 4, name: "Crystal Dangles", price: "₱329", images: ["earing4_1.jpg", "earing4_2.jpg", "earing4_3.jpg"] },
        { id: 5, name: "Silver Hoops", price: "₱279", images: ["earing5_1.jpg", "earing5_2.jpg", "earing5_3.jpg"] },
        { id: 6, name: "Rose Gold Studs", price: "₱359", images: ["earing6_1.jpg", "earing6_2.jpg", "earing6_3.jpg"] },
        { id: 7, name: "Geometric Earrings", price: "₱319", images: ["earing7_1.jpg", "earing7_2.jpg", "earing7_3.jpg"] },
        { id: 8, name: "Floral Drops", price: "₱369", images: ["earing8_1.jpg", "earing8_2.jpg", "earing8_3.jpg"] },
        { id: 9, name: "Minimalist Hoops", price: "₱259", images: ["earing9_1.jpg", "earing9_2.jpg", "earing9_3.jpg"] },
        { id: 10, name: "Bold Statement", price: "₱429", images: ["earing10_1.jpg", "earing10_2.jpg", "earing10_3.jpg"] },
        { id: 11, name: "Moon & Stars", price: "₱389", images: ["earing11_1.jpg", "earing11_2.jpg", "earing11_3.jpg"] },
        { id: 12, name: "Feather Dangles", price: "₱339", images: ["earing12_1.jpg", "earing12_2.jpg", "earing12_3.jpg"] }
    ];
    
    // Display earings with pagination
    const earingsContainer = document.getElementById('earings-container');
    const paginationContainer = document.getElementById('pagination');
    
    if (!earingsContainer) return;
    
    const itemsPerPage = 10;
    let currentPage = 1;
    
    function displayEarings(page) {
        // Clear current earings
        earingsContainer.innerHTML = '';
        
        // Calculate start and end index
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageEarings = earings.slice(startIndex, endIndex);
        
        // Display earings for current page
        pageEarings.forEach(earing => {
            const earingElement = document.createElement('div');
            earingElement.className = 'product-card';
            earingElement.innerHTML = `
                <div class="product-image" style="background-image: url('https://images.unsplash.com/photo-${150000 + earing.id}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80')"></div>
                <h3>${earing.name}</h3>
                <p class="price">${earing.price}</p>
                <button class="btn-secondary view-details" data-id="${earing.id}">View Details</button>
            `;
            earingsContainer.appendChild(earingElement);
        });
        
        // Add event listeners to view details buttons
        document.querySelectorAll('.view-details').forEach(button => {
            button.addEventListener('click', function() {
                const id = parseInt(this.getAttribute('data-id'));
                openGallery(id);
            });
        });
        
        // Update pagination
        updatePagination(page);
    }
    
    function updatePagination(page) {
        if (!paginationContainer) return;
        
        const totalPages = Math.ceil(earings.length / itemsPerPage);
        paginationContainer.innerHTML = '';
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.className = 'pagination-btn';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.disabled = page === 1;
        prevButton.addEventListener('click', () => {
            if (page > 1) {
                currentPage = page - 1;
                displayEarings(currentPage);
            }
        });
        paginationContainer.appendChild(prevButton);
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.className = 'pagination-btn';
            pageButton.textContent = i;
            if (i === page) {
                pageButton.classList.add('active');
            }
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayEarings(currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.className = 'pagination-btn';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.disabled = page === totalPages;
        nextButton.addEventListener('click', () => {
            if (page < totalPages) {
                currentPage = page + 1;
                displayEarings(currentPage);
            }
        });
        paginationContainer.appendChild(nextButton);
    }
    
    // Gallery modal functionality
    function openGallery(id) {
        const earing = earings.find(e => e.id === id);
        if (!earing) return;
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'gallery-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal"><i class="fas fa-times"></i></button>
                <h2>${earing.name}</h2>
                <p class="modal-price">${earing.price}</p>
                <div class="gallery-main">
                    <div class="main-image" style="background-image: url('https://images.unsplash.com/photo-${150000 + earing.id}?ixlib=rb-4.0.3&auto=format&fit=crop&w-600&q=80')"></div>
                </div>
                <div class="gallery-thumbnails">
                    ${earing.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" style="background-image: url('assets/${img}')" data-index="${index}"></div>
                    `).join('')}
                </div>
                <p class="modal-description">Beautiful ${earing.name.toLowerCase()} earrings, handcrafted with attention to detail. Perfect for both casual and formal occasions.</p>
                <div class="modal-actions">
                    <button class="btn-primary order-btn"><i class="fab fa-facebook-messenger"></i> Order on Facebook</button>
                    <button class="btn-secondary chat-btn"><i class="fas fa-shopping-cart"></i> Chat to Order</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add modal styles
        const modalStyles = document.createElement('style');
        modalStyles.textContent = `
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
            }
            
            .modal-price {
                color: var(--secondary-color);
                font-weight: 600;
                font-size: 1.5rem;
                margin-bottom: 1.5rem;
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
            }
            
            .modal-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            
            .modal-actions button {
                flex: 1;
                min-width: 200px;
            }
        `;
        document.head.appendChild(modalStyles);
        
        // Add event listeners
        modal.querySelector('.close-modal').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyles);
        });
        
        // Thumbnail click event
        modal.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.addEventListener('click', function() {
                const index = this.getAttribute('data-index');
                
                // Update active thumbnail
                modal.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Update main image - in a real site, this would show the actual image
                const mainImage = modal.querySelector('.main-image');
                mainImage.style.backgroundImage = `url('https://images.unsplash.com/photo-${150000 + earing.id + parseInt(index)*10}?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80')`;
            });
        });
        
        // Order button events
        modal.querySelector('.order-btn').addEventListener('click', () => {
            window.open('https://facebook.com', '_blank');
        });
        
        modal.querySelector('.chat-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
            document.head.removeChild(modalStyles);
            
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
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                document.head.removeChild(modalStyles);
            }
        });
    }
    
    // Initial display
    displayEarings(currentPage);
}
