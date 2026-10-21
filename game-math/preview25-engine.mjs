/**
 * Preview 2.5 game-math reference engine.
 * Pure rules only: no DOM, storage, network, or real-money handling.
 * Virtual Play Coins are fictional and non-redeemable.
 */
export const POKER_CATEGORY = Object.freeze({
  HIGH_CARD: 0, ONE_PAIR: 1, TWO_PAIR: 2, THREE_OF_A_KIND: 3,
  STRAIGHT: 4, FLUSH: 5, FULL_HOUSE: 6, FOUR_OF_A_KIND: 7,
  STRAIGHT_FLUSH: 8,
});
const CATEGORY_NAMES = ["High card", "One pair", "Two pair", "Three of a kind", "Straight", "Flush", "Full house", "Four of a kind", "Straight flush"];
const SUITS = ["clubs", "diamonds", "hearts", "spades"];

function assert(condition, message) { if (!condition) throw new TypeError(message); }
function safePayout(value) {
  assert(Number.isSafeInteger(value) && value >= 0, "Payout exceeds safe integer precision.");
  return value;
}
function isIntegerBetween(value, min, max) { return Number.isInteger(value) && value >= min && value <= max; }
function cardKey(card) { return String(card.rank) + ":" + card.suit; }
function validateCard(card) {
  assert(card && isIntegerBetween(card.rank, 2, 14), "Card rank must be an integer from 2 through 14.");
  assert(SUITS.includes(card.suit), "Card suit must be clubs, diamonds, hearts, or spades.");
}
function validateUniqueCards(cards) {
  assert(Array.isArray(cards), "Cards must be an array.");
  cards.forEach(validateCard);
  const keys = cards.map(cardKey);
  assert(new Set(keys).size === keys.length, "Duplicate physical card detected.");
}
export function createDeck() {
  return SUITS.flatMap(suit => Array.from({ length: 13 }, (_, i) => ({ rank: i + 2, suit })));
}
export function shuffleDeck(random = Math.random) {
  assert(typeof random === "function", "Random source must be a function.");
  const deck = createDeck();
  for (let i = deck.length - 1; i > 0; i--) {
    const sample = random();
    assert(typeof sample === "number" && sample >= 0 && sample < 1, "Random source must return a number in [0, 1).");
    const j = Math.floor(sample * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
function straightHigh(ranks) {
  const unique = [...new Set(ranks)].sort((a, b) => b - a);
  if (unique.includes(14)) unique.push(1); // Ace-low wheel: A-2-3-4-5
  for (let i = 0; i <= unique.length - 5; i++) {
    let run = true;
    for (let j = 1; j < 5; j++) if (unique[i + j] !== unique[i] - j) run = false;
    if (run) return unique[i];
  }
  return 0;
}
function compareTuple(a, b) {
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    const delta = (a[i] ?? 0) - (b[i] ?? 0);
    if (delta) return Math.sign(delta);
  }
  return 0;
}
function evaluateFive(cards) {
  const ranks = cards.map(c => c.rank).sort((a, b) => b - a);
  const counts = new Map();
  for (const rank of ranks) counts.set(rank, (counts.get(rank) || 0) + 1);
  const groups = [...counts.entries()].sort((a, b) => b[1] - a[1] || b[0] - a[0]);
  const flush = cards.every(c => c.suit === cards[0].suit);
  const straight = straightHigh(ranks);
  let category, tie;
  if (flush && straight) { category = 8; tie = [straight]; }
  else if (groups[0][1] === 4) { category = 7; tie = [groups[0][0], groups[1][0]]; }
  else if (groups[0][1] === 3 && groups[1][1] === 2) { category = 6; tie = [groups[0][0], groups[1][0]]; }
  else if (flush) { category = 5; tie = ranks; }
  else if (straight) { category = 4; tie = [straight]; }
  else if (groups[0][1] === 3) { category = 3; tie = [groups[0][0], ...groups.slice(1).map(g => g[0]).sort((a, b) => b - a)]; }
  else if (groups[0][1] === 2 && groups[1][1] === 2) {
    const pairs = groups.filter(g => g[1] === 2).map(g => g[0]).sort((a, b) => b - a);
    category = 2; tie = [...pairs, groups.find(g => g[1] === 1)[0]];
  } else if (groups[0][1] === 2) {
    category = 1;
    tie = [groups[0][0], ...groups.filter(g => g[1] === 1).map(g => g[0]).sort((a, b) => b - a)];
  } else { category = 0; tie = ranks; }
  return { category, name: CATEGORY_NAMES[category], tiebreakers: tie };
}
function combinations(items, size, start = 0, chosen = [], out = []) {
  if (chosen.length === size) { out.push(chosen); return out; }
  for (let i = start; i <= items.length - (size - chosen.length); i++) combinations(items, size, i + 1, [...chosen, items[i]], out);
  return out;
}
export function evaluatePokerHand(cards) {
  assert(Array.isArray(cards) && cards.length >= 5 && cards.length <= 7, "Poker hand must contain 5, 6, or 7 cards.");
  validateUniqueCards(cards);
  let best = null;
  for (const five of combinations(cards, 5)) {
    const result = evaluateFive(five);
    if (!best || comparePokerHands(result, best) > 0) best = result;
  }
  return best;
}
export function comparePokerHands(a, b) {
  assert(a && Number.isInteger(a.category) && Array.isArray(a.tiebreakers), "First poker hand is invalid.");
  assert(b && Number.isInteger(b.category) && Array.isArray(b.tiebreakers), "Second poker hand is invalid.");
  return compareTuple([a.category, ...a.tiebreakers], [b.category, ...b.tiebreakers]);
}
export function blackjackTotal(cards) {
  assert(Array.isArray(cards) && cards.length > 0, "Blackjack hand must contain at least one card.");
  let total = 0, aces = 0;
  for (const card of cards) {
    const rank = typeof card === "number" ? card : card.rank;
    assert(isIntegerBetween(rank, 1, 14), "Blackjack card rank must be an integer from 1 through 14.");
    if (rank === 1 || rank === 14) { total += 11; aces++; }
    else total += Math.min(rank, 10);
  }
  while (total > 21 && aces > 0) { total -= 10; aces--; }
  return { total, soft: aces > 0, bust: total > 21, blackjack: cards.length === 2 && total === 21 };
}
/** Returns the total amount returned, including the original stake on wins/pushes. */
export function settleBlackjack({ playerCards, dealerCards, stake }) {
  assert(Number.isSafeInteger(stake) && stake > 0, "Stake must be a positive safe integer.");
  const player = blackjackTotal(playerCards), dealer = blackjackTotal(dealerCards);
  if (player.bust) return { outcome: "loss", payout: 0 };
  if (player.blackjack && !dealer.blackjack) return { outcome: "blackjack", payout: safePayout(stake + Math.floor(stake * 1.5)) };
  if (dealer.bust) return { outcome: "win", payout: safePayout(stake * 2) };
  if (dealer.blackjack && !player.blackjack) return { outcome: "loss", payout: 0 };
  if (player.total > dealer.total) return { outcome: "win", payout: safePayout(stake * 2) };
  if (player.total < dealer.total) return { outcome: "loss", payout: 0 };
  return { outcome: "push", payout: stake };
}
/**
 * Grid is rows x reels. Each payline lists a row index for each reel.
 * paytable[symbol][count] is an integer virtual-coin multiplier per line wager.
 * Wilds may substitute for a paytable symbol; only left-to-right consecutive matches pay.
 */
export function calculateSlotPayout({ grid, paylines, paytable, wagerPerLine, wildSymbol = "WILD" }) {
  assert(Array.isArray(grid) && grid.length > 0 && Array.isArray(grid[0]) && grid[0].length > 0, "Slot grid must be a non-empty rectangular array.");
  const reels = grid[0].length;
  assert(grid.every(row => Array.isArray(row) && row.length === reels), "Slot grid rows must have equal lengths.");
  assert(Array.isArray(paylines) && paylines.length > 0, "At least one payline is required.");
  assert(paylines.every(line => Array.isArray(line) && line.length === reels && line.every(r => Number.isInteger(r) && r >= 0 && r < grid.length)), "Each payline must provide a valid row for every reel.");
  assert(Number.isSafeInteger(wagerPerLine) && wagerPerLine > 0, "Wager per line must be a positive safe integer.");
  assert(paytable && typeof paytable === "object", "Paytable is required.");
  let payout = 0;
  const wins = [];
  for (let lineIndex = 0; lineIndex < paylines.length; lineIndex++) {
    const symbols = paylines[lineIndex].map((row, reel) => grid[row][reel]);
    let best = null;
    for (const symbol of Object.keys(paytable)) {
      const schedule = paytable[symbol];
      let count = 0;
      for (const actual of symbols) {
        if (actual === symbol || actual === wildSymbol || (symbol === wildSymbol && actual === wildSymbol)) count++;
        else break;
      }
      const multiplier = schedule[count];
      if (count >= 3 && Number.isSafeInteger(multiplier) && multiplier > 0) {
        const candidate = { line: lineIndex, symbol, count, amount: wagerPerLine * multiplier };
        if (!best || candidate.amount > best.amount) best = candidate;
      }
    }
    if (best) { payout += best.amount; wins.push(best); }
  }
  assert(Number.isSafeInteger(payout), "Calculated slot payout exceeds safe integer precision.");
  return { payout, wins };
}
/** Pure, idempotent virtual-wallet settlement helper for tests and reference integration. */
export function settleVirtualRound({ balance, wager, payout, roundId, settledRoundIds = [] }) {
  for (const [name, value] of Object.entries({ balance, wager, payout })) {
    assert(Number.isSafeInteger(value) && value >= 0, name + " must be a non-negative safe integer.");
  }
  assert(wager > 0, "Wager must be positive.");
  assert(typeof roundId === "string" && roundId.trim().length > 0, "roundId is required.");
  assert(Array.isArray(settledRoundIds) && settledRoundIds.every(id => typeof id === "string"), "settledRoundIds must be an array of strings.");
  if (settledRoundIds.includes(roundId)) {
    return { balance, settledRoundIds: [...settledRoundIds], duplicate: true, delta: 0 };
  }
  assert(wager <= balance, "Insufficient virtual balance.");
  const nextBalance = balance - wager + payout;
  assert(Number.isSafeInteger(nextBalance) && nextBalance >= 0, "Settlement would create an invalid balance.");
  return { balance: nextBalance, settledRoundIds: [...settledRoundIds, roundId], duplicate: false, delta: payout - wager };
}
