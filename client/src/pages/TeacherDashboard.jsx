import React, { useState } from "react";
import { Link } from "react-router-dom";
import TeacherTests from "../components/TeacherTests";
import SubmissionsOnTest from "../components/SubmissionsOnTest";

const TeacherDashboard = () => {
  const [selectedTest, setSelectedTest] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  return (
    <div className="min-h-screen bg-background text-octonary">
     
      <header className="bg-gradient-to-r from-teal to-hover-teal p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-4xl font-bold text-background">Teacher Dashboard</h1>
          <Link
            to="/create-test"
            className="px-6 py-3 bg-background text-teal rounded-full font-semibold hover:bg-quinary transition-colors duration-300 shadow-md"
          >
            Create New Test
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <TeacherTests setSelectedTest={setSelectedTest} setSubmissions={setSubmissions} />
        <SubmissionsOnTest selectedTest={selectedTest} submissions={submissions} />
      </main>
    </div>
  );
};

export default TeacherDashboard;