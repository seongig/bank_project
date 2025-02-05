import React, { useState } from 'react';

function Transfer() {
    const [fromAccountId, setFromAccountId] = useState('');
    const [toAccountId, setToAccountId] = useState('');
    const [amount, setAmount] = useState('');

    const handleTransfer = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    fromAccountId,
                    toAccountId,
                    amount,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                alert('이체 성공');
            } else {
                alert(data.message || '이체 실패');
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{ margin: '2rem' }}>
            <h1>마이페이지(이체)</h1>
            <div>
                <label>내 계좌번호</label>
                <input
                    value={fromAccountId}
                    onChange={(e) => setFromAccountId(e.target.value)}
                />
            </div>
            <div>
                <label>받는 계좌번호</label>
                <input
                    value={toAccountId}
                    onChange={(e) => setToAccountId(e.target.value)}
                />
            </div>
            <div>
                <label>이체 금액</label>
                <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>
            <button onClick={handleTransfer}>이체하기</button>
        </div>
    );
}

export default Transfer;
