import { GoSun } from "react-icons/go";

const ProductCard = (props) => {
  return (
    <div className="relative flex flex-col bg-ss-fg h-64 gap-4 rounded-[24px] items-center justify-center text-ss-gray hover:shadow-xl hover:text-white overflow-hidden">
      {props.online ? (
        <div className="absolute top-6 right-6 bg-ss-green w-8 h-8 rounded-full"></div>
      ) : (
        <div className="absolute top-6 right-6 bg-ss-gray w-8 h-8 rounded-full"></div>
      )}
      <GoSun size={128} />
      <span className="font-bold text-2xl">{props.label}</span>
    </div>
  );
};

export default ProductCard;
