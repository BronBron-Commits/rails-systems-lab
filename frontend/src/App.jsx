import { useEffect, useState } from "react";

const API = "http://localhost:3000/api/notes";
const STATUSES = ["Open", "In Progress", "Completed"];

export default function App() {
  const [orders, setOrders] = useState([]);
  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [machineName, setMachineName] = useState("");
  const [machineModel, setMachineModel] = useState("");
  const [machineLocation, setMachineLocation] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [editingId, setEditingId] = useState(null);

  function load() {
    fetch(API).then(r => r.json()).then(setOrders);
  }

  useEffect(load, []);

  function payload() {
    return {
      note: {
        title: issue,
        body: description,
        machine_name: machineName,
        machine_model: machineModel,
        machine_location: machineLocation,
        operating_hours: operatingHours ? Number(operatingHours) : null,
      }
    };
  }

  function createOrder() {
    fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload())
    }).then(() => {
      clear();
      load();
    });
  }

  function updateOrder() {
    fetch(`${API}/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload())
    }).then(() => {
      clear();
      load();
    });
  }

  function updateStatus(id, status) {
    fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: { status } })
    }).then(load);
  }

  function deleteOrder(id) {
    fetch(`${API}/${id}`, { method: "DELETE" }).then(load);
  }

  function startEdit(o) {
    setEditingId(o.id);
    setIssue(o.title);
    setDescription(o.body);
    setMachineName(o.machine_name || "");
    setMachineModel(o.machine_model || "");
    setMachineLocation(o.machine_location || "");
    setOperatingHours(o.operating_hours || "");
  }

  function clear() {
    setEditingId(null);
    setIssue("");
    setDescription("");
    setMachineName("");
    setMachineModel("");
    setMachineLocation("");
    setOperatingHours("");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <section className="mx-auto max-w-6xl">

        <h1 className="text-4xl font-bold mb-8">Fleet Maintenance Dashboard</h1>

        <div className="mb-10 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <input placeholder="Machine" value={machineName} onChange={e => setMachineName(e.target.value)} className="block w-full mb-2 p-2 bg-slate-800 rounded"/>
          <input placeholder="Model" value={machineModel} onChange={e => setMachineModel(e.target.value)} className="block w-full mb-2 p-2 bg-slate-800 rounded"/>
          <input placeholder="Location" value={machineLocation} onChange={e => setMachineLocation(e.target.value)} className="block w-full mb-2 p-2 bg-slate-800 rounded"/>
          <input placeholder="Hours" value={operatingHours} onChange={e => setOperatingHours(e.target.value)} className="block w-full mb-2 p-2 bg-slate-800 rounded"/>
          <input placeholder="Issue" value={issue} onChange={e => setIssue(e.target.value)} className="block w-full mb-2 p-2 bg-slate-800 rounded"/>
          <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="block w-full mb-2 p-2 bg-slate-800 rounded"/>

          <button onClick={editingId ? updateOrder : createOrder} className="bg-orange-500 px-4 py-2 rounded">
            {editingId ? "Update" : "Create"}
          </button>
        </div>

        <div className="grid gap-4">
          {orders.map(o => (
            <div key={o.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800">

              <p className="text-sm text-slate-400">
                {o.machine_model} • {o.machine_name}
              </p>

              <h3 className="text-xl font-bold">{o.title}</h3>
              <p>{o.body}</p>

              <p className="text-sm mt-2">📍 {o.machine_location}</p>

              <div className="mt-3 flex gap-2 items-center">
                <select
                  value={o.status || "Open"}
                  onChange={(e) => updateStatus(o.id, e.target.value)}
                  className="bg-slate-800 px-3 py-1 rounded"
                >
                  {STATUSES.map(s => (
                    <option key={s}>{s}</option>
                  ))}
                </select>

                <span className="text-sm">
                  Score: {o.score ?? 0}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => startEdit(o)} className="bg-slate-700 px-3 py-1 rounded">
                  Edit
                </button>

                <button onClick={() => deleteOrder(o.id)} className="bg-red-600 px-3 py-1 rounded">
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </section>
    </main>
  );
}
