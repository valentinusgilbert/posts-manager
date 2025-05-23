// State management
const state = {
    currentPage: 1,
    searchQuery: '',
    sortField: 'id',
    sortOrder: 'asc',
    postCount: 5,
    totalPosts: 0
};

// DOM Elements
const elements = {
    postsList: document.getElementById('postsList'),
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    sortField: document.getElementById('sortField'),
    sortOrder: document.getElementById('sortOrder'),
    postCount: document.getElementById('postCount'),
    prevPage: document.getElementById('prevPage'),
    nextPage: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo'),
    addPostBtn: document.getElementById('addPostBtn'),
    addPostModal: document.getElementById('addPostModal'),
    addPostForm: document.getElementById('addPostForm'),
    closeModal: document.querySelector('.close-modal'),
    postTitle: document.getElementById('postTitle'),
    postBody: document.getElementById('postBody'),
    titleError: document.getElementById('titleError'),
    bodyError: document.getElementById('bodyError'),
    goToPage: document.getElementById('goToPage')
};

// Utility functions
const updateURL = () => {
    const params = new URLSearchParams({
        _page: state.currentPage,
        _limit: state.postCount,
        _sort: state.sortField,
        _order: state.sortOrder
    });
    
    if (state.searchQuery) {
        params.append('title_like', state.searchQuery);
    }
    
    window.history.pushState({}, '', `?${params.toString()}`);
};

const validateForm = () => {
    let isValid = true;
    const title = elements.postTitle.value.trim();
    const body = elements.postBody.value.trim();

    // Reset errors
    elements.titleError.textContent = '';
    elements.bodyError.textContent = '';

    // Title validation
    if (!title) {
        elements.titleError.textContent = 'Title is required';
        isValid = false;
    } else if (/\d/.test(title)) {
        elements.titleError.textContent = 'Title cannot contain numbers';
        isValid = false;
    } else if (title.length > 30) {
        elements.titleError.textContent = 'Title must be 30 characters or less';
        isValid = false;
    }

    // Body validation
    if (!body) {
        elements.bodyError.textContent = 'Body is required';
        isValid = false;
    } else if (/\d/.test(body)) {
        elements.bodyError.textContent = 'Body cannot contain numbers';
        isValid = false;
    }

    return isValid;
};

const createPostCard = (post) => {
    return `
        <div class="post-card">
            <div class="post-id">#${post.id}</div>
            <h3 class="post-title">${post.title}</h3>
            <p class="post-body">${post.body}</p>
        </div>
    `;
};

const createPagination = () => {
    const totalPages = Math.ceil(state.totalPosts / state.postCount);
    const pageNumbers = document.querySelector('.page-numbers');
    pageNumbers.innerHTML = '';

    // Always show first page
    addPageNumber(1, pageNumbers);

    // Calculate range of pages to show
    let startPage = Math.max(2, state.currentPage - 1);
    let endPage = Math.min(totalPages - 1, state.currentPage + 1);

    // Add ellipsis if needed
    if (startPage > 2) {
        addEllipsis(pageNumbers);
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
        addPageNumber(i, pageNumbers);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
        addEllipsis(pageNumbers);
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
        addPageNumber(totalPages, pageNumbers);
    }
};

const addPageNumber = (pageNum, container) => {
    const pageButton = document.createElement('button');
    pageButton.className = `page-number ${pageNum === state.currentPage ? 'active' : ''}`;
    pageButton.textContent = pageNum;
    pageButton.addEventListener('click', () => {
        state.currentPage = pageNum;
        updateURL();
        fetchPosts();
    });
    container.appendChild(pageButton);
};

const addEllipsis = (container) => {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'page-number ellipsis';
    ellipsis.textContent = '...';
    container.appendChild(ellipsis);
};

