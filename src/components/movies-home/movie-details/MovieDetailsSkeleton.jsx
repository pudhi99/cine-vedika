import { Skeleton } from "@/components/ui/skeleton";

export function MovieDetailsSkeleton() {
  return (
    <div className="animate-in fade-in duration-500">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Movie Info */}
      <div className="relative z-10 -mt-32 space-y-8 px-4">
        <div className="flex gap-8">
          <Skeleton className="h-[300px] w-[200px] rounded-lg" />
          <div className="flex-1 space-y-4 pt-32">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-6 w-1/4" />
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>

        {/* Plot */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>

        {/* Cast */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-32" />
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
