const BASE_URL = "https://api.semanticscholar.org/graph/v1";
const API_KEY = "API_KEY_HERE"

export const getArticles = async (query) => {
    const response = await fetch(`${BASE_URL}/paper/search?query=${encodeURIComponent(query)}&apiKey=${API_KEY}`);
    const data = await response.json();
    return data;
}