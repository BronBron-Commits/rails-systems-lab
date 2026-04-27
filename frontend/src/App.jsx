import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const NOTES_API = "http://localhost:3000/api/notes";
const INSIGHTS_API = "http://localhost:3000/api/insights";

const STATUS_OPTIONS = ["Open", "In Progress", "Completed"];

export default function App() {
  const [orders, setOrders] = useState([]);
  const [insights, setInsights] = useState(null);
  const [filter, setFilter] = useState("all");

  const [issue, setIssue] = useState("");
  const [description, setDescription] = useState("");
  const [machineName, setMachineName] = useState("");
  const [machineModel, setMachineModel] = useState("");
  const [machineLocation, setMachineLocation] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  function load() {
    fetch(NOTES_API).then((r) => r.json()).then(setOrders);
    fetch(INSIGHTS_API).then((r) => r.json()).then(setInsights);
  }

  useEffect(load, []);

  function showMessage(text) {
    setMessage(text);
    setTimeout(() => setMessage(""), 1800);
  }

  function payload() {
    return {
      note: {
        title: issue,
        body: description,
        machine_name: machineName,
        machine_model: machineModel,
        machine_location: machineLocation,
        operating_hours: operatingHours ? Number(operatingHours) : null,
      },
    };
  }

  function clearForm() {
    setIssue("");
    setDescription("");
    setMachineName("");
    setMachineModel("");
    setMachineLocation("");
    setOperatingHours("");
    setEditingId(null);
  }

  function saveOrder() {
    const url = editingId ? `${NOTES_API}/${editingId}` : NOTES_API;
    const method = editingId ? "PATCH" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload()),
    }).then(() => {
      clearForm();
      load();
      showMessage(editingId ? "Work order updated" : "Work order created");
    });
  }

  function deleteOrder(id) {
    fetch(`${NOTES_API}/${id}`, { method: "DELETE" }).then(() => {
      load();
      showMessage("Work order deleted");
    });
  }

  function updateStatus(order, status) {
    fetch(`${NOTES_API}/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: { status } }),
    }).then(() => {
      load();
      showMessage(`Marked ${status}`);
    });
  }

  function startEdit(order) {
    setEditingId(order.id);
    setIssue(order.title || "");
    setDescription(order.body || "");
    setMachineName(order.machine_name || "");
    setMachineModel(order.machine_model || "");
    setMachineLocation(order.machine_location || "");
    setOperatingHours(order.operating_hours || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (filter === "all") return true;
      if (filter === "open") return order.status !== "Completed";
      if (filter === "completed") return order.status === "Completed";
      if (filter === "critical") return (order.score ?? 0) >= 30;
      return true;
    });
  }, [orders, filter]);

  const modelData = Object.entries(insights?.breakdowns?.by_model || {}).map(
    ([name, value]) => ({ name: name || "Unknown", value })
  );

  const locationData = Object.entries(insights?.breakdowns?.by_location || {}).map(
    ([name, value]) => ({ name: name || "Unknown", value })
  );

  const criticalOrders = orders
    .filter((o) => (o.score ?? 0) >= 30 && o.status !== "Completed")
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {message && (
        <div className="fixed right-5 top-5 z-50 rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-white shadow-lg">
          {message}
        </div>
      )}

      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-r border-slate-800 bg-slate-950 p-6">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-400">
            FleetOps
          </p>
          <h1 className="mt-3 text-2xl font-black">Command Center</h1>

          <nav className="mt-8 grid gap-2 text-sm">
            {[
              ["all", "All Work Orders"],
              ["open", "Open / Active"],
              ["critical", "Critical Faults"],
              ["completed", "Completed"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={`rounded-xl px-4 py-3 text-left font-semibold transition ${
                  filter === id
                    ? "bg-orange-500 text-white"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <p className="text-xs uppercase tracking-widest text-slate-500">
              System Status
            </p>
            <p className="mt-2 text-sm text-emerald-400">API Online</p>
            <p className="mt-1 text-sm text-slate-400">
              {orders.length} active records loaded
            </p>
          </div>
        </aside>

        <section className="p-6 lg:p-8">
          <header className="mb-8 flex flex-col justify-between gap-4 xl:flex-row xl:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-orange-400">
                Rails API + React Dashboard
              </p>
              <h2 className="mt-2 text-4xl font-black tracking-tight">
                Fleet Maintenance Intelligence
              </h2>
              <p className="mt-2 max-w-3xl text-slate-400">
                Monitor machine faults, prioritize service work, and identify operational risk across models and sites.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4">
              <p className="text-xs uppercase tracking-widest text-slate-500">
                Current View
              </p>
              <p className="mt-1 text-lg font-bold capitalize">{filter}</p>
            </div>
          </header>

          <section className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Kpi label="Total Faults" value={insights?.totals?.total ?? orders.length} />
            <Kpi label="Open Work" value={insights?.totals?.open ?? 0} tone="yellow" />
            <Kpi label="Completed" value={insights?.totals?.completed ?? 0} tone="green" />
            <Kpi label="Critical" value={insights?.totals?.high_priority ?? 0} tone="red" />
          </section>

          <section className="mb-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <Panel title="Faults by Machine Model">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={modelData}>
                    <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                    <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: 12,
                        color: "#e2e8f0",
                      }}
                    />
                    <Bar dataKey="value" fill="#f97316" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title="Critical Fault Feed">
              {criticalOrders.length === 0 ? (
                <p className="text-slate-400">No active critical faults.</p>
              ) : (
                <div className="grid gap-3">
                  {criticalOrders.map((order) => (
                    <div key={order.id} className="rounded-xl bg-red-500/10 p-3">
                      <p className="font-bold text-red-300">{order.title}</p>
                      <p className="text-sm text-slate-400">
                        {order.machine_model || "Unknown model"} • {order.machine_location || "Unknown site"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Panel>
          </section>

          <section className="mb-8 grid gap-6 xl:grid-cols-[0.7fr_1.3fr]">
            <Panel title="Faults by Site">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={locationData} dataKey="value" nameKey="name" outerRadius={90} label>
                      {locationData.map((_, i) => (
                        <Cell
                          key={i}
                          fill={["#f97316", "#38bdf8", "#22c55e", "#eab308", "#ef4444", "#a855f7"][i % 6]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#0f172a",
                        border: "1px solid #334155",
                        borderRadius: 12,
                        color: "#e2e8f0",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Panel>

            <Panel title={editingId ? "Edit Machine Work Order" : "Create Machine Work Order"}>
              <div className="grid gap-3 md:grid-cols-2">
                <Input placeholder="Machine name" value={machineName} setValue={setMachineName} />
                <Input placeholder="Model, e.g. Cat 966M" value={machineModel} setValue={setMachineModel} />
                <Input placeholder="Location, e.g. North Quarry" value={machineLocation} setValue={setMachineLocation} />
                <Input placeholder="Operating hours" value={operatingHours} setValue={setOperatingHours} />
                <Input className="md:col-span-2" placeholder="Issue" value={issue} setValue={setIssue} />
                <textarea
                  className="min-h-28 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-orange-400 md:col-span-2"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={saveOrder}
                  className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white transition hover:bg-orange-400"
                >
                  {editingId ? "Update Work Order" : "Create Work Order"}
                </button>
                {editingId && (
                  <button
                    onClick={clearForm}
                    className="rounded-xl bg-slate-700 px-5 py-3 font-bold transition hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </Panel>
          </section>

          <Panel title="Work Order Queue">
            {filteredOrders.length === 0 ? (
              <p className="text-slate-400">No matching work orders.</p>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-800">
                <div className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr] bg-slate-950 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <p>Issue</p>
                  <p>Machine</p>
                  <p>Location</p>
                  <p>Status</p>
                  <p>Actions</p>
                </div>

                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="grid grid-cols-[1.2fr_1fr_0.8fr_0.8fr_0.8fr] items-center gap-4 border-t border-slate-800 px-4 py-4"
                  >
                    <div>
                      <p className="font-bold">{order.title}</p>
                      <p className="mt-1 line-clamp-1 text-sm text-slate-400">{order.body}</p>
                      <p className="mt-2 text-xs text-slate-500">Priority Score: {order.score ?? 0}</p>
                    </div>

                    <div>
                      <p className="font-semibold">{order.machine_name || "Unassigned"}</p>
                      <p className="text-sm text-slate-400">{order.machine_model || "Unknown model"}</p>
                    </div>

                    <p className="text-sm text-slate-300">{order.machine_location || "Unknown"}</p>

                    <select
                      value={order.status || "Open"}
                      onChange={(e) => updateStatus(order, e.target.value)}
                      className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(order)}
                        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-semibold hover:bg-slate-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </section>
      </div>
    </main>
  );
}

function Kpi({ label, value, tone = "slate" }) {
  const tones = {
    slate: "text-slate-100",
    yellow: "text-yellow-400",
    green: "text-green-400",
    red: "text-red-400",
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className={`mt-3 text-4xl font-black ${tones[tone]}`}>{value}</p>
    </div>
  );
}

function Panel({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl">
      <h3 className="mb-4 text-xl font-bold">{title}</h3>
      {children}
    </section>
  );
}

function Input({ placeholder, value, setValue, className = "" }) {
  return (
    <input
      className={`rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-orange-400 ${className}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
