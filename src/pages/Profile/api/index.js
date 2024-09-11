import axios from "axios";
import { toast } from "react-hot-toast";
import { setUser } from "../../../core/store/userSlice";
import { fetchUserData } from "../../../api";

const API_URL = process.env.REACT_APP_API_URL;
const token = JSON.parse(localStorage.getItem("userToken"));
const putNewUserAvatar = `${API_URL}/users/`;

const userData = JSON.parse(localStorage.getItem("userData"));
const userID = userData ? userData.id : null;

export const uploadAvatar = async (file, setAvatar, dispatch,) => {
    if (!userID) {
        console.error("User ID not found");
        return;
    }
    const formData = new FormData();
    formData.append("avatar", file);
    try {
        const response = await toast.promise(
            axios.patch(`${putNewUserAvatar}${userID}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`,
                },
            }),
            {
                loading: "Avatar updating...",
                success: "Avatar updated successfully!",
                error: "Failed to update avatar. Please try again.",
            }
        );

        const newAvatarUrl = response.data.avatar64;;
        dispatch(setUser({
            ...response.data,
            avatar64: newAvatarUrl
        }));
        setAvatar(newAvatarUrl);
        await fetchUserData(token);
    } catch (error) {
        console.error("Error uploading avatar:", error);
    }
};

export const updateUsername = async (newUserName, dispatch,) => {
    if (!userID) {
        console.error("User ID not found");
        return;
    }
    try {
        const response = await toast.promise(
            axios.patch(`${putNewUserAvatar}${userID}/`, { name: newUserName }, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Token ${token}`,
                },
            }),
            {
                loading: "Username updating...",
                success: "Username updated successfully!",
                error: "Failed to update Username. Please try again.",
            }
        );
        dispatch(setUser({
            ...response.data,
        }));
        console.log(response.data);

        await fetchUserData(token);
    } catch (error) {
        console.error("Error uploading avatar:", error);
    }
};

