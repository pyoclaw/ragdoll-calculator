import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Render an error page that displays a centered card with an error message.
 *
 * @param searchParams - A promise that resolves to an object which may contain an `error` string; when present the page shows `Code error: {error}`, otherwise a generic fallback message is shown.
 * @returns A React element containing a centered card that displays either `Code error: {error}` or `An unspecified error occurred.`
 */
export default async function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const params = await searchParams

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sorry, something went wrong.</CardTitle>
            </CardHeader>
            <CardContent>
              {params?.error ? (
                <p className="text-sm text-muted-foreground">Code error: {params.error}</p>
              ) : (
                <p className="text-sm text-muted-foreground">An unspecified error occurred.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
