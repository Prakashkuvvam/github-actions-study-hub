declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"study": {
"caching-artifacts/index.md": {
	id: "caching-artifacts/index.md";
  slug: "caching-artifacts";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"custom-actions/index.md": {
	id: "custom-actions/index.md";
  slug: "custom-actions";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"debugging/index.md": {
	id: "debugging/index.md";
  slug: "debugging";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"environments/index.md": {
	id: "environments/index.md";
  slug: "environments";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"foundations/index.md": {
	id: "foundations/index.md";
  slug: "foundations";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"job-control/index.md": {
	id: "job-control/index.md";
  slug: "job-control";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"practice-exams/index.md": {
	id: "practice-exams/index.md";
  slug: "practice-exams";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"reusable-workflows/index.md": {
	id: "reusable-workflows/index.md";
  slug: "reusable-workflows";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"secrets-vars/index.md": {
	id: "secrets-vars/index.md";
  slug: "secrets-vars";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"security-oidc/index.md": {
	id: "security-oidc/index.md";
  slug: "security-oidc";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"self-hosted-runners/index.md": {
	id: "self-hosted-runners/index.md";
  slug: "self-hosted-runners";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
"triggers/index.md": {
	id: "triggers/index.md";
  slug: "triggers";
  body: string;
  collection: "study";
  data: InferEntrySchema<"study">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = typeof import("../../src/content/config.js");
}
