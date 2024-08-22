import { useCallback } from "react";

const useTabNavigation = (connections, activeTab, setActiveTab) => {
  const handleLeftButtonClick = useCallback(() => {
    const currentIndex = connections.findIndex((item) => item.id === activeTab);
    const newIndex =
      (currentIndex - 1 + connections.length) % connections.length;
    setActiveTab(connections[newIndex].id);
  }, [connections, activeTab, setActiveTab]);

  const handleRightButtonClick = useCallback(() => {
    const currentIndex = connections.findIndex((item) => item.id === activeTab);
    const newIndex = (currentIndex + 1) % connections.length;
    setActiveTab(connections[newIndex].id);
  }, [connections, activeTab, setActiveTab]);

  return { handleLeftButtonClick, handleRightButtonClick };
};

export default useTabNavigation;
