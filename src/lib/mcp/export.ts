import { existsSync, mkdirSync, copyFileSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

export function getSchemasDir(): string {
	const HERE = dirname(fileURLToPath(import.meta.url));
	const candidates = [
		join(HERE, 'schemas'),
		join(HERE, '..', 'mcp', 'schemas'),
		join(HERE, '..', '..', 'src', 'lib', 'mcp', 'schemas'),
		join(process.cwd(), 'src', 'lib', 'mcp', 'schemas'),
		join(process.cwd(), 'dist', 'mcp', 'schemas')
	];
	for (const candidate of candidates) {
		if (existsSync(candidate)) return candidate;
	}
	throw new Error(`Schemas directory not found. Searched: ${candidates.join(', ')}`);
}

export function exportSchemas(targetDir: string): { created: number; dir: string } {
	const resolvedTarget = resolve(process.cwd(), targetDir);
	mkdirSync(resolvedTarget, { recursive: true });

	const schemasDir = getSchemasDir();
	const files = readdirSync(schemasDir);
	let created = 0;

	for (const file of files) {
		const srcFile = join(schemasDir, file);
		const destFile = join(resolvedTarget, file);
		copyFileSync(srcFile, destFile);
		created++;
	}

	return { created, dir: resolvedTarget };
}

export function installToAntigravity(): { success: boolean; dir: string } {
	const home = os.homedir();
	const agyMcpDir = join(home, '.gemini', 'antigravity', 'mcp', 'fractalstyler2');
	const agyConfigPath = join(home, '.gemini', 'antigravity', 'mcp_config.json');

	exportSchemas(agyMcpDir);

	// Update mcp_config.json if it exists or create it
	let config: any = { mcpServers: {} };
	if (existsSync(agyConfigPath)) {
		try {
			config = JSON.parse(readFileSync(agyConfigPath, 'utf8'));
		} catch {}
	}
	if (!config.mcpServers) config.mcpServers = {};

	config.mcpServers.fractalstyler2 = {
		command: 'node',
		args: [join(dirname(fileURLToPath(import.meta.url)), 'server.js')],
		env: {}
	};

	writeFileSync(agyConfigPath, JSON.stringify(config, null, 2), 'utf8');
	return { success: true, dir: agyMcpDir };
}

export function installToOpenCode(): { success: boolean; configPath: string } {
	const home = os.homedir();
	const ocConfigPath = join(home, '.config', 'opencode', 'opencode.json');

	if (existsSync(ocConfigPath)) {
		try {
			const config = JSON.parse(readFileSync(ocConfigPath, 'utf8'));
			if (!config.mcp) config.mcp = {};
			config.mcp.fractalstyler2 = {
				type: 'local',
				command: ['node', join(dirname(fileURLToPath(import.meta.url)), 'server.js')],
				enabled: true
			};
			writeFileSync(ocConfigPath, JSON.stringify(config, null, 2), 'utf8');
			return { success: true, configPath: ocConfigPath };
		} catch {}
	}
	return { success: false, configPath: ocConfigPath };
}
