<?php

namespace Rate;

use RuntimeException;
use Obullo\Container\Container;

/**
 * Rate Limiter
 * 
 * @category  Security
 * @package   Limiter
 * @author    Obullo Framework <obulloframework@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://opensource.org/licenses/MIT MIT license
 * @link      http://obullo.com/docs
 */
Class Limiter
{
    /**
     * Container
     * 
     * @var object
     */
    public $c;

    /**
     * Constructor
     * 
     * @param object $c container
     */
    public function __construct(Container $c)
    {
        $this->c = $c;
    }

    /**
     * Load rate limiter configuration
     * 
     * @param string $listener name
     * @param array  $params   configuration
     * 
     * @return void
     */
    public function set($listener = 'ip', $params = array())
    {
        if (count($params) == 0) {
            $params = $this->c['config']->load('rate');  // Load from file
        }
        if (isset($this->{$listener})) {
            return $this->{$listener};
        }
        return $this->{$listener} = new Rate($this->c, $listener, $params);
    }
}


// END Limiter Class

/* End of file Limiter.php */
/* Location: .Obullo/Rate/Limiter.php */