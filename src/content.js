/* ── Basel Supper Club — site content ──
   Prices, evenings, menus, cuisines, FAQ and gallery captions.
   Edit this file, commit, and CI redeploys the site. */

/* ═══════════ CONTENT — edit here ═══════════ */
var P_DINNER = 120, P_DRINKS = 150;

/* How many tiles each gallery shows. Real photos fill these first;
   whatever is left over renders as an "add a photo" placeholder. */
var FOOD_SLOTS = 30, GUEST_SLOTS = 5;

/* Payment links are deliberately NOT in this file. A seat is by invitation:
   a guest requests one, we decide, and we send the link by hand. Putting the
   links in the page would let anyone pay their way in.
   The links live in README.md under "Sending a payment link". */

var CUISINES = [
  { n:"01", flag:"jp", country:"Japan", icon:"bowl", title:"Ramen &amp; tantan",
    desc:"The bowl everything else is judged against. Noodles that actually bite back.",
    dishes:["Tantan","Shoyu ramen","Gyoza","Katsu","Chilli oil"] },
  { n:"02", flag:"in", country:"India", icon:"flame", title:"Curry &amp; tandoor",
    desc:"Nik's mother's recipes. Whole spices toasted and ground the same day, never a jar.",
    dishes:["Butter chicken","Lamb korma","Paneer","Dal","Naan"] },
  { n:"03", flag:"it", country:"Italy", icon:"wheat", title:"Pasta",
    desc:"Made here, not opened. Nobody rushes it.",
    dishes:["Rag\u00f9","Rigatoni","Carbonara","Focaccia"] },
  { n:"04", flag:"th", country:"Thailand", icon:"leaf", title:"Thai",
    desc:"Coconut, lime leaf, fresh chilli, and the balance that takes years to get right.",
    dishes:["Green curry","Tom kha","Pad thai","Som tam"] },
  { n:"05", flag:"cn", country:"China", icon:"dumpling", title:"Dumplings &amp; dim sum",
    desc:"Folded by hand at the counter while you drink. Usually the first thing on the table.",
    dishes:["Bao","Wontons","Dim sum","Stir fry"] },
  { n:"06", flag:"pl", country:"Poland", icon:"pot", title:"Ania's home table",
    desc:"Where she started, and the reason any of this happened. Cooked the way her family does it.",
    dishes:["Pierogi","\u017burek","Bigos","Sernik"] }
];

var FLAGS = {
  jp:'<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="5.6" fill="#BC002D"/>',
  in:'<rect width="30" height="6.67" fill="#FF9933"/><rect y="6.67" width="30" height="6.66" fill="#fff"/>'+
     '<rect y="13.33" width="30" height="6.67" fill="#138808"/><circle cx="15" cy="10" r="2.5" fill="none" stroke="#000080" stroke-width="0.7"/>',
  it:'<rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#CE2B37"/>',
  th:'<rect width="30" height="20" fill="#fff"/><rect width="30" height="3.33" fill="#A51931"/>'+
     '<rect y="16.67" width="30" height="3.33" fill="#A51931"/><rect y="6.67" width="30" height="6.66" fill="#2D2A4A"/>',
  cn:'<rect width="30" height="20" fill="#DE2910"/>'+
     '<path d="M7 3.3 7.75 5.47 10.04 5.51 8.22 6.9 8.88 9.09 7 7.78 5.12 9.09 5.78 6.9 3.96 5.51 6.25 5.47Z" fill="#FFDE00"/>'+
     '<circle cx="12.4" cy="3" r="0.75" fill="#FFDE00"/><circle cx="14.2" cy="5" r="0.75" fill="#FFDE00"/>'+
     '<circle cx="14.2" cy="7.7" r="0.75" fill="#FFDE00"/><circle cx="12.4" cy="9.6" r="0.75" fill="#FFDE00"/>',
  pl:'<rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#DC143C"/>'
};

