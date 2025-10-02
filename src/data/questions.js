// Pruned to 24 unique questions (removed overlapping themes: motivation duplicate, wake-up motivation, problem solving vs decision making, biggest strength vs crisis strength, crew role vs group role, unexpected situations vs pressure, legacy & greatest wish). Renumbered sequentially.
export const questions = [
  { id: 1, question: "What role do you usually take in a group?", answers: [
  { text: "The leader who motivates everyone", scores: { luffy: 1, zoro: 1, jinbe: 1 } },
    { text: "The loyal supporter who follows the leader", scores: { zoro: 3, chopper: 2, jinbe: 1 } },
    { text: "The strategist who plans everything", scores: { nami: 3, robin: 2, jinbe: 1 } },
    { text: "The entertainer who keeps spirits high", scores: { luffy: 1, brook: 3, franky: 2 } }
  ]},
  { id: 2, question: "What's your ideal adventure?", answers: [
    { text: "Exploring uncharted territories", scores: { luffy: 2, robin: 2, franky: 2 } },
    { text: "Treasure hunting for riches", scores: { nami: 3, luffy: 1, usopp: 2 } },
    { text: "Meeting new people and cultures", scores: { luffy: 1, sanji: 2, brook: 2, jinbe: 1, franky: 1 } },
    { text: "Solving ancient mysteries", scores: { robin: 3, chopper: 1, brook: 1, usopp: 1 } }
  ]},
  { id: 3, question: "How do you react under pressure?", answers: [
    { text: "Stay calm and think logically", scores: { robin: 2, jinbe: 2, nami: 1, zoro: 1 } },
    { text: "Fight head-on with determination", scores: { luffy: 2, zoro: 3, sanji: 2 } },
    { text: "Panic at first, then find courage", scores: { usopp: 3, chopper: 2, nami: 1, luffy: 1 } },
    { text: "Make jokes to lighten the mood", scores: { brook: 3, luffy: 1, franky: 2 } }
  ]},
  { id: 4, question: "Pick a favorite color or vibe:", answers: [
    { text: "Red - Bold and energetic", scores: { luffy: 2, franky: 2, sanji: 1 } },
    { text: "Green - Natural and strong", scores: { zoro: 3, chopper: 1, jinbe: 1 } },
    { text: "Orange - Bright and cheerful", scores: { nami: 3, usopp: 1, brook: 1, luffy: 1 } },
    { text: "Blue - Calm and mysterious", scores: { robin: 2, jinbe: 2, brook: 1 } }
  ]},
  { id: 5, question: "What's your strength in a crisis?", answers: [
    { text: "Physical strength and combat skills", scores: { luffy: 2, zoro: 3, sanji: 2, jinbe: 1 } },
    { text: "Intelligence and problem-solving", scores: { nami: 3, robin: 2, chopper: 1 } },
    { text: "Creativity and resourcefulness", scores: { usopp: 3, franky: 3, nami: 1 } },
    { text: "Emotional support and healing", scores: { chopper: 3, sanji: 2, brook: 1, jinbe: 1, robin: 1 } }
  ]},
  { id: 6, question: "How do you handle conflict?", answers: [
    { text: "Face it directly with confidence", scores: { luffy: 2, zoro: 2, sanji: 2 } },
    { text: "Try to find a peaceful solution", scores: { jinbe: 3, chopper: 2, robin: 1 } },
    { text: "Use strategy and manipulation", scores: { nami: 3, robin: 2, usopp: 1, franky: 1 } },
    { text: "Avoid it or make light of it", scores: { usopp: 2, brook: 3, chopper: 1, luffy: 1 } }
  ]},
  { id: 7, question: "What's your favorite type of food?", answers: [
    { text: "Meat! Lots and lots of meat!", scores: { luffy: 2, zoro: 1, franky: 2 } },
    { text: "Elegant cuisine with fine presentation", scores: { sanji: 3, robin: 1, nami: 1 } },
    { text: "Sweet treats and desserts", scores: { chopper: 3, brook: 1, usopp: 1, sanji: 1 } },
    { text: "Healthy, nutritious meals", scores: { jinbe: 2, chopper: 2, robin: 1, luffy: 1 } }
  ]},
  { id: 8, question: "How do you spend your free time?", answers: [
    { text: "Training and getting stronger", scores: { zoro: 3, luffy: 1, sanji: 2 } },
    { text: "Reading books and studying", scores: { robin: 2, chopper: 2, nami: 1, jinbe: 1 } },
    { text: "Creating inventions or art", scores: { franky: 3, usopp: 2, nami: 1, robin: 1 } },
    { text: "Playing music and entertaining", scores: { brook: 3, luffy: 1, franky: 2 } }
  ]},
  { id: 9, question: "What's your biggest fear?", answers: [
    { text: "Being unable to protect my friends", scores: { zoro: 3, sanji: 2, chopper: 2, jinbe: 1, luffy: 1 } },
    { text: "Being forgotten or left alone", scores: { brook: 3, chopper: 2, usopp: 2 } },
    { text: "Not achieving my dreams", scores: { luffy: 2, nami: 2, usopp: 2, franky: 2 } },
    { text: "Losing my knowledge or memories", scores: { robin: 2, chopper: 1, brook: 1, nami: 1 } }
  ]},
  { id: 10, question: "What weapon would you choose?", answers: [
    { text: "My bare fists - I am my weapon!", scores: { luffy: 2, jinbe: 2, sanji: 1 } },
    { text: "Three swords for maximum power", scores: { zoro: 3, luffy: 1, franky: 1 } },
    { text: "A slingshot with creative ammunition", scores: { usopp: 3, nami: 1, franky: 2 } },
    { text: "Something elegant and precise", scores: { robin: 2, sanji: 2, brook: 2, nami: 1 } }
  ]},
  { id: 11, question: "How do you make important decisions?", answers: [
    { text: "Follow my gut instinct", scores: { luffy: 2, zoro: 2, brook: 1, sanji: 1 } },
    { text: "Analyze all the facts carefully", scores: { robin: 2, nami: 2, chopper: 1, jinbe: 1 } },
    { text: "Consider what's best for everyone", scores: { jinbe: 3, sanji: 2, chopper: 2 } },
    { text: "Think of the most creative solution", scores: { usopp: 3, franky: 3, nami: 1 } }
  ]},
  { id: 12, question: "What's your ideal weather?", answers: [
  { text: "Sunny and bright - perfect for adventure!", scores: { luffy: 1, franky: 3, brook: 1 } },
    { text: "Calm and peaceful weather", scores: { jinbe: 2, robin: 2, chopper: 1 } },
    { text: "Stormy - I love the excitement!", scores: { nami: 3, zoro: 1, luffy: 1, sanji: 1 } },
    { text: "Cool and misty - mysterious atmosphere", scores: { robin: 2, brook: 2, usopp: 1, zoro: 1, jinbe: 1 } }
  ]},
  { id: 13, question: "How do you show you care about someone?", answers: [
    { text: "Cook them their favorite meal", scores: { sanji: 3, chopper: 1, jinbe: 1, luffy: 1 } },
    { text: "Protect them no matter what", scores: { zoro: 3, luffy: 1, jinbe: 1 } },
    { text: "Help them achieve their dreams", scores: { luffy: 2, nami: 1, franky: 2 } },
    { text: "Listen to their problems and give advice", scores: { robin: 2, jinbe: 3, chopper: 2, usopp: 1 } }
  ]},
  { id: 14, question: "What's your learning style?", answers: [
    { text: "Learn by doing and making mistakes", scores: { luffy: 2, franky: 3, usopp: 1, sanji: 1 } },
    { text: "Study books and research thoroughly", scores: { robin: 2, chopper: 2, nami: 1 } },
    { text: "Practice the same technique over and over", scores: { zoro: 3, sanji: 2, brook: 1 } },
    { text: "Learn from others' experiences and stories", scores: { brook: 2, jinbe: 2, usopp: 2, robin: 1 } }
  ]},
  { id: 15, question: "How do you handle being criticized?", answers: [
    { text: "Ignore it and keep doing what I believe in", scores: { luffy: 2, zoro: 2, franky: 2 } },
    { text: "Analyze if there's truth in it and improve", scores: { robin: 2, nami: 2, chopper: 1, jinbe: 1 } },
    { text: "Get defensive but eventually consider it", scores: { sanji: 2, usopp: 3, nami: 1, luffy: 1 } },
    { text: "Use humor to deflect but think about it later", scores: { brook: 3, usopp: 2, luffy: 1, franky: 1 } }
  ]},
  { id: 16, question: "What's your ideal vacation?", answers: [
    { text: "Exploring a mysterious new island", scores: { luffy: 2, robin: 2, franky: 2 } },
    { text: "Relaxing on a peaceful beach", scores: { jinbe: 2, brook: 2, chopper: 1, sanji: 1 } },
    { text: "Shopping and enjoying luxury", scores: { nami: 3, sanji: 2, chopper: 1 } },
    { text: "Training in a challenging environment", scores: { zoro: 3, luffy: 1, sanji: 1, franky: 1 } }
  ]},
  { id: 17, question: "How do you deal with failure?", answers: [
    { text: "Get back up immediately and try again", scores: { luffy: 2, zoro: 2, franky: 2 } },
    { text: "Analyze what went wrong and plan better", scores: { nami: 3, robin: 2, chopper: 1, usopp: 1 } },
    { text: "Feel discouraged but eventually find courage", scores: { usopp: 3, chopper: 2, brook: 1, luffy: 1 } },
    { text: "Accept it calmly and learn from the experience", scores: { jinbe: 2, robin: 2, brook: 1, zoro: 1 } }
  ]},
  { id: 18, question: "What's your communication style?", answers: [
    { text: "Direct and straightforward", scores: { luffy: 2, zoro: 2, franky: 2 } },
    { text: "Thoughtful and mysterious", scores: { robin: 2, jinbe: 1, brook: 1 } },
    { text: "Emotional and expressive", scores: { sanji: 3, chopper: 2, usopp: 1, robin: 1 } },
    { text: "Funny and entertaining", scores: { brook: 3, usopp: 2, luffy: 1, franky: 1 } }
  ]},
  { id: 19, question: "What's your relationship with money?", answers: [
    { text: "Money? What's that? I just want adventure!", scores: { luffy: 2, zoro: 1, brook: 1, franky: 1 } },
    { text: "Money is very important for security", scores: { nami: 3, usopp: 1, chopper: 1, robin: 1 } },
    { text: "I'll spend it on things I'm passionate about", scores: { franky: 3, sanji: 2, luffy: 1, usopp: 1 } },
    { text: "Money should be used wisely and responsibly", scores: { jinbe: 2, robin: 2, chopper: 1, nami: 1 } }
  ]},
  { id: 20, question: "How do you handle stress?", answers: [
    { text: "Take a nap and things will work out", scores: { luffy: 2, brook: 2, zoro: 1 } },
    { text: "Train harder to blow off steam", scores: { zoro: 3, sanji: 2, luffy: 1, franky: 1 } },
    { text: "Plan and organize to regain control", scores: { nami: 3, robin: 2, jinbe: 1, usopp: 1 } },
    { text: "Talk to friends or help others", scores: { chopper: 3, sanji: 1, brook: 1, jinbe: 1 } }
  ]},
  { id: 21, question: "How do you view the past?", answers: [
    { text: "The past is behind me, focus on now!", scores: { luffy: 2, franky: 2, brook: 1 } },
    { text: "I learn from past mistakes", scores: { jinbe: 2, robin: 2, nami: 1, franky: 1 } },
    { text: "Some past memories still haunt me", scores: { robin: 2, brook: 3, sanji: 2, chopper: 1, luffy: 1 } },
    { text: "I honor the past but don't live in it", scores: { zoro: 3, jinbe: 2, usopp: 1, nami: 1 } }
  ]},
  { id: 22, question: "What's your approach to friendship?", answers: [
    { text: "Friends are the most important thing ever!", scores: { luffy: 2, chopper: 2, brook: 1, usopp: 1 } },
    { text: "I'm quietly loyal and protective", scores: { zoro: 3, robin: 2, jinbe: 1 } },
    { text: "I show care through actions, not words", scores: { sanji: 3, chopper: 2, franky: 2 } },
    { text: "I value deep, meaningful connections", scores: { robin: 2, jinbe: 2, brook: 1, nami: 1 } }
  ]},
  { id: 23, question: "What's your philosophy on life?", answers: [
    { text: "Live freely and follow your dreams!", scores: { luffy: 2, brook: 2, franky: 2 } },
    { text: "Honor, duty, and protecting others", scores: { zoro: 3, jinbe: 2, sanji: 2 } },
    { text: "Knowledge is the greatest treasure", scores: { robin: 2, chopper: 2, nami: 1, jinbe: 1 } },
    { text: "Be true to yourself and make others smile", scores: { brook: 3, chopper: 2, usopp: 2 } }
  ]},
  { id: 24, question: "How do you celebrate victories?", answers: [
    { text: "Throw a huge party with lots of food!", scores: { luffy: 2, franky: 3, brook: 2, sanji: 1 } },
    { text: "Quietly appreciate the achievement", scores: { zoro: 3, robin: 2, jinbe: 1 } },
  { text: "Share the success with everyone", scores: { chopper: 3, sanji: 2, usopp: 3 } },
    { text: "Plan for the next challenge", scores: { nami: 3, robin: 1, jinbe: 1, franky: 1 } }
  ]}
];

