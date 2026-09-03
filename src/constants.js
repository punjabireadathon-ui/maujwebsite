import {
  BookOpen, Volume2, Repeat, Dumbbell, TreePine, Eye, Smile, Phone,
} from "lucide-react";

export const ADMIN_PASSCODE = "KHALSA2049";

export const GURMUKHI_DIGITS = ["੦","੧","੨","੩","੪","੫","੬","੭","੮","੯"];

export const HABITS = [
  { key: "sehajPaath",   gur: "ਸਹਿਜ ਪਾਠ",        en: "Sehaj Paath",     target: "5 min",  icon: BookOpen,  type: "ang" },
  { key: "readAloud",    gur: "ਉੱਚੀ ਪੜ੍ਹਨਾ",      en: "Read Aloud",      target: "10 min", icon: Volume2,   type: "mins" },
  { key: "kanthBani",    gur: "ਬਾਣੀ ਕੰਠ",         en: "Bani Kanth",      target: "3 min",  icon: Repeat,    type: "check" },
  { key: "kasrat",       gur: "ਕਸਰਤ",             en: "Kasrat",          target: "10 min", icon: Dumbbell,  type: "mins" },
  { key: "natureWatch",  gur: "ਕੁਦਰਤ ਨਿਹਾਰਨਾ",     en: "Nature Watch",    target: "1 min",  icon: TreePine,  type: "check" },
  { key: "visualization",gur: "ਦ੍ਰਿਸ਼ਟੀਕਰਨ",       en: "Visualisation",   target: "1 min",  icon: Eye,       type: "check" },
  { key: "sim",          gur: "SIM",              en: "Smile is Must",   target: "—",      icon: Smile,     type: "rating" },
  { key: "ptm",          gur: "PTM",              en: "Phone to Mother", target: "—",      icon: Phone,     type: "hours" },
];

export const CHAR_STRENGTHS = {
  "Wisdom":         ["Creativity", "Curiosity", "Judgment", "Love of Learning", "Perspective"],
  "Courage":         ["Bravery", "Honesty", "Perseverance", "Zest"],
  "Humanity":       ["Kindness", "Love", "Social Intelligence"],
  "Justice":          ["Fairness", "Leadership", "Teamwork"],
  "Temperance":       ["Forgiveness", "Humility", "Prudence", "Self-Regulation"],
  "Transcendence": ["Appreciation of Beauty & Excellence", "Gratitude", "Hope", "Humor", "Spirituality"],
};
