export default function ContactLoading() {
  return (
    <div className="flex flex-col">
      <div className="border-b border-slate-200 bg-gradient-to-b from-primary-50 to-white py-20 dark:border-slate-700 dark:from-slate-900 dark:to-slate-950">
        <div className="container-main">
          <div className="mx-auto flex max-w-3xl animate-pulse flex-col items-center gap-6">
            <div className="h-7 w-48 rounded-full bg-primary-100 dark:bg-slate-800" />
            <div className="h-12 w-full max-w-xl rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-5 w-full max-w-2xl rounded bg-slate-200 dark:bg-slate-800" />
            <div className="mt-2 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="section bg-white dark:bg-slate-950">
        <div className="container-main">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="animate-pulse space-y-4 lg:col-span-4">
              <div className="h-8 w-40 rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-5 w-full rounded bg-slate-200 dark:bg-slate-800" />
              <div className="h-32 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-20 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>

            <div className="lg:col-span-8">
              <div className="animate-pulse rounded-2xl border border-slate-200 p-6 sm:p-8 dark:border-slate-700">
                <div className="mb-8 flex items-start gap-4">
                  <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-6 w-64 rounded bg-slate-200 dark:bg-slate-800" />
                    <div className="h-4 w-80 max-w-full rounded bg-slate-200 dark:bg-slate-800" />
                  </div>
                </div>
                <div className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="h-10 rounded-md bg-slate-200 dark:bg-slate-800" />
                    <div className="h-10 rounded-md bg-slate-200 dark:bg-slate-800" />
                  </div>
                  <div className="h-10 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="grid gap-2 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={index} className="h-14 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    ))}
                  </div>
                  <div className="h-10 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="h-32 rounded-md bg-slate-200 dark:bg-slate-800" />
                  <div className="h-11 w-full rounded-md bg-slate-200 dark:bg-slate-800 sm:w-48" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}