// API functions
const fetchPosts = async () => {
    try {
        const params = new URLSearchParams({
            _page: state.currentPage,
            _limit: state.postCount,
            _sort: state.sortField,
            _order: state.sortOrder
        });

        if (state.searchQuery) {
            params.append('title_like', state.searchQuery);
        }

        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?${params}`);
        const posts = await response.json();
        
        const totalCount = response.headers.get('X-Total-Count');
        state.totalPosts = parseInt(totalCount);

        elements.postsList.innerHTML = posts.map(createPostCard).join('');
        
        // Update pagination
        createPagination();
        
        // Update pagination buttons
        elements.prevPage.disabled = state.currentPage === 1;
        elements.nextPage.disabled = state.currentPage >= Math.ceil(state.totalPosts / state.postCount);
    } catch (error) {
        console.error('Error fetching posts:', error);
        elements.postsList.innerHTML = '<div class="error">Error loading posts. Please try again.</div>';
    }
};

const addPost = async (postData) => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ...postData,
                userId: 1
            })
        });

        const newPost = await response.json();
        
        // Show success message with enhanced styling
        elements.postsList.innerHTML = `
            <div class="post-card success">
                <div class="post-id">
                    Post Added Successfully!
                </div>
                <h3 class="post-title">
                    <i class="fas fa-file-alt"></i>
                    ${newPost.title}
                </h3>
                <p class="post-body">
                    <i class="fas fa-align-left"></i>
                    ${newPost.body}
                </p>
                <div class="post-id">
                    <i class="fas fa-hashtag"></i>
                    Post #${newPost.id}
                </div>
            </div>
        `;

        // Close modal after delay
        setTimeout(() => {
            elements.addPostModal.style.display = 'none';
            fetchPosts();
        }, 2000);
    } catch (error) {
        console.error('Error adding post:', error);
        elements.postsList.innerHTML = `
            <div class="post-card error">
                <div class="post-id">
                    <i class="fas fa-exclamation-circle"></i>
                    Error
                </div>
                <h3 class="post-title">Error Adding Post</h3>
                <p class="post-body">Please try again later.</p>
            </div>
        `;
    }
};

// Event Listeners
elements.searchBtn.addEventListener('click', () => {
    state.searchQuery = elements.searchInput.value.trim();
    state.currentPage = 1;
    updateURL();
    fetchPosts();
});

elements.searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.searchBtn.click();
    }
});

elements.sortField.addEventListener('change', () => {
    state.sortField = elements.sortField.value;
    state.currentPage = 1;
    updateURL();
    fetchPosts();
});

elements.sortOrder.addEventListener('change', () => {
    state.sortOrder = elements.sortOrder.value;
    state.currentPage = 1;
    updateURL();
    fetchPosts();
});

elements.prevPage.addEventListener('click', () => {
    if (state.currentPage > 1) {
        state.currentPage--;
        updateURL();
        fetchPosts();
    }
});

elements.nextPage.addEventListener('click', () => {
    if (state.currentPage < Math.ceil(state.totalPosts / state.postCount)) {
        state.currentPage++;
        updateURL();
        fetchPosts();
    }
});

elements.addPostBtn.addEventListener('click', () => {
    elements.addPostModal.style.display = 'block';
});

elements.closeModal.addEventListener('click', () => {
    elements.addPostModal.style.display = 'none';
});

elements.addPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
        const postData = {
            title: elements.postTitle.value.trim(),
            body: elements.postBody.value.trim()
        };
        
        await addPost(postData);
    }
});

// Add event listener for post count change
elements.postCount.addEventListener('change', () => {
    state.postCount = parseInt(elements.postCount.value);
    state.currentPage = 1;
    updateURL();
    fetchPosts();
});

// Add event listener for direct page input
elements.goToPage.addEventListener('click', () => {
    const pageInput = document.getElementById('pageInput');
    const pageNum = parseInt(pageInput.value);
    const totalPages = Math.ceil(state.totalPosts / state.postCount);
    
    if (pageNum && pageNum > 0 && pageNum <= totalPages) {
        state.currentPage = pageNum;
        updateURL();
        fetchPosts();
        pageInput.value = '';
    }
});

// Add event listener for Enter key on page input
document.getElementById('pageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.goToPage.click();
    }
});

// Initialize from URL parameters
const initializeFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    state.currentPage = parseInt(params.get('_page')) || 1;
    state.searchQuery = params.get('title_like') || '';
    state.sortField = params.get('_sort') || 'id';
    state.sortOrder = params.get('_order') || 'asc';
    state.postCount = parseInt(params.get('_limit')) || 5;

    elements.searchInput.value = state.searchQuery;
    elements.sortField.value = state.sortField;
    elements.sortOrder.value = state.sortOrder;
    elements.postCount.value = state.postCount;
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeFromURL();
    fetchPosts();
}); 