<?php

/*
|--------------------------------------------------------------------------
| Permission Tree Config
|--------------------------------------------------------------------------
| Configuration set permission tree
|
|   const STR_REPLACE_URL      = '##url##';
|   const STR_REPLACE_ICON     = '##icon##';
|   const STR_REPLACE_NAME     = '##name##';
|   const STR_REPLACE_VALUE    = '##value##';
|   const STR_REPLACE_COUNT    = '##count##';
|   const STR_REPLACE_SELECTED = '##selected##';
*/
return array(
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
    // 'template' => array(
    //     'main' => array(
    //         'open'       => '<li data-value="##value##"><a href="" ##selected##>##name##</a>',
    //         'subsOfMain' => '<li data-value="##value##"><a href="" ##selected##>##name##</a><ul>',
    //     ),

    //     // sub category start
    //     'first' => array(
    //         'subOfParent'  => '<ul><li data-value="##value##"><a href="" ##selected##>##name##</a>',
    //         'singleParent' => '<ul><li data-value="##value##"><a href="" ##selected##>##name##</a></li>',
    //     ),
    //     'second' => array(
    //         'childOfParent' => '<li data-value="##value##"><a href="" ##selected##>##name##</a>',
    //         'singleChild'   => '<li data-value="##value##"><a href="" ##selected##>##name##</a></li>',
    //     ),
    //     // sub category end
        
    //     'close' => array(
    //         'childOfParent' => '</li>',
    //         'subOfParent'   => '</li></ul>',
    //         'singleParent'  => '</ul>',
    //         'subsOfMain'    => '</ul></li>',
    //         'open'          => '</li>',
    //         'singleChild'   => '',
    //     ),
    // ),
    ]
);


/* End of file tree.php */
/* Location: ./classes/Permission/Config/tree.php */