import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaClipboard, FaUser, FaSignOutAlt } from 'react-icons/fa';

function MainPage() {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [totalBalance, setTotalBalance] = useState(0);

    const fetchAccounts = async () => {
        const mockData = [{ account_id: 1, balance: 1000 }];
        setAccounts(mockData);
        setTotalBalance(mockData.reduce((sum, acc) => sum + acc.balance, 0));
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* 사이드바 */}
            <div className="sidebar">
                <div onClick={() => navigate('/')}>
                    <FaHome size={24} />
                    <p>홈</p>
                </div>
                <div onClick={() => navigate('/board')}>
                    <FaClipboard size={24} />
                    <p>게시판</p>
                </div>
                <div onClick={() => navigate('/transfer')}>
                    <FaUser size={24} />
                    <p>이체</p>
                </div>
                <div
                    style={{ marginTop: 'auto' }}
                    onClick={() => alert('로그아웃')}
                >
                    <FaSignOutAlt size={24} />
                    <p>로그아웃</p>
                </div>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="content">
                <h1>메인페이지</h1>
                <div className="card-container">
                    <div className="card">
                        <h3>총 자산</h3>
                        <p>₩{totalBalance}</p>
                    </div>
                    <div className="card">
                        <h3>계좌 목록</h3>
                        {accounts.map((acc) => (
                            <p key={acc.account_id}>
                                계좌: {acc.account_id} / 잔액: ₩{acc.balance}
                            </p>
                        ))}
                    </div>
                    <div className="card">
                        <h3>빠른 서비스</h3>
                        <button onClick={() => navigate('/transfer')}>
                            송금
                        </button>
                        <button onClick={() => alert('납부 기능 준비 중')}>
                            납부
                        </button>
                    </div>
                </div>
                <button
                    style={{
                        marginTop: '2rem',
                        padding: '0.5rem 2rem',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        cursor: 'pointer',
                    }}
                    onClick={() => alert('계좌 개설')}
                >
                    계좌 개설
                </button>
            </div>
        </div>
    );
}

export default MainPage;
