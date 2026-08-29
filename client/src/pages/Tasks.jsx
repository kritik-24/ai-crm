import React, { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/task";
import { getCustomers } from "../api/customer";
import { getDeals } from "../api/deal";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    customer: "",
    deal: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    }
  };

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error("Failed to load customers:", error);
    }
  };

  const loadDeals = async () => {
    try {
      const data = await getDeals();
      setDeals(data);
    } catch (error) {
      console.error("Failed to load deals:", error);
    }
  };

  useEffect(() => {
    loadTasks();
    loadCustomers();
    loadDeals();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      customer: "",
      deal: "",
      dueDate: "",
      priority: "medium",
      status: "pending",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      const taskData = {
        ...form,
        customer: form.customer || null,
        deal: form.deal || null,
      };

      if (editingId) {
        await updateTask(editingId, taskData);
        setMessage("Task updated successfully!");
      } else {
        await createTask(taskData);
        setMessage("Task created successfully!");
      }

      resetForm();
      await loadTasks();
    } catch (error) {
      console.error("Task operation failed:", error);

      setError(
        error.response?.data?.message ||
          (editingId
            ? "Failed to update task"
            : "Failed to create task")
      );
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);

    setForm({
      title: task.title || "",
      description: task.description || "",
      customer: task.customer?._id || "",
      deal: task.deal?._id || "",
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      priority: task.priority || "medium",
      status: task.status || "pending",
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      await deleteTask(id);

      setMessage("Task deleted successfully!");
      await loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  const handleCancel = () => {
    resetForm();
    setMessage("");
    setError("");
  };

  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      task.title?.toLowerCase().includes(searchText) ||
      task.description?.toLowerCase().includes(searchText) ||
      task.customer?.name?.toLowerCase().includes(searchText) ||
      task.deal?.title?.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getPriorityClass = (priority) => {
    if (priority === "high") {
      return "bg-red-100 text-red-700";
    }

    if (priority === "medium") {
      return "bg-yellow-100 text-yellow-700";
    }

    return "bg-green-100 text-green-700";
  };

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-green-100 text-green-700";
    }

    if (status === "in-progress") {
      return "bg-blue-100 text-blue-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Tasks
        </h1>

        <p className="text-gray-500 mt-1">
          Manage your CRM tasks and follow-ups.
        </p>
      </div>

      {/* Messages */}
      {message && (
        <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-lg">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Task Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Task" : "Add Task"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Title */}
          <input
            type="text"
            name="title"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          {/* Due Date */}
          <input
            type="date"
            name="dueDate"
            value={form.dueDate}
            onChange={handleChange}
            required
            className="border rounded-lg px-4 py-2"
          />

          {/* Customer */}
          <select
            name="customer"
            value={form.customer}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">
              No Customer
            </option>

            {customers.map((customer) => (
              <option
                key={customer._id}
                value={customer._id}
              >
                {customer.name}
                {customer.company
                  ? ` - ${customer.company}`
                  : ""}
              </option>
            ))}
          </select>

          {/* Deal */}
          <select
            name="deal"
            value={form.deal}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">
              No Deal
            </option>

            {deals.map((deal) => (
              <option
                key={deal._id}
                value={deal._id}
              >
                {deal.title}
              </option>
            ))}
          </select>

          {/* Priority */}
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          >
            <option value="low">
              Low Priority
            </option>

            <option value="medium">
              Medium Priority
            </option>

            <option value="high">
              High Priority
            </option>
          </select>

          {/* Status */}
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border rounded-lg px-4 py-2"
          >
            <option value="pending">
              Pending
            </option>

            <option value="in-progress">
              In Progress
            </option>

            <option value="completed">
              Completed
            </option>
          </select>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Task description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="border rounded-lg px-4 py-2 md:col-span-2"
          />

        </div>

        <div className="flex gap-3 mt-4">

          <button
            type="submit"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {editingId
              ? "Update Task"
              : "Add Task"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          )}

        </div>
      </form>

      {/* Task List */}
      <div className="bg-white rounded-xl shadow overflow-hidden">

        {/* Filters */}
        <div className="p-5 border-b">

          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">

            <h2 className="text-xl font-semibold">
              Task List
            </h2>

            <div className="flex flex-col md:flex-row gap-3">

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="border rounded-lg px-4 py-2"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="border rounded-lg px-4 py-2"
              >
                <option value="all">
                  All Status
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="in-progress">
                  In Progress
                </option>

                <option value="completed">
                  Completed
                </option>
              </select>

            </div>

          </div>
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No tasks found.
          </div>
        ) : (
          <div className="divide-y">

            {filteredTasks.map((task) => (
              <div
                key={task._id}
                className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-5 hover:bg-gray-50"
              >

                {/* Task Information */}
                <div className="flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <h3 className="text-lg font-semibold text-gray-900">
                      {task.title}
                    </h3>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getPriorityClass(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusClass(
                        task.status
                      )}`}
                    >
                      {task.status.replace(
                        "-",
                        " "
                      )}
                    </span>

                  </div>

                  {task.description && (
                    <p className="text-gray-600 mt-2">
                      {task.description}
                    </p>
                  )}

                  <div className="text-sm text-gray-500 mt-2 space-y-1">

                    <p>
                      Due:{" "}
                      <span className="font-medium">
                        {formatDate(task.dueDate)}
                      </span>
                    </p>

                    {task.customer && (
                      <p>
                        Customer:{" "}
                        <span className="font-medium">
                          {task.customer.name}
                        </span>
                      </p>
                    )}

                    {task.deal && (
                      <p>
                        Deal:{" "}
                        <span className="font-medium">
                          {task.deal.title}
                        </span>
                      </p>
                    )}

                  </div>

                </div>

                {/* Actions */}
                <div className="flex gap-3">

                  <button
                    onClick={() =>
                      handleEdit(task)
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(task._id)
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Tasks;