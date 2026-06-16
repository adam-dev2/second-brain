import Layout from "../layouts/Layout";


const CardSkeleton = () => {
  return (
  <Layout>
    <div>

      {/* HEADER */}
      <div className="mb-8">
        <div className="skeleton h-8 w-40 mb-4 rounded" />

        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="skeleton h-9 w-full rounded-xl" />
          </div>
          <div className="flex gap-3">
            <div className="skeleton h-9 w-20 rounded-full" />
            <div className="skeleton h-9 w-24 rounded-full" />
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className="bg-neutral-100 dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.08] rounded-2xl p-5"
          >
            <div className="skeleton h-4 w-3/4 mb-2 rounded" />
            <div className="skeleton h-4 w-1/2 mb-4 rounded" />

            <div className="flex justify-between mb-4">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-6 w-16 rounded-full" />
            </div>

            <div className="flex gap-2 mb-4">
              <div className="skeleton h-5 w-14 rounded" />
              <div className="skeleton h-5 w-16 rounded" />
            </div>

            <div className="flex justify-between pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          </div>
        ))}
      </div>

    </div>
  </Layout>
);
};

export default CardSkeleton;