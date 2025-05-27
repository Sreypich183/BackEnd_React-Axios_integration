import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilterByCategory() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/articles');
      setArticles(res.data);
    } catch (err) {
      console.error('Error fetching articles', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3000/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories', err);
    }
  };

  const applyFilters = async () => {
    if (!selectedCategory) {
      fetchArticles();
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:3000/categories/${selectedCategory}/articles`
      );
      setArticles(res.data);
    } catch (err) {
      console.error('Error filtering by category', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedCategory('');
    fetchArticles();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', borderRadius: '10px' }}>
      <h2 style={{ color: '#333', textAlign: 'center' }}>📰 Articles</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
        <label htmlFor="categoryFilter" style={{ fontWeight: 'bold' }}>Filter by Category:</label>
        <select
          id="categoryFilter"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '5px', borderRadius: '5px' }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button 
          onClick={applyFilters} 
          style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#3138b3aa', color: 'white', border: 'none' }}
        >
          Apply Filters
        </button>
        <button 
          onClick={resetFilters} 
          style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#3138b3aa', color: 'white', border: 'none' }}
        >
          Reset Filters
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : articles.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No articles found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {articles.map((article) => (
            <li 
              key={article.id} 
              style={{ backgroundColor: '#fff', padding: '10px', margin: '10px 0', borderRadius: '5px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}
            >
              <strong>{article.title}</strong> <br />
              <small>
                By Journalist #{article.journalistId} | Category #{article.categoryId}
              </small>
              <br />
              <button disabled style={{ margin: '3px', color: 'white', backgroundColor: '#3138b3aa', border: 'none', borderRadius: '3px', padding: '10px'}}>Delete</button>
              <button disabled style={{ margin: '3px', color: 'white', backgroundColor: '#3138b3aa', border: 'none', borderRadius: '3px', padding: '10px'}}>Update</button>
              <button disabled style={{ margin: '3px', color: 'white', backgroundColor: '#3138b3aa', border: 'none', borderRadius: '3px', padding: '10px'}}>View</button>
            </li>
          ))}
        </ul>
      )}
    </div>

  );
}
