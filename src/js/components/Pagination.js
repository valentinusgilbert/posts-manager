import { state } from '../utils/state.js';
import { updateURL } from '../utils/helpers.js';
import { fetchPosts } from '../services/api.js';

export function createPagination() {
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
}

function addPageNumber(pageNum, container) {
    const pageButton = document.createElement('button');
    pageButton.className = `page-number ${pageNum === state.currentPage ? 'active' : ''}`;
    pageButton.textContent = pageNum;
    pageButton.addEventListener('click', () => {
        state.currentPage = pageNum;
        updateURL();
        fetchPosts();
    });
    container.appendChild(pageButton);
}

function addEllipsis(container) {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'page-number ellipsis';
    ellipsis.textContent = '...';
    container.appendChild(ellipsis);
} 