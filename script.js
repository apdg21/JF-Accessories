// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
    // Load header
    fetch('header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            initMobileMenu();
            setActiveNavLink();
        })
        .catch(error => {
            console.error('Error loading header:', error);
            document.getElementById('header-container').innerHTML = '<p>Navigation loading failed</p>';
        });
    
    // Load footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
    
    // Initialize chat widget (common to all pages)
    initChatWidget();
    
    // Load featured earrings if on homepage
    if (document.querySelector('.featured-section')) {
        loadFeaturedEarrings();
    }
});

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
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

// Chat widget functionality (common to all pages)
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

// Load and display featured earrings on homepage
async function loadFeaturedEarrings() {
    console.log('Loading featured earrings for homepage...');
    
    const container = document.getElementById('featured-earrings-container');
    if (!container) return;
    
    // Show loading state
    container.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i> Loading featured earrings...
        </div>
    `;
    
    try {
        // Try to load from JSON file
        const response = await fetch('earings-data.json');
        if (!response.ok) {
            throw new Error(`Failed to load earrings data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        const earings = data.earings || [];
        
        console.log(`Loaded ${earings.length} earrings for homepage`);
        
        if (earings.length === 0) {
            throw new Error('No earrings found in data file');
        }
        
        // Display first 3 earrings as featured (or less if not enough)
        const featuredCount = Math.min(3, earings.length);
        const featuredEarings = earings.slice(0, featuredCount);
        
        displayFeaturedEarrings(featuredEarings, container);
        
    } catch (error) {
        console.error('Error loading featured earrings:', error);
        // Show error message
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Unable to load featured earrings. <a href="earings.html">Browse all earrings</a></p>
                <p class="error-detail">${error.message}</p>
            </div>
        `;
    }
}

// Display featured earrings in the container
function displayFeaturedEarrings(earings, container) {
    if (!earings || earings.length === 0) {
        container.innerHTML = '<p class="no-results">No featured earrings available.</p>';
        return;
    }
    
    container.innerHTML = earings.map(earing => `
        <div class="product-card">
            <div class="product-image" style="background-image: url('${getImageUrl(earing.images && earing.images[0] ? earing.images[0] : null)}');"
                 onerror="this.style.backgroundImage='url(\'${getDefaultImage()}\')'">
            </div>
            <h3>${earing.name}</h3>
            <p class="price">${earing.price}</p>
            <a href="earings.html#product${earing.id}" class="btn-secondary view-featured" data-id="${earing.id}">
                View Details
            </a>
        </div>
    `).join('');
    
    // Add click handlers to featured earring links
    container.querySelectorAll('.view-featured').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            console.log('Featured earring clicked:', productId);
            
            // Store in localStorage and redirect to earings page
            localStorage.setItem('openProductModal', productId);
            window.location.href = 'earings.html';
        });
    });
}

// Get image URL (same as in earings.js)
function getImageUrl(imageName) {
    if (!imageName) {
        return getDefaultImage();
    }
    
    // If it's already a full URL, return it as-is
    if (imageName.startsWith('http') || imageName.startsWith('data:')) {
        return imageName;
    }
    
    // If it's just a filename, add the correct path
    const cleanName = imageName.split('/').pop().split('\\').pop();
    
    // Check if it's a default placeholder
    if (cleanName === 'default.jpg') {
        return getDefaultImage();
    }
    
    // Return local file path
    return `assets/earings/${cleanName}`;
}

// Get default image URL
function getDefaultImage() {
    return 'https://images.unsplash.com/photo-1599643478510-a349f327f8c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
}

// Add CSS styles for loading and error states
(function addFeaturedEarringsStyles() {
    if (document.querySelector('#featured-earrings-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'featured-earrings-styles';
    style.textContent = `
        /* Loading spinner */
        .loading-spinner {
            text-align: center;
            padding: 3rem;
            color: var(--secondary-color);
            font-size: 1.1rem;
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
        
        .loading-spinner i {
            font-size: 2rem;
            color: var(--primary-color);
        }
        
        /* Error message */
        .error-message {
            text-align: center;
            padding: 2rem;
            background-color: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 10px;
            color: #c53030;
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
        }
        
        .error-message i {
            font-size: 2.5rem;
            color: #fc8181;
            margin-bottom: 0.5rem;
        }
        
        .error-message a {
            color: var(--primary-color);
            text-decoration: underline;
            font-weight: 500;
            margin-top: 0.5rem;
            display: inline-block;
        }
        
        .error-detail {
            font-size: 0.9rem;
            color: #718096;
            margin-top: 0.5rem;
        }
        
        /* No results */
        .no-results {
            text-align: center;
            padding: 3rem;
            color: var(--dark-color);
            font-size: 1.2rem;
            grid-column: 1 / -1;
        }
        
        /* Featured earrings grid layout */
        .featured-earrings {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            justify-content: center;
            margin-top: 1rem;
        }
        
        /* Featured product cards */
        .featured-earrings .product-card {
            background: white;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: 1px solid #eee;
            display: flex;
            flex-direction: column;
        }
        
        .featured-earrings .product-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        
        .featured-earrings .product-image {
            height: 250px;
            background-size: cover;
            background-position: center;
            background-color: #f5f5f5;
        }
        
        .featured-earrings .product-card h3 {
            margin: 1rem 1rem 0.5rem;
            color: var(--secondary-color);
            font-size: 1.2rem;
        }
        
        .featured-earrings .price {
            margin: 0 1rem;
            color: var(--accent-color);
            font-weight: 600;
            font-size: 1.3rem;
        }
        
        .featured-earrings .btn-secondary {
            margin: 1rem;
            margin-top: auto;
            text-align: center;
        }
        
        @media (max-width: 768px) {
            .featured-earrings {
                grid-template-columns: 1fr;
                max-width: 400px;
                margin: 0 auto;
            }
        }
    `;
    
    document.head.appendChild(style);
})();
