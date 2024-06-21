type CredentialObject = { id: string; pubkey: string; address: String };
type PassKeyObject = { name: string; credential: CredentialObject };
type TokenBalance = { denom: string; amount: number; usdValue: number };
type PriceData = { updated: number; prices: Map<string, number> };
type TokenAmount = { denom: string; amount: string };
type BetItem = {
  idx: number;
  title: string;
  description: string;
  minBet: TokenAmount;
  bidding_ends_at: string;
  options: string[];
};
type Voter = { bidder: string; amount: string; option: string };
type VotingOption = { name: string; voters: Voter[] };
export type {
  PassKeyObject,
  TokenBalance,
  PriceData,
  BetItem,
  Voter,
  VotingOption,
};
