document.addEventListener("DOMContentLoaded", function() {
    const articlesContainer = document.getElementById("articles");

    // Function to load articles dynamically
    function loadArticles() {
        fetch('articles/sample-article.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                const articleElement = document.createElement('div');
                articleElement.innerHTML = data;
                articlesContainer.appendChild(articleElement);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Load articles on page load
    loadArticles();
});

document.addEventListener("DOMContentLoaded", function () {
    const cards = document.querySelectorAll('.article-card');

    function onScroll() {
        cards.forEach((card, i) => {
            const rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                card.classList.add('in-view');
                card.style.transitionDelay = `${0.1 + i * 0.1}s`;
            }
        });
    }

    window.addEventListener('scroll', onScroll);
    onScroll(); // Trigger on load
});