// State management
export const state = {
    currentPage: 1,
    searchQuery: '',
    sortField: 'id',
    sortOrder: 'asc',
    postCount: 5,
    totalPosts: 0
};

// DOM Elements
export const elements = {
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