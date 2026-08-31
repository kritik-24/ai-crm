import React, { useEffect, useMemo, useState } from "react";

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
  const [priorityFilter, setPriorityFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  // =========================
  // LOAD DATA
  // =========================

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

  // =========================
  // FORM
  // =========================

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

  // =========================
  // EDIT
  // =========================

  const handleEdit = (task) => {
    setEditingId(task._id);

    setForm({
      title: task.title || "",
      description: task.description || "",
      customer:
        task.customer?._id ||
        task.customer ||
        "",
      deal:
        task.deal?._id ||
        task.deal ||
        "",
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

  // =========================
  // DELETE
  // =========================

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

  // =========================
  // QUICK STATUS UPDATE
  // =========================

  const updateTaskStatus = async (
    task,
    newStatus
  ) => {
    try {
      setUpdatingStatusId(task._id);
      setError("");

      await updateTask(task._id, {
        title: task.title,
        description: task.description || "",
        customer:
          task.customer?._id ||
          task.customer ||
          null,
        deal:
          task.deal?._id ||
          task.deal ||
          null,
        dueDate: task.dueDate
          ? new Date(task.dueDate)
              .toISOString()
              .split("T")[0]
          : "",
        priority: task.priority,
        status: newStatus,
      });

      setTasks((prev) =>
        prev.map((item) =>
          item._id === task._id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      setMessage("Task status updated!");
    } catch (error) {
      console.error(
        "Failed to update task status:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update task status"
      );
    } finally {
      setUpdatingStatusId(null);
    }
  };

  // =========================
  // DATE HELPERS
  // =========================

  const getDaysDifference = (date) => {
    if (!date) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(date);
    due.setHours(0, 0, 0, 0);

    return Math.floor(
      (due - today) /
        (1000 * 60 * 60 * 24)
    );
  };

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

  const getDueDateInfo = (
    date,
    status
  ) => {
    if (!date) {
      return {
        label: "No due date",
        className:
          "bg-slate-100 text-slate-600",
      };
    }

    if (status === "completed") {
      return {
        label: formatDate(date),
        className:
          "bg-green-50 text-green-700",
      };
    }

    const difference =
      getDaysDifference(date);

    if (difference < 0) {
      return {
        label: `Overdue • ${formatDate(
          date
        )}`,
        className:
          "bg-red-50 text-red-700 border border-red-100",
      };
    }

    if (difference === 0) {
      return {
        label: "Due Today",
        className:
          "bg-orange-50 text-orange-700 border border-orange-100",
      };
    }

    if (difference === 1) {
      return {
        label: "Due Tomorrow",
        className:
          "bg-yellow-50 text-yellow-700 border border-yellow-100",
      };
    }

    return {
      label: formatDate(date),
      className:
        "bg-blue-50 text-blue-700 border border-blue-100",
    };
  };

  // =========================
  // FILTERING
  // =========================

  const filteredTasks = useMemo(() => {
    const searchText =
      search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        task.title
          ?.toLowerCase()
          .includes(searchText) ||
        task.description
          ?.toLowerCase()
          .includes(searchText) ||
        task.customer?.name
          ?.toLowerCase()
          .includes(searchText) ||
        task.deal?.title
          ?.toLowerCase()
          .includes(searchText);

      const matchesStatus =
        statusFilter === "all" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority
      );
    });
  }, [
    tasks,
    search,
    statusFilter,
    priorityFilter,
  ]);

  // =========================
  // STATISTICS
  // =========================

  const statistics = useMemo(() => {
    const total = tasks.length;

    const pending = tasks.filter(
      (task) => task.status === "pending"
    ).length;

    const inProgress = tasks.filter(
      (task) =>
        task.status === "in-progress"
    ).length;

    const completed = tasks.filter(
      (task) =>
        task.status === "completed"
    ).length;

    const overdue = tasks.filter(
      (task) =>
        task.status !== "completed" &&
        task.dueDate &&
        getDaysDifference(task.dueDate) < 0
    ).length;

    return {
      total,
      pending,
      inProgress,
      completed,
      overdue,
    };
  }, [tasks]);

  // =========================
  // BADGES
  // =========================

  const getPriorityClass = (priority) => {
    if (priority === "high") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (priority === "medium") {
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    }

    return "bg-green-50 text-green-700 border-green-200";
  };

  const getStatusClass = (status) => {
    if (status === "completed") {
      return "bg-green-50 text-green-700 border-green-200";
    }

    if (status === "in-progress") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }

    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">

      {/* ================= HEADER ================= */}

      <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-600 font-bold text-sm tracking-wide">
              PRODUCTIVITY
            </span>

            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Task Management
          </h1>

          <p className="text-slate-500 mt-2">
            Stay organized and manage your
            priorities, follow-ups and deadlines.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">

          <p className="text-sm text-slate-500">
            Task Completion
          </p>

          <div className="flex items-end gap-2 mt-1">

            <p className="text-3xl font-bold text-slate-900">
              {statistics.total === 0
                ? 0
                : Math.round(
                    (statistics.completed /
                      statistics.total) *
                      100
                  )}
              %
            </p>

            <p className="text-sm text-slate-400 mb-1">
              completed
            </p>

          </div>

        </div>

      </div>

      {/* ================= ALERTS ================= */}

      {message && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-green-700">

          <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center font-bold">
            ✓
          </span>

          <span className="font-medium">
            {message}
          </span>

        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">

          <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center font-bold">
            !
          </span>

          <span className="font-medium">
            {error}
          </span>

        </div>
      )}

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Total Tasks
          </p>

          <p className="text-3xl font-bold text-slate-900 mt-2">
            {statistics.total}
          </p>

          <p className="text-xs text-slate-400 mt-2">
            All your tasks
          </p>

        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">

          <p className="text-sm font-medium text-slate-500">
            Pending
          </p>

          <p className="text-3xl font-bold text-slate-700 mt-2">
            {statistics.pending}
          </p>

          <p className="text-xs text-slate-400 mt-2">
            Awaiting action
          </p>

        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

          <p className="text-sm font-medium text-blue-600">
            In Progress
          </p>

          <p className="text-3xl font-bold text-blue-700 mt-2">
            {statistics.inProgress}
          </p>

          <p className="text-xs text-blue-500 mt-2">
            Currently active
          </p>

        </div>

        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">

          <p className="text-sm font-medium text-green-600">
            Completed
          </p>

          <p className="text-3xl font-bold text-green-700 mt-2">
            {statistics.completed}
          </p>

          <p className="text-xs text-green-500 mt-2">
            Successfully finished
          </p>

        </div>

        <div className="bg-red-50 border border-red-100 rounded-2xl p-5">

          <p className="text-sm font-medium text-red-600">
            Overdue
          </p>

          <p className="text-3xl font-bold text-red-700 mt-2">
            {statistics.overdue}
          </p>

          <p className="text-xs text-red-500 mt-2">
            Needs attention
          </p>

        </div>

      </div>

      {/* ================= FORM ================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm mb-8 overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-100">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              {editingId ? "✎" : "+"}
            </div>

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                {editingId
                  ? "Edit Task"
                  : "Create New Task"}
              </h2>

              <p className="text-sm text-slate-500">
                {editingId
                  ? "Update task information and progress."
                  : "Create a task and assign its priority and deadline."}
              </p>

            </div>

          </div>

        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Task Title *
              </label>

              <input
                type="text"
                name="title"
                placeholder="Follow up with customer"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Due Date *
              </label>

              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Customer
              </label>

              <select
                name="customer"
                value={form.customer}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >

                <option value="">
                  No Customer
                </option>

                {customers.map(
                  (customer) => (
                    <option
                      key={customer._id}
                      value={customer._id}
                    >
                      {customer.name}
                      {customer.company
                        ? ` - ${customer.company}`
                        : ""}
                    </option>
                  )
                )}

              </select>

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Deal
              </label>

              <select
                name="deal"
                value={form.deal}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >

                <option value="low">
                  🟢 Low Priority
                </option>

                <option value="medium">
                  🟡 Medium Priority
                </option>

                <option value="high">
                  🔴 High Priority
                </option>

              </select>

            </div>

            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description
              </label>

              <textarea
                name="description"
                placeholder="Add task details, notes or instructions..."
                value={form.description}
                onChange={handleChange}
                rows="4"
                className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

            </div>

          </div>

          <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-slate-100">

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
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
                className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition"
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </div>

      {/* ================= TASK LIST ================= */}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        <div className="p-6 border-b border-slate-100">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Your Tasks
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Showing {filteredTasks.length} of{" "}
                {statistics.total} tasks
              </p>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

              <input
                type="text"
                placeholder="🔍 Search tasks..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="sm:col-span-3 xl:col-span-1 xl:w-64 rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
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

              <select
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >

                <option value="all">
                  All Priorities
                </option>

                <option value="high">
                  High
                </option>

                <option value="medium">
                  Medium
                </option>

                <option value="low">
                  Low
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="p-16 text-center">

            <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />

            <p className="text-slate-500">
              Loading your tasks...
            </p>

          </div>
        )}

        {/* EMPTY */}

        {!loading &&
          filteredTasks.length === 0 && (
            <div className="p-16 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-3xl">
                ✓
              </div>

              <h3 className="text-lg font-bold text-slate-900 mt-5">
                No tasks found
              </h3>

              <p className="text-slate-500 mt-2">
                {search ||
                statusFilter !== "all" ||
                priorityFilter !== "all"
                  ? "Try changing your search or filters."
                  : "Create your first task to start managing your work."}
              </p>

            </div>
          )}

        {/* TASK CARDS */}

        {!loading &&
          filteredTasks.length > 0 && (
            <div className="divide-y divide-slate-100">

              {filteredTasks.map((task) => {

                const dueInfo =
                  getDueDateInfo(
                    task.dueDate,
                    task.status
                  );

                return (
                  <div
                    key={task._id}
                    className="p-6 hover:bg-slate-50 transition"
                  >

                    <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">

                      <div className="flex-1 min-w-0">

                        {/* TITLE */}

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-lg font-bold text-slate-900">
                            {task.title}
                          </h3>

                          <span
                            className={`px-3 py-1 rounded-full border text-xs font-semibold capitalize ${getPriorityClass(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>

                          <span
                            className={`px-3 py-1 rounded-full border text-xs font-semibold ${getStatusClass(
                              task.status
                            )}`}
                          >
                            {task.status.replace(
                              "-",
                              " "
                            )}
                          </span>

                        </div>

                        {/* DESCRIPTION */}

                        {task.description && (
                          <p className="text-slate-600 mt-3 leading-relaxed max-w-3xl">
                            {task.description}
                          </p>
                        )}

                        {/* METADATA */}

                        <div className="flex flex-wrap gap-3 mt-5">

                          <span
                            className={`px-3 py-2 rounded-xl text-xs font-semibold ${dueInfo.className}`}
                          >
                            📅 {dueInfo.label}
                          </span>

                          {task.customer?.name && (
                            <span className="px-3 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-medium">
                              👤 {task.customer.name}
                            </span>
                          )}

                          {task.deal?.title && (
                            <span className="px-3 py-2 rounded-xl bg-purple-50 text-purple-700 text-xs font-medium">
                              💼 {task.deal.title}
                            </span>
                          )}

                        </div>

                        {/* QUICK STATUS */}

                        {task.status !==
                          "completed" && (
                          <div className="flex flex-wrap gap-2 mt-5">

                            {task.status ===
                              "pending" && (
                              <button
                                onClick={() =>
                                  updateTaskStatus(
                                    task,
                                    "in-progress"
                                  )
                                }
                                disabled={
                                  updatingStatusId ===
                                  task._id
                                }
                                className="text-xs px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition"
                              >
                                Start Task →
                              </button>
                            )}

                            <button
                              onClick={() =>
                                updateTaskStatus(
                                  task,
                                  "completed"
                                )
                              }
                              disabled={
                                updatingStatusId ===
                                task._id
                              }
                              className="text-xs px-3 py-2 rounded-lg bg-green-50 text-green-700 font-semibold hover:bg-green-100 transition"
                            >
                              {updatingStatusId ===
                              task._id
                                ? "Updating..."
                                : "✓ Mark Completed"}
                            </button>

                          </div>
                        )}

                      </div>

                      {/* ACTIONS */}

                      <div className="flex items-center gap-3 xl:shrink-0">

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
                            handleDelete(
                              task._id
                            )
                          }
                          disabled={
                            deletingId ===
                            task._id
                          }
                          className="px-4 py-2.5 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 disabled:opacity-50 transition"
                        >
                          {deletingId ===
                          task._id
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