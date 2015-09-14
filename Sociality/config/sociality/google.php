<?php

return array(
    
    'oauth' => [
        'uri'   => 'https://accounts.google.com/o/oauth2/auth',
        'token' => 'https://accounts.google.com/o/oauth2/token',
    ],
    'client' => [
        'id'     => '703811068112-d6pa4aiqs10rv1a21ga7l14ujhcf302m.apps.googleusercontent.com',
        'email'  => '703811068112-d6pa4aiqs10rv1a21ga7l14ujhcf302m@developer.gserviceaccount.com',
        'secret' => 'jvc67Y_gq-m3fPmj9x5Y9vH5',
    ],
    'redirect' => [
        'url1' => 'http://www.maxiwetten.com/invite/callback/google',
        // 'url2' => 'http://www.pbetting.net/invite/callback/google',
    ],
    'javascript' => [
        'origins' => ['https://www.pbetting.net']
    ],
    'maxResults' => 100
);


/* End of file google.php */
/* Location: .app/config/sociality/google.php */