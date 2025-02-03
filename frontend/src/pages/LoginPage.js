import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('로그인 성공');
        navigate('/main');
      } else {
        alert(data.message || '로그인 실패');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const goRegister = () => {
    navigate('/register');
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>로그인</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label>아이디</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">로그인</button>
      </form>
      <button onClick={goRegister}>회원가입 페이지로</button>
    </div>
  );
}

export default LoginPage;
