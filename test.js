var CGKCoin = require('./controllers/coin.controller');
//CGKCoin.getCoinMarket();
//CGKCoin.fetchCurrentCoinDetails('bitcoin')

CGKCoin.fetchCoinDetails('bitcoin', {}, true)
//CGKCoin.syncCoinList();
// CGKCoin.fetchCoinDetails('ethereum')

//CGKCoin.syncCoinDetails();

// let string = '{"id":"aidos-kuneen","symbol":"adk","name":"Aidos Kuneen","asset_platform_id":null,"platforms":{"":""},"block_time_in_minutes":10,"categories":["Finance / Banking"],"public_notice":null,"additional_notices":[],"links":{"homepage":["https://www.aidoskuneen.com/","",""],"blockchain_site":["https://explorer.aidoskuneen.com/","","","","","","","","",""],"official_forum_url":["","",""],"chat_url":["","",""],"announcement_url":["https://medium.com/@aidoskuneen",""],"twitter_screen_name":"Aidos_kuneen","facebook_username":"aidoskuneenofficial","bitcointalk_thread_identifier":1954428,"telegram_channel_identifier":"aidos_kuneen","subreddit_url":null,"repos_url":{"github":["https://github.com/AidosKuneen/aknode"],"bitbucket":[]}},"image":{"thumb":"https://assets.coingecko.com/coins/images/6077/thumb/Logoldpi.png?1600764971","small":"https://assets.coingecko.com/coins/images/6077/small/Logoldpi.png?1600764971","large":"https://assets.coingecko.com/coins/images/6077/large/Logoldpi.png?1600764971"},"country_origin":"ZZ","genesis_date":null,"sentiment_votes_up_percentage":null,"sentiment_votes_down_percentage":100,"market_cap_rank":1257,"coingecko_rank":1289,"coingecko_score":20.118,"developer_score":16.302,"community_score":7.572,"liquidity_score":11.945,"public_interest_score":null,"community_data":{"facebook_likes":null,"twitter_followers":8116,"reddit_average_posts_48h":0,"reddit_average_comments_48h":0,"reddit_subscribers":0,"reddit_accounts_active_48h":0,"telegram_channel_user_count":7506},"public_interest_stats":{"alexa_rank":976024,"bing_matches":null},"status_updates":[],"last_updated":"2021-12-29T10:40:02.898Z"}'
//
// console.log()