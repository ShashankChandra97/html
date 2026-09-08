"use client";

import { useEffect,useRef,useState } from "react";
import { withBasePath } from "@/lib/basePath";

export function MobileModel({phase}:{phase:number}) {
  return <div className="mobile-model" data-mobile-model={phase} aria-hidden="true">
    {/* Static art stays complete while WebGL loads or if a context fails. */}
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img className="mobile-model-poster" src={withBasePath(`/images/mobile-model-${phase}.webp`)} width="800" height="600" alt="" loading={phase===0?"eager":"lazy"} />
  </div>;
}

export function MobileModels() {
  const host=useRef<HTMLDivElement>(null);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    const mobile=window.matchMedia("(max-width: 767px), (pointer: coarse) and (max-width: 1024px)");
    const motion=window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose:(()=>void)|undefined,revision=0;
    async function initialize(){
      const current=++revision;dispose?.();dispose=undefined;setReady(false);
      if(!mobile.matches||!host.current)return;
      try{
        const {createMobileScene}=await import("../lib/mobileScene");
        if(current!==revision||!host.current)return;
        dispose=createMobileScene(host.current,motion.matches,()=>setReady(false),()=>setReady(true));setReady(true);
      }catch{if(current===revision)setReady(false);}
    }
    void initialize();mobile.addEventListener("change",initialize);motion.addEventListener("change",initialize);
    return ()=>{revision++;dispose?.();mobile.removeEventListener("change",initialize);motion.removeEventListener("change",initialize);};
  },[]);
  return <div ref={host} className="mobile-renderer" data-ready={ready} aria-hidden="true" />;
}
