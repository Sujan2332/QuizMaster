import axios from "axios"

const API_URL = import.meta.env.VITE_BACKEND_URL
console.log(API_URL)
const api = axios.create({
    baseURL:API_URL,
    headers:{
        "Content-Type":"application/json"
    }
})

export const registerUser = async (userData) => {
console.log(API_URL)
    try {
      const response = await api.post('/auth/register', userData);
      return response.data; // Ensure this is a valid response
    } catch (error) {
      // Catch errors and handle them gracefully
      if (error.response) {
        throw new Error(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        throw new Error("No response received from the server.");
      } else {
        throw new Error(error.message);
      }
    }
  };

export const loginUser = async (credentials)=>{
    try{
        const response = await api.post("/auth/login",credentials)
        return response.data
    } catch(err){
        throw err.response.data
    }
}

export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data; // Return the success message
    } catch (error) {
        // Handle errors gracefully
        if (error.response) {
            throw new Error(error.response.data.message || "Something went wrong!");
        } else if (error.request) {
            throw new Error("No response received from the server.");
        } else {
            throw new Error(error.message);
        }
    }
};

export const updatePassword = async (resetToken, newPassword) => {
    try {
        // Log the data being sent to the server
        console.log("Data being sent to the server:", { resetToken, newPassword });

        const response = await api.post('/auth/update-password', { resetToken, newPassword });

        // Log the server response
        console.log("Server response:", response.data);

        return response.data; // Return the success message
    } catch (error) {
        // Log the error details
        if (error.response) {
            console.error("Server responded with an error:", error.response.data);
            throw new Error(error.response.data.message || "Something went wrong!");
        } else if (error.request) {
            console.error("No response received from the server:", error.request);
            throw new Error("No response received from the server.");
        } else {
            console.error("Error occurred while making the request:", error.message);
            throw new Error(error.message);
        }
    }
};

export const getQuizzes = async ()=>{
    try{
        const token = localStorage.getItem("token")
        const response = await api.get("/quiz",{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response.data
    } catch(error){
        throw error.response ? error.response.data :error.message
    }
}

export const getQuizById = async(quizId)=>{
    try{
        const token = localStorage.getItem("token")
        const response = await api.get(`/quiz/${quizId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response.data
    }catch(error){
        throw error.response.data
    }
}

export const submitQuiz = async (quizId, answers, token)=>{
    try{
        const response = await api.post(`/quiz/${quizId}/submit`,{answers},{
            headers:{Authorization:`Bearer ${token}`}
        })
        return response.data
    } catch(error){
        throw error.response.data
    }
}

export const getLeaderboard = async (quizId)=>{
    try{
        const token = localStorage.getItem("token")
        const response = await api.get(`/quiz/${quizId}/leaderboard`,{
            headers:{
                Authorization:`Bearer ${token}`
            }})
        return response.data
    } catch(error){
        throw error.response.data
    }
}

  export const createQuiz = async (quizData) => {
    const token = localStorage.getItem("token");
  
    try {
      // Making an API POST request to create a quiz
      const response = await api.post('/quiz', quizData, {
        headers: {
          Authorization: `Bearer ${token}` // Include token for authentication if needed
        }
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
  
export const updateQuiz = async (quizId, quizData)=>{
    try{
        const token = localStorage.getItem("token")
        const response = await api.put(`/quiz/${quizId}`,quizData,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response.data
    } catch(error){
        throw error.response.data
    }
}

export const deleteQuiz = async (quizId)=>{
    try{
        const token = localStorage.getItem("token")
        const response = await api.delete(`/quiz/${quizId}`,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response.data
    } catch(error){
        throw error.response.data
    }
}