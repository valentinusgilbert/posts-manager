import { state } from './state.js';

export const updateURL = () => {
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

export const validateForm = (elements) => {
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