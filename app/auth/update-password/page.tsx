import { UpdatePasswordForm } from '@/components/update-password-form'

/**
 * Page component that renders a centered, responsive container with the update password form.
 *
 * @returns The page's JSX layout: a full-width, vertically centered container with responsive padding and a constrained wrapper that renders `UpdatePasswordForm`.
 */
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <UpdatePasswordForm />
      </div>
    </div>
  )
}