var EVENINGS = [
  { id:"indian", n:"01", flag:"in", title:"Indian Night", when:"Friday 2 October 2026",
    dishes:["Paneer lababdar","Chicken tikka masala","Dal","Naan","Jeera rice","Gajar ka halwa"],
    sub:"Everything arrives together and stays on the table, the way it is actually eaten at home.",
    status:"open", statusText:"Booking open",
    menu:[
      { course:"To start",  dishes:[
        { name:"Paneer pakora",        photo:"paneer pakora" },
        { name:"Chicken pakora",       photo:"chicken pakora" },
        { name:"Mint sauce",           photo:"mint sauce" }
      ]},
      { course:"The table", dishes:[
        { name:"Paneer lababdar",      photo:"paneer lababdar" },
        { name:"Chicken tikka masala", photo:"chicken tikka masala" },
        { name:"Dal",                  photo:"daal" },
        { name:"Jeera rice",           photo:"jeera rice" },
        { name:"Naan",                 photo:"naan bread" },
        { name:"Raita",                photo:"kheera raita" }
      ]},
      { course:"Sweet",     dishes:[
        { name:"Gajar ka halwa",       photo:"gajar ka halwa" }
      ]}
    ],
    courses:[] },
  { id:"ramen", n:"02", flag:"jp", title:"Ramen Night", when:"Date announced soon",
    dishes:["Tantan","Shoyu ramen","Gyoza","Chilli oil","Black sesame ice"],
    sub:"Tantan, hand-folded gyoza, and a chilli oil that people ask to take home.",
    status:"soon", statusText:"Dates soon",
    courses:[] },

  { id:"pasta", n:"03", flag:"it", title:"Pasta Night", when:"Date announced soon",
    dishes:["Rag\u00f9","Rigatoni","Carbonara","Focaccia","Tiramis\u00f9"],
    sub:"Rigatoni with mushroom and parmesan, a ragù nobody rushed, and far too much bread.",
    status:"soon", statusText:"Dates soon",
    courses:[] },
  { id:"thai", n:"04", flag:"th", title:"Thai Night", when:"Date announced soon",
    dishes:["Green curry","Tom kha","Pad thai","Som tam","Mango sticky rice"],
    sub:"Coconut, lime leaf and fresh chilli. The evening with the most colour on the table.",
    status:"soon", statusText:"Dates soon",
    courses:[] }
];


/* Evenings we have actually cooked. Every one sold out at six seats. */
var PAST = [
  { date:"19 August 2026",  flag:"it", title:"Italian Night",  note:"Sold out \u00b7 6 seats" },
  { date:"21 July 2026",    flag:"jp", title:"Japanese Night", note:"Sold out \u00b7 6 seats" },
  { date:"3 July 2026",     flag:"in", title:"Indian Night",   note:"Sold out \u00b7 6 seats" }
];

/* Guests' own words, sent to us after the evening. Nothing here is edited. */
var REVIEWS = [
  "Such a lovely evening with Nik and Ania. I loved hearing the stories behind the food, especially the recipes from Nik\u2019s mum. There was always something else to try, and the conversation just kept going. We arrived not knowing the other guests and ended up chatting for hours. I\u2019d love to come back for another menu.",
  "What I enjoyed most was how relaxed it all felt. Nik and Ania sat and ate with us, so we got to know them as well as the other guests. The food was delicious, there was plenty of it, and nobody was in a hurry. It felt like being invited to a really good dinner party. Very happy we went.",
  "I came on my own and honestly wasn\u2019t sure what to expect, but I felt comfortable very quickly. With just a few people around the table, it was easy to join the conversation. I loved the Japanese food and getting to ask about how it was made. We laughed a lot, and I left really glad I\u2019d tried something different."
];

var TIMELINE = [
  ["19:00","<strong>Come in.</strong> There is a drink in your hand before your coat is off. If it is warm, this happens on the balcony."],
  ["19:30","<strong>Everyone sits.</strong> One table, eight people. We tell you what tonight is and where we picked it up, then get out of the way."],
  ["19:45","<strong>It begins.</strong> Whatever we have been folding, frying or pulling out of the oven at the counter. This is where the table stops being strangers."],
  ["21:00","<strong>The long middle.</strong> Dishes keep arriving and nobody counts them. The menu is set the week before and it is never the same twice."],
  ["22:00","<strong>The big one.</strong> Out of the pot, into the middle of the table, everyone reaching across each other."],
  ["22:45","<strong>Something sweet.</strong> Coffee, tea, and the story behind the dessert \u2014 usually the best story of the night."],
  ["23:30","<strong>Coats.</strong> We wrap up before midnight, so you get home at a reasonable hour and we get to do the washing up."]
];

