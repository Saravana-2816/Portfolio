import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import { CustomEase } from "gsap/CustomEase"
import { Flip } from "gsap/Flip"

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, DrawSVGPlugin, CustomEase, Flip)

// Two curves, used everywhere: a long confident settle, and a symmetric move.
CustomEase.create("settle", "0.16, 1, 0.3, 1")
CustomEase.create("swing", "0.76, 0, 0.24, 1")

gsap.defaults({ ease: "settle", duration: 0.9 })

export { gsap, ScrollTrigger, SplitText, Flip }
