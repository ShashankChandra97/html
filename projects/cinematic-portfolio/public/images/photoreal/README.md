# Portfolio editorial imagery

Nine section visuals revised on September 13, 2026. Seven new photographic concepts use the built-in image generation tool; Xome adds original tool SVGs to its workstation, Skills is a cloud-and-tool diagram, and CloudVeyra uses actual local demo screenshots. The existing education photograph is preserved. Art direction: realistic cloud infrastructure, precise hardware, natural materials, and a white background.

CloudVeyra shows the actual browser-only resource dashboard and a local five-replica Kubernetes simulation, rendered into a CSS monitor and layered window. Screens are captured directly without AI alteration. Other scenes are editorial concepts, not photographs of employer facilities. Star-Ways shows a conceptual reservation screen. The medals are decorative representations of the listed AZ-900/AZ-104 achievements, not reproductions of official credentials. Personal claims and project descriptions remain in `lib/portfolioContent.ts`.

Tool logos come from [Devicon](https://github.com/devicons/devicon), with the repository license retained as `source/DEVICON-LICENSE`. Original SVGs remain in `source/`. Product labels identify Azure DevOps, Microsoft Azure, Docker, Kubernetes, Git, GitHub Actions, PowerShell, and Python. Logos retain their original proportions and colors.

The final generation prompt set is `source/prompts.json`. `source/compositions.html?scene=xome`, `?scene=skills`, and `?scene=cloudveyra` preserve the exact HTML/CSS compositions, renderable at 1440 × 1080. The CloudVeyra source captures and the clean Xome workstation are stored beside that file.

Each scene has 720 px and 1440 px WebP versions. Full-resolution generated masters remain in the local image-generation output directory; the site only uses the optimized local WebP assets. Section mapping and image descriptions are in `lib/visualScenes.ts`.

The page preserves these images and restores the original scroll-linked dissolve, particle flow and reassembly effect. Particles sample the actual foreground colors of each photograph; the white background remains white. Full-resolution images stay sharp and opaque during reading holds. Mobile, reduced-motion and JavaScript-disabled views use complete static section images. If WebGL is unavailable, desktop transitions fall back to image fades. The previous stylized 3D models are not loaded.