var FAQ = [
  ["How many people are there?","Six to eight guests, one table, the two of us cooking. It's deliberately small — at eight people one conversation still works."],
  ["What does it cost?","CHF 120 per person for the whole evening of food, with a welcome drink, water, coffee and tea. CHF 150 per person if you want drinks poured all evening — wine, beer, gin and tonic, vodka mate and classic cocktails, no tab and no counting at the end. Everyone at the table chooses separately."],
  ["What kind of food is it?","It depends on the evening. Ramen, curry, pasta, Thai, gyoza, tacos. Each evening commits to one kitchen and goes deep rather than serving a bit of everything. The menu is always published before you book."],
  ["How many dishes are there?","As many as the night needs \u2014 we don't count courses. A ramen night is gyoza, a cold plate, the bowl itself and something sweet. An Indian night is butter chicken, korma, paneer, dal, naan and rice all arriving at once. We cook until the table is full and nobody leaves hungry."],
  ["How is the food served?","Everything comes to the middle of the table and you help yourself. It is the fastest way we know to make eight strangers stop being polite with each other."],
  ["Where is it?","Our flat in Basel. You get the exact address and directions with your confirmation, never before. It's a short walk from a tram and easy from Basel SBB."],
  ["I don't know anyone. Is that weird?","It's the normal way to come. Most people book one or two seats and arrive not knowing the rest of the table. With six to eight people there's one conversation, not several, and by the second course you'll have forgotten you were nervous."],
  ["How do I pay?","Not when you ask. Requesting a seat costs nothing — we read every request ourselves, and if there is room at that table we reply within 24 hours with a payment link. You pay by card, Apple Pay or Twint through Stripe, your seat is confirmed once that goes through, and the address follows straight after. We never see your card details."],
  ["What if I can't come?","Once you have paid, the seat is not refundable — the shopping is done and the table is built around who is coming. You can send someone else in your place though. Tell us their name in advance and we will look after them exactly the same."],
  ["I'm vegetarian / vegan / coeliac / don't eat pork.","Every menu has a full vegetarian version written from scratch, not the same plate with the meat removed. Vegan and gluten-free need a week's notice. No pork or halal on request, arranged in advance. Tell us when you book."],
  ["Is it spicy?","It's seasoned, which is different. Nothing goes out at a heat that hides the food, and there's always something on the table to cool it down. If your limit is low, say so and we'll adjust your plate."],
  ["Can I bring my own wine?","Yes, and there's no corkage. If you'd rather not think about it, take the CHF 150 and we'll pour all evening."],
  ["Can we book the whole table?","Yes — book all the seats and the evening is yours. Or ask about private dining and we'll come and cook at your place instead."],
  ["Do you do gift vouchers?","Yes, for any evening or any amount. Email us and we'll send you one."],
  ["What language is the evening in?","English, and German when the table prefers it. Between us we'll also happily switch to Polish or Hindi if that's where the table lands."]
];

var GALLERY = [
  ["hero2","Tantan with soft egg, greens and mince"],
  ["f0","Udon, two fried eggs, a lot of dill"],
  ["f6","Gyoza, folded by hand"],
  ["f1","Coconut curry with chicken and vegetables"],
  ["f4","Rigatoni, mushroom, parmesan"],
  ["f7","Chicken curry, straight out of the pan"],
  ["f2","Creamy udon with chilli threads"],
  ["f5","Spaghetti with basil"],
  ["f3","Satay udon with a fried egg"],
  ["f8","Prawn curry for the table"],
  ["f9","Noodles, egg, too much parmesan"],
  ["f10","Rice, chicken and a fried egg on top"],
  ["table1","Mezze and flatbread"],
  ["table2","Taco night"]
];

var ICONS = {
  bowl:'<path d="M3 11h18a9 9 0 0 1-18 0Z"/><path d="M7 11c0-3 2-4 2-6M12 11c0-3 2-4 2-6M17 11c0-2 1-3 1-4"/>',
  flame:'<path d="M12 3s5 4.5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 1.5 0 1-4-1-7.5Z"/>',
  dumpling:'<path d="M3 14a9 5 0 0 1 18 0Z"/><path d="M6 14c0-2 .8-3 1.6-3M10 14c0-2.5.8-3.5 1.6-3.5M14 14c0-2.5.8-3.5 1.6-3.5M18 14c0-2-.8-3-1.6-3"/>',
  wheat:'<path d="M12 21V9"/><path d="M12 9c-2 0-3.5-1.5-3.5-3.5C10.5 5.5 12 7 12 9ZM12 9c2 0 3.5-1.5 3.5-3.5C13.5 5.5 12 7 12 9ZM12 14c-2 0-3.5-1.5-3.5-3.5C10.5 10.5 12 12 12 14ZM12 14c2 0 3.5-1.5 3.5-3.5C13.5 10.5 12 12 12 14Z"/>',
  leaf:'<path d="M20 4C10 4 4 9 4 16c0 2 1 4 1 4s2-9 15-11c0 0-4 2-7 6"/>',
  pot:'<path d="M4 9h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4Z"/><path d="M2 9h20M8 6V4M12 5.5V3.5M16 6V4"/>'
};

/* Everything the site renders from. This is the file to edit. */
window.SITE = {
  P_DINNER: P_DINNER, P_DRINKS: P_DRINKS,
  FOOD_SLOTS: FOOD_SLOTS, GUEST_SLOTS: GUEST_SLOTS,
  CUISINES: CUISINES, FLAGS: FLAGS, EVENINGS: EVENINGS,
  TIMELINE: TIMELINE, FAQ: FAQ, GALLERY: GALLERY, ICONS: ICONS,
  PAST: PAST, REVIEWS: REVIEWS
};
