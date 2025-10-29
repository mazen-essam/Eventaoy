"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";

interface SplitTextProps {
    children: ReactNode;
    splitBy?: "words" | "chars" | "lines";
    className?: string;
    duration?: number;
    delay?: number;
    stagger?: number;
    animation?: "fadeIn" | "slideUp" | "slideDown" | "slideLeft" | "slideRight" | "scale" | "none";
    trigger?: "onMount" | "onScroll" | "onHover";
    once?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
    children,
    splitBy = "chars",
    className = "",
    duration = 0.8,
    delay = 0,
    stagger = 0.02,
    animation = "fadeIn",
    trigger = "onMount",
    once = true,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (!containerRef.current) return;
        if (once && hasAnimatedRef.current) return;

        const element = containerRef.current;
        const text = element.textContent || "";

        // Clear the container
        element.innerHTML = "";

        let items: HTMLElement[] = [];

        if (splitBy === "chars") {
            // Split into characters
            const chars = text.split("");
            chars.forEach((char, index) => {
                const span = document.createElement("span");
                span.textContent = char === " " ? "\u00A0" : char;
                span.style.display = "inline-block";
                span.style.whiteSpace = "pre";
                element.appendChild(span);
                items.push(span);
            });
        } else if (splitBy === "words") {
            // Split into words
            const words = text.split(/\s+/);
            words.forEach((word, index) => {
                const span = document.createElement("span");
                span.textContent = word;
                span.style.display = "inline-block";
                span.style.whiteSpace = "pre";
                if (index < words.length - 1) {
                    span.innerHTML += "\u00A0";
                }
                element.appendChild(span);
                items.push(span);
            });
        } else if (splitBy === "lines") {
            // Split into lines (simplified - splits by <br> tags)
            const lines = text.split("\n").filter(line => line.trim() !== "");
            lines.forEach((line, index) => {
                const span = document.createElement("span");
                span.textContent = line;
                span.style.display = "block";
                element.appendChild(span);
                items.push(span);
            });
        }

        // Set initial states based on animation type
        items.forEach((item, index) => {
            switch (animation) {
                case "fadeIn":
                    gsap.set(item, { opacity: 0 });
                    break;
                case "slideUp":
                    gsap.set(item, { opacity: 0, y: 20 });
                    break;
                case "slideDown":
                    gsap.set(item, { opacity: 0, y: -20 });
                    break;
                case "slideLeft":
                    gsap.set(item, { opacity: 0, x: 20 });
                    break;
                case "slideRight":
                    gsap.set(item, { opacity: 0, x: -20 });
                    break;
                case "scale":
                    gsap.set(item, { opacity: 0, scale: 0 });
                    break;
                case "none":
                    break;
            }
        });

        const animate = () => {
            if (once && hasAnimatedRef.current) return;
            hasAnimatedRef.current = true;

            const animationProps: any = {
                opacity: 1,
                duration,
                delay: delay + stagger,
                stagger: {
                    amount: stagger * items.length,
                },
                ease: "power2.out",
            };

            switch (animation) {
                case "fadeIn":
                    gsap.to(items, animationProps);
                    break;
                case "slideUp":
                    gsap.to(items, { ...animationProps, y: 0 });
                    break;
                case "slideDown":
                    gsap.to(items, { ...animationProps, y: 0 });
                    break;
                case "slideLeft":
                    gsap.to(items, { ...animationProps, x: 0 });
                    break;
                case "slideRight":
                    gsap.to(items, { ...animationProps, x: 0 });
                    break;
                case "scale":
                    gsap.to(items, { ...animationProps, scale: 1 });
                    break;
                case "none":
                    gsap.to(items, { opacity: 1, duration: 0 });
                    break;
            }
        };

        if (trigger === "onMount") {
            animate();
        } else if (trigger === "onScroll") {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            animate();
                            if (once) {
                                observer.disconnect();
                            }
                        } else if (!once) {
                            // Reset animation if not once
                            items.forEach((item) => {
                                switch (animation) {
                                    case "fadeIn":
                                        gsap.set(item, { opacity: 0 });
                                        break;
                                    case "slideUp":
                                        gsap.set(item, { opacity: 0, y: 20 });
                                        break;
                                    case "slideDown":
                                        gsap.set(item, { opacity: 0, y: -20 });
                                        break;
                                    case "slideLeft":
                                        gsap.set(item, { opacity: 0, x: 20 });
                                        break;
                                    case "slideRight":
                                        gsap.set(item, { opacity: 0, x: -20 });
                                        break;
                                    case "scale":
                                        gsap.set(item, { opacity: 0, scale: 0 });
                                        break;
                                }
                            });
                            hasAnimatedRef.current = false;
                        }
                    });
                },
                { threshold: 0.1 }
            );

            observer.observe(element);

            return () => {
                observer.disconnect();
            };
        } else if (trigger === "onHover") {
            const handleMouseEnter = () => animate();
            element.addEventListener("mouseenter", handleMouseEnter);

            return () => {
                element.removeEventListener("mouseenter", handleMouseEnter);
            };
        }
    }, [children, splitBy, duration, delay, stagger, animation, trigger, once]);

    return (
        <span ref={containerRef} className={className}>
            {children}
        </span>
    );
};

export default SplitText;

