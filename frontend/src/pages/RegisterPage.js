import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('회원가입 성공');
        navigate('/');
      } else {
        alert(data.message || '회원가입 실패');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>회원가입</h1>
      <form onSubmit={handleRegister}>
        <div>
          <label>아이디</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;
