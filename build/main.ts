import { join } from '@std/path';
import { assert } from '@std/assert';
import { parse } from '@std/toml';

import { CONFIG_FILE, PUBLIC_DIR, ROOT_DIR } from './lib/env.ts';
import { Config, TomlSection } from './lib/types.ts';
import { fetchRules } from './lib/fetch.ts';
//import { mergeDuplicateRules } from './lib/merge.ts';

async function main() {
    const tomlFile = join(ROOT_DIR, CONFIG_FILE);
    let hasError = false;
    let config: Config;

    try {
        const tomlContent = await Deno.readTextFile(tomlFile);
        config = parse(tomlContent) as Config;
    } catch {
        console.error(`[ERROR] 无法读取或解析 ${tomlFile}`);
        return;
    }

    const version = config.version;
    console.log(`[INFO] 规则集版本: ${version}`);

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
            const outputFileName = `${category}-${name}.json`;
            console.log(
                `\n[INFO] 构建 ${outputFileName}`,
            );
            if (!section.source || !Array.isArray(section.source)) {
                console.warn(
                    `[WARN] ${category}.${name}：没有找到 'source' 数组`,
                );
                continue;
            }

            try {
                const fetchPromises = section.source.map((url) =>
                    fetchRules(url, category)
                );
                const results = await Promise.all(fetchPromises);
                const allRules = results.flat();
                //let allRules = results.flat();
                //if (section.merge === true) {
                //    allRules = mergeDuplicateRules(allRules);
                //}
                const outputJson = {
                    version: version,
                    rules: allRules,
                };
                const outputPath = join(PUBLIC_DIR, outputFileName);
                await Deno.writeTextFile(
                    outputPath,
                    JSON.stringify(outputJson, null, 2),
                );
                console.log(
                    `[INFO] 构建成功`,
                );
            } catch {
                hasError = true;
                console.error(`[ERROR] 构建失败`);
            }
        }
    }
    if (hasError) {
        Deno.exit(1);
    }
}

await main();
