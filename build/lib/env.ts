import { join, resolve } from '@std/path';

export const CONFIG_FILE = 'config.toml';

export const ROOT_DIR = resolve('.');
export const PUBLIC_DIR = join(ROOT_DIR, 'public');
