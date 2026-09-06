import MuiGitHub from "@mui/icons-material/GitHub"
import MuiLinkedIn from "@mui/icons-material/LinkedIn"

type BrandIconProps = { className?: string }

export function GitHubIcon({ className }: BrandIconProps) {
  return <MuiGitHub className={className} style={{ width: 16, height: 16 }} />
}

export function LinkedInIcon({ className }: BrandIconProps) {
  return <MuiLinkedIn className={className} style={{ width: 16, height: 16 }} />
}
