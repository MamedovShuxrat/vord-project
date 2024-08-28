import axios from "axios";
import { toast } from "react-hot-toast";

const API_URL = process.env.REACT_APP_API_URL;
const INVENT = `${API_URL}/invite/`;

const token = JSON.parse(localStorage.getItem("userToken"));

export const sendRoleData = async (email, access_type_id) => {
	const inveteData = {
		email,
		access_type_id
	};
	try {
		const response = await toast.promise(
			axios.post(INVENT, inveteData, {
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
