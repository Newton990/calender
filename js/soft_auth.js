function handleLogin(method) {
    console.log(`Authenticating with ${method}...`);
    
    // Simulate premium feedback
    const card = document.querySelector('.auth-card');
    card.style.transform = 'scale(0.98)';
    setTimeout(() => card.style.transform = 'scale(1)', 100);

    // Mock session init
    localStorage.setItem('NewLunaSession', 'demo_user_soft');
    
    // Show premium transition
    const container = document.querySelector('.auth-container');
    container.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    container.style.opacity = '0';
    container.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        window.location.href = 'soft_dashboard.html';
    }, 600);
}

// Add premium entrance animations
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.auth-container');
    const blobs = document.querySelectorAll('.blob');
    
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.transition = 'opacity 0.8s cubic-bezier(0.23, 1, 0.32, 1), transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
    
    blobs.forEach(blob => {
        blob.style.opacity = '0';
        blob.style.transition = 'opacity 1.2s ease-out';
    });

    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
        blobs.forEach(blob => blob.style.opacity = '1');
    }, 100);
});
