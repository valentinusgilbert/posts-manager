import { state, elements } from '../utils/state.js';
import { createPostCard, createSuccessPostCard, createErrorPostCard } from '../components/Post.js';
import { createPagination } from '../components/Pagination.js';

export const fetchPosts = async () => {
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
        if (posts.length === 0) {
            elements.postsList.innerHTML = `
              <div class="empty-state">
                <i class="fas fa-folder-open"></i>
                <div><strong>No posts found.</strong></div>
                <div>Try searching with different keywords or adjust your filters.</div>
              </div>
            `;
        } else {
            elements.postsList.innerHTML = posts.map(createPostCard).join('');
        }
        createPagination();
        elements.prevPage.disabled = state.currentPage === 1;
        elements.nextPage.disabled = state.currentPage >= Math.ceil(state.totalPosts / state.postCount);
    } catch (error) {
        console.error('Error fetching posts:', error);
        elements.postsList.innerHTML = '<div class="error">Error loading posts. Please try again.</div>';
    }
};

export const addPost = async (postData) => {
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
        elements.postsList.innerHTML = createSuccessPostCard(newPost);
        setTimeout(() => {
            elements.addPostModal.style.display = 'none';
            fetchPosts();
        }, 2000);
        return true;
    } catch (error) {
        console.error('Error adding post:', error);
        elements.postsList.innerHTML = createErrorPostCard();
        return false;
    }
}; 