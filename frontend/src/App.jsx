import { useEffect, useState } from "react";

const API = "http://127.0.0.1:3000/api/notes";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  function load() {
    fetch(API)
      .then(r => r.json())
      .then(setNotes);
  }

  useEffect(load, []);

  function createNote() {
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: { title, body } })
    }).then(() => {
      setTitle("");
      setBody("");
      load();
    });
  }

  function deleteNote(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(load);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Rails + React</h1>

      <input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <br />

      <textarea
        placeholder="Body"
        value={body}
        onChange={e => setBody(e.target.value)}
      />

      <br />

      <button onClick={createNote}>Create</button>

      <hr />

      {notes.map(n => (
        <div key={n.id} style={{ marginBottom: 20 }}>
          <h3>{n.title}</h3>
          <p>{n.body}</p>
          <p>Status: {n.status}</p>
          <p>Score: {n.score}</p>
          <button onClick={() => deleteNote(n.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
