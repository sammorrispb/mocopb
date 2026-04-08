import type { FAQItem } from "@/components/FAQAccordion";
import { hubUrl } from "./tracking";

const COACHING = "https://www.sammorrispb.com";
const NGA = "https://www.nextgenacademypb.com";

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
    answer: "The easiest way is to show up at a local court during open play hours. Cabin John Regional Park has free outdoor courts, and Dill Dinkers offers indoor play in Rockville and North Bethesda. If you've never played before, consider a beginner clinic to learn the basics.",
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
  {
    category: "getting-started",
    question: "What's the difference between indoor and outdoor pickleball?",
    answer: "Indoor courts (like Dill Dinkers) offer climate-controlled play, consistent lighting, and smoother surfaces. Outdoor courts (like Cabin John) are free but weather-dependent. Indoor balls have larger holes and are heavier; outdoor balls are harder and have smaller holes. Many players enjoy both.",
    cta: { text: "Compare courts", href: "/courts" },
  },

  // Finding Play
  {
    category: "finding-play",
    question: "Where can I play pickleball in Montgomery County?",
    answer: "Montgomery County has 30+ pickleball courts across 8+ facilities. Indoor options include Dill Dinkers (Rockville and North Bethesda) and Montgomery TennisPlex. Outdoor courts include Cabin John Regional Park, Olney Manor, and Wheaton Regional Park.",
    cta: { text: "View all courts", href: "/courts" },
  },
  {
    category: "finding-play",
    question: "Are there free pickleball courts near me?",
    answer: "Yes! Montgomery County Parks operate free outdoor courts at Cabin John Regional Park (6 courts with lights), Olney Manor (4 courts), and Wheaton Regional Park (4 courts). Courts are first-come, first-served. Arrive early on weekends — they fill up fast.",
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
    question: "How do I find pickleball players near me?",
    answer: "Join the Link & Dink community — it connects 2,000+ pickleball players across Montgomery County. You can find playing partners at your skill level, join groups, and discover events. You can also show up to open play at any local court.",
    cta: { text: "Join Link & Dink", href: hubUrl("/", "faq_find_players") },
  },
  {
    category: "finding-play",
    question: "What pickleball groups exist in Montgomery County?",
    answer: "There are 15+ active pickleball groups in MoCo ranging from casual social play to competitive leagues. Groups meet at Dill Dinkers, Cabin John, and other facilities. Link & Dink helps you find groups matched to your skill level and schedule.",
    cta: { text: "Browse groups", href: "/groups" },
  },

  // Improving
  {
    category: "improving",
    question: "How do I get better at pickleball?",
    answer: "The fastest way to improve is a combination of playing regularly, taking lessons from a certified coach, and drilling specific skills. Focus on consistency before power — a reliable serve, accurate dinks, and smart court positioning will beat raw athleticism every time.",
    cta: { text: "Book a lesson", href: COACHING + "/programs/coaching?utm_source=mocopb&utm_medium=website&utm_campaign=faq_improve" },
  },
  {
    category: "improving",
    question: "What is a DUPR rating?",
    answer: "DUPR (Dynamic Universal Pickleball Rating) is the global rating system for pickleball players, ranging from 2.0 (beginner) to 6.0+ (pro). It's based on match results, not self-assessment. Many leagues and tournaments in MoCo use DUPR for fair matchmaking.",
    cta: { text: "Get evaluated", href: COACHING + "/programs/coaching?utm_source=mocopb&utm_medium=website&utm_campaign=faq_dupr" },
  },
  {
    category: "improving",
    question: "Should I take pickleball lessons?",
    answer: "If you want to improve efficiently, yes. A certified coach can identify bad habits early, teach proper technique, and accelerate your development. Coach Sam Morris offers private lessons and skill evaluations at Dill Dinkers facilities in Rockville and North Bethesda.",
    cta: { text: "Book a private lesson", href: COACHING + "/programs/coaching?utm_source=mocopb&utm_medium=website&utm_campaign=faq_lessons" },
  },
  {
    category: "improving",
    question: "What are pickleball clinics?",
    answer: "Clinics are group instruction sessions focused on specific skills (dinking, serving, strategy). They're more affordable than private lessons and a great way to learn while meeting other players. Dill Dinkers and Coach Sam Morris run regular clinics for all levels.",
    cta: { text: "Find clinics", href: "/clinics" },
  },
  {
    category: "improving",
    question: "Are there youth pickleball programs in Montgomery County?",
    answer: "Yes! Next Gen Pickleball Academy offers structured programs for kids ages 5-16 at Dill Dinkers facilities. Four skill levels (Red, Orange, Green, Yellow) ensure your child progresses at the right pace. It's the only dedicated youth academy in MoCo.",
    cta: { text: "Explore youth programs", href: NGA + "?utm_source=mocopb&utm_medium=website&utm_campaign=faq_youth" },
  },

  // Competitive
  {
    category: "competitive",
    question: "Are there pickleball leagues in Montgomery County?",
    answer: "Yes — multiple DUPR-rated leagues run at Dill Dinkers throughout the year. Leagues are organized by skill level so you play competitive matches against similar players. Seasons run 6-8 weeks with weekly matches.",
    cta: { text: "Join a league", href: hubUrl("/", "faq_leagues") },
  },
  {
    category: "competitive",
    question: "How do I join a pickleball tournament?",
    answer: "Tournaments in MoCo are typically hosted at Dill Dinkers and run through CourtReserve. Events range from beginner-friendly round robins to competitive DUPR-rated brackets. Join the Link & Dink community to get notified when tournaments open for registration.",
    cta: { text: "See upcoming events", href: "/events" },
  },
  {
    category: "competitive",
    question: "What skill levels exist in pickleball?",
    answer: "Pickleball skill levels range from 1.0 (never played) to 5.5+ (professional). Most recreational players fall between 2.5 and 4.0. Beginners (2.0-2.5) are learning fundamentals. Intermediate players (3.0-3.5) have consistent rallies. Advanced players (4.0+) have strategic, competitive games.",
    cta: { text: "Get your rating", href: COACHING + "/programs/coaching?utm_source=mocopb&utm_medium=website&utm_campaign=faq_skill_levels" },
  },
];

export function getFAQsByCategory(category: FAQCategory): CategorizedFAQ[] {
  return allFAQs.filter((f) => f.category === category);
}

export function getTopFAQs(count: number = 5): CategorizedFAQ[] {
  return allFAQs.slice(0, count);
}
