export interface LhtrpgCharacter {
  name: string;
  character_rank: number;
  level: string;
  player_name: string;
  race: string;
  archetype: string;
  main_job: string;
  sub_job: string;
  gender: string;
  tags: string[];
  remarks: any;
  max_hitpoint: number;
  effect: number;
  action: number;
  move: number;
  range: string;
  heal_power: number;
  physical_attack: number;
  magic_attack: number;
  physical_defense: number;
  magic_defense: number;
  str_basic_value: number;
  dex_basic_value: number;
  pow_basic_value: number;
  int_basic_value: number;
  str_value: number;
  dex_value: number;
  pow_value: number;
  int_value: number;
  abl_motion: string;
  abl_durability: string;
  abl_dismantle: string;
  abl_operate: string;
  abl_sense: string;
  abl_negotiate: string;
  abl_knowledge: string;
  abl_analyze: string;
  abl_avoid: string;
  abl_resist: string;
  abl_hit: string;
  creed_name: string;
  creed: string;
  creed_tag: string;
  creed_detail: string;
  connections: Connection[];
  unions: Union[];
  hand1?: Hand1;
  hand2?: Hand2;
  armor?: Armor;
  support_item1?: SupportItem1;
  support_item2?: SupportItem2;
  support_item3?: SupportItem3;
  bag?: Bag;
  item_slot_size: number;
  items: (Item | null)[];
  gold: number;
  style_skill_name: string;
  skills: Skill[];
  image_url: string;
  sheet_url: string;
}

export interface Connection {
  name: string;
  tags: string[];
  detail: string;
}

export interface Union {
  name: string;
  tags: any[];
  detail: any;
}

export interface Hand1 {
  type: string;
  item_rank: number;
  name: string;
  alias: string;
  physical_attack: number;
  magic_attack: number;
  physical_defense: number;
  magic_defense: number;
  hit: number;
  action: number;
  range: string;
  timing: string;
  target: string;
  roll: string;
  price: number;
  function: string;
  tags: string[];
  recipe: any;
  prefix_function: string;
  slot_size: any;
  id: number;
}

export interface Hand2 {
  type: string;
  item_rank: number;
  name: string;
  alias: string;
  physical_attack: number;
  magic_attack: number;
  physical_defense: number;
  magic_defense: number;
  hit: number;
  action: number;
  range: string;
  timing: string;
  target: string;
  roll: string;
  price: number;
  function: string;
  tags: string[];
  recipe: any;
  prefix_function: string;
  slot_size: any;
  id: number;
}

export interface Armor {
  type: string;
  item_rank: number;
  name: string;
  alias: string;
  physical_attack: number;
  magic_attack: number;
  physical_defense: number;
  magic_defense: number;
  hit: number;
  action: number;
  range: string;
  timing: string;
  target: string;
  roll: string;
  price: number;
  function: string;
  tags: string[];
  recipe: string;
  prefix_function: any;
  slot_size: any;
  id: number;
}

export interface SupportItem1 {
  type: string;
  item_rank: number;
  name: string;
  alias: string;
  physical_attack: number;
  magic_attack: number;
  physical_defense: number;
  magic_defense: number;
  hit: number;
  action: number;
  range: string;
  timing: string;
  target: string;
  roll: string;
  price: number;
  function: string;
  tags: string[];
  recipe: any;
  prefix_function: string;
  slot_size: any;
  id: number;
}

export interface SupportItem2 {
  type: string;
  item_rank: number;
  name: string;
  alias: string;
  physical_attack: number;
  magic_attack: number;
  physical_defense: number;
  magic_defense: number;
  hit: number;
  action: number;
  range: string;
  timing: string;
  target: string;
  roll: string;
  price: number;
  function: string;
  tags: string[];
  recipe: string;
  prefix_function: any;
  slot_size: any;
  id: number;
}

export interface SupportItem3 {
  type: string;
  item_rank: number;
  name: string;
  alias: string;
  physical_attack: number;
  magic_attack: number;
  physical_defense: number;
  magic_defense: number;
  hit: number;
  action: number;
  range: string;
  timing: string;
  target: string;
  roll: string;
  price: number;
  function: string;
  tags: string[];
  recipe: any;
  prefix_function: string;
  slot_size: any;
  id: number;
}

export interface Bag {
  type: string;
  item_rank: number;
  name: string;
  alias: string;
  physical_attack: number;
  magic_attack: number;
  physical_defense: number;
  magic_defense: number;
  hit: number;
  action: number;
  range: string;
  timing: string;
  target: string;
  roll: string;
  price: number;
  function: string;
  tags: string[];
  recipe: any;
  prefix_function: string;
  slot_size: number;
  id: number;
}

export interface Item {
  type: string;
  item_rank: number;
  name: string;
  alias: string;
  physical_attack: number;
  magic_attack: number;
  physical_defense: number;
  magic_defense: number;
  hit: number;
  action: number;
  range: string;
  timing: string;
  target: string;
  roll: string;
  price: number;
  function: string;
  tags: string[];
  recipe: any;
  prefix_function?: string;
  slot_size: any;
  id: number;
}

export interface Skill {
  job_type: string;
  type: string;
  name: string;
  skill_rank: number;
  skill_max_rank: number;
  timing: string;
  roll: string;
  target: string;
  range: string;
  cost: string;
  post: string;
  limit: string;
  tags: string[];
  function: string;
  explain: string;
  id: number;
}

export const fetchLhtrpgData = async (id: string): Promise<LhtrpgCharacter> => {
  const res = await fetch(`https://lhrpg.com/lhz/api/${id}.json`);
  if (!res.ok) throw new Error("キャラクター情報の取得に失敗しました");
  const characterData = await res.json();

  return characterData;
};
