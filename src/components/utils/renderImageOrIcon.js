import RandomColorIcon from "../ui/CreateDynamicSvgIcon/RandomColorIcon";

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  if (color === '#FFFFFF') {
    return getRandomColor();
  }
  return color;
};

export const renderImageOrIcon = (item) => {
  const isSvg = typeof item.img === "string" && item.img.includes(".svg");

  const width = parseInt(item.w, 10) || 20;
  const height = parseInt(item.h, 10) || 20;

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
        color={getRandomColor()}
        width={width}
        height={height}
      />
    );
  }
};