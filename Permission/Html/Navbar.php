<?php

/**
 * Html Navbar
 * 
 * @category  Html
 * @package   Navbar
 * @author    Ali İhsan ÇAĞLAYAN <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/docs
 */
Class Permission_Html_Navbar extends Permission_AbstractAdapter implements Permission_Html_InterfaceHtml
{
    const CACHE_KEY     = 'Tree:NavbarMenu:';
    const TRANSLATE_KEY = 'rbac_permission_resource';

    /**
     * Contructor
     * 
     * @param object $c container
     */
    public function __construct($c)
    {
        $this->c     = $c;
        $this->cache = $c['return cache'];
        parent::__construct($this->cache, $this->getConfig());
    }

    /**
     * Returns navbar configuration data.
     * 
     * @return array config
     */
    public function getConfig()
    {   
        $config = include CLASSES .'Permission/Config/menu.php';
        return $config;
    }

    /**
     * Get translate key
     * 
     * @return string
     */
    public function getTranslateKey()
    {
        return static::TRANSLATE_KEY;
    }

    /**
     * Get selected attribte
     * 
     * @return html attribute
     */
    public function getSelectedAttr()
    {
        return '';
    }

    /**
     * Get redis key
     * 
     * @return string
     */
    public function getKey()
    {
        return $this->key = static::CACHE_KEY . $this->c->load('translator')->getLocale() .':'. $this->getUserID();
    }

    /**
     * Exists key cache
     * 
     * @param string $key cache key
     * 
     * @return boolean
     */
    public function existsCache($key = null)
    {
        if ($key === null) {
            $key = $this->getKey();
        }
        return $this->cache->keyExists($key);
    }

    /**
     * Print html
     * 
     * @return string html
     */
    public function printHtml()
    {
        Permission_Cache::setCache($this->cache);

        if ($this->existsCache() === false) {
            $parser = new Permission_Tree_Html($this->c, $this);
            $html   = $parser->build();

            Permission_Cache::set($this->getKey(), $html);
        } else {
            $html = Permission_Cache::data($this->getKey());
        }
        return $html;
    }
}


// END Navbar Class

/* End of file Navbar.php */
/* Location: .classes/Permission/Provider/Navbar.php */
