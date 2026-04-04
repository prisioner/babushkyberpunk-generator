export type RollType = 'd6' | 'd66' | 'd66-range';
export type D6Value = 1 | 2 | 3 | 4 | 5 | 6;

export type HighlightKind =
    | 'stat'
    | 'advantage'
    | 'disadvantage'
    | 'crit_success'
    | 'crit_fail'
    | 'gm_move';

export type StatId = 'hardening' | 'wits' | 'computers' | 'authority';

export interface Highlight {
    text: string;
    kind: HighlightKind;
    statId?: StatId;
}

export interface BaseEntry {
    label: string;
    description?: string;
    highlights?: Highlight[];
}

export interface KeyedEntry extends BaseEntry {
    key: string;
}

export interface HairColorEntry extends KeyedEntry {
    color: string;
}

export interface RangedEntry extends BaseEntry {
    range: [number, number];
}

export interface SubtableLinkedEntry extends KeyedEntry {
    subtableId: string;
}

export interface BaseTable {
    id: string;
    title: string;
    roll: RollType;
}

export interface D6Table extends BaseTable {
    roll: 'd6';
    entries: KeyedEntry[];
}

export interface HairColorTable extends D6Table {
    id: 'hair_color';
    entries: HairColorEntry[];
}

export interface D66Table extends BaseTable {
    roll: 'd66';
    entries: KeyedEntry[];
}

export interface D66RangeTable extends BaseTable {
    roll: 'd66-range';
    entries: RangedEntry[];
}

export type RollTable = D6Table | D66Table | D66RangeTable;

export interface EnemyTypeTable extends BaseTable {
    id: 'enemy_type';
    roll: 'd6';
    entries: SubtableLinkedEntry[];
}

export type AdventureTable = RollTable | EnemyTypeTable;

export interface CharacterTablesFile {
    tables: RollTable[];
}

export interface AdventureTablesFile {
    tables: AdventureTable[];
}

export interface SongsTableFile {
    id: string;
    title: string;
    roll: 'd6';
    entries: KeyedEntry[];
}

export interface D6RollResult {
    value: D6Value;
    key: string;
}

export interface D66RollResult {
    firstDie: D6Value;
    secondDie: D6Value;
    key: string;
}

export interface RolledD6TableResult<TEntry extends KeyedEntry = KeyedEntry> {
    roll: D6RollResult;
    entry: TEntry;
}

export interface RolledD66TableResult<TEntry extends KeyedEntry = KeyedEntry> {
    roll: D66RollResult;
    entry: TEntry;
}

export interface RolledD66RangeTableResult<TEntry extends RangedEntry = RangedEntry> {
    roll: D66RollResult;
    entry: TEntry;
}

export interface GeneratedCharacterName {
    fullName: string;
    firstName: RolledD6TableResult;
    patronymic: RolledD6TableResult;
}

export type GeneratedCharacterStats = Record<StatId, number>;

export interface GeneratedCharacter {
    hairColor: RolledD6TableResult;
    name: GeneratedCharacterName;
    flaw: RolledD6TableResult;
    past: RolledD66RangeTableResult;
    signatureMove: RolledD66RangeTableResult;
    veshch: RolledD66RangeTableResult;
    stats: GeneratedCharacterStats;
}

export interface GeneratedEnemies {
    appearance: RolledD6TableResult;
    type: RolledD6TableResult<SubtableLinkedEntry>;
    subtype: RolledD6TableResult;
}

export interface GeneratedScene {
    location: RolledD66TableResult;
    technology: RolledD66TableResult;
    enemies: GeneratedEnemies;
}

export interface GeneratedAdventure {
    hook: RolledD66TableResult;
    scenes: GeneratedScene[];
}

export type CharacterFieldType =
    | 'rolled'
    | 'computed'
    | 'derived'
    | 'manual-distribution';

export interface DisplayConfig {
    style?: string;
}

export interface ComputedCharacterField {
    id: string;
    title: string;
    type: 'computed';
    rerollable: boolean;
    computedFrom: string[];
    display?: DisplayConfig;
}

export interface DerivedCharacterField {
    id: string;
    title: string;
    type: 'derived';
    rerollable: boolean;
    derivedFrom: string[];
    display?: DisplayConfig;
}

export interface RolledCharacterField {
    id: string;
    title: string;
    type: 'rolled';
    tableId: string;
    rerollable: boolean;
    display?: DisplayConfig;
}

export interface ManualDistributionRules {
    stats: StatId[];
    minPerStat: number;
    maxPerStat: number;
    totalPoints: number;
}

export interface ManualDistributionCharacterField {
    id: string;
    title: string;
    type: 'manual-distribution';
    rerollable: boolean;
    rules: ManualDistributionRules;
    display?: DisplayConfig;
}

export type CharacterResultField =
    | ComputedCharacterField
    | DerivedCharacterField
    | RolledCharacterField
    | ManualDistributionCharacterField;

export interface CharacterSchemaFile {
    generatorId: 'character';
    title: string;
    resultFields: CharacterResultField[];
    tableTabs: string[];
}

export interface AdventureHookConfig {
    tableId: string;
    rerollable: boolean;
}

export interface AdventureEnemiesBlueprint {
    appearanceTableId: string;
    typeTableId: string;
    rerollable: boolean;
}

export interface AdventureSceneFieldConfig {
    tableId: string;
    rerollable: boolean;
}

export interface AdventureSceneBlueprint {
    location: AdventureSceneFieldConfig;
    technology: AdventureSceneFieldConfig;
    enemies: AdventureEnemiesBlueprint;
}

export interface AdventureSchemaFile {
    generatorId: 'adventure';
    title: string;
    hook: AdventureHookConfig;
    sceneCount: number;
    sceneBlueprint: AdventureSceneBlueprint;
    tableTabs: string[];
}
