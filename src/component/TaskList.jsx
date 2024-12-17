import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [form, setForm] = useState({
    title: "",
    startTime: "",
    endTime: "",
    priority: "",
    status: "",
  });
  // console.log(data);

  const [addTaskPopup, setAddTaskPopup] = useState(false);
  const [updateTaskPopup, setupdateTaskPopup] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [priorityFilter, setPriorityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const token = localStorage.getItem("token");
  const baseURL = "https://reunion-server-s2jv.onrender.com";

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
    } else {
      setIsAuthenticated(true);
      fetchTask();
    }
  }, [token]);

  const handlePriorityFilterChange = (e) => {
    setPriorityFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  //   const filteredTasks = data.filter((task) => {
  //     const matchesPriority = priorityFilter
  //       ? task.priority === parseInt(priorityFilter)
  //       : true;
  //     const matchesStatus = statusFilter ? task.status === statusFilter : true;
  //     return matchesPriority && matchesStatus;
  //   });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const addTask = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${baseURL}/api/v1/task/add`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      alert("Task added successfully!");
      setAddTaskPopup(false);
      setForm({
        title: "",
        startTime: "",
        endTime: "",
        priority: "",
        status: "",
      });
    } catch (error) {
      console.error("Failed to add task:", error.message);
    }
  };

  const fetchTask = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/v1/task/getall`);
      setData(response.data);
    } catch (error) {
      console.error("Error while fetching data", error);
    }
  };

  const openUpdateTaskPopup = (task) => {
    setForm({
      ...task,
    });
    setupdateTaskPopup(true);
  };

  const updateTask = async () => {
    const token = localStorage.getItem("token");
    console.log(token);

    try {
      await axios.put(`${baseURL}/api/v1/task/update/${form._id}`, form, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      alert("Task updated successfully!");
      setupdateTaskPopup(false);
      fetchTask();
      setForm({
        title: "",
        startTime: "",
        endTime: "",
        priority: "",
        status: "",
      });
    } catch (error) {
      console.error("Error while updating task", error.message);
    }
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", options);
  };

  const calculateTimeDifferenceInHours = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMs = end - start;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours.toFixed(2);
  };

  const deleteSelctedTask = async () => {
    if (selectedTasks.length === 0) {
      alert("No tasks selected!");
      return;
    }
    try {
      await Promise.all(
        selectedTasks.map((id) =>
          axios.delete(`${baseURL}/api/v1/task/delete/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
        )
      );
      alert("Tasks deleted successfully!");
      fetchTask();
      setSelectedTasks([]);
    } catch (error) {
      console.error("Failed to delete tasks", error.message);
    }
  };

  const handleCheckboxChange = (taskId) => {
    if (selectedTasks.includes(taskId)) {
      setSelectedTasks(selectedTasks.filter((id) => id !== taskId));
    } else {
      setSelectedTasks([...selectedTasks, taskId]);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex justify-center mt-20 font-bold text-xl text-blue-800">
        You need to sign in to access this page
      </div>
    );
  }

  return (
    <div className="px-20">
      <div className="mt-10 flex justify-between">
        <h1 className="text-2xl font-bold text-gray-500">Task list</h1>
        <button
          className="self-center px-8 py-3 font-semibold rounded border border-blue-600 text-black hover:bg-gray-600 hover:text-white"
          onClick={() => navigate("/")}
        >
          Dashboard
        </button>
      </div>
      <div className="flex mt-10 justify-between">
        <div className="gap-3 flex">
          <button
            className="self-center px-8 py-3 font-semibold rounded border border-blue-600 text-black hover:bg-gray-600 hover:text-white"
            onClick={() => setAddTaskPopup(true)}
          >
            + Add Task
          </button>
          <button
            className="self-center px-8 py-3 font-semibold rounded border border-red-600 text-black  hover:bg-gray-600 hover:text-white"
            onClick={deleteSelctedTask}
          >
            Delete selected task
          </button>
        </div>
        <div className="flex gap-2 items-center">
          <p className="border rounded-full px-2 py-2 bg-gray-500 text-white w-auto h-12">
            sort
          </p>
          <select
            value={priorityFilter}
            onChange={handlePriorityFilterChange}
            className="p-2 border border-gray-300 rounded-full w-auto"
          >
            <option value="">Filter by Priority</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Filter by Status</option>
            <option value="Pending">Pending</option>
            <option value="Finished">Finished</option>
          </select>
        </div>
      </div>
      <div>
        <div className="overflow-x-auto mt-10">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="sticky inset-y-0 start-0 bg-white px-4 py-2">
                  <label htmlFor="SelectAll" className="sr-only">
                    Select All
                  </label>

                  <input
                    type="checkbox"
                    id="SelectAll"
                    className="size-5 rounded border-gray-300"
                  />
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Task ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Title
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Priority
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Status
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Start Time
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  End Time
                </th>
                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Total time to finish
                </th>

                <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                  Edit
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {data?.task?.map((item) => {
                return (
                  <tr key={item.id}>
                    <td className="sticky inset-y-0 start-0 bg-white px-4 py-2">
                      <label className="sr-only" htmlFor="Row1">
                        Row 1
                      </label>

                      <input
                        className="size-5 rounded border-gray-300"
                        type="checkbox"
                        id={`task-${item._id}`}
                        checked={selectedTasks.includes(item._id)}
                        onChange={() => handleCheckboxChange(item._id)}
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {item._id}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {item.title}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {item.priority}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {item.status}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {formatDate(item.startTime)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {formatDate(item.endTime)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {calculateTimeDifferenceInHours(
                        item.startTime,
                        item.endTime
                      )}{" "}
                      hr
                    </td>
                    <td className="whitespace-nowrap px-2 py-2 text-gray-700">
                      <button
                        className="self-center px-4 py-2 font-semibold rounded border border-green-600 text-black hover:bg-gray-600 hover:text-white"
                        onClick={() => openUpdateTaskPopup(item)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {addTaskPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Add Task</h2>
              <form onSubmit={addTask}>
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                />

                <label className="block mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                />

                <label className="block mb-2">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                />

                <label className="block mb-2">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                >
                  <option value="">Select Priority</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>

                <label className="block mb-2">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Fineished">Finished</option>
                </select>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setAddTaskPopup(false)}
                    className="px-4 py-2 text-white bg-red-600 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {updateTaskPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg w-1/3">
              <h2 className="text-xl font-bold mb-4">Update Task</h2>
              <form onSubmit={updateTask}>
                <label className="block mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                />

                <label className="block mb-2">Start Time</label>
                <input
                  type="datetime-local"
                  name="startTime"
                  value={form.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                />

                <label className="block mb-2">End Time</label>
                <input
                  type="datetime-local"
                  name="endTime"
                  value={form.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                />

                <label className="block mb-2">Priority</label>
                <select
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                >
                  <option value="">Select Priority</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>

                <label className="block mb-2">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 mb-4 border rounded"
                >
                  <option value="">Select Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Fineished">Finished</option>
                </select>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setupdateTaskPopup(false)}
                    className="px-4 py-2 text-white bg-red-600 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded"
                  >
                    Update Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mt-8">
          {data.length > 0 ? (
            <table className="min-w-full bg-white border rounded">
              <thead>
                <tr>
                  <th className="py-2 px-4 border">Title</th>
                  <th className="py-2 px-4 border">Start Time</th>
                  <th className="py-2 px-4 border">End Time</th>
                  <th className="py-2 px-4 border">Priority</th>
                  <th className="py-2 px-4 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((task, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border">{task.title}</td>
                    <td className="py-2 px-4 border">{task.startTime}</td>
                    <td className="py-2 px-4 border">{task.endTime}</td>
                    <td className="py-2 px-4 border">{task.priority}</td>
                    <td className="py-2 px-4 border">{task.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
