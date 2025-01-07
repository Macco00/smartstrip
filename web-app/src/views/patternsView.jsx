export default function patternsView(props) {
  function onPatternChangeACB(evt) {
    props.onPatternChange(evt.target.value);
  }
  function onLabelChangeACB(evt) {
    props.onLabelChange(evt.target.value);
  }

  function onAddClickACB(evt) {
    props.onAddClick();
  }

  function onDeviceIDChangeACB(evt) {
    props.onDeviceIDChange(evt.target.value);
  }
  function onDeviceLabelChangeACB(evt) {
    props.onDeviceLabelChange(evt.target.value);
  }

  function onDeviceAddClickACB(evt) {
    props.onDeviceAddClick();
  }

  function getPatternACB(pattern) {
    return (
      <div key={pattern.label}>
        {console.log(pattern.colors)}
        {pattern.label}: {pattern.colors.toString()}
      </div>
    );
  }
  return (
    <div className="p-6">
      <div className="mb-4 ">
        <input
          className="py-2  mr-4"
          placeholder="Enter pattern here"
          onChange={onPatternChangeACB}
        ></input>
        <input
          className="py-2 mr-4"
          placeholder="Pattern label"
          onChange={onLabelChangeACB}
        ></input>
        <button
          className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onAddClickACB}
        >
          add pattern
        </button>
      </div>

      <div>
        <input
          className="py-2 mr-4"
          placeholder="Device ID"
          onChange={onDeviceIDChangeACB}
        ></input>
        <input
          className="py-2 mr-4"
          placeholder="Device label"
          onChange={onDeviceLabelChangeACB}
        ></input>
        <button
          className="mr-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={onDeviceAddClickACB}
        >
          add device
        </button>
      </div>
      <div className="p-6">
        <h1 className=" text-4x1 text-white font-bold ">Patterns: </h1>
        <div className="text-white ">{props.patterns.map(getPatternACB)}</div>
      </div>
    </div>
  );
}