export const characters = {
  luffy: {
    name: "Monkey D. Luffy",
    title: "Captain & Dreamer",
    description: "You're optimistic, adventurous, and a natural leader! Like Luffy, you inspire others with your unwavering determination and infectious enthusiasm.",
    traits: ["Courageous", "Fun-loving", "Leader", "Determined"],
    color: "#DC143C",
    image: "./images/luffy.jpg",
    emoji: "👑"
  },
  zoro: {
    name: "Roronoa Zoro",
    title: "First Mate & Swordsman", 
    description: "You're loyal, disciplined, and incredibly focused. Like Zoro, you're reliable and will fight to the end for what you believe in.",
    traits: ["Loyal", "Serious", "Disciplined", "Strong"],
    color: "#228B22",
    image: "./images/zoro.jpg",
    emoji: "⚔️"
  },
  nami: {
    name: "Nami",
    title: "Navigator & Strategist",
    description: "You're smart, resourceful, and ambitious. Like Nami, you're excellent at planning and always thinking several steps ahead.",
    traits: ["Smart", "Resourceful", "Ambitious", "Strategic"],
    color: "#FF8C00",
    image: "./images/nami.jpg",
    emoji: "🗺️"
  },
  sanji: {
    name: "Sanji",
    title: "Cook & Gentleman",
    description: "You're chivalrous, emotional, and caring. Like Sanji, you have a big heart and always put others' needs before your own.",
    traits: ["Chivalrous", "Emotional", "Caring", "Passionate"],
    color: "#FFD700",
    image: "./images/sanji.jpg",
    emoji: "👨‍🍳"
  },
  usopp: {
    name: "Usopp",
    title: "Sniper & Storyteller",
    description: "You're creative, sometimes anxious, but incredibly brave when it counts. Like Usopp, you have amazing potential that shines in crucial moments.",
    traits: ["Creative", "Brave", "Storyteller", "Inventive"],
    color: "#DEB887",
    image: "./images/usoop.jpg",
    emoji: "🎯"
  },
  chopper: {
    name: "Tony Tony Chopper",
    title: "Doctor & Heart of the Crew",
    description: "You're caring, cute, and have a healing nature. Like Chopper, you bring warmth and comfort to everyone around you.",
    traits: ["Caring", "Cute", "Healer", "Innocent"],
    color: "#FFB6C1",
    image: "./images/chopper.jpg",
    emoji: "🩺"
  },
  robin: {
    name: "Nico Robin",
    title: "Archaeologist & Scholar",
    description: "You're mysterious, intelligent, and calm under pressure. Like Robin, you value knowledge and have a deep, thoughtful nature.",
    traits: ["Mysterious", "Intelligent", "Calm", "Scholarly"],
    color: "#9370DB",
    image: "./images/robin.jpg",
    emoji: "📜"
  },
  franky: {
    name: "Franky",
    title: "Shipwright & Inventor",
    description: "You're energetic, flashy, and love to create things. Like Franky, you're enthusiastic about your passions and not afraid to show it!",
    traits: ["Energetic", "Flashy", "Inventor", "SUPER!"],
    color: "#00CED1",
    image: "./images/franky.jpg",
    emoji: "🔧"
  },
  brook: {
    name: "Brook",
    title: "Musician & Soul King",
    description: "You're funny, chill, and bring joy to others. Like Brook, you can find humor in any situation and lift everyone's spirits.",
    traits: ["Funny", "Chill", "Musical", "Optimistic"],
    color: "#2F4F4F",
    image: "./images/brook.jpg",
    emoji: "🎵"
  },
  jinbe: {
    name: "Jinbe",
    title: "Helmsman & Wise Counselor",
    description: "You're wise, calm, and honorable. Like Jinbe, you're the voice of reason and others look to you for guidance and stability.",
    traits: ["Wise", "Calm", "Honorable", "Reliable"],
    color: "#4682B4",
    image: "./images/jimbei.jpg",
    emoji: "⚓"
  }
};