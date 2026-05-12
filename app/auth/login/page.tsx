import { LoginForm } from '@/components/login-form'

/**
 * Renders the authentication page: a centered, full-height layout containing the LoginForm inside a constrained-width container.
 *
 * @returns The React element for the login page layout containing the `LoginForm` component.
 */
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
