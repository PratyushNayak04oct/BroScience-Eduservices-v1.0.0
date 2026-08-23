import Skeleton from "@/components/ui/Skeleton";

function PageFrame({ children }) {
  return (
    <div data-skeleton className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      {children}
    </div>
  );
}

function HeadingBlock() {
  return (
    <div className="mb-12 max-w-3xl sm:mb-16">
      <Skeleton className="h-3 w-28 rounded-full" />
      <Skeleton className="mt-6 h-10 w-[min(100%,22rem)] rounded-sm sm:h-14 sm:w-[32rem]" />
      <Skeleton className="mt-4 h-4 w-full max-w-xl rounded-sm" />
      <Skeleton className="mt-2 h-4 w-[80%] max-w-md rounded-sm" />
    </div>
  );
}

function CardGrid({ count = 6, columns = "sm:grid-cols-2 lg:grid-cols-3" }) {
  return (
    <div className={`grid gap-6 ${columns}`}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="glass-panel flex flex-col gap-4 rounded-sm p-6">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-3 w-20 rounded-full" />
          <Skeleton className="h-5 w-[85%] rounded-sm" />
          <Skeleton className="h-4 w-full rounded-sm" />
          <div className="mt-2 flex items-center justify-between gap-3">
            <Skeleton className="h-6 w-24 rounded-sm" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <div data-skeleton className="pb-16">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 pt-24 sm:px-8 min-[600px]:grid-cols-2 min-[600px]:items-center">
        <div>
          <Skeleton className="h-3 w-40 rounded-full" />
          <Skeleton className="mt-6 h-12 w-full max-w-md rounded-sm" />
          <Skeleton className="mt-3 h-12 w-[80%] rounded-sm" />
          <Skeleton className="mt-6 h-4 w-full max-w-sm rounded-sm" />
          <Skeleton className="mt-2 h-4 w-[70%] rounded-sm" />
          <div className="mt-8 flex flex-wrap gap-3">
            <Skeleton className="h-11 w-40 rounded-full" />
            <Skeleton className="h-11 w-44 rounded-full" />
          </div>
        </div>
        <Skeleton className="aspect-[4/3] w-full rounded-sm" />
      </div>
      <PageFrame>
        <HeadingBlock />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="space-y-3">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-6 w-40 rounded-sm" />
              <Skeleton className="h-4 w-full rounded-sm" />
              <Skeleton className="h-4 w-[80%] rounded-sm" />
            </div>
          ))}
        </div>
      </PageFrame>
    </div>
  );
}

export function ListingSkeleton({ cards = 6 }) {
  return (
    <PageFrame>
      <HeadingBlock />
      <div className="grid gap-12 lg:grid-cols-[240px_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-9 w-20 rounded-full" />
            ))}
          </div>
        </div>
        <CardGrid count={cards} />
      </div>
    </PageFrame>
  );
}

export function MarketplaceSkeleton() {
  return (
    <PageFrame>
      <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <HeadingBlock />
        <Skeleton className="h-11 w-28 shrink-0 rounded-full" />
      </div>
      <CardGrid count={6} />
    </PageFrame>
  );
}

export function DetailSkeleton() {
  return (
    <PageFrame>
      <HeadingBlock />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="glass-panel space-y-4 rounded-sm p-6 sm:p-8">
            <Skeleton className="h-6 w-32 rounded-sm" />
            <div className="grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-3 w-16 rounded-full" />
                  <Skeleton className="h-4 w-28 rounded-sm" />
                </div>
              ))}
            </div>
          </div>
          <div className="glass-panel space-y-3 rounded-sm p-6 sm:p-8">
            {Array.from({ length: 5 }, (_, index) => (
              <Skeleton key={index} className="h-4 w-full rounded-sm" />
            ))}
          </div>
        </div>
        <div className="glass-panel space-y-4 rounded-sm p-6 sm:p-8">
          <Skeleton className="h-4 w-20 rounded-sm" />
          <Skeleton className="h-10 w-36 rounded-sm" />
          <Skeleton className="h-11 w-full rounded-full" />
          <Skeleton className="h-11 w-full rounded-full" />
        </div>
      </div>
    </PageFrame>
  );
}

export function ContactSkeleton() {
  return (
    <PageFrame>
      <HeadingBlock />
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="glass-panel space-y-3 rounded-sm p-6">
              <Skeleton className="h-3 w-16 rounded-full" />
              <Skeleton className="h-5 w-48 rounded-sm" />
              <Skeleton className="h-4 w-32 rounded-sm" />
            </div>
          ))}
        </div>
        <div className="glass-panel space-y-5 rounded-sm p-6 sm:p-8">
          <Skeleton className="h-6 w-40 rounded-sm" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </div>
    </PageFrame>
  );
}

export function ArticleSkeleton() {
  return (
    <PageFrame>
      <HeadingBlock />
      <div className="mx-auto max-w-3xl space-y-4">
        <Skeleton className="h-56 w-full rounded-sm" />
        {Array.from({ length: 8 }, (_, index) => (
          <Skeleton key={index} className="h-4 w-full rounded-sm" />
        ))}
      </div>
    </PageFrame>
  );
}
