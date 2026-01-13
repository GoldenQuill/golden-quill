import React, { useState } from 'react';
import './App.css';

interface WritingEntry {
  id: number;
  title: string;
  text: string;
}

function App() {
  const [title, setTitle] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [savedEntries, setSavedEntries] = useState<WritingEntry[]>([]);
  const [aiResult, setAiResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSave = () => {
    if (!title || !text) return;
    const newEntry: WritingEntry = { 
      id: Date.now(),
      title: title,
      text: text,
    };
    setSavedEntries([newEntry, ...savedEntries]);
    setTitle('');
    setText('');
  };

  const handleLoadEntry = (entry: WritingEntry) => {
    setTitle(entry.title);
    setText(entry.text);
    document.querySelector('textarea')?.focus();
  }

  const handleAI = async () => {
    if (!text) return;
    setIsLoading(true);
    setAiResult("Awaiting the spark...");
    try {
      const response = await fetch('/api/suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text }),
      })

      const data = await response.json();

      if (response.ok) {
        setAiResult(data.suggestion);
      } else {
        setAiResult(`Error: ${data.err}`);
      }
    } catch (err) {
      setAiResult("Could not reach the server.")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Golden Quill</h1>
      </header>

      <main className="main-content">
        {/* Form Box */}
        <section className="input-box">
          <h2>The Blank Parchment</h2>
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
            <button className="btn-save" onClick={handleSave}>Capture Thought</button>
            <button className="btn-ai" onClick={handleAI} disabled={isLoading}>Consult the Quill</button>
          </div>
        </section>

        {/* Bank Box */}
        <section className="saved-box">
          <h2>The Vault</h2>
          <div className="entries-list">
            {savedEntries.map(entry => (
              <article key={entry.id} className="entry-card">
                <div className='entry-header'>
                <h3>{entry.title}</h3>
                  <button className="btn-load" onClick={() => handleLoadEntry(entry)}>
                    Edit
                  </button>
                </div>
                <p className='entry-preview'>{entry.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* AI Result */}
      <footer className="ai-footer">
        <h3>The Gilded Draft</h3>
        <div className="ai-content">
          {aiResult || "A silent quill, waiting for inspiration..."}
        </div>
      </footer>
    </div>
  );
}

export default App;

