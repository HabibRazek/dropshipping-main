interface Order {
    id: number;
    parent_id: number;
    status: string;
    currency: string;
    version: string;
    prices_include_tax: boolean;
    date_created: string;
    date_modified: string;
    discount_total: string;
    discount_tax: string;
    shipping_total: string;
    shipping_tax: string;
    cart_tax: string;
    total: string;
    total_tax: string;
    customer_id: number;
    order_key: string;
    billing: Billing;
    shipping: Shipping;
    payment_method: string;
    payment_method_title: string;
    transaction_id: string;
    customer_ip_address: string;
    customer_user_agent: string;
    created_via: string;
    customer_note: string;
    date_completed: null | string;
    date_paid: null | string;
    cart_hash: string;
    number: string;
    meta_data: MetaData[];
    line_items: LineItem[];
    tax_lines: any[];
    shipping_lines: any[];
    fee_lines: any[];
    coupon_lines: any[];
    refunds: any[];
    payment_url: string;
    is_editable: boolean;
    needs_payment: boolean;
    needs_processing: boolean;
    date_created_gmt: string;
    date_modified_gmt: string;
    date_completed_gmt: null | string;
    date_paid_gmt: null | string;
    gift_cards: any[];
    currency_symbol: string;
    _links: Links;
}

interface Billing {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    email: string;
    phone: string;
}

interface Shipping {
    first_name: string;
    last_name: string;
    company: string;
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
}

interface MetaData {
    id: number;
    key: string;
    value: string | number;
}

interface LineItem {
    id: number;
    name: string;
    product_id: number;
    variation_id: number;
    quantity: number;
    tax_class: string;
    subtotal: string;
    subtotal_tax: string;
    total: string;
    total_tax: string;
    taxes: any[];
    meta_data: any[];
    sku: string;
    price: number;
    image: Image;
    parent_name: null | string;
    bundled_by: string;
    bundled_item_title: string;
    bundled_items: any[];
}

interface Image {
    id: string;
    src: string;
}

interface Links {
    self: Link[];
    collection: Link[];
}

interface Link {
    href: string;
}



export type { Order, Billing, Shipping, MetaData, LineItem, Image, Links, Link };
