"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

    // Smooth spring follow for the outer ring
    const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
    const ringX = useSpring(cursorX, springConfig);
    const ringY = useSpring(cursorY, springConfig);

    useEffect(() => {
        // Skip on touch devices
        if ("ontouchstart" in window || navigator.maxTouchPoints > 0) {
            setIsTouchDevice(true);
            return;
        }

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const handleEnter = () => setIsVisible(true);
        const handleLeave = () => setIsVisible(false);
        const handleDown = () => setIsClicking(true);
        const handleUp = () => setIsClicking(false);

        // Detect hoverable elements
        const handleOverInteractive = (e: Event) => {
            const target = e.target as HTMLElement;
            if (
                target.closest("a, button, [role='button'], input, textarea, select, label[for], .cursor-hover")
            ) {
                setIsHovering(true);
            }
        };

        const handleOutInteractive = (e: Event) => {
            const target = e.target as HTMLElement;
            if (
                target.closest("a, button, [role='button'], input, textarea, select, label[for], .cursor-hover")
            ) {
                setIsHovering(false);
            }
        };

        window.addEventListener("mousemove", moveCursor);
        document.addEventListener("mouseenter", handleEnter);
        document.addEventListener("mouseleave", handleLeave);
        document.addEventListener("mousedown", handleDown);
        document.addEventListener("mouseup", handleUp);
        document.addEventListener("mouseover", handleOverInteractive);
        document.addEventListener("mouseout", handleOutInteractive);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            document.removeEventListener("mouseenter", handleEnter);
            document.removeEventListener("mouseleave", handleLeave);
            document.removeEventListener("mousedown", handleDown);
            document.removeEventListener("mouseup", handleUp);
            document.removeEventListener("mouseover", handleOverInteractive);
            document.removeEventListener("mouseout", handleOutInteractive);
        };
    }, [cursorX, cursorY, isVisible]);

    if (isTouchDevice) return null;

    return (
        <>
            {/* Hide default cursor globally */}
            <style jsx global>{`
        *, *::before, *::after {
          cursor: none !important;
        }
      `}</style>

            {/* Inner dot — follows cursor exactly */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{ x: cursorX, y: cursorY }}
                aria-hidden="true"
            >
                <motion.div
                    animate={{
                        scale: isClicking ? 0.6 : isHovering ? 0 : 1,
                        opacity: isVisible ? 1 : 0,
                    }}
                    transition={{ duration: 0.15 }}
                    className="relative -top-1.5 -left-1.5 w-3 h-3 rounded-full bg-white"
                    style={{
                        boxShadow: "0 0 10px rgba(139, 92, 246, 0.6), 0 0 20px rgba(139, 92, 246, 0.3)",
                    }}
                />
            </motion.div>

            {/* Outer ring — follows with spring delay */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9998]"
                style={{ x: ringX, y: ringY }}
                aria-hidden="true"
            >
                <motion.div
                    animate={{
                        width: isHovering ? 56 : 36,
                        height: isHovering ? 56 : 36,
                        borderColor: isHovering
                            ? "rgba(139, 92, 246, 0.6)"
                            : "rgba(139, 92, 246, 0.25)",
                        opacity: isVisible ? 1 : 0,
                        scale: isClicking ? 0.85 : 1,
                    }}
                    transition={{ duration: 0.2 }}
                    className="rounded-full border-2 relative"
                    style={{
                        top: isHovering ? -28 : -18,
                        left: isHovering ? -28 : -18,
                        background: isHovering
                            ? "rgba(139, 92, 246, 0.06)"
                            : "transparent",
                    }}
                />
            </motion.div>
        </>
    );
}
