import { SignUpForm } from '@/components/sign-up-form'

/**
 * Renders a centered signup page layout that contains the SignUpForm component.
 *
 * @returns A JSX element with a full-viewport centered container and a constrained-width wrapper for `SignUpForm`.
 */
export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
