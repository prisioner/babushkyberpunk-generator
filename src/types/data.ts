export type RollType = 'd6' | 'd66' | 'd66-range';

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
    rerollable: false;
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
