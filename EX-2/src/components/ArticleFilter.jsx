import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ArticleFilter() {
  const [articles, setArticles] = useState([]);
  const [journalists, setJournalists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedJournalist, setSelectedJournalist] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchArticles();
    fetchJournalists();
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

  const fetchJournalists = async () => {
    try {
      const res = await axios.get('http://localhost:3000/journalists');
      setJournalists(res.data);
    } catch (err) {
      console.error('Error fetching journalists', err);
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
    setLoading(true);
    try {
      let url = 'http://localhost:3000/articles';

      if (selectedJournalist && selectedCategory) {
        url += `?journalistId=${selectedJournalist}&categoryId=${selectedCategory}`;
      } else if (selectedJournalist) {
        url = `http://localhost:3000/journalists/${selectedJournalist}/articles`;
      } else if (selectedCategory) {
        url = `http://localhost:3000/categories/${selectedCategory}/articles`;
      }

      const res = await axios.get(url);
      setArticles(res.data);
    } catch (err) {
      console.error('Error applying filters', err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSelectedJournalist('');
    setSelectedCategory('');
    fetchArticles();
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', borderRadius: '10px' }}>
      <h2 style={{ color: '#333', textAlign: 'center' }}>📰 News Article Filter</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
        <label htmlFor="journalistFilter" style={{ fontWeight: 'bold' }}>Filter by Journalist:</label>
        <select
          id="journalistFilter"
          value={selectedJournalist}
          onChange={(e) => setSelectedJournalist(e.target.value)}
          style={{ padding: '5px', borderRadius: '5px' }}
        >
          <option value="">All Journalists</option>
          {journalists.map((j) => (
            <option key={j.id} value={j.id}>
              {j.name}
            </option>
          ))}
        </select>

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

        <button onClick={applyFilters} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#3138b3aa', color: 'white', border: 'none' }}>Apply Filters</button>
        <button onClick={resetFilters} style={{ padding: '5px 10px', borderRadius: '5px', backgroundColor: '#3138b3aa', color: 'white', border: 'none' }}>Reset Filters</button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center' }}>Loading...</p>
      ) : articles.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No articles found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {articles.map((article) => (
            <li key={article.id} style={{ backgroundColor: '#fff', padding: '10px', margin: '10px 0', borderRadius: '5px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
              <strong>{article.title}</strong> <br />
              <small>
                By {journalists.find(j => j.id === article.journalistId)?.name || `Journalist #${article.journalistId}`} | Category {categories.find(c => c.id === article.categoryId)?.name || `#${article.categoryId}`}
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
