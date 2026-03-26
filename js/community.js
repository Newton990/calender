document.addEventListener('DOMContentLoaded', () => {
    // FAQ Accordion Toggle
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const span = btn.querySelector('span');
            
            // Toggle active class
            item.classList.toggle('active');
            
            // Toggle icon
            if (item.classList.contains('active')) {
                span.textContent = '−';
            } else {
                span.textContent = '+';
            }
            
            // Optional: Close other FAQs
            // faqQuestions.forEach(otherBtn => {
            //     if (otherBtn !== btn) {
            //         otherBtn.parentElement.classList.remove('active');
            //         otherBtn.querySelector('span').textContent = '+';
            //     }
            // });
        });
    });
});
