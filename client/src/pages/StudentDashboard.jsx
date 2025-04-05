import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import axios from "axios";
import SubmitTest from "../components/SubmittedTest.jsx";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { workspaceService } from "../services/workspaceService.js"; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [invitedWorkspaces, setInvitedWorkspaces] = useState([]);
  const [uniqueCode, setUniqueCode] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/student/submissions`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const validSubmissions = subRes.data.filter(sub => 
          sub && sub.test && Array.isArray(sub.answers)
        );
        console.log("Submissions data:", validSubmissions);
        setSubmissions(validSubmissions);
        const allWorkspaces = await workspaceService.getWorkspaces();
        console.log("All workspaces data:", allWorkspaces);
        setWorkspaces(
          allWorkspaces.filter((w) =>
            w.members.some((m) => m.userId._id === user.id && m.role === "owner")
          )
        );
        setInvitedWorkspaces(
          allWorkspaces.filter((w) =>
            w.members.some((m) => m.userId._id === user.id && m.role !== "owner")
          )
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load dashboard data");
      }
    };
    fetchData();
  }, [user.id]); 
  
  const handleOpenTest = async () => {
    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/student/test/link/${uniqueCode}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate(`/test/${uniqueCode}`);
    } catch (error) {
      console.error("Error opening test:", error);
      setError("Invalid or unavailable test code");
    }
  };

  const handleNavigateToWorkspaces = () => {
    navigate("/workspaces");
  };

  const handleNavigateToRoadmap = () => {
    navigate("/roadmap");
  };

  const testsAttempted = submissions.length;
  const workspacesCreated = workspaces.length;
  const invitedCount = invitedWorkspaces.length;

  const chartData = {
    labels: submissions.map((sub) => sub.test?.title || 'Untitled Test'),
    datasets: [
      {
        label: "Marks Obtained",
        data: submissions.map((sub) => sub.answers?.reduce((sum, ans) => sum + (ans.marks || 0), 0) || 0),
        backgroundColor: submissions.map((sub) =>
          sub.answers?.some((ans) => ans.marks > 0) ? "#3dffa2" : "#f8ec9e"
        ),
        borderColor: submissions.map((sub) =>
          sub.answers?.some((ans) => ans.marks > 0) ? "#2ecc8b" : "#e6d87a"
        ),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: { color: "#b3b3b3" },
      },
      title: {
        display: true,
        text: "Your Performance Statistics",
        color: "#3dffa2",
        font: { size: 18 },
      },
      tooltip: {
        backgroundColor: "#333333",
        titleColor: "#b3b3b3",
        bodyColor: "#b3b3b3",
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#999999" },
        grid: { color: "#4d4d4d" },
      },
      y: {
        beginAtZero: true,
        ticks: { color: "#999999" },
        grid: { color: "#4d4d4d" },
        title: {
          display: true,
          text: "Marks Obtained",
          color: "#b3b3b3",
        },
      },
    },
  };

  // Hardcoded User Insights
  const userInsights = [
    { title: "Consistency King", value: "You've completed 15 tests in the last 30 days!", color: "#3dffa2" },
    { title: "Code Master", value: "80% of your submissions scored above 90!", color: "#f8ec9e" },
    { title: "Team Star", value: "Collaborated in 5 workspaces this month!", color: "#ff6b6b" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-teal tracking-tight">Student Dashboard</h1>
        <button
          onClick={handleNavigateToWorkspaces}
          className="bg-teal text-background py-2 px-6 rounded-lg font-semibold hover:bg-hover-teal transition-colors duration-300 shadow-sm"
        >
          Go to Workspaces
        </button>
      </div>

      {/* Stats Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-tertiary p-4 rounded-lg shadow-md border border-quaternary text-center">
          <h3 className="text-lg font-semibold text-octonary">Tests Attempted</h3>
          <p className="text-2xl text-teal mt-2">{testsAttempted}</p>
        </div>
        <div className="bg-tertiary p-4 rounded-lg shadow-md border border-quaternary text-center">
          <h3 className="text-lg font-semibold text-octonary">Workspaces Created</h3>
          <p className="text-2xl text-teal mt-2">{workspacesCreated}</p>
        </div>
        <div className="bg-tertiary p-4 rounded-lg shadow-md border border-quaternary text-center">
          <h3 className="text-lg font-semibold text-octonary">Invited Workspaces</h3>
          <p className="text-2xl text-teal mt-2">{invitedCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          {/* Open Test Block */}
          <div className="bg-tertiary p-6 rounded-lg shadow-md border border-quaternary">
            <h2 className="text-2xl font-semibold text-octonary mb-4">Open a Test</h2>
            <input
              type="text"
              value={uniqueCode}
              onChange={(e) => setUniqueCode(e.target.value)}
              placeholder="Enter test unique code"
              className="w-full p-3 bg-quaternary text-octonary rounded-lg border border-senary focus:outline-none focus:border-teal transition-colors duration-200 placeholder-septenary"
            />
            <button
              onClick={handleOpenTest}
              className="mt-4 w-full bg-teal text-background py-3 rounded-lg font-semibold hover:bg-hover-teal transition-colors duration-300 shadow-sm"
            >
              Open Test
            </button>
            {error && <p className="text-yellow mt-3 text-sm">{error}</p>}
          </div>

          {/* Submissions Block */}
          <div className="mt-6 bg-tertiary p-6 rounded-lg shadow-md border border-quaternary">
            <h2 className="text-2xl font-semibold text-octonary mb-4">Your Submissions</h2>
            <ul className="space-y-3">
              {submissions.length === 0 ? (
                <li className="text-senary text-center">No submissions yet</li>
              ) : (
                submissions.map((sub) => (
                  <li
                    key={sub._id}
                    onClick={() => setSelectedSubmission(sub)}
                    className="bg-quaternary p-4 rounded-lg cursor-pointer hover:bg-quinary transition-colors duration-200 text-octonary shadow-sm"
                  >
                    <span className="font-medium">{sub.test?.title || 'Untitled Test'}</span> -{" "}
                    <span className={sub.answers?.some((ans) => ans.marks > 0) ? "text-teal" : "text-yellow"}>
                      {sub.answers?.some((ans) => ans.marks > 0) ? "Evaluated" : "Pending"}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="col-span-2 flex flex-col gap-6">
          {/* Chart Block */}
          <div className="bg-tertiary p-6 rounded-lg shadow-md border border-quaternary">
            <Bar data={chartData} options={chartOptions} />
          </div>

          {/* Roadmap Block */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h2 className="text-2xl font-bold text-white mb-3">Your Learning Roadmap</h2>
            <p className="text-white text-opacity-90 mb-4">
              "Bhai, apna coding journey ekdum next level pe le jao! Check out your personalized roadmap and master skills step-by-step!"
            </p>
            <button
              onClick={handleNavigateToRoadmap}
              className="bg-white text-purple-600 py-2 px-6 rounded-lg font-semibold hover:bg-opacity-90 transition-colors duration-300 shadow-md"
            >
              Explore Roadmap
            </button>
          </div>

          {/* User Insight Block */}
          <div className="bg-tertiary p-6 rounded-lg shadow-md border border-quaternary">
            <h2 className="text-2xl font-semibold text-octonary mb-4">Your Insights</h2>
            <div className="grid grid-cols-1 gap-4">
              {userInsights.map((insight, index) => (
                <div
                  key={index}
                  className="bg-quaternary p-4 rounded-lg flex items-center justify-between transition-all duration-200 hover:shadow-lg"
                >
                  <div>
                    <h3 className="text-lg font-medium text-octonary">{insight.title}</h3>
                    <p className="text-sm text-senary">{insight.value}</p>
                  </div>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: insight.color }}
                  >
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Submission */}
          {selectedSubmission && <SubmitTest submission={selectedSubmission} />}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;