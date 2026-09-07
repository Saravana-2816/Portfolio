import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2, Mail, Phone } from "lucide-react"
import { GitHubIcon, LinkedInIcon } from "@/components/icons/BrandIcons"
import { site } from "@/data/site"
import { useMaskedReveal } from "@/hooks/useMaskedReveal"
import { Section } from "@/components/layout/Section"
import { SectionHeading } from "@/components/layout/SectionHeading"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const contactSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email address."),
  message: z.string().min(10, "Say a little more — at least 10 characters."),
})

type ContactValues = z.infer<typeof contactSchema>

const directInfo = [
  { label: site.email, href: `mailto:${site.email}`, icon: Mail },
  { label: site.phone, href: `tel:${site.phone.replace(/\s+/g, "")}`, icon: Phone },
  { label: "LinkedIn", href: site.linkedin, icon: LinkedInIcon },
  { label: "GitHub", href: site.github, icon: GitHubIcon },
]

export function Connect() {
  const introRef = useMaskedReveal<HTMLParagraphElement>()
  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", message: "" },
  })

  async function onSubmit(values: ContactValues) {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      if (!res.ok) throw new Error("Request failed")
      toast.success("Message sent — I'll get back to you soon.")
      form.reset()
    } catch {
      toast.error("Something went wrong. Try emailing me directly instead.")
    }
  }

  return (
    <Section id="connect">
      <SectionHeading index={6} title="Connect" />
      <p
        ref={introRef}
        className="mt-3 max-w-[65ch] text-base text-muted-foreground opacity-0"
      >
        Have a role, a project, or just want to talk shop about RAG pipelines and system design?
        Reach out.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-3">
          {directInfo.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="glass-panel glass-panel-hover flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-colors hover:text-foreground sm:text-base"
            >
              <Icon className="size-4 shrink-0" />
              <span>{label}</span>
            </a>
          ))}
        </div>

        <div className="relative">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="glass-panel relative space-y-5 rounded-xl p-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="What are you building?" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="size-4 animate-spin" />}
                Send message
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </Section>
  )
}
