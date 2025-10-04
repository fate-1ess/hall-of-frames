import { useCallback, useLayoutEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const imgtext = [
  { "Zinjao": "img_01.png" },
  { "Fastwired": "img_02.png" },
  { "Jarritos": "img_03.jpeg" },
  { "Matt Smith": "img_04.png" },
  { "Lizzy": "img_05.jpeg" },
  { "Okai": "img_06.png" },
  { "QuestR": "img_07.png" },
  { "Weblogician": "img_08.png" },
  { "Wallmats": "img_09.jpeg" },
];

function App() {
  const menuRef = useRef<HTMLDivElement>(null);
  const wrapperRefs = useRef<Array<HTMLDivElement | null>>([]);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const wrapperMetrics = useRef<Array<{ width: number; height: number } | null>>([]);
  const itemMetrics = useRef<Array<DOMRect | null>>([]);

  useGSAP(
    () => {
      gsap.timeline()
        .set(".menu", { autoAlpha: 1 })
        .from(".menu-item-text", {
          delay: 1,
          duration: 0.85,
          xPercent: 25,
          yPercent: 125,
          stagger: 0.095,
          skewY: gsap.utils.wrap([-8, 8]),
          ease: "expo.out",
        })
        .set(".menu", { pointerEvents: "all" });

      gsap.defaults({ duration: 0.55, ease: "expo.out" });
    },
    { scope: menuRef }
  );

  const recalcBounds = useCallback(() => {
    itemRefs.current.forEach((item, index) => {
      itemMetrics.current[index] = item ? item.getBoundingClientRect() : null;
    });

    wrapperRefs.current.forEach((wrapper, index) => {
      if (!wrapper) {
        wrapperMetrics.current[index] = null;
        return;
      }
      const bounds = wrapper.getBoundingClientRect();
      wrapperMetrics.current[index] = { width: bounds.width, height: bounds.height };
    });
  }, []);

  useLayoutEffect(() => {
    recalcBounds();
    window.addEventListener("resize", recalcBounds);
    return () => {
      window.removeEventListener("resize", recalcBounds);
    };
  }, [recalcBounds]);

  const handleEnter = (i: number) => {
    const wrapper = wrapperRefs.current[i];
    if (!wrapper) return;
    gsap.set(wrapper, {
      scale: 0.8,
      xPercent: 25,
      yPercent: 50,
      rotation: -15
    });
    gsap.to(wrapper, {
      opacity: 1,
      scale: 1,
      yPercent: 0,
      rotation: 0
    });
  };

  const handleLeave = (i: number) => {
    const wrapper = wrapperRefs.current[i];
    if (!wrapper) return;
    gsap.to(wrapper, {
      opacity: 0,
      yPercent: -50,
      xPercent: 25,
      scale: 0.8,
      rotation: -15,
    });
  };

  const handleMove = (i: number, e: MouseEvent<HTMLDivElement>) => {
    const wrapper = wrapperRefs.current[i];
    const itemBounds = itemMetrics.current[i];
    const wrapperBounds = wrapperMetrics.current[i];
    if (!wrapper || !itemBounds || !wrapperBounds) return;

    let yOffset = itemBounds.top / wrapperBounds.height;
    yOffset = gsap.utils.mapRange(0, 1.5, -150, 150, yOffset);

    gsap.to(wrapper, {
      duration: 1.25,
      x: Math.abs(e.clientX - itemBounds.left) - wrapperBounds.width / 1.55,
      y: Math.abs(e.clientY - itemBounds.top) - wrapperBounds.height / 2 - yOffset,
    });
  };

  return (
    <div
      className="menu w-full h-screen bg-[#131313] p-16 overflow-hidden"
      ref={menuRef}
    >
      {imgtext.map((item, index) => {
        const key = Object.keys(item)[0] as keyof typeof item;
        const value = item[key];
        return (
          <div
            key={index}
            className="w-max relative cursor-pointer group"
            ref={(el) => { itemRefs.current[index] = el; }}
            onMouseEnter={() => handleEnter(index)}
            onMouseLeave={() => handleLeave(index)}
            onMouseMove={(e) => handleMove(index, e)}
          >
            <div
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none opacity-0"
              ref={(el) => { wrapperRefs.current[index] = el; }}
            >
              <img className="absolute left-0 top-0 w-full h-full object-cover" src={value} alt={key} />
            </div>
            <div
              className="menu-item-text relative font-bold font-sans uppercase text-[5vw] leading-none text-[#e6e3d8] transition-opacity duration-350 ease-in-out whitespace-nowrap overflow-hidden group-hover:text-[#c24628]"
            >
              {key}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default App;
