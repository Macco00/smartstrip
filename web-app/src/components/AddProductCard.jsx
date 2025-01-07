import { VscAdd } from "react-icons/vsc";

const AddProductCard = (props) => {
  return (
    <div className="flex bg-ss-fg h-64 rounded-[24px] items-center justify-center text-ss-gray hover:shadow-xl hover:text-white">
      <VscAdd size={128} />
    </div>
  );
};

export default AddProductCard;
