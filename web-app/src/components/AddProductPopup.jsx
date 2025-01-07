const AddProductPopup = (props) => {
  return (
    <div className="flex bg-ss-fg h-64 rounded-[24px] items-center justify-center text-ss-gray hover:shadow-xl hover:text-white">
      <form className="w-full px-10 py-10">
        <span className="font-medium text-ss-gray">Add new device</span>
        <input
          onChange={(e) => {
            props.onIDChange(e.target.value);
          }}
          className="px-2 py-1 mb-1 w-full bg-white text-black rounded-lg p-2.5"
          placeholder="Device ID"
        ></input>
        <input
          onChange={(e) => {
            props.onLabelChange(e.target.value);
          }}
          className="px-2 py-1 mb-2 w-full bg-white text-black rounded-lg p-2.5"
          placeholder="Device Label"
        ></input>
        <div
          onClick={props.onAddDevice}
          className="flex items-center justify-center bg-ss-dark-green h-full rounded-3xl hover:shadow-xl active:shadow-inner text-ss-black hover:text-white hover:bg-ss-green active:bg-ss-dark-green cursor-pointer transition duration-150 ease-in-out"
        >
          <span className="font-medium lg:font-bold lg:text-2xl">
            Add device
          </span>
        </div>
      </form>
    </div>
  );
};

export default AddProductPopup;
