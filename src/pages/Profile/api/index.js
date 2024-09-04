import axios from "axios";
import { toast } from "react-hot-toast";
import { setUser } from "../../../core/store/userSlice";
import { fetchUserData } from "../../../api";

const API_URL = process.env.REACT_APP_API_URL;
const token = JSON.parse(localStorage.getItem("userToken"));
const putNewUserAvatar = `${API_URL}/users/`;

export const uploadAvatar = async (file, setAvatar, dispatch,) => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const userID = userData ? userData.pk : null;
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

        const newAvatarUrl = response.data.avatar;

        dispatch(setUser({
            ...response.data,
            avatar: newAvatarUrl
        }));
        setAvatar(newAvatarUrl);
        fetchUserData(token)
    } catch (error) {
        console.error("Error uploading avatar:", error);
    }
};
