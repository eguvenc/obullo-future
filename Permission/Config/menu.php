<?php

/*
|--------------------------------------------------------------------------
| Navbar Menu Config
|--------------------------------------------------------------------------
| Configuration set navbar menu
|
|   const STR_REPLACE_URL      = '##url##';
|   const STR_REPLACE_ICON     = '##icon##';
|   const STR_REPLACE_NAME     = '##name##';
|   const STR_REPLACE_VALUE    = '##value##';
|   const STR_REPLACE_COUNT    = '##count##';
|   const STR_REPLACE_SELECTED = '##selected##';
*/
return [

    'template' => [

        'open' => [
            'main' => [
                'first' => '<li class="dropdown"><a><i class="##icon##"> </i> ##name##<b class="caret"></b></a>',
            ],
            'sub' => [
                'first'          => '<ul class="dropdown-menu">',
                'secondOfParent' => '<li class="dropdown-submenu"><a><i class="##icon##"> </i> ##name##</a>',
                'secondNoParent' => '<li><a href="/##url##"><i class="##icon##"> </i> ##name##</a></li>',
            ],
        ],

        'close' => [
            'sub' => [
                'first' => '</ul>',
            ],
            'main' => [
                'first' => '</li>',
            ],
        ],

        // 'main' => array(
        //     'open' => '<li class="dropdown">
        //     <a><i class="##icon##"> </i> ##name##<b class="caret"></b></a>',
        //     'subsOfMain' => '<li class="dropdown">
        //     <a class="dropdown-toggle" data-toggle="dropdown"><i class="##icon##"> </i> ##name##<b class="caret"></b></a>
        //     <ul class="dropdown-menu">',
        // ),

        // // sub category start
        // 'first' => array(
        //     'subOfParent'  => '<li class="dropdown-submenu">
        //     <a><i class="##icon##"> </i> ##name##</a>
        //     <ul class="dropdown-menu">',
        //     'singleParent' => '<li><a href="/##url##"><i class="##icon##"> </i> ##name##</a></li>',
        // ),
        // 'second' => array(
        //     'childOfParent' => '<li class="dropdown-submenu"><a><i class="##icon##"> </i> ##name##</a>
        //     <ul class="dropdown-menu">',
        //     'singleChild'  => '<li><a href="/##url##"><i class="##icon##"> </i> ##name##</a></li>',
        // ),
        // sub category end

        // 'close' => array(
        //     'open'          => '</li>',
        //     'childOfParent' => '</ul></li>',
        //     'subOfParent'   => '</ul>',
        //     'liSubOfParent' => '</li>',
        //     'singleParent'  => '',
        //     'subsOfMain'    => '</ul></li>',
        //     'singleChild'   => '',
        // ),

    ],
    'translate' => [
        /*##################### User Management #####################*/
        '#user_management'            => 'HEADER:MENU:USER_MANAGEMENT',
            'departments/departments' => 'HEADER:MENU:DEPARTMENTS',
            'permissions/permissions' => 'HEADER:MENU:PERMISSIONS',
            'users/users'             => 'HEADER:MENU:USERS',
            'users/tasks'             => 'HEADER:MENU:TASKS',
            'users/notes'             => 'HEADER:MENU:NOTES',
            'chat/chat'               => 'HEADER:MENU:CHAT',
        /*##################### System Management ###################*/
        '#system_management'        => 'HEADER:MENU:SYSTEM_MANAGEMENT',
            'countries/countries'   => 'HEADER:MENU:COUNTRIES',
            'currencies/currencies' => 'HEADER:MENU:CURRENCIES',
            'verify/verify'         => 'HEADER:MENU:VERIFY',
            'banner/banner'         => 'HEADER:MENU:BANNER',
            'help/help'             => 'HEADER:MENU:HELP',
        /*##################### Games Management ###################*/
        '#games_management'     => 'HEADER:MENU:GAME_MANAGEMENT',
            'games/manager'     => 'HEADER:MENU:GAMES',
            'scratchcard/lists' => 'HEADER:MENU:SCRATCHCARD',
        /*##################### Messages ############################*/
        '#messages'                  => 'HEADER:MENU:MESSAGES',
            'messages/user_messages' => 'HEADER:MENU:MESSAGES:USER_MESSAGE',
            'messages/templates'     => 'HEADER:MENU:MESSAGES:MESSAGE_TEMPLATE',
        /*##################### Transactions ########################*/
        '#transactions'                        => 'HEADER:MENU:TRANSACTIONS',
            '#site_transaction'                => 'HEADER:MENU:SITE_TRANSACTION',
                'transactions/site/types'      => 'HEADER:MENU:TRANSACTION:SITE:TYPES',
                'transactions/site/categories' => 'HEADER:MENU:TRANSACTION:SITE:CATEGORIES',
            '#system_transaction'              => 'HEADER:MENU:SYSTEM_TRANSACTION',
                'transactions/system/types'    => 'HEADER:MENU:TRANSACTION:SYSTEM:TYPES',
        /*##################### BONUSES ########################*/
        '#bonuses'                      => 'HEADER:MENU:BONUSES',
            'bonuses/deposit_bonus'     => 'HEADER:MENU:BONUSES:DEPOSIT_BONUS',
            'bonuses/combination_bonus' => 'HEADER:MENU:BONUSES:COMBINATION_BONUS',
            'bonuses/happy_hour_bonus'  => 'HEADER:MENU:BONUSES:HAPPY_HOUR_BONUS',
            'bonuses/level_bonus'       => 'HEADER:MENU:BONUSES:LEVEL_BONUS',
        /*##################### BONUSES ########################*/
        '#whatsapp'                 => 'HEADER:MENU:WHATSAPP',
            'whatsapp/numbers'      => 'HEADER:MENU:WHATSAPP:NUMBERS',
            'whatsapp/messages'     => 'HEADER:MENU:WHATSAPP:MESSAGES',
        /*##################### Accounting ##########################*/
        '#accounting'                          => 'HEADER:MENU:ACCOUNTING',
            'money/deposits'                   => 'HEADER:MENU:MONEY:DEPOSITS',
            'money/withdrawals'                => 'HEADER:MENU:MONEY:WITHDRAWALS',
            'money/transactions'               => 'HEADER:MENU:MONEY:TRANSACTIONS',
            'money/payment_methods_management' => 'HEADER:MENU:MONEY:PAYMENT_METHODS_MANAGEMENT',
        /*##################### Settings ############################*/
        '#settings'               => 'HEADER:MENU:SETTINGS',
            'limits/limit_key'    => 'HEADER:MENU:LIMITS:LIMIT_KEY',
            'limits/system_limit' => 'HEADER:MENU:LIMITS:SYSTEM_LIMIT',
            'limits/user_limit'   => 'HEADER:MENU:LIMITS:USER_LIMIT',
            'manager/site'        => 'HEADER:MENU:MANAGER:SITE',
            'manager/cache'       => 'HEADER:MENU:MANAGER:CACHE',
            'limits/banned_words'  => 'HEADER:MENU:LIMITS:BANNEDWORD',
        /*##################### Statistics ###########################*/
        '#statistics'                        => 'HEADER:MENU:STATISTICS',
            '#instant'                       => 'HEADER:MENU:INSTANT',
                'statistics/daily_coupon'    => 'HEADER:MENU:STATISTICS:DAILY_COUPON',
                'statistics/daily_games'     => 'HEADER:MENU:STATISTICS:DAILY_GAMES',
                'statistics/bet_density'     => 'HEADER:MENU:STATISTICS:BET_DENSITY',
                'statistics/daily_cashflow'  => 'HEADER:MENU:STATISTICS:DAILY_CASHFLOW',
                'statistics/totals'          => 'HEADER:MENU:STATISTICS:TOTALS',
            '#end_of_day'                    => 'HEADER:MENU:END_OF_DAY',
                'statistics/user'            => 'HEADER:MENU:STATISTICS:USER',
                'statistics/user_for_sites'  => 'HEADER:MENU:STATISTICS:USER_FOR_SITES',
                'statistics/transaction'     => 'HEADER:MENU:STATISTICS:TRANSACTION',
                'statistics/cashflow'        => 'HEADER:MENU:STATISTICS:CASHFLOW',
                'statistics/coupon'          => 'HEADER:MENU:STATISTICS:COUPON',
                'statistics/coupon_cashflow' => 'HEADER:MENU:STATISTICS:COUPON_CASHFLOW',
                'statistics/games'           => 'HEADER:MENU:STATISTICS:GAMES',
                'statistics/games_cashflow'  => 'HEADER:MENU:STATISTICS:GAMES_CASHFLOW',
        /*##################### Bet Management ######################*/
        '#bet_management'                          => 'HEADER:MENU:BET_MANAGEMENT',
            'bet/events/event_list'                => 'HEADER:MENU:BET:EVENTS_LIST',
            'bet/management/manager'               => 'HEADER:MENU:BET:MANAGEMENT_MANAGER',
            'bet/teams/team_list'                  => 'HEADER:MENU:BET:TEAMS_LIST',
            'bet/markets/manager'                  => 'HEADER:MENU:BET:MARKETS_MANAGER',
            'bet/live/live_market'                 => 'HEADER:MENU:BET:LIVE:LIVE_MARKET',
            'bet/live/active_events_list'          => 'HEADER:MENU:BET:LIVE:ACTIVE_EVENTS_LIST',
            'bet/live/completed_events_list'       => 'HEADER:MENU:BET:LIVE:COMPLETED_EVENTS_LIST',
        /*##################### Coupon Management ####################*/
        '#coupon_management'          => 'HEADER:MENU:COUPON_MANAGEMENT',
            'coupon/coupon'           => 'HEADER:MENU:COUPON:COUPON',
            'coupon/games'            => 'HEADER:MENU:COUPON:GAMES',
            'coupon/ready_bets_list'  => 'HEADER:MENU:COUPON:READYMADEBETS',
        /*##################### Logs Management ######################*/
        '#logs_management'                => 'HEADER:MENU:LOGS_MANAGEMENT',
            'logs/user/user'              => 'HEADER:MENU:LOGS:USER',
            'logs/system/system'          => 'HEADER:MENU:LOGS:SYSTEM',
            '#application_logs'           => 'HEADER:MENU:APPLICATION_LOGS',
                'logs/user/application'   => 'HEADER:MENU:LOGS:USER:APPLICATION',
                'logs/system/application' => 'HEADER:MENU:LOGS:SYSTEM:APPLICATION',
            'logs/worker/worker'          => 'HEADER:MENU:LOGS:WORKER',
        /*##################### Marketing ############################*/
        '#marketing'                      => 'HEADER:MENU:MARKETING',
            'marketing/email_campaign'    => 'HEADER:MENU:MARKETING:EMAIL_CAMPAIGN',
            'marketing/sms_campaign'      => 'HEADER:MENU:MARKETING:SMS_CAMPAIGN',
            'marketing/whatsapp_campaign' => 'HEADER:MENU:MARKETING:WHATSAPP_CAMPAIGN',
            'marketing/media_manager'     => 'HEADER:MENU:MARKETING:MEDIA_MANAGER',
        /*##################### Member Management ####################*/
        '#member_management'           => 'HEADER:MENU:MEMBER_MANAGEMENT',
            'members/members_list'     => 'HEADER:MENU:MEMBERS:MEMBERS_LIST',
            'members/active_members'   => 'HEADER:MENU:MEMBERS:ACTIVE_MEMBERS',
            'members/negative_balance' => 'HEADER:MENU:MEMBERS:NEGATIVE_BALANCE',
    ],
    'icons' => [
        /*##################### User Management #####################*/
        '#user_management'            => 'fa fa-user',
            'departments/departments' => 'fa fa-sitemap',
            'permissions/permissions' => 'fa fa-shield',
            'users/users'             => 'fa fa-users',
            'users/notes'             => 'fa fa-comment',
            'users/tasks'             => 'fa fa-tasks',
            'chat/chat'               => 'fa fa-comments',
        /*##################### System Management ###################*/
        '#system_management'        => 'fa fa-gears',
            'countries/countries'   => 'fa fa-flag-checkered',
            'currencies/currencies' => 'fa fa-money',
            'verify/verify'         => 'fa fa-check-circle-o',
            'banner/banner'         => 'fa fa-file-picture-o',
            'help/help'             => 'fa fa-question-circle',
            // 'games/manager'         => 'fa fa-gamepad',
        /*##################### Games Management ###################*/
        '#games_management'     => 'fa fa-gamepad',
            'games/manager'     => 'fa fa-gamepad',
            'scratchcard/lists' => 'fa fa-gamepad',
        /*##################### Messages ############################*/
        '#messages'                  => 'fa fa-inbox',
            'messages/user_messages' => 'fa fa-user',
            'messages/templates'     => 'fa fa-archive',
        /*##################### Transactions ########################*/
        '#transactions'                        => 'fa fa-tasks',
            '#site_transaction'                => 'fa fa-globe',
                'transactions/site/types'      => 'fa fa-book',
                'transactions/site/categories' => 'fa fa-bars',
            '#system_transaction'              => 'fa fa-cubes',
                'transactions/system/types'    => 'fa fa-book',
        /*##################### BONUSES ########################*/
        '#bonuses'                      => 'fa fa-star',
            'bonuses/deposit_bonus'     => 'fa fa-briefcase',
            'bonuses/combination_bonus' => 'fa fa-clipboard',
            'bonuses/happy_hour_bonus'  => 'fa fa-clock-o',
            'bonuses/level_bonus'       => 'fa fa-level-up',
        /*##################### BONUSES ########################*/
        '#whatsapp'             => 'fa fa-wechat',
            'whatsapp/numbers'  => 'fa fa-phone-square',
            'whatsapp/messages' => 'fa fa-inbox',
        /*##################### Accounting ##########################*/
        '#accounting'                          => 'fa fa-database',
            'money/deposits'                   => 'fa fa-cloud-download',
            'money/withdrawals'                => 'fa fa-share-square-o',
            'money/transactions'               => 'fa fa-tasks',
            'money/payment_methods_management' => 'fa fa-credit-card',
        /*##################### Settings ############################*/
        '#settings'               => 'fa fa-wrench',
            'limits/limit_key'    => 'fa fa-key',
            'limits/system_limit' => 'fa fa-legal',
            'limits/user_limit'   => 'fa fa-sliders',
            'manager/site'        => 'fa fa-globe',
            'manager/cache'       => 'fa fa-binoculars',
        /*##################### Statistics ###########################*/
        '#statistics'                        => 'fa fa-bar-chart',
            '#instant'                       => 'fa fa-bullseye',
                'statistics/daily_coupon'    => 'fa fa-sun-o',
                'statistics/daily_games'     => 'fa fa-magic',
                'statistics/bet_density'     => 'fa fa-cube',
                'statistics/daily_cashflow'  => 'fa fa-barcode',
                'statistics/totals'          => 'fa fa-circle-o-notch',
            '#end_of_day'                    => 'fa fa-line-chart',
                'statistics/user'            => 'fa fa-users',
                'statistics/user_for_sites'  => 'fa fa-user',
                'statistics/transaction'     => 'fa fa-gear',
                'statistics/cashflow'        => 'fa fa-area-chart',
                'statistics/coupon'          => 'fa fa-newspaper-o',
                'statistics/coupon_cashflow' => 'fa fa-calculator',
                'statistics/games'           => 'fa fa-gamepad',
                'statistics/games_cashflow'  => 'fa fa-puzzle-piece',
        /*##################### Bet Management ######################*/
        '#bet_management'                          => 'fa fa-qrcode',
            'bet/events/event_list'                => 'fa fa-tasks',
            'bet/management/manager'               => 'fa fa-bars',
            'bet/teams/team_list'                  => 'fa fa-users',
            'bet/markets/manager'                  => 'fa fa-briefcase',
            'bet/live/live_market'                 => 'fa fa-video-camera',
            'bet/live/active_events_list'          => 'fa fa-star',
            'bet/live/completed_events_list'       => 'fa fa-check-circle',
        /*##################### Coupon Management ####################*/
        '#coupon_management' => 'fa fa-newspaper-o',
            'coupon/coupon'  => 'fa fa-soccer-ball-o',
            'coupon/games'   => 'fa fa-gamepad',
        /*##################### Logs Management ######################*/
        '#logs_management'                => 'fa fa-print',
            'logs/user/user'              => 'fa fa-group',
            'logs/system/system'          => 'fa fa-archive',
            '#application_logs'           => 'fa fa-quote-left',
                'logs/user/application'   => 'fa fa-user',
                'logs/system/application' => 'fa fa-bookmark',
        /*##################### Marketing ############################*/
        '#marketing'                      => 'fa fa-bank',
            'marketing/email_campaign'    => 'fa fa-mail-reply-all',
            'marketing/sms_campaign'      => 'fa fa-envelope-o',
            'marketing/whatsapp_campaign' => 'fa fa-comments',
        /*##################### Member Management ####################*/
        '#member_management'           => 'fa fa-users',
            'members/members_list'     => 'fa fa-group',
            'members/active_members'   => 'fa fa-pencil-square-o',
            'members/negative_balance' => 'fa fa-pencil-square',
    ],
];

/* End of file menu.php */
/* Location: ./classes/Permission/Config/menu.php */
