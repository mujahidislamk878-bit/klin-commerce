import type { AnimationType, AnimationProps, AnimationTrigger } from "../types";
import type { Variants, Transition } from "framer-motion";

export const animationVariants: Record<AnimationType, Variants> = {
  none: { hidden: {}, visible: {} },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInDown: {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  fadeInLeft: {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  },
  fadeInRight: {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0 },
  },
  slideUp: {
    hidden: { y: "100%" },
    visible: { y: 0 },
  },
  slideDown: {
    hidden: { y: "-100%" },
    visible: { y: 0 },
  },
  slideLeft: {
    hidden: { x: "100%" },
    visible: { x: 0 },
  },
  slideRight: {
    hidden: { x: "-100%" },
    visible: { x: 0 },
  },
  scaleIn: {
    hidden: { scale: 0 },
    visible: { scale: 1 },
  },
  scaleInX: {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1 },
  },
  scaleInY: {
    hidden: { scaleY: 0 },
    visible: { scaleY: 1 },
  },
  rotateIn: {
    hidden: { rotate: -180, opacity: 0 },
    visible: { rotate: 0, opacity: 1 },
  },
  flipInX: {
    hidden: { rotateX: -90, opacity: 0 },
    visible: { rotateX: 0, opacity: 1 },
  },
  flipInY: {
    hidden: { rotateY: -90, opacity: 0 },
    visible: { rotateY: 0, opacity: 1 },
  },
  zoomIn: {
    hidden: { scale: 0.5, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  },
};

export function getAnimationProps(props: AnimationProps) {
  const {
    animation = "none",
    duration = 0.5,
    delay = 0,
    once = true,
    ease = "easeOut",
  } = props;

  const variants = animationVariants[animation] ?? animationVariants.none;
  const transition: Transition = { duration, delay, ease: ease as any };

  return { variants, transition, once };
}

export function getInitial(animation: AnimationType) {
  return animation === "none" ? undefined : "hidden";
}

export function getWhileInView(animation: AnimationType) {
  return animation === "none" ? undefined : "visible";
}