import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat/ui/Chat";
import { useDispatch, useSelector } from "react-redux";
import commonStyles from "../../assets/styles/commonStyles/common.module.scss";
import { fetchDashboardVisualizations } from "../../core/store/DashboardsSlice";
import styles from './dashboards.module.scss';

const DashboardsPage = () => {
  const dispatch = useDispatch();
  const { visualizations = [], loading, error } = useSelector((state) => state.dashboard);

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    dispatch(fetchDashboardVisualizations());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={commonStyles.sectionWrapper}>
      <div className={styles.contentContainer}>
        <div className={styles.visualizationsSection}>
          <h2 className={styles.pageTitle}>Your charts</h2>
          <div className={`${styles.visualizationsWrapper} ${showMore ? styles.expanded : ''}`}>
            {visualizations.length > 0 ? (
              visualizations.map((plot, index) => {
                const cleanPlot = plot.replace(/^b'|'$/g, '');
                return (
                  <img
                    key={index}
                    src={`data:image/png;base64,${cleanPlot}`}
                    alt={`Visualization ${index + 1}`}
                    className={styles.visualizationImage}
                  />
                );
              })
            ) : (
              <p className={styles.noChartsMessage}>Create your first chart in the Charts tab</p>
            )}
          </div>
          {visualizations.length > 6 && (
            <button
              className={styles.showMoreButton}
              onClick={() => setShowMore(!showMore)}
            >
              {showMore ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        <div className={styles.chatWrapper}>
          <Chat />
        </div>
      </div>
    </div>
  );
};

export default DashboardsPage;
