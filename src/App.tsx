import React, { useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [savedEntries, setSavedEntries] = useState([]);
  const [aiResult, setAiResult] = useState('');

  const handleSave = () => {
    if (!title || !text) return;
    const newEntry = { title, text, id: Date.now() };
    setSavedEntries([newEntry, ...savedEntries]);
    setTitle('');
    setText('');
  };

  const handleAI = async () => {
    setAiResult("Waiting for AI response...");
    setTimeout(() => {
      setAiResult(`AI Suggestion for "${title}":`);
    }, 1000);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Golden Quill</h1>
      </header>

      <main className="main-content">
        {/* Form Box */}
        <section className="input-box">
          <h2>Your Idea</h2>
          <input 
            className="title-input"
            type="text" 
            placeholder="Title" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea 
            className="content-textarea"
            placeholder="Start writing..." 
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="button-group">
            <button className="btn-save" onClick={handleSave}>Save Idea</button>
            <button className="btn-ai" onClick={handleAI}>AI Suggestion</button>
          </div>
        </section>

        {/* Bank Box */}
        <section className="saved-box">
          <h2>Saved Ideas</h2>
          <div className="entries-list">
            {savedEntries.map(entry => (
              <article key={entry.id} className="entry-card">
                <h3>{entry.title}</h3>
                <p>{entry.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* AI Result */}
      <footer className="ai-footer">
        <h3>AI Result</h3>
        <div className="ai-content">
          {aiResult || "AI suggestions will appear here..."}
        </div>
      </footer>
    </div>
  );
}

export default App;

