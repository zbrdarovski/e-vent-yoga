document.addEventListener("DOMContentLoaded", function() {
    fetch('news.json')
        .then(response => response.json())
        .then(data => {
            const newsContainer = document.getElementById('news-container');
            data.forEach(news => {
                const newsArticle = document.createElement('div');
                newsArticle.classList.add('news-article');
                
                const title = document.createElement('h2');
                title.textContent = news.title;
                
                const content = document.createElement('p');
                content.textContent = news.content;
                
                const date = document.createElement('small');
                date.textContent = new Date(news.date).toLocaleDateString();
                
                newsArticle.appendChild(title);
                newsArticle.appendChild(content);
                newsArticle.appendChild(date);
                
                newsContainer.appendChild(newsArticle);
            });
        })
        .catch(error => console.error('Error fetching news:', error));
});
