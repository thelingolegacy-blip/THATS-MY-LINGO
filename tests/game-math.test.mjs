import test from "node:test";
import assert from "node:assert/strict";
import {
  POKER_CATEGORY, createDeck, shuffleDeck, evaluatePokerHand, comparePokerHands,
  blackjackTotal, settleBlackjack, calculateSlotPayout, settleVirtualRound
} from "../game-math/preview25-engine.mjs";

const card = (rank, suit) => ({ rank, suit });
const hand = (...cards) => evaluatePokerHand(cards);
const ranks = (result) => result.tiebreakers;

test("52-card deck is unique; shuffle preserves all cards and never duplicates a physical card", () => {
  const deck = createDeck();
  assert.equal(deck.length, 52);
  assert.equal(new Set(deck.map(c => `${c.rank}:${c.suit}`)).size, 52);
  let n = 0;
  const shuffled = shuffleDeck(() => ((n++ * 17) % 53) / 53);
  assert.equal(shuffled.length, 52);
  assert.deepEqual([...shuffled.map(c => `${c.rank}:${c.suit}`)].sort(), [...deck.map(c => `${c.rank}:${c.suit}`)].sort());
  assert.throws(() => hand(card(14,"spades"),card(14,"spades"),card(2,"clubs"),card(3,"clubs"),card(4,"clubs")), /Duplicate physical card/);
});

test("all nine poker categories rank in the correct order", () => {
  const hands = [
    hand(card(14,"clubs"),card(11,"diamonds"),card(9,"spades"),card(6,"hearts"),card(3,"clubs")),
    hand(card(2,"clubs"),card(2,"diamonds"),card(14,"spades"),card(9,"hearts"),card(5,"clubs")),
    hand(card(3,"clubs"),card(3,"diamonds"),card(8,"spades"),card(8,"hearts"),card(14,"clubs")),
    hand(card(7,"clubs"),card(7,"diamonds"),card(7,"spades"),card(14,"hearts"),card(2,"clubs")),
    hand(card(2,"clubs"),card(3,"diamonds"),card(4,"spades"),card(5,"hearts"),card(6,"clubs")),
    hand(card(2,"hearts"),card(5,"hearts"),card(8,"hearts"),card(11,"hearts"),card(13,"hearts")),
    hand(card(4,"clubs"),card(4,"diamonds"),card(4,"spades"),card(9,"clubs"),card(9,"hearts")),
    hand(card(10,"clubs"),card(10,"diamonds"),card(10,"spades"),card(10,"hearts"),card(2,"clubs")),
    hand(card(9,"hearts"),card(10,"hearts"),card(11,"hearts"),card(12,"hearts"),card(13,"hearts"))
  ];
  assert.deepEqual(hands.map(h => h.category), [0,1,2,3,4,5,6,7,8]);
  for (let i = 1; i < hands.length; i++) assert.equal(comparePokerHands(hands[i], hands[i-1]), 1);
  assert.equal(POKER_CATEGORY.STRAIGHT_FLUSH, 8);
});

test("poker kickers break pair and two-pair ties", () => {
  const pairA = hand(card(12,"clubs"),card(12,"diamonds"),card(14,"spades"),card(9,"hearts"),card(3,"clubs"));
  const pairB = hand(card(12,"hearts"),card(12,"spades"),card(13,"spades"),card(9,"clubs"),card(3,"diamonds"));
  assert.equal(comparePokerHands(pairA, pairB), 1);
  assert.equal(comparePokerHands(pairA, pairA), 0);
  assert.throws(() => comparePokerHands({ category: 9, tiebreakers: [14] }, pairA), /category must be an integer from 0 through 8/);
  assert.throws(() => comparePokerHands({ category: 1, tiebreakers: [14, 1] }, pairA), /tiebreakers must contain/);
  const twoPairA = hand(card(14,"clubs"),card(14,"diamonds"),card(5,"spades"),card(5,"hearts"),card(13,"clubs"));
  const twoPairB = hand(card(14,"hearts"),card(14,"spades"),card(5,"clubs"),card(5,"diamonds"),card(12,"clubs"));
  assert.equal(comparePokerHands(twoPairA, twoPairB), 1);
});

test("ace-low straight is five-high and loses to a six-high straight", () => {
  const wheel = hand(card(14,"clubs"),card(2,"diamonds"),card(3,"spades"),card(4,"hearts"),card(5,"clubs"));
  const sixHigh = hand(card(2,"clubs"),card(3,"diamonds"),card(4,"spades"),card(5,"hearts"),card(6,"clubs"));
  assert.equal(wheel.category, POKER_CATEGORY.STRAIGHT);
  assert.deepEqual(ranks(wheel), [5]);
  assert.equal(comparePokerHands(sixHigh, wheel), 1);
});

test("seven-card poker selects the best five-card hand", () => {
  const best = hand(card(14,"clubs"),card(14,"diamonds"),card(14,"spades"),card(14,"hearts"),card(2,"clubs"),card(3,"diamonds"),card(4,"spades"));
  assert.equal(best.category, POKER_CATEGORY.FOUR_OF_A_KIND);
  assert.deepEqual(best.tiebreakers, [14,4]);
});

