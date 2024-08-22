import axios from "axios";
import { stringify } from "uuid";

const API = process.env.REACT_APP_API_URL;
const access = JSON.parse(localStorage.getItem("userToken"));

export const sendMessageToBackend = async (chatId, message) => {
  console.log("Access token:", access);
  const res = await axios({
    url: `${API}/message/`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Token ${access}`,
    },
    data: {
      chat_id: stringify(chatId),
      message: message
    }
  });

  return res;
};


export const getMessages = async (chatId, userId, dateSend) => {
  const res = await axios({
    url: `${API}/message/message_list/?chat_id__id=${chatId}${userId ? `&user_id__id=${userId}` : ""}${dateSend ? `&date_send=${dateSend}` : ""}`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Authorization": `Token ${access}`,
    }
  });

  return res;
};

export const getUserChats = async () => {
  const res = await axios({
    url: `${API}/chat/user_chats/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Authorization": `Token ${access}`,
    }
  });
  return res;
};


export const getChatMembers = async (chatId) => {
  const res = await axios({
    url: `${API}/chat/chat_members/`,
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Authorization": `Token ${access}`,
    },
    params: {
      chat_id: chatId
    }
  });
  return res;
};
