const COIN_DETAILS = {
    id: null,
    symbol: null,
    name: null,
    asset_platform_id: null,
    platforms: {},
    block_time_in_minutes: null,
    hashing_algorithm: null,
    categories: [],
    public_notice: null,
    additional_notices: [],
    localization: {},
    description: {},
    links: {},
    image: {},
    country_origin: null,
    genesis_date: null,
    contract_address: null,
    sentiment_votes_up_percentage: 0,
    sentiment_votes_down_percentage: 0,
    market_cap_rank: 0,
    coingecko_rank: 0,
    coingecko_score: 0,
    developer_score: 0,
    community_score: 0,
    liquidity_score: 0,
    public_interest_score: 0,
    market_data: {},
    community_data: {},
    public_interest_stats: {},
    status_updates: null,
    last_updated: [],
    //tickers: []
};

const COIN_MARKETS = {
    id: null,
    symbol: null,
    name: null,
    image: null,
    current_price: 0,
    market_cap: 0,
    market_cap_rank: 0,
    fully_diluted_valuation: 0,
    total_volume: 0,
    high_24h: 0,
    low_24h: 0,
    price_change_24h: 0,
    price_change_percentage_24h: 0,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: 0,
    max_supply: 0,
    ath: 0,
    ath_change_percentage: 0,
    ath_date: null,
    atl: 0,
    atl_change_percentage: 0,
    atl_date: null,
    roi: null,
    last_updated: null
}

const COIN_TICKERS = {
    id: null,
    name: null,
    tickers: []
}

const COIN_MARKET_CHART = {
    id: null,
    price: []
}

const COIN_LIST = {
    id: null,
    symbol: null,
    name: null
}

module.exports = {
    COIN_DETAILS,
    COIN_MARKETS,
    COIN_TICKERS,
    COIN_MARKET_CHART,
    COIN_LIST
}