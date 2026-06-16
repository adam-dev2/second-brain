import Layout from "../layouts/Layout";


const DashboardSkeleton = () => {
  return (
  <Layout>
    <div>

      {/* header */}
      <div className="mb-8">
        <div className="skeleton h-8 w-40 rounded mb-2" />
        <div className="skeleton h-4 w-56 rounded mb-2" />
        <div className="skeleton h-3 w-28 rounded" />
      </div>

      {/* stat cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-neutral-100 dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5"
          >
            <div className="skeleton h-3 w-24 mb-3 rounded" />
            <div className="skeleton h-8 w-16 rounded" />
          </div>
        ))}
      </div>

      {/* panels */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="bg-neutral-100 dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-6 lg:col-span-2">
          <div className="skeleton h-4 w-32 mb-4 rounded" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4 p-3 mb-2">
              <div className="skeleton w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="skeleton h-3 w-3/4 rounded" />
                <div className="skeleton h-3 w-1/2 rounded" />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-neutral-100 dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-6">
          <div className="skeleton h-4 w-24 mb-6 rounded" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between mb-2">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="skeleton h-3 w-6 rounded" />
              </div>
              <div className="h-1 bg-black/[0.08] dark:bg-white/[0.06] rounded">
                <div className="skeleton h-1 rounded" style={{ width: `${80 - i * 10}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </Layout>
);
};

export default DashboardSkeleton;