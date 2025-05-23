// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Document is ready!');
    
    // Example of DOM manipulation
    const container = document.querySelector('.container');
    
    // Example of adding an event listener
    container.addEventListener('click', () => {
        alert('Container clicked!');
    });
}); 