import React from 'react';
import Navigation from './components/Navigation';
import HelloWorldPage from './components/HelloWorldPage';
import './App.css';

/**
 * App Component
 * Root component that renders the navigation and main page
 */
function App() {
  return (
    <div className="App">
      {/* Fixed Top Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="App-main">
        <HelloWorldPage />
      </main>
    </div>
  );
}

export default App;
