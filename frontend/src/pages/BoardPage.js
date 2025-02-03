import React, { useEffect, useState } from 'react';

function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [writer, setWriter] = useState('');
  const [content, setContent] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/board');
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const createPost = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ writer, content })
      });
      if (res.ok) {
        alert('게시물 작성 성공');
        fetchPosts();
      } else {
        alert('게시물 작성 실패');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ margin: '1rem' }}>
      <h1>게시판</h1>
      <div>
        <label>작성자: </label>
        <input value={writer} onChange={e => setWriter(e.target.value)} />
      </div>
      <div>
        <label>내용: </label>
        <textarea value={content} onChange={e => setContent(e.target.value)} />
      </div>
      <button onClick={createPost}>작성</button>

      <hr />
      <h2>게시물 목록</h2>
      {posts.map(post => (
        // dangerouslySetInnerHTML를 쓰면 XSS 위험 (의도적)
        <div key={post.post_id} style={{ border: '1px solid gray', margin: '1rem', padding: '1rem' }}>
          <p>작성자: {post.writer}</p>
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      ))}
    </div>
  );
}

export default BoardPage;
