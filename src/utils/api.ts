import axios from "axios";

export const searchQuery = async (question: string, collectionName: string) => {
  try {
    const response = await axios.post("http://127.0.0.1:5000/search", {
      question,
      collection_name: "aptos_test",
    });
    return response.data; // 返回后端的响应数据
  } catch (error: any) {
    console.error("Error during search query:", error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch search results"
    );
  }
};