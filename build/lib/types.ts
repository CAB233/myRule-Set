export interface TomlSection {
    source: string[];
    merge?: boolean;
}

export type Config = {
    version: number;
    [category: string]: Record<string, TomlSection> | number;
};

export interface SourceRuleSet {
    rules: Rule[];
}

export interface Rule {
    query_type?: (string | number)[];
    network?: string[];
    domain?: string[];
    domain_suffix?: string[];
    domain_keyword?: string[];
    domain_regex?: string[];
    source_ip_cidr?: string[];
    ip_cidr?: string[];
    source_port?: number[];
    source_port_range?: string[];
    port?: number[];
    port_range?: string[];
    process_name?: string[];
    process_path?: string[];
    process_path_regex?: string[];
    package_name?: string[];
    network_type?: string[];
    network_is_expensive?: boolean;
    network_is_constrained?: boolean;
    network_interface_address?: Record<string, string[]>;
    default_interface_address?: string[];
    wifi_ssid?: string[];
    wifi_bssid?: string[];
    invert?: boolean;
    type?: string;
    mode?: string;
    rules?: Rule[];
}
