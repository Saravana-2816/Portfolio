import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { site } from "@/data/site"
import { PillButton } from "@/components/ui/pill-button"

const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name."),
  email: z.string().trim().email("Enter a valid email address."),
  message: z.string().trim().min(10, "Write at least 10 characters."),
  website: z.string().max(0).optional(),
})

type ContactValues = z.infer<typeof contactSchema>

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      <p id={`${id}-error`} role={error ? "alert" : undefined} className="min-h-5 text-sm text-destructive">
        {error}
      </p>
    </div>
  )
}

const inputClass =
  "w-full rounded-2xl border border-line-strong bg-background/60 px-4 text-base text-foreground transition-[border-color,box-shadow] outline-none placeholder:text-muted-foreground/80 focus:border-signal focus:shadow-[0_0_0_4px_color-mix(in_srgb,var(--signal)_16%,transparent)] aria-invalid:border-destructive"

/** Loaded on demand: validation libraries stay out of the first-load bundle. */
export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
  })

  const onSubmit = async (values: ContactValues) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error(String(res.status))
      toast.success("Message sent. I'll reply soon.")
      reset()
    } catch {
      toast.error(`That didn't send. Email me at ${site.email} instead.`)
    }
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="surface flex flex-col gap-2 rounded-[1.75rem] p-6 sm:p-9"
    >
      <p className="mb-4 font-display text-2xl font-semibold tracking-[-0.02em]">Send a message</p>

      <div className="grid gap-x-4 sm:grid-cols-2">
        <Field id="contact-name" label="Name" error={errors.name?.message}>
          <input
            id="contact-name"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby="contact-name-error"
            className={cn(inputClass, "h-12")}
            {...register("name")}
          />
        </Field>
        <Field id="contact-email" label="Email" error={errors.email?.message}>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby="contact-email-error"
            className={cn(inputClass, "h-12")}
            {...register("email")}
          />
        </Field>
      </div>
      <Field id="contact-message" label="Message" error={errors.message?.message}>
        <textarea
          id="contact-message"
          rows={5}
          placeholder="What are you building?"
          aria-invalid={!!errors.message}
          aria-describedby="contact-message-error"
          className={cn(inputClass, "resize-none py-3 leading-relaxed")}
          {...register("message")}
        />
      </Field>

      {/* Honeypot: people never see it, bots fill it in */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Goes straight to my inbox.</p>
        <PillButton type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting ? "Sending" : "Send message"}
        </PillButton>
      </div>
    </form>
  )
}
