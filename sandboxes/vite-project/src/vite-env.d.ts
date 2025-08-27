/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly CUSTOM: number[];
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
