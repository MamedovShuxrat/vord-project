import React, { useState, useRef } from "react";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";  // Подключаем глобальные стили
import wikiStyles from "./WikiPage.module.scss";  // Подключаем специфичные стили

const faqData = [
  { question: "How do I create an account?", answer: "To create an account, click on 'Sign Up' on the main page. You can register using your email, Google, or GitHub account. Follow the instructions to complete the registration process." },
  { question: "How do I reset my password?", answer: "You can reset your password by clicking on 'Forgot Password' on the login page." },
  { question: "How do I update my profile information?", answer: "Go to your profile settings and update the information." },
  { question: "How can I invite team members to my workspace?", answer: "Once logged in, navigate to the 'Team Management' section. You can invite members by entering their email or username. Assign them roles such as Admin, Analyst, Manager, Engineer, or Viewer." },
  { question: "What data sources can I use to upload data?", answer: "You can upload data from various sources such as Excel, CSV, JSON, or relational databases (e.g., MySQL, PostgreSQL). Go to the 'Data Import' section to set up connections to your preferred data source." },
  { question: "How can I collaborate with my team on the platform?", answer: "Team collaboration is available in shared workspaces. You can edit SQL queries, comment on analytics, and work together on projects in real-time. Use the built-in chat feature to communicate with your team." },
  { question: "Can I visualize my data on the platform?", answer: "Yes, the platform allows you to create interactive visualizations. You can build charts and dashboards based on your data. Navigate to the 'Data Visualization' section to get started." },
  { question: "How do I generate reports?", answer: "You can export your analysis and visualizations as reports in PDF, Word, or PowerPoint formats. Go to the 'Reports' section, choose the type of report, and download the final version." },
  { question: "Is there a limit on the number of team members I can add?", answer: "The platform allows free access for teams with up to 3 members. For larger teams, you’ll need to subscribe to a paid plan based on the number of team members." },
  { question: "What roles and permissions are available for team members?", answer: "Roles include Admin, Analyst, Manager, Engineer, and Viewer. Permissions can be customized for each role, allowing team members to view, edit, comment, or manage workspaces, projects, and data." },
  { question: "Can I share files and data with my team?", answer: "Yes, file sharing is enabled within workspaces. You can upload files or share data directly within your team's collaborative environment." },
  { question: "How can I track my team's progress?", answer: "You can track team progress through dashboards tailored for strategic, operational, analytical, and tactical purposes. Each dashboard offers insights into key performance metrics relevant to different team members." },
  { question: "Is there a freemium model available for the platform?", answer: "Yes, the platform offers a freemium model. Teams of up to 3 members can access the platform for free. For larger teams or additional features, you can upgrade to a paid subscription." },
  { question: "What’s the purpose of the platform?", answer: "The platform is designed for collaborative data collection, analysis, and visualization. It centralizes data-related tasks, allowing teams to work together seamlessly on analytics and generate meaningful insights from their data." },
  { question: "How do I upload my data into the platform?", answer: "Go to the 'Data Import' section, where you can upload data files such as Excel, CSV, or JSON, or connect to external databases. The platform supports easy setup for connecting and working with your data." },
  { question: "Can I create custom SQL queries in the platform?", answer: "Yes, the platform includes an integrated SQL editor where you can create, run, and save custom SQL queries. Use the editor to explore your data and build custom analyses." },
];

const WikiPage = () => {
  const [openQuestionIndex, setOpenQuestionIndex] = useState(null);
  const contentRefs = useRef([]);

  const handleToggleQuestion = (index) => {
    setOpenQuestionIndex(index === openQuestionIndex ? null : index);
  };

  return (
    <div className={`${commonStyles.sectionWrapper} ${wikiStyles.wrapper}`}>  {/* Используем глобальный стиль для фона */}
      {/* Вопросы располагаются по центру */}
      <div className={wikiStyles.faqContainer}>
        {faqData.map((faq, index) => (
          <div key={index} className={commonStyles.faqItem}>
            <div
              className={wikiStyles.question}
              onClick={() => handleToggleQuestion(index)}
            >
              <span>{faq.question}</span>
              <span>{openQuestionIndex === index ? "▲" : "▼"}</span>
            </div>
            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className={wikiStyles.answerWrapper}
              style={{
                maxHeight: openQuestionIndex === index
                  ? contentRefs.current[index]?.scrollHeight + "px"
                  : "0",
              }}
            >
              <div className={wikiStyles.answer}>
                {faq.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WikiPage;
