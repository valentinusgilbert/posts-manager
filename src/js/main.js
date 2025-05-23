import { state, elements } from './utils/state.js';
import { updateURL, validateForm } from './utils/helpers.js';
import { fetchPosts, addPost } from './services/api.js';
import { showToast } from './components/Toast.js';

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
    if (validateForm(elements)) {
        const postData = {
            title: elements.postTitle.value.trim(),
            body: elements.postBody.value.trim()
        };
        const result = await addPost(postData);
        if (result) {
            showToast('Post added successfully!', 'success');
        } else {
            showToast('Failed to add post!', 'error');
        }
    }
});

elements.postCount.addEventListener('change', () => {
    state.postCount = parseInt(elements.postCount.value);
    state.currentPage = 1;
    updateURL();
    fetchPosts();
});

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

document.getElementById('pageInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        elements.goToPage.click();
    }
});

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

document.addEventListener('DOMContentLoaded', () => {
    initializeFromURL();
    fetchPosts();
}); 