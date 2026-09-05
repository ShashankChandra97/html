# Optional 120-frame sequence

Place WebP frames here using this exact naming pattern:

`frame-001.webp` through `frame-120.webp`

Then start or build the project with:

```bash
NEXT_PUBLIC_FRAME_SEQUENCE=true npm run dev
```

Without these files, the canvas renders the built-in procedural cloud-infrastructure animation. The loader keeps only a small window around the current scroll position active and caps mobile canvas resolution for performance.
