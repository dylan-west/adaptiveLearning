const BASE_URL = "https://api.semanticscholar.org/graph/v1/paper/search?";





export const getArticles = async (query) => {
    const response = await fetch(`${BASE_URL}query=${encodeURIComponent(query)}&limit=5&fields=title,year,authors`);
    const data = await response.json();
    return data;
}