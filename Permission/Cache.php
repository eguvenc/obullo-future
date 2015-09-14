<?php

/**
 * Cache
 * 
 * @category  Permission
 * @package   Cache
 * @author    Ali İhsan ÇAĞLAYAN <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/docs
 */
Class Permission_Cache
{
    /**
     * Cache instance
     * 
     * @var object
     */
    protected static $cache;

    /**
     * Cache expiration
     * 
     * @var integer
     */
    protected static $expiration = 7200;

    /**
     * Cache
     * 
     * @param object $cache cache instance
     * 
     * @return void
     */
    public static function setCache($cache)
    {
        static::$cache = (object)$cache;
    }

    /**
     * Get data
     * 
     * @param string $key cache key
     * 
     * @return mixed data
     */
    public static function data($key)
    {
        if (($data = static::$cache->get($key)) !== false) {
            $data = static::decode($data);
        }
        return $data;
    }

    /**
     * Set data to cache
     * 
     * @param string $key  cache key
     * @param mix    $data cache data
     * 
     * @return void
     */
    public static function set($key, $data)
    {
        static::$cache->set($key, static::encode($data), static::$expiration);
    }

    /**
     * Base64 encode
     * 
     * @param mixed $data data
     * 
     * @return string
     */
    protected static function encode($data)
    {
        return base64_encode($data);
    }

    /**
     * Base64 decode
     * 
     * @param mixed $data data
     * 
     * @return mixed
     */
    protected static function decode($data)
    {
        return base64_decode($data);
    }
}


// END Cache Class

/* End of file Cache.php */
/* Location: .classes/Permission/Cache.php */