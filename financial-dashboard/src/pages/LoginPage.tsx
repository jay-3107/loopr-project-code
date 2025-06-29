import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center p-4">
        <LoginForm className="w-full" />
      </div>
    </div>
  );
}