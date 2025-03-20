const ProgressBar = ({ percentage }) => {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-green-600 h-2.5 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-sm text-gray-700">{percentage}%</span>
      </div>
    );
  };
  
  export default ProgressBar;