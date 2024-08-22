import React, { useState, useEffect } from "react";
import styles from "./feedback.module.scss";
import Chat from "../../components/Chat/ui/Chat";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import FeedbackForm from "../../components/FeedbackForm/FeedbackForm";

const Feedback = () => {

    return (
        <div className={commonStyles.sectionWrapper}>
            <div className={styles.feedbackPage}>
                <h2 className={styles.feedbackTitle}>Please write to us</h2>
                <FeedbackForm />
            </div>
            <div className={commonStyles.chatWrapper}>
                <Chat />
            </div>
        </div>
    );
};

export default Feedback;
