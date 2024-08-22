import RandomColorIcon from "../ui/CreateDynamicSvgIcon/RandomColorIcon";

export const renderImageOrIcon = (item) => {
    const isSvg = item.img.includes(".svg");
    if (isSvg) {
        return (
            <img
                width={item.w}
                height={item.h}
                src={item.img}
                alt={`${item.MySQL}_pic`}
            />
        );
    } else {
        return (
            <RandomColorIcon color={item.img} width={item.w} height={item.h} />
        );
    }
};