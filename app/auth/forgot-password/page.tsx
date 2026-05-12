import { ForgotPasswordForm } from '@/components/forgot-password-form'

/**
 * Renders a centered layout containing the ForgotPasswordForm.
 *
 * The layout fills the viewport height, centers its content, applies responsive
 * padding, and constrains the form to a maximum width.
 *
 * @returns The React element for the forgot-password page.
 */
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}
