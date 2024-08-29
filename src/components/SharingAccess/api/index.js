import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;
const INVITE = `${API_URL}/invite/`;
const INVITED_USERS = `${API_URL}/access/`;

const token = JSON.parse(localStorage.getItem("userToken"));

export const sendRoleData = async (email, access_type_id) => {
	const inveteData = {
		email,
		access_type_id
	};
	try {
		const response = await toast.promise(
			axios.post(INVITE, inveteData, {
				headers: {
					Authorization: `Token ${token}`
				}
			}),
			{
				loading: "Sending Invite...",
				success: (res) => {
					return res.data.message || "The invitation has been sent successfully!"
				},
				error: "Error. Please try again."
			}
		);

		return response.data;
	} catch (error) {
		console.error("Error saving data:", error);
		throw new Error(error.message);
	}
};

export const handleSendData = async (email, role, setIsConfirmed) => {
	const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailPattern.test(email)) {
		toast.error("Please provide a valid email address.");
		setIsConfirmed(false);
		return;
	}

	if (!role) {
		toast.error("Please select a role.");
		setIsConfirmed(false);
		return;
	}

	try {
		await sendRoleData(email, role);
		setIsConfirmed(true);
	} catch (error) {
		console.error("Error sending data:", error);
		setIsConfirmed(false);
	}
};

export const fetchInvitedUsers = async (ownerId) => {
	try {
		const response = await toast.promise(
			axios.get(`${INVITED_USERS}?user_id__id=&owner_id__id=${ownerId}`, {
				headers: {
					Authorization: `Token ${token}`
				}
			}),
			{
				loading: "Loading invited users...",
				success: "Users loaded successfully!",
				error: "Failed to load users. Please try again."
			}
		)
		return response.data
	} catch (error) {
		console.error("Error fetching invited users:", error);
		throw new Error(error.message);
	}
}

