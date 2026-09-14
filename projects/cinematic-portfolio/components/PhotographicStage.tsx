"use client";

import { useEffect, useRef, useState } from "react";
import { withBasePath } from "@/lib/basePath";
import { buildSceneTransitions, phaseAtScroll, type SceneTransition } from "@/lib/sceneTiming";
import { visualScenes } from "@/lib/visualScenes";
import { photoSweep } from "@/lib/photoParticles";
import type { createPhotoMorph, PhotoRect } from "@/lib/photoMorph";

function ScenePicture({ phase, decorative=false }: { phase:number; decorative?:boolean }) {
  const scene = visualScenes[phase];
  return <picture>
    <source media="(max-width:767px)" srcSet={withBasePath(`/images/photoreal/${scene.id}-720.webp`)} />
    {/* These local, pre-compressed images also work in a plain static export. */}
    <img src={withBasePath(`/images/photoreal/${scene.id}-1440.webp`)} width="1440" height="1080" alt={decorative ? "" : scene.alt} loading={phase===0 ? "eager" : "lazy"} fetchPriority={phase===0 ? "high" : "auto"} />
  </picture>;
}

/** The static/mobile image is always present, including with JavaScript disabled. */
export function SectionImage({ phase }: { phase:number }) {
  return <div className="section-image" data-photo-phase={phase}><ScenePicture phase={phase} /></div>;
}

/** The original particle transformation, now sampled from the realistic images. */
export function PhotographicStage() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = host.current;
    if(!root) return;
    const mobile = window.matchMedia("(max-width:767px), (pointer:coarse) and (max-width:1024px)");
    const reduced = window.matchMedia("(prefers-reduced-motion:reduce)");
    const frames = Array.from(root.querySelectorAll<HTMLElement>(".photo-frame"));
    const images=frames.map(frame=>frame.querySelector("img")!);
    let timeline:SceneTransition[] = [], request=0, alive=true, enabled=false, revision=0;
    let morph:Awaited<ReturnType<typeof createPhotoMorph>>|undefined;
    let morphActive=false,rects:PhotoRect[]=[];

    function render() {
      request=0;
      if(!enabled || !alive) return;
      const phase=phaseAtScroll(timeline,window.scrollY);
      const from=Math.floor(phase), to=Math.min(visualScenes.length-1,from+1);
      const progress=phase-from, blend=progress*progress*(3-2*progress);
      const sweep=photoSweep(progress);
      frames.forEach((frame,index)=>{
        if(morphActive){
          const visible=(index===from && sweep.outgoing<1)||(index===to && sweep.incoming>0);
          frame.style.visibility=visible ? "visible" : "hidden";
          frame.style.opacity="1";
          frame.style.transform="translateY(-50%)";
          const bounds=rects[index];
          const inset=bounds ? bounds.left-frame.offsetLeft : 0;
          const width=bounds?.width ?? frame.clientWidth;
          frame.style.clipPath=index===from
            ? `inset(0 0 0 ${inset+sweep.outgoing*width}px)`
            : `inset(0 ${frame.clientWidth-inset-sweep.incoming*width}px 0 0)`;
          return;
        }
        frame.style.clipPath="none";
        const weight=index===from ? 1-blend : index===to ? blend : 0;
        frame.style.visibility=weight>0 ? "visible" : "hidden";
        frame.style.opacity=String(weight);
        // Keep the physical objects intact. Only a restrained editorial push-in moves.
        const y=index===from ? -18*blend : 18*(1-blend);
        const scale=index===from ? 1-.025*blend : .975+.025*blend;
        frame.style.transform=`translateY(calc(-50% + ${y}px)) scale(${scale})`;
      });
      if(morphActive && morph && rects[from] && rects[to])morph.render(from,to,progress,rects[from],rects[to]);
      root!.dataset.phase=phase.toFixed(3);
      root!.dataset.scene=visualScenes[Math.round(phase)].id;
      root!.dataset.transition=morphActive && sweep.particles ? "pixel-flow" : "photo";
    }
    function measure() {
      if(!enabled || !alive) return;
      const anchors=Array.from(document.querySelectorAll<HTMLElement>("[data-core-phase]")).map(element=>{
        const content=element.querySelector<HTMLElement>(":scope > .section-heading, :scope > .reading-column") ?? element;
        // offsetTop is unaffected by the subtle text reveal transforms.
        let top=0, node:HTMLElement|null=content;
        while(node){top+=node.offsetTop;node=node.offsetParent as HTMLElement|null;}
        return {top,phase:Number(element.dataset.corePhase)};
      }).sort((a,b)=>a.top-b.top);
      timeline=buildSceneTransitions(anchors,window.innerHeight,document.querySelector(".site-header")?.getBoundingClientRect().height ?? 76,document.documentElement.scrollHeight-window.innerHeight);
      rects=frames.map((frame,index)=>{
        const ratio=images[index].naturalWidth/Math.max(1,images[index].naturalHeight)||4/3;
        const width=Math.min(frame.clientWidth,frame.clientHeight*ratio),height=width/ratio;
        return {left:frame.offsetLeft+(frame.clientWidth-width)/2,top:frame.offsetTop-height/2,width,height};
      });
      morph?.resize(window.innerWidth,window.innerHeight);
      render();
    }
    function queue() { if(enabled && !request) request=requestAnimationFrame(render); }
    function configure() {
      const current=++revision;
      morphActive=false;morph?.dispose();morph=undefined;
      enabled=!mobile.matches && !reduced.matches;
      setReady(enabled);
      if(enabled) {
        measure();
        void import("@/lib/photoMorph").then(async({createPhotoMorph})=>{
          if(!alive || current!==revision)return;
          const instance=await createPhotoMorph(root!,images,()=>{
            morphActive=false;
            const canvas=root!.querySelector<HTMLCanvasElement>("canvas");
            if(canvas)canvas.style.visibility="hidden";
            root!.dataset.effect="fallback";render();
          });
          if(!alive || current!==revision){instance.dispose();return;}
          morph=instance;morphActive=true;root!.dataset.effect="particles";measure();
        }).catch(()=>{if(alive && current===revision){root!.dataset.effect="fallback";render();}});
      } else {cancelAnimationFrame(request);request=0;root!.dataset.effect="static";}
    }
    const observer=new ResizeObserver(measure);
    const main=document.querySelector("main");
    if(main) observer.observe(main);
    configure();
    window.addEventListener("scroll",queue,{passive:true});
    window.addEventListener("resize",measure);
    mobile.addEventListener("change",configure);
    reduced.addEventListener("change",configure);
    void document.fonts.ready.then(()=>{if(alive)measure();});
    return ()=>{
      alive=false;revision++;morph?.dispose();cancelAnimationFrame(request);observer.disconnect();
      window.removeEventListener("scroll",queue);window.removeEventListener("resize",measure);
      mobile.removeEventListener("change",configure);reduced.removeEventListener("change",configure);
    };
  },[]);

  return <div ref={host} className="photographic-stage" data-ready={ready} aria-hidden="true">
    {visualScenes.map((scene,phase)=><div className={`photo-frame photo-${scene.side===1 ? "right" : "left"}`} key={scene.id}><ScenePicture phase={phase} decorative /></div>)}
  </div>;
}
