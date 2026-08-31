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
  const initialForm = {
    title: "",
    description: "",
    customer: "",
    deal: "",
    dueDate: "",
    priority: "medium",
    status: "pending",
  };

  const [tasks, setTasks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [deals, setDeals] = useState([]);

  const [form, setForm] = useState(initialForm);

  const [editingId, setEditingId] = useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // -----------------------------
  // Load Data
  // -----------------------------

  const loadTasks = async () => {
    const data = await getTasks();
    setTasks(data || []);
  };

  const loadCustomers = async () => {
    const data = await getCustomers();
    setCustomers(data || []);
  };

  const loadDeals = async () => {
    const data = await getDeals();
    setDeals(data || []);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      await Promise.all([
        loadTasks(),
        loadCustomers(),
        loadDeals(),
      ]);
    } catch (error) {
      console.error("Failed to load task data:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // -----------------------------
  // Form
  // -----------------------------

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setSubmitting(true);

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
    } finally {
      setSubmitting(false);
    }
  };

  // -----------------------------
  // Edit
  // -----------------------------

  const handleEdit = (task) => {
    setEditingId(task._id);

    setForm({
      title: task.title || "",
      description: task.description || "",
      customer: task.customer?._id || task.customer || "",
      deal: task.deal?._id || task.deal || "",
      dueDate: task.dueDate
        ? new Date(task.dueDate)
            .toISOString()
            .split("T")[0]
        : "",
      priority: task.priority || "medium",
      status: task.status || "pending",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancel = () => {
    resetForm();
    setMessage("");
    setError("");
  };

  // -----------------------------
  // Delete
  // -----------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setMessage("");
      setError("");

      await deleteTask(id);

      setTasks((prev) =>
        prev.filter((task) => task._id !== id)
      );

      setMessage("Task deleted successfully!");
    } catch (error) {
      console.error("Failed to delete task:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // -----------------------------
  // Filtering
  // -----------------------------

  const filteredTasks = tasks.filter((task) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      task.title?.toLowerCase().includes(searchText) ||
      task.description?.toLowerCase().includes(searchText) ||
      task.customer?.name
        ?.toLowerCase()
        .includes(searchText) ||
      task.deal?.title
        ?.toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // -----------------------------
  // Statistics
  // -----------------------------

  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // -----------------------------
  // Styling Helpers
  // -----------------------------

  const getPriorityClass = (priority) => {
    if (priority === "high") {
      return "bg-red-100 text-red-700 border border-red-200";
    }

    if (priority === "medium") {
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }

    return "bg-green-100 text-green-700 border border-green-200";
  };

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-green-100 text-green-700 border border-green-200";
    }

    if (status === "in-progress") {
      return "bg-blue-100 text-blue-700 border border-blue-200";
    }

    return "bg-gray-100 text-gray-700 border border-gray-200";
  };

  // -----------------------------
  // Date Helpers
  // -----------------------------

  const formatDate = (date) => {
    if (!date) return "No due date";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getDueDateInfo = (date, status) => {
    if (!date || status === "completed") {
      return {
        label: formatDate(date),
        className: "text-gray-500",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(date);
    due.setHours(0, 0, 0, 0);

    const difference =
      Math.floor(
        (due - today) /
          (1000 * 60 * 60 * 24)
      );

    if (difference < 0) {
      return {
        label: `Overdue • ${formatDate(date)}`,
        className:
          "text-red-600 font-semibold",
      };
    }

    if (difference === 0) {
      return {
        label: "Due Today",
        className:
          "text-orange-600 font-semibold",
      };
    }

    if (difference === 1) {
      return {
        label: "Due Tomorrow",
        className:
          "text-yellow-600 font-semibold",
      };
    }

    return {
      label: formatDate(date),
      className: "text-gray-600",
    };
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">

      {/* =====================================
          HEADER
      ===================================== */}

      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <p className="text-sm font-semibold text-blue-600 mb-1">
            PRODUCTIVITY
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tasks
          </h1>

          <p className="text-gray-500 mt-2">
            Manage tasks, follow-ups, priorities and deadlines.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-100 px-4 py-3 rounded-xl">
          <p className="text-sm text-blue-600">
            Total Tasks
          </p>

          <p className="text-2xl font-bold text-blue-700">
            {totalTasks}
          </p>
        </div>

      </div>

      {/* =====================================
          SUCCESS / ERROR
      ===================================== */}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">
          <span className="text-lg">✓</span>
          <span className="font-medium">
            {message}
          </span>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
          <span className="text-lg">!</span>
          <span className="font-medium">
            {error}
          </span>
        </div>
      )}

      {/* =====================================
          STATISTICS
      ===================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-medium text-gray-500">
            Total Tasks
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalTasks}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            All tasks in your CRM
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="text-sm font-medium text-gray-500">
            Pending
          </p>

          <p className="text-3xl font-bold text-gray-700 mt-2">
            {pendingTasks}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Awaiting action
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-5">
          <p className="text-sm font-medium text-blue-600">
            In Progress
          </p>

          <p className="text-3xl font-bold text-blue-700 mt-2">
            {inProgressTasks}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Currently being worked on
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
          <p className="text-sm font-medium text-green-600">
            Completed
          </p>

          <p className="text-3xl font-bold text-green-700 mt-2">
            {completedTasks}
          </p>

          <p className="text-sm text-gray-400 mt-2">
            Successfully finished
          </p>
        </div>

      </div>

      {/* =====================================
          ADD / EDIT FORM
      ===================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">

        <div className="px-6 py-5 border-b border-gray-100">

          <h2 className="text-xl font-bold text-gray-900">
            {editingId
              ? "Edit Task"
              : "Create New Task"}
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            {editingId
              ? "Update the details of this task."
              : "Add a new task and link it with a customer or deal."}
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Title */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>

              <input
                type="text"
                name="title"
                placeholder="e.g. Follow up with client"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Due Date */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>

            {/* Customer */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Customer
              </label>

              <select
                name="customer"
                value={form.customer}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
            </div>

            {/* Deal */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deal
              </label>

              <select
                name="deal"
                value={form.deal}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
            </div>

            {/* Priority */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="low">
                  Low
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="high">
                  High
                </option>

              </select>
            </div>

            {/* Status */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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
            </div>

            {/* Description */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Add details about this task..."
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

          {/* Actions */}

          <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-gray-100">

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting
                ? "Saving..."
                : editingId
                ? "Update Task"
                : "Create Task"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* =====================================
          TASK LIST
      ===================================== */}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

        {/* List Header */}

        <div className="p-6 border-b border-gray-100">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                Your Tasks
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Showing {filteredTasks.length} of {totalTasks} tasks
              </p>

            </div>

            <div className="flex flex-col sm:flex-row gap-3">

              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full sm:w-64 rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="rounded-xl border border-gray-300 px-4 py-3 bg-white outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

        {/* Loading */}

        {loading && (
          <div className="p-12 text-center">

            <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-gray-500">
              Loading your tasks...
            </p>

          </div>
        )}

        {/* Empty State */}

        {!loading && filteredTasks.length === 0 && (
          <div className="p-12 text-center">

            <div className="text-5xl mb-4">
              ✓
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              No tasks found
            </h3>

            <p className="text-gray-500 mt-2">
              {search || statusFilter !== "all"
                ? "Try changing your search or filter."
                : "Create your first task to get started."}
            </p>

          </div>
        )}

        {/* Task Cards */}

        {!loading && filteredTasks.length > 0 && (
          <div className="divide-y divide-gray-100">

            {filteredTasks.map((task) => {

              const dueInfo = getDueDateInfo(
                task.dueDate,
                task.status
              );

              return (
                <div
                  key={task._id}
                  className="p-6 hover:bg-gray-50 transition"
                >

                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                    {/* Task Content */}

                    <div className="flex-1 min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-lg font-bold text-gray-900">
                          {task.title}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {task.priority} priority
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusClass(
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
                        <p className="text-gray-600 mt-3 leading-relaxed max-w-3xl">
                          {task.description}
                        </p>
                      )}

                      {/* Metadata */}

                      <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4 text-sm">

                        <div>
                          <p className="text-gray-400">
                            Due Date
                          </p>

                          <p className={dueInfo.className}>
                            {dueInfo.label}
                          </p>
                        </div>

                        {task.customer && (
                          <div>
                            <p className="text-gray-400">
                              Customer
                            </p>

                            <p className="font-medium text-gray-700">
                              {task.customer.name}
                            </p>
                          </div>
                        )}

                        {task.deal && (
                          <div>
                            <p className="text-gray-400">
                              Deal
                            </p>

                            <p className="font-medium text-gray-700">
                              {task.deal.title}
                            </p>
                          </div>
                        )}

                      </div>

                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-3 xl:self-start">

                      <button
                        type="button"
                        onClick={() =>
                          handleEdit(task)
                        }
                        className="px-4 py-2.5 border border-blue-200 text-blue-700 font-medium rounded-xl hover:bg-blue-50 transition"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(task._id)
                        }
                        disabled={
                          deletingId === task._id
                        }
                        className="px-4 py-2.5 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 disabled:opacity-50 transition"
                      >
                        {deletingId === task._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default Tasks;