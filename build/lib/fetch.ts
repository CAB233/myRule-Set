import { Rule, SourceRuleSet } from './types.ts';

function filterGeoIpRules(rules: Rule[]): Rule[] {
    return rules
        .map((rule) => {
            const filteredRule: Rule = {};
            if (rule.ip_cidr) {
                filteredRule.ip_cidr = rule.ip_cidr;
            }
            if (rule.source_ip_cidr) {
                filteredRule.source_ip_cidr = rule.source_ip_cidr;
            }
            return filteredRule;
        })
        .filter((rule) => rule.ip_cidr || rule.source_ip_cidr);
}

async function fetchRuleSet(url: string): Promise<SourceRuleSet> {
    let response: Response;
    try {
        response = await fetch(url);
    } catch (error) {
        const e = error instanceof Error ? error.message : String(error);
        throw new Error(`[ERROR] ${url}: ${e}`);
    }

    if (!response.ok) {
        throw new Error(
            `[ERROR] ${url}: ${response.status}`,
        );
    }

    let data: unknown;
    try {
        data = await response.json();
    } catch {
        throw new Error(`[ERROR] 无法解析 JSON 文件`);
    }

    if (
        data && typeof data === 'object' &&
        Array.isArray((data as SourceRuleSet).rules)
    ) {
        return data as SourceRuleSet;
    } else {
        throw new Error(`[ERROR] 不存在 rules 数组`);
    }
}

export async function fetchRules(
    url: string,
    category?: string,
): Promise<Rule[]> {
    const data = await fetchRuleSet(url);
    if (category === 'geoip') {
        return filterGeoIpRules(data.rules);
    }
    return data.rules;
}
