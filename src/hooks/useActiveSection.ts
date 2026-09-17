import * as React from "react"

/**
 * The section whose body crosses the upper-middle band of the viewport.
 * Sections mount progressively after the hero, so late arrivals are picked up too.
 */
export function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = React.useState("")

  React.useEffect(() => {
    const visible = new Map<string, boolean>()
    const watched = new Set<Element>()

    const intersection = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting))
        setActiveId(ids.find((id) => visible.get(id)) ?? "")
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )

    const watchNew = () => {
      ids.forEach((id) => {
        const el = document.getElementById(id)
        if (el && !watched.has(el)) {
          watched.add(el)
          intersection.observe(el)
        }
      })
    }
    watchNew()

    const main = document.getElementById("main")
    const mutations = new MutationObserver(watchNew)
    if (main) mutations.observe(main, { childList: true })

    return () => {
      intersection.disconnect()
      mutations.disconnect()
    }
  }, [ids])

  return activeId
}
