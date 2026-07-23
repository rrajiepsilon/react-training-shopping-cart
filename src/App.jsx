import { useState } from 'react';
import CartPage from './pages/CartPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  if (activeTab === 'cart') {
    return <CartPage onReturnHome={() => setActiveTab('home')} />;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>React Training</h1>
        <nav className="app-nav">
          <button
            type="button"
            className={activeTab === 'home' ? 'active' : ''}
            onClick={() => setActiveTab('home')}
          >
            Home
          </button>
          <button
            type="button"
            className={activeTab === 'cart' ? 'active' : ''}
            onClick={() => setActiveTab('cart')}
          >
            Cart
          </button>
        </nav>
      </header>

      <main className="app-main">
        <h2>Course Home</h2>
        <p>Welcome to the React Training course. Use the navigation above to open the shopping cart demo.</p>
      </main>
    </div>
  );
}

export default App;
