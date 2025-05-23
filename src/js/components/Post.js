export const createPostCard = (post) => {
    return `
        <div class="post-card">
            <h3 class="post-title">${post.title}</h3>
            <div class="post-title-underline"></div>
            <p class="post-body">${post.body}</p>
            <div class="post-id-bottom">#${post.id}</div>
        </div>
    `;
};

export const createSuccessPostCard = (post) => {
    return `
        <div class="post-card success">
            <h3 class="post-title"><i class="fas fa-file-alt"></i> ${post.title}</h3>
            <div class="post-title-underline"></div>
            <p class="post-body"><i class="fas fa-align-left"></i> ${post.body}</p>
            <div class="post-id-bottom"><i class="fas fa-hashtag"></i> Post #${post.id}</div>
        </div>
    `;
};

export const createErrorPostCard = () => {
    return `
        <div class="post-card error">
            <h3 class="post-title">Error Adding Post</h3>
            <div class="post-title-underline"></div>
            <p class="post-body">Please try again later.</p>
        </div>
    `;
}; 