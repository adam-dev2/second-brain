import Layout from "../layouts/Layout";

const SearchResultsSkeleton = () => {
  return (
    <Layout>
      <div>

        {/* HEADER */}
        <div className="mb-10">
          <div className="skeleton h-8 w-48 mb-2" />
          <div className="skeleton h-4 w-64 mb-6" />

          {/* SEARCH BAR */}
          <div className="bg-neutral-900 border border-white/[0.08] rounded-2xl p-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="skeleton h-10 w-full rounded-xl" />
              </div>
              <div className="skeleton h-10 w-20 rounded-xl" />
              <div className="skeleton h-10 w-24 rounded-xl" />
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-neutral-900 border border-white/[0.08] rounded-2xl p-5"
            >
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-4 w-1/2 mb-4" />

              <div className="flex justify-between mb-4">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-6 w-16 rounded-full" />
              </div>

              <div className="flex gap-2 mb-4">
                <div className="skeleton h-5 w-14 rounded" />
                <div className="skeleton h-5 w-16 rounded" />
              </div>

              <div className="flex justify-between pt-3 border-t border-white/[0.06]">
                <div className="skeleton h-3 w-20" />
                <div className="skeleton h-3 w-20" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default SearchResultsSkeleton;