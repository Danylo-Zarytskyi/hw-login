'use client';
import { useState } from 'react';
import styles from './page.module.css';
import axios from 'axios';

export default function Home() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Перевірка...');
    
      const formData = new FormData();
      formData.append('login', login);
      formData.append('password', password);

      
      const response = await axios.post('http://localhost:4000/', formData);

      setMessage(response.data.success ? 'Success' : 'Wrong login or password');
  };

  return (
    <div>
      <h1>Авторизація</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <label>Логін:</label>
          <input
            type='text'
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Пароль:</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type='submit'>Увійти</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