test("blackjack totals handle multiple aces, soft totals, and busts", () => {
  assert.deepEqual(blackjackTotal([14, 9]), { total: 20, soft: true, bust: false, blackjack: false });
  assert.deepEqual(blackjackTotal([14, 14, 9]), { total: 21, soft: true, bust: false, blackjack: false });
  assert.deepEqual(blackjackTotal([10, 8, 7]), { total: 25, soft: false, bust: true, blackjack: false });
  assert.equal(blackjackTotal([14, 13]).blackjack, true);
});

test("blackjack settlement covers natural, win, loss, push, and bust", () => {
  assert.deepEqual(settleBlackjack({ playerCards:[14,13], dealerCards:[10,9], stake:10 }), { outcome:"blackjack", payout:25 });
  assert.deepEqual(settleBlackjack({ playerCards:[10,9], dealerCards:[10,8], stake:10 }), { outcome:"win", payout:20 });
  assert.deepEqual(settleBlackjack({ playerCards:[10,7,8], dealerCards:[10,8], stake:10 }), { outcome:"loss", payout:0 });
  assert.deepEqual(settleBlackjack({ playerCards:[10,8], dealerCards:[9,9], stake:10 }), { outcome:"push", payout:10 });
  assert.deepEqual(settleBlackjack({ playerCards:[10,8,5], dealerCards:[10,8], stake:10 }), { outcome:"loss", payout:0 });
  assert.throws(() => settleBlackjack({ playerCards:[14,13], dealerCards:[10,9], stake:Number.MAX_SAFE_INTEGER }), /Payout exceeds safe integer precision/);
  assert.throws(() => settleBlackjack({ playerCards:[10,9], dealerCards:[10,8], stake:Number.MAX_SAFE_INTEGER }), /Payout exceeds safe integer precision/);
});

test("slot payout is deterministic, left-to-right, wild-aware, and multiplies wager per line", () => {
  const paytable = { CHERRY:{3:2,4:5,5:10}, LEMON:{3:1,4:3,5:6}, WILD:{3:3,4:8,5:20} };
  const grid = [
    ["CHERRY","CHERRY","WILD","LEMON","LEMON"],
    ["LEMON","LEMON","LEMON","LEMON","LEMON"],
    ["CHERRY","WILD","CHERRY","CHERRY","CHERRY"]
  ];
  const paylines = [[0,0,0,0,0],[1,1,1,1,1],[2,2,2,2,2]];
  const result = calculateSlotPayout({ grid, paylines, paytable, wagerPerLine:2 });
  assert.equal(result.payout, 2*2 + 2*6 + 2*10);
  assert.equal(result.wins.length, 3);
  assert.equal(calculateSlotPayout({ grid, paylines:[ [0,0,0,0,0] ], paytable, wagerPerLine:1 }).payout, 2);
});

test("virtual wallet rejects overspending and invalid amounts, and repeated settlement is idempotent", () => {
  assert.throws(() => settleVirtualRound({ balance:5, wager:6, payout:0, roundId:"r1" }), /Insufficient virtual balance/);
  assert.throws(() => settleVirtualRound({ balance:5, wager:-1, payout:0, roundId:"r1" }), /wager must be a non-negative safe integer/);
  const first = settleVirtualRound({ balance:100, wager:10, payout:25, roundId:"r1" });
  assert.deepEqual(first, { balance:115, settledRoundIds:["r1"], duplicate:false, delta:15 });
  const retry = settleVirtualRound({ balance:first.balance, wager:10, payout:25, roundId:"r1", settledRoundIds:first.settledRoundIds });
  assert.deepEqual(retry, { balance:115, settledRoundIds:["r1"], duplicate:true, delta:0 });
});

test("repeated rounds preserve balance invariants and never permit negative balances", () => {
  let state = { balance:100, settledRoundIds:[] };
  for (let i=0; i<100; i++) {
    const wager = Math.min(3, state.balance);
    if (!wager) break;
    const payout = i % 4 === 0 ? 8 : i % 4 === 1 ? 0 : i % 4 === 2 ? 3 : 1;
    state = settleVirtualRound({ balance:state.balance, wager, payout, roundId:`round-${i}`, settledRoundIds:state.settledRoundIds });
    assert.ok(Number.isSafeInteger(state.balance));
    assert.ok(state.balance >= 0);
    assert.equal(new Set(state.settledRoundIds).size, state.settledRoundIds.length);
  }
});

test("invalid poker inputs and malformed slot grids fail closed", () => {
  assert.throws(() => hand(card(14,"clubs"),card(2,"diamonds"),card(3,"spades"),card(4,"hearts")), /5, 6, or 7/);
  assert.throws(() => calculateSlotPayout({ grid:[["A","B"],["A"]], paylines:[[0,0]], paytable:{A:{2:1}}, wagerPerLine:1 }), /equal lengths/);
});
