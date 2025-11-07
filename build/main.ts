import { join } from '@std/path';
import { assert } from '@std/assert';
import { parse } from '@std/toml';
import { deepMerge } from '@std/collections/deep-merge';

import { CONFIG_FILE, PUBLIC_DIR, ROOT_DIR } from './lib/env.ts';
import { Config, TomlSection } from './lib/types.ts';
import { fetchRules } from './lib/fetch.ts';

async function loadConfig(tomlFile: string): Promise<Config> {
    try {
        const tomlContent = await Deno.readTextFile(tomlFile);
        return parse(tomlContent) as Config;
    } catch (error) {
        console.error(`[ERROR] 无法读取或解析 ${tomlFile}`);
        console.error(error);
        throw new Error('无法读取或解析配置文件');
    }
}

// 负责处理单个 "section"，包括获取、合并和写入
async function processSection(
    category: string,
    name: string,
    section: TomlSection,
    version: number,
): Promise<boolean> {
    const outputFileName = `${category}-${name}.json`;
    console.log(`\n[INFO] 开始构建 ${outputFileName}`);

    if (!section.source || !Array.isArray(section.source)) {
        console.warn(
            `[WARN] [${category}.${name}] 中没有找到 'source' 数组, 已跳过`,
        );
        return true;
    }

    try {
        const fetchPromises = section.source.map((url) =>
            fetchRules(url, category)
        );
        const results = await Promise.all(fetchPromises);
        let allRules = results.flat();

        if (section.merge === true) {
            allRules = [
                allRules.reduce((acc, curr) =>
                    deepMerge(
                        acc as Record<string, unknown>,
                        curr as Record<string, unknown>,
                    ), {}),
            ];
        }

        const outputJson = {
            version: version,
            rules: allRules,
        };
        const outputPath = join(PUBLIC_DIR, outputFileName);
        await Deno.writeTextFile(
            outputPath,
            JSON.stringify(outputJson, null, 2),
        );

        console.log(`[INFO] 构建成功`);
        return true;
    } catch (error) {
        console.error(`[ERROR] 构建失败`);
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('捕获到一个未知的错误:', error);
        }
        return false;
    }
}

async function main() {
    const tomlFile = join(ROOT_DIR, CONFIG_FILE);
    let config: Config;

    try {
        config = await loadConfig(tomlFile);
    } catch {
        Deno.exit(1);
    }

    const version = config.version;
    console.log(`[INFO] 规则集版本: ${version}`);

    let hasError = false;

    for (const category of Object.keys(config)) {
        if (category === 'version') {
            continue;
        }

        const sections = config[category];
        assert(
            typeof sections === 'object' && sections !== null &&
                !Array.isArray(sections),
            '[ERROR] TOML 结构错误',
        );

        for (const name of Object.keys(sections)) {
            const section = sections[name] as TomlSection;
            const success = await processSection(
                category,
                name,
                section,
                version,
            );

            if (!success) {
                hasError = true;
            }
        }
    }

    if (hasError) {
        Deno.exit(1);
    }
}

await main();
