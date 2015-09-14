<?php

namespace Service;

use Obullo\Sociality\Connect;
use Obullo\Container\Container;
use Obullo\ServiceProviders\ServiceInterface;

class Sociality implements ServiceInterface
{
    /**
     * Registry
     *
     * @param object $c container
     *
     * @return void
     */
    public function register(Container $c)
    {
        $c['sociality'] = function () use ($c) {
            $connect = new Connect($c);
            return $connect;
        };
    }
}

// END Sociality service

/* End of file Sociality.php */
/* Location: .classes/Service/Sociality.php */
