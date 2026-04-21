const DashboardSkeleton: React.FC = () => {
  return (
    <div className="h-full w-full p-9 bg-gray-50">
      {/* header */}
      <div className="mb-8">
        <div className="skeleton h-9 w-48 rounded-lg mb-2" />
        <div className="skeleton h-4 w-64 rounded-md mb-2" />
        <div className="skeleton h-3 w-32 rounded-md" />
      </div>

      {/* stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="skeleton h-4 w-24 rounded-md mb-3" />
            <div className="skeleton h-8 w-16 rounded-md" />
          </div>
        ))}
      </div>

      {/* bottom panels */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* recent cards panel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 col-span-1 lg:col-span-2 h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div className="skeleton h-5 w-32 rounded-md" />
            <div className="skeleton h-4 w-16 rounded-md" />
          </div>
          <div className="space-y-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="skeleton w-10 h-10 rounded-lg shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="skeleton h-4 w-3/4 rounded-md" />
                  <div className="flex gap-2">
                    <div className="skeleton h-3 w-20 rounded-md" />
                    <div className="skeleton h-3 w-16 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* top tags panel */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 h-[420px]">
          <div className="skeleton h-5 w-24 rounded-md mb-6" />
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <div className="flex justify-between mb-2">
                  <div className="skeleton h-4 w-20 rounded-md" />
                  <div className="skeleton h-4 w-6 rounded-md" />
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="skeleton h-2 rounded-full"
                    style={{ width: `${80 - i * 12}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton