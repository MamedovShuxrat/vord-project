import RandomColorIcon from "../ui/CreateDynamicSvgIcon/RandomColorIcon";

export const renderImageOrIcon = (item) => {
  const isSvg = typeof item.img === "string" && item.img.includes(".svg");

  // Приведение типов для ширины и высоты
  const width = parseInt(item.w, 10) || 20; // Используем значение по умолчанию 20, если width не задан
  const height = parseInt(item.h, 10) || 20; // Используем значение по умолчанию 20, если height не задан

  if (isSvg) {
    return (
      <img
        width={width}
        height={height}
        src={item.img}
        alt={`${item.connectionName || "default"}_pic`}
      />
    );
  } else {
    return (
      <RandomColorIcon
        color={item.img || "#000000"}
        width={width}
        height={height}
      />
    );
  }
};
