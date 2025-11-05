import { Rule } from './types.ts';

export function mergeDuplicateRules(rules: Rule[]): Rule[] {
    const allIpCidrs = new Set<string>();
    const allSourceIpCidrs = new Set<string>();
    for (const rule of rules) {
        if (rule.ip_cidr) {
            for (const cidr of rule.ip_cidr) {
                allIpCidrs.add(cidr);
            }
        }
        if (rule.source_ip_cidr) {
            for (const cidr of rule.source_ip_cidr) {
                allSourceIpCidrs.add(cidr);
            }
        }
    }

    const mergedRule: Rule = {};
    if (allIpCidrs.size > 0) {
        mergedRule.ip_cidr = Array.from(allIpCidrs).sort();
    }
    if (allSourceIpCidrs.size > 0) {
        mergedRule.source_ip_cidr = Array.from(allSourceIpCidrs).sort();
    }

    return Object.keys(mergedRule).length > 0 ? [mergedRule] : [];
}
