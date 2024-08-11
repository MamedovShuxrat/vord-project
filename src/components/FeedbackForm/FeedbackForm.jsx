import React, { useState } from "react";
import styles from "./feedbackForm.module.scss"
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const API_URL = process.env.REACT_APP_API_URL || "http://vardserver:8000/api";
const feedback = `${API_URL}/feedback/`;

const FeedbackForm = () => {
    const [theme, setTheme] = useState("");
    const [description, setDescription] = useState("");
    const token = useSelector((state) => state.user.token)
    console.log(token);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await toast.promise(
                axios.post(
                    feedback,
                    { theme, description },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                ),
                {
                    loading: "Sending feedback...",
                    success: "Feedback submitted successfully!",
                    error: "Failed to submit feedback. Please try again.",
                }
            );
            if (response.status === 201) {
                setTheme("");
                setDescription("");
            } else {
                console.error("Failed to submit feedback. Please try again.")
            }
        } catch (error) {
            console.error("Failed to submit feedback. Please try again.")
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    className={styles.inputField}
                    type="text"
                    id="theme"
                    required
                    value={theme}
                    placeholder="Theme"
                    onChange={(e) => setTheme(e.target.value)}
                />
                <textarea
                    className={`${styles.inputField} ${styles.textareaField}`}
                    placeholder="description"
                    id="description"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <button
                className={styles.changeButton}
                type="submit"
            >
                Submit
            </button>
        </form>
    );

}

export default FeedbackForm