import { useEffect, useState } from "react";

const API = "http://127.0.0.1:3000/api/notes";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState(null);

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

  function updateNote() {
    fetch(`${API}/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: { title, body } })
    }).then(() => {
      setEditingId(null);
      setTitle("");
      setBody("");
      load();
    });
  }

  function deleteNote(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(load);
  }

  function startEdit(n) {
    setEditingId(n.id);
    setTitle(n.title);
    setBody(n.body);
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

      {editingId ? (
        <button onClick={updateNote}>Update</button>
      ) : (
        <button onClick={createNote}>Create</button>
      )}

      <hr />

      {notes.map(n => (
        <div key={n.id} style={{ marginBottom: 20 }}>
          <h3>{n.title}</h3>
          <p>{n.body}</p>
          <p>Status: {n.status}</p>
          <p>Score: {n.score}</p>

          <button onClick={() => startEdit(n)}>Edit</button>
          <button onClick={() => deleteNote(n.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
