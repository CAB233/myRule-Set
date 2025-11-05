import { Rule, SourceRuleSet } from './types.ts';

export async function fetchRules(
    url: string,
    category?: string,
): Promise<Rule[]> {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`[ERROR] ${url}: ${response.statusText}`);
        throw new Error(`[ERROR] ${url}: ${response.statusText}`);
    }
    const data = await response.json() as SourceRuleSet;
    if (data && Array.isArray(data.rules)) {
        if (category === 'geoip') {
            return data.rules.map((rule) => {
                const filteredRule: Rule = {};
                if (rule.ip_cidr) {
                    filteredRule.ip_cidr = rule.ip_cidr;
                }
                if (rule.source_ip_cidr) {
                    filteredRule.source_ip_cidr = rule.source_ip_cidr;
                }
                return filteredRule;
            }).filter((rule) => rule.ip_cidr || rule.source_ip_cidr);
        }
        return data.rules;
    } else {
        console.error(`[ERROR] ${url}：没有找到 'rules' 数组`);
        throw new Error(`[ERROR] ${url}：没有找到 'rules' 数组`);
    }
}
