import type { FAQItem } from "@/components/FAQAccordion";
import { businessUrl } from "./tracking";
import { getBusinessById } from "./businesses";

const coaching = getBusinessById("coaching");
const nga = getBusinessById("nga");

export const faqCategories = [
  { id: "getting-started", label: "Getting Started" },
  { id: "finding-play", label: "Finding Play" },
  { id: "improving", label: "Improving Your Game" },
  { id: "competitive", label: "Competitive Play" },
] as const;

export type FAQCategory = (typeof faqCategories)[number]["id"];

export interface CategorizedFAQ extends FAQItem {
  category: FAQCategory;
}

export const allFAQs: CategorizedFAQ[] = [
  // Getting Started
  {
    category: "getting-started",
    question: "What is pickleball?",
    answer: "Pickleball is a paddle sport that combines elements of tennis, badminton, and ping-pong. It's played on a court about one-third the size of a tennis court with a perforated plastic ball and solid paddles. It's the fastest-growing sport in America — easy to learn, social, and a great workout for all ages.",
  },
  {
    category: "getting-started",
    question: "How do I start playing pickleball in Montgomery County?",
    answer: "The easiest way is to show up at a local court during open play hours. Bauer Drive Local Park in Rockville has six free dedicated lighted courts that fill up daily with players of every level. If you've never played before, consider a beginner clinic to learn the basics.",
    cta: { text: "Find courts near you", href: "/courts" },
  },
  {
    category: "getting-started",
    question: "What equipment do I need to start?",
    answer: "All you need is a pickleball paddle, a few pickleballs, and athletic shoes with good lateral support (court shoes or tennis shoes work great). Many facilities and open play groups have loaner paddles for beginners. Expect to spend $30-80 on a starter paddle.",
  },
  {
    category: "getting-started",
    question: "What are the basic rules of pickleball?",
    answer: "Games are played to 11 points (win by 2). Only the serving team can score. The ball must bounce once on each side before volleys are allowed (the two-bounce rule). There's a 7-foot non-volley zone called 'the kitchen' near the net. Serves are underhand and diagonal.",
  },

  // Finding Play
  {
    category: "finding-play",
    question: "Where can I play pickleball in Montgomery County?",
    answer: "Montgomery County has free outdoor courts at multiple facilities including Bauer Drive Local Park and Mattie Stepanek Park in Rockville, Olney Mill Neighborhood Park in Olney, and Seven Locks Local Park in the Cabin John area, plus indoor courts at the Germantown Recreation Center.",
    cta: { text: "View all courts", href: "/courts" },
  },
  {
    category: "finding-play",
    question: "Are there free pickleball courts near me?",
    answer: "Yes! Montgomery County has free dedicated outdoor courts at Bauer Drive Local Park in Rockville (6 lighted courts — MoCo Parks' first dedicated facility), Mattie Stepanek Park in Rockville (4 lighted courts), Olney Mill Neighborhood Park in Olney (4 lighted courts), and Seven Locks Local Park in the Cabin John area (2 courts). Courts are first-come, first-served. Arrive early on weekends — they fill up fast.",
    cta: { text: "Find free courts", href: "/courts" },
  },
  {
    category: "finding-play",
    question: "What is open play?",
    answer: "Open play is drop-in pickleball where you show up and rotate partners. Players typically put their paddles in a queue and play with whoever's next. It's the best way to meet other players and get games in. Most facilities offer open play daily at various skill levels.",
    cta: { text: "Find open play", href: "/open-play" },
  },
  {
    category: "finding-play",
    question: "What pickleball groups exist in Montgomery County?",
    answer: "There are several active pickleball groups in MoCo ranging from casual social play to competitive leagues. Groups meet at Bauer Drive, Mattie Stepanek Park, Olney Mill, Seven Locks, and other facilities throughout the area.",
    cta: { text: "Browse groups", href: "/groups" },
  },

  // Improving
  {
    category: "improving",
    question: "How do I get better at pickleball?",
    answer: "The fastest way to improve is a combination of playing regularly, taking lessons from a certified coach, and drilling specific skills. Focus on consistency before power — a reliable serve, accurate dinks, and smart court positioning will beat raw athleticism every time.",
    cta: { text: "Book a lesson", href: businessUrl(coaching, "faq_improve", "book_lesson", "/programs/coaching") },
  },
  {
    category: "improving",
    question: "What is a DUPR rating?",
    answer: "DUPR (Dynamic Universal Pickleball Rating) is the global rating system for pickleball players, ranging from 2.0 (beginner) to 6.0+ (pro). It's based on match results, not self-assessment. Many leagues and tournaments in MoCo use DUPR for fair matchmaking.",
    cta: { text: "Get evaluated", href: businessUrl(coaching, "faq_dupr", "get_evaluated", "/programs/coaching") },
  },
  {
    category: "improving",
    question: "Should I take pickleball lessons?",
    answer: "If you want to improve efficiently, yes. A certified coach can identify bad habits early, teach proper technique, and accelerate your development. Coach Sam Morris offers private lessons and skill evaluations around Montgomery County.",
    cta: { text: "Book a private lesson", href: businessUrl(coaching, "faq_lessons", "book_private", "/programs/coaching") },
  },
  {
    category: "improving",
    question: "What are pickleball clinics?",
    answer: "Clinics are group instruction sessions focused on specific skills (dinking, serving, strategy). They're more affordable than private lessons and a great way to learn while meeting other players. Coach Sam Morris runs regular clinics for all levels in Montgomery County.",
    cta: { text: "Find clinics", href: "/clinics" },
  },
  {
    category: "improving",
    question: "Are there youth pickleball programs in Montgomery County?",
    answer: "Yes! Next Gen Pickleball Academy offers structured programs for kids ages 5-16 in Montgomery County. Four skill levels (Red, Orange, Green, Yellow) ensure your child progresses at the right pace.",
    cta: { text: "Explore youth programs", href: businessUrl(nga, "faq_youth", "explore_youth") },
  },

  // Competitive
  {
    category: "competitive",
    question: "Are there pickleball leagues in Montgomery County?",
    answer: "Yes — multiple DUPR-rated leagues run in Montgomery County throughout the year. Leagues are organized by skill level so you play competitive matches against similar players. Seasons run 6-8 weeks with weekly matches.",
    cta: { text: "See upcoming events", href: "/events" },
  },
  {
    category: "competitive",
    question: "How do I join a pickleball tournament?",
    answer: "Tournaments in MoCo are hosted at various venues throughout the area. Events range from beginner-friendly round robins to competitive DUPR-rated brackets. Check upcoming events for dates and registration.",
    cta: { text: "See upcoming events", href: "/events" },
  },
  {
    category: "competitive",
    question: "What skill levels exist in pickleball?",
    answer: "Pickleball skill levels range from 1.0 (never played) to 5.5+ (professional). Most recreational players fall between 2.5 and 4.0. Beginners (2.0-2.5) are learning fundamentals. Intermediate players (3.0-3.5) have consistent rallies. Advanced players (4.0+) have strategic, competitive games.",
    cta: { text: "Get your rating", href: businessUrl(coaching, "faq_skill_levels", "get_rating", "/programs/coaching") },
  },
];

export function getFAQsByCategory(category: FAQCategory): CategorizedFAQ[] {
  return allFAQs.filter((f) => f.category === category);
}

export function getTopFAQs(count: number = 5): CategorizedFAQ[] {
  return allFAQs.slice(0, count);
}
