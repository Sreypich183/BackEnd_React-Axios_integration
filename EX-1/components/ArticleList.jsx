import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ArticleList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/articles')
      .then(res => {
        console.log("Articles fetched:", res.data);
        setArticles(res.data.data.articles);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const deleteArticle = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/articles/${id}`);
      setArticles(prev => prev.filter(article => article.id !== id)); 
    } catch (err) {
      console.error('Failed to delete article:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!Array.isArray(articles)) return <div>Error: Invalid articles data</div>;

  return (
    <div>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>📄 View Articles</Link>
        <Link to="/add"> ➕ Add Article</Link>
      </nav>

      <h2>Articles</h2>
      <ul>
        {articles.map(article => (
          <li key={article.id}>
            <strong>{article.title}</strong> <br />
            <small>By Journalist #{article.journalistId} | Category #{article.categoryId}</small><br />
            <button onClick={() => deleteArticle(article.id)}>Delete</button>
            <button onClick={() => navigate(`/articles/update/${article.id}`)}>Update</button>
            <button onClick={() => navigate(`/articles/${article.id}`)}>View</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
