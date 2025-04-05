import React, { useState, useEffect } from "react";
import { useOthers, useMyPresence } from "@liveblocks/react";
import axios from "axios";
import CodeEditor from "../components/CodeEditor.jsx";
import OutputPanel from "../components/OutputPanel.jsx";
import EditorControls from "../components/EditorControls.jsx";
import Cursor from "../components/Cursor.jsx";
import { fileService } from "../services/fileService.js";

const EditorArea = ({ file, user, files, workspaceId, onFileChange,isTestMode = false }) => {
  const others = useOthers();
  const [{ cursor }, updateMyPresence] = useMyPresence();
  const [output, setOutput] = useState("");
  const [editorSettings, setEditorSettings] = useState({
    theme: "vs-dark",
    fontSize: 14,
    language: file?.language || "javascript",
  });
  const [editorContent, setEditorContent] = useState(file?.content || "");

  useEffect(() => {
    const editorContainer = document.getElementById("editor-container");
    const handlePointerMove = (e) => {
      if (!editorContainer) return;
      const bounds = editorContainer.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      updateMyPresence({ cursor: { x, y }, username: user?.displayName || "Anonymous" });
    };
    const handlePointerLeave = () => updateMyPresence({ cursor: null, username: null });

    editorContainer?.addEventListener("pointermove", handlePointerMove);
    editorContainer?.addEventListener("pointerleave", handlePointerLeave);
    return () => {
      editorContainer?.removeEventListener("pointermove", handlePointerMove);
      editorContainer?.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, [updateMyPresence, user]);

  useEffect(() => {
    if (file) {
      setEditorSettings((prev) => ({
        ...prev,
        language: file.language,
      }));
      setEditorContent(file.content);
    }
  }, [file]);

  const handleRunCode = async () => {
    if (!file?.content) {
      setOutput("Error: No code to execute");
      return;
    }
    setOutput("Running code...");
    try {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      let language;
      switch (fileExtension) {
        case "js": language = "javascript"; break;
        case "py": language = "python"; break;
        case "cpp": language = "cpp"; break;
        case "c": language = "c"; break;
        case "java": language = "java"; break;
        default: language = file.language?.toLowerCase() || "javascript";
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/execute`,
        { code: file.content, language: language || "python", fileName: file.name },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" },
          timeout: 15000,
        }
      );
      if (response.data && typeof response.data.output === "string") {
        setOutput(response.data.output);
      } else if (response.data.error) {
        setOutput(`Execution Error: ${response.data.error}`);
      } else {
        setOutput("No output received from execution");
      }
    } catch (error) {
      console.error("Code execution error details:", error.response?.data);
      if (error.code === "ECONNABORTED") {
        setOutput("Error: Code execution timed out (15s limit)");
      } else if (error.response?.data?.message) {
        setOutput(`Error: ${error.response.data.message}`);
      } else {
        setOutput(`Error: ${error.message || "Unknown error occurred"}`);
      }
    }
  };

  const handleLanguageChange = (newLanguage) => {
    if (file && onFileChange) {
      const updatedFile = { ...file, language: newLanguage };
      onFileChange(updatedFile);
      fileService.updateFile(file._id, updatedFile).catch((error) =>
        console.error("Error updating file language:", error)
      );
    }
  };

  const handleContentChange = (newContent) => {
    setEditorContent(newContent);
    if (file && onFileChange) {
      const updatedFile = { ...file, content: newContent };
      onFileChange(updatedFile);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-background">
      <EditorControls
        settings={editorSettings}
        onSettingsChange={(key, value) =>
          setEditorSettings((prev) => ({ ...prev, [key]: value }))
        }
        onRunCode={handleRunCode}
        usersOnline={others.length + 1}
        onLanguageChange={handleLanguageChange}
      />
      <div className="flex flex-1 overflow-hidden">
        <div id="editor-container" className="flex-1 relative bg-tertiary">
          {others.map(({ connectionId, presence }) =>
            presence?.cursor ? (
              <Cursor
                key={`cursor-${connectionId}`}
                x={presence.cursor.x}
                y={presence.cursor.y}
                username={presence.username || "Anonymous"}
              />
            ) : null
          )}
          {file ? (
            <CodeEditor
              file={file}
              settings={editorSettings}
              onFileChange={onFileChange}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-senary text-lg">
              No file selected. Create or select a file to start coding!
            </div>
          )}
        </div>
        <OutputPanel
          output={output}
          editorContent={editorContent}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
};

export default EditorArea;