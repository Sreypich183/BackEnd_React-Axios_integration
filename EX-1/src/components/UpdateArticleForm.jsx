import { useEffect, useState } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';

export default function UpdateArticleForm() {
  const [form, setForm] = useState({
    title: '',
    content: '',
    journalistId: '',
    categoryId: '',
  });
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Get article ID from URL
  const navigate = useNavigate(); // For navigation after update

  // Fetch to prefill a form and update an existing article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/articles/${id}`);
        console.log("Fetched article:", res.data);
        setForm(res.data.data.article);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Update article with axios
    const updatedForm = {
      title: form.title,
      content: form.content,
      journalistId: Number(form.journalistId),
      categoryId: Number(form.categoryId),
    };
    try {
      const res = await axios.put(`http://localhost:3000/articles/${id}`, updatedForm);
      alert('Article updated successfully!');
      navigate(`/articles/${id}`); 
    } catch (error) {
      console.error('Failed to update article:', error.response?.data || error.message);
      alert('Failed to update article. See console for details.');
    }
  };

  if (loading) return <div>Loading form...</div>; 

  return (
    <form onSubmit={handleSubmit}>
      <h3>Update Article</h3>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required /><br />
      <textarea name="content" value={form.content} onChange={handleChange} placeholder="Content" required /><br />
      <input name="journalistId" value={form.journalistId} onChange={handleChange} placeholder="Journalist ID" required /><br />
      <input name="categoryId" value={form.categoryId} onChange={handleChange} placeholder="Category ID" required /><br />
      <button type="submit">Update</button>
    </form>
  );
}
