export interface NetilionAsset {
    serial_number: 'string';
    description: 'string';
    production_date: 'string';
    last_seen_at: 'string';
    id: number;
    ownership_claimed: boolean;
    created_at: 'string';
    updated_at: 'string';
    product: {
        id: number;
        href: 'string';
    };
    product_variant: {
        id: number;
        href: 'string';
    };
    parent: {
        id: number;
        href: 'string';
    };
    status: {
        id: number;
        href: 'string';
    };
    tenant: {
        id: number;
        href: 'string';
    };
    links: {
        documents: {
            href: 'string';
        };
        events: {
            href: 'string';
        };
        nodes: {
            href: 'string';
        };
        instrumentations: {
            href: 'string';
        };
        systems: {
            href: 'string';
        };
        pictures: {
            href: 'string';
        };
        specifications: {
            href: 'string';
        };
        subscriptions: {
            href: 'string';
        };
        api_subscriptions: {
            href: 'string';
        };
        health_conditions: {
            href: 'string';
        };
    };
}
