const LeaderBoard = (props) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full mx-auto lg:w-2/4 text-sm text-left rtl:text-right text-ss-gray dark:text-gray-400 ">
        <thead className="text-xs text-ss-gray uppercase  bg-ss-fg dark:border-gray-700 border-b ">
          <tr>
            <th scope="col" className="px-6 py-3">
              Difficulty
            </th>
            <th scope="col" className="px-6 py-3">
              Best Score
            </th>
            <th scope="col" className="px-6 py-3">
              Average Score
            </th>
            <th scope="col" className="px-6 py-3">
              Attempts
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-ss-fg border-b dark:border-gray-700 ">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Easy
            </th>
            {console.log("leaderboard")}
            {console.log(props)}
            <td className="px-6 py-4">{props.statistics.bestGameEasy}</td>
            <td className="px-6 py-4">
              {props.statistics.avgScoreEasy.toFixed(2)}
            </td>
            <td className="px-6 py-4">{props.statistics.attemptsEasy}</td>
          </tr>
          <tr className="bg-ss-fg  border-b dark:border-gray-700">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Medium
            </th>
            <td className="px-6 py-4">{props.statistics.bestGameMedium}</td>
            <td className="px-6 py-4">
              {props.statistics.avgScoreMedium.toFixed(2)}
            </td>
            <td className="px-6 py-4">{props.statistics.attemptsMedium}</td>
          </tr>
          <tr className="bg-ss-fg  border-b dark:border-gray-700">
            <th
              scope="row"
              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              Hard
            </th>
            <td className="px-6 py-4">{props.statistics.bestGameHard}</td>
            <td className="px-6 py-4">
              {props.statistics.avgScoreHard.toFixed(2)}
            </td>
            <td className="px-6 py-4">{props.statistics.attemptsHard}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default LeaderBoard;
