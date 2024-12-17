import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ task: [] });

  const fetchTask = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/task/getall"
      );
      setData(response.data);
    } catch (error) {
      console.error("Error while fetching data", error);
    }
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const calculateTimeDifferenceInHours = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diffInMs = end - start;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    return diffInHours.toFixed(2);
  };

  const completedTasks = data.task.filter(
    (task) => task.status === "Fineished"
  );
  
  const averageTime =
    completedTasks.length > 0
      ? completedTasks.reduce((acc, task) => {
          return (
            acc + calculateTimeDifferenceInHours(task.startTime, task.endTime)
          );
        }, 0) / completedTasks.length
      : 0;

  const pendingTasks = data.task.filter((task) => task.status === "Pending");

  const totalTimeElapsed = pendingTasks.reduce((acc, task) => {
    const startTime = new Date(task.startTime);
    const currentTime = new Date();
    const timeElapsedInMs = currentTime - startTime;
    return acc + timeElapsedInMs / (1000 * 60 * 60);
  }, 0);

  const totalTimeToFinish = pendingTasks.reduce((acc, task) => {
    return acc + calculateTimeDifferenceInHours(task.startTime, task.endTime);
  }, 0);
  return (
    <div className="px-20 my-10">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          className="self-center px-8 py-3 font-semibold rounded bg-blue-600 text-white"
          onClick={() => navigate("/task/list")}
        >
          Task List
        </button>
      </div>

      <div className="mt-10">
        <h2 className="text-gray-800 font-semibold text-xl">Summary</h2>
        <div className="mt-5 flex gap-20">
          <div className="flex flex-col w-auto items-center">
            <p className="text-blue-800/80 font-semibold text-xl">
              {data.task.length}
            </p>
            <p className="text-gray-600 font-semibold">Total Tasks</p>
          </div>
          <div className="flex flex-col w-20 items-center">
            <p className="text-blue-800/80 font-semibold text-xl">
              {completedTasks.length}
            </p>
            <p className="text-gray-600 font-semibold">Tasks Completed</p>
          </div>
          <div className="flex flex-col w-20 items-center">
            <p className="text-blue-800/80 font-semibold text-xl">
              {pendingTasks.length}
            </p>
            <p className="text-gray-600 font-semibold">Tasks Pending</p>
          </div>
          <div className="flex flex-col w-20 items-center">
            <p className="text-blue-800/80 font-semibold text-xl">
              {averageTime.toFixed(2)}
            </p>

            <p className="text-gray-600 font-semibold">
              Average time per complete task
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-gray-800 font-semibold text-xl">
          Pending task summary
        </h2>
        <div className="mt-5 flex gap-20">
          <div className="flex flex-col w-20 items-center">
            <p className="text-blue-800/80 font-semibold text-xl">
              {pendingTasks.length}
            </p>
            <p className="text-gray-600 font-semibold">Pending Tasks</p>
          </div>
          <div className="flex flex-col w-20 items-center">
            <p className="text-blue-800/80 font-semibold text-xl">
              {totalTimeElapsed?.toFixed(2)}
            </p>
            <p className="text-gray-600 font-semibold">Total Time Elapsed</p>
          </div>
          <div className="flex flex-col w-20 items-center">
            <p className="text-blue-800/80 font-semibold text-xl">
              {totalTimeToFinish}
            </p>
            <p className="text-gray-600 font-semibold">
              Total time to finish <br />
              estimated based on endtime
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-20">
        <table className="table table-xs border ">
          <thead className="">
            <tr className="border border-black bg-gray-600 text-white">
              <th className="px-5 py-2">S/N</th>
              <th className="border px-5 py-2">Task priority</th>
              <th className="border px-5 py-2">Pending Task</th>
              <th className="border px-5 py-2">Time LAPSED (hrs)</th>
              <th className="border px-5 py-2">Time to finish (hrs)</th>
            </tr>
          </thead>
          <tbody>
            {data.task.map((task, index) => (
              <tr className="border" key={index}>
                <th className="border px-5 py-2">{index + 1}</th>
                <td className="border px-5 py-2">{task.priority}</td>
                <td className="border px-5 py-2">
                  {task.status === "Pending" ? "Yes" : "No"}
                </td>
                <td className="border px-5 py-2">
                  {task.status === "Pending"
                    ? calculateTimeDifferenceInHours(task.startTime, new Date())
                    : "-"}
                </td>
                <td className="border px-5 py-2">
                  {task.status === "Pending"
                    ? calculateTimeDifferenceInHours(
                        task.startTime,
                        task.endTime
                      )
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
