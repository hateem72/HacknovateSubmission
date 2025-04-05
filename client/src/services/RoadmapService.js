import axios from "axios";
import { fetchAifyResponse } from "../services/geminiService";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const roadmapService = {
  generateRoadmap: async (interest) => {
    try {
      console.log("Generating roadmap with AI for:", interest);
      const aiPrompt = `
        Generate a detailed learning roadmap for "${interest}" aimed at coding enthusiasts. Include 5-7 key milestones, each with:
        - A unique ID (e.g., "node1", "node2")
        - A title (e.g., "Learn Basics of ${interest}")
        - A description (short, 15-20 words)
        - A task (e.g., "Solve 5 problems on X")
        - 2-3 relevant resource links (real URLs from reputable sources)
        Return the result as a JSON object with "interest" and "nodes" fields.
      `;

      const aiResponse = await fetchAifyResponse(aiPrompt);
      console.log("Raw AI response:", aiResponse);

      let roadmapData;
      try {
        const cleaned = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
        roadmapData = JSON.parse(cleaned);
      } catch (parseError) {
        console.error("Parse error:", parseError);
        throw new Error("Failed to parse AI response");
      }

      if (!roadmapData?.interest || !Array.isArray(roadmapData?.nodes)) {
        throw new Error("Invalid AI response structure");
      }

      const response = await axios.post(
        `${BASE_URL}/api/roadmap/generate`,
        roadmapData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Generate roadmap error:", {
        message: error.message,
        response: error.response?.data,
      });
      throw new Error(
        error.response?.data?.message || error.message || "Failed to generate roadmap"
      );
    }
  },

  fetchRoadmap: async () => {
    try {
      console.log("Attempting to fetch roadmap...");
      const response = await axios.get(`${BASE_URL}/api/roadmap`, {
        withCredentials: true,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("Roadmap fetch successful:", response.data);
      return response.data;
    } catch (error) {
      console.error("Roadmap fetch error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      if (error.response?.status === 404) {
        throw new Error("No roadmap found");
      } else if (error.response?.status === 401) {
        throw new Error("Please login to view your roadmap");
      } else {
        throw new Error(error.response?.data?.message || "Failed to fetch roadmap");
      }
    }
  },

  updateProgress: async (nodeId, status) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/api/roadmap/progress`,
        { nodeId, status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update progress");
    }
  },

  updateRoadmap: async (interest) => {
    try {
      const aiPrompt = `
        Update an existing roadmap for "${interest}". Provide 5-7 new milestones with:
        - Unique IDs
        - Titles
        - Descriptions
        - Tasks
        - Resource links
        Return as JSON with "interest" and "nodes", no markdown (e.g., no backticks).
      `;
      const aiResponse = await fetchAifyResponse(aiPrompt);
      const roadmapData = JSON.parse(aiResponse);

      const response = await axios.put(`${BASE_URL}/api/roadmap/update`, roadmapData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to update roadmap");
    }
  },
};

export default roadmapService;