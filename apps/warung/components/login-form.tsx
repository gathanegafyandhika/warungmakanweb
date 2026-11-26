"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowRight, Loader2, LockKeyhole } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { loginSchema, type LoginInput } from "@/lib/validators"

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  async function onSubmit(values: LoginInput) {
    setError(null)
    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword(values)

    if (authError) {
      setError(
        authError.message.toLowerCase().includes("invalid")
          ? "Email atau password salah."
          : "Gagal masuk. Coba lagi sebentar.",
      )
      return
    }

    let target =
      redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
        ? redirectTo
        : "/dashboard"

    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .maybeSingle()

    if (!redirectTo && profile?.role === "admin" && profile.is_active) {
      target = "/admin"
    }

    router.replace(target)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-semibold">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="penjual@warung.id"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--green)] focus:ring-4 focus:ring-[var(--green)]/10"
          {...register("email")}
        />
        {errors.email && (
          <p className="mt-1.5 text-xs font-medium text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-semibold">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-4 py-3 outline-none transition focus:border-[var(--green)] focus:ring-4 focus:ring-[var(--green)]/10"
          {...register("password")}
        />
        {errors.password && (
          <p className="mt-1.5 text-xs font-medium text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {error && (
        <div role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--green)] px-5 py-3.5 font-bold text-white transition hover:bg-[var(--green-deep)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Memeriksa...
          </>
        ) : (
          <>
            <LockKeyhole className="size-4" /> Masuk ke dashboard
            <ArrowRight className="size-4 transition group-hover:translate-x-1" />
          </>
        )}
      </button>

      <p className="text-center text-xs leading-relaxed text-[var(--muted)]">
        Belum punya akun? Akun penjual dibuat oleh admin lewat panel admin.
      </p>
    </form>
  )
}
