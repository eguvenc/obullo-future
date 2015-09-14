<?php

/**
 * Permission
 * 
 * @category  Permission
 * @package   Method
 * @author    Ali İhsan ÇAĞLAYAN <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/docs
 */
Class Permission_Method
{
    /**
     * Provider instance
     * 
     * @var object
     */
    protected static $method = null;

    /**
     * Create a method
     * 
     * @param string $c      container
     * @param string $method method name (class name)
     * 
     * @return object method instance
     */
    public static function create($c, $method)
    {
        $Class = 'Permission_Html_'. ucfirst($method);

        if ( ! class_exists($Class, true)) {
            throw new RunTimeException("This '$method' method is not found");
        }
        static::$method = new $Class($c);

        return static::$method;
    }
}


// END Method Class

/* End of file Method.php */
/* Location: .classes/Permission/Method.php */