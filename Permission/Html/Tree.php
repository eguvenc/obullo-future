<?php

/**
 * Tree
 * 
 * @category  Html
 * @package   Tree
 * @author    Ali İhsan ÇAĞLAYAN <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/docs
 */
Class Permission_Html_Tree extends Permission_AbstractAdapter implements Permission_Html_InterfaceHtml
{
    const CACHE_KEY     = 'Tree:Permissions:';
    const TRANSLATE_KEY = 'rbac_permission_name';

    /**
     * Contructor
     * 
     * @param object $c container
     */
    public function __construct($c)
    {
        $this->c = $c;
        $this->cache = $c['return cache'];
        parent::__construct($this->cache, $this->getConfig());
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
     * Returns navbar configuration data.
     * 
     * @return array config
     */
    public function getConfig()
    {   
        $config = include CLASSES .'Permission/Config/tree.php';
        return $config;
    }

    /**
     * Get selected attribte
     * 
     * @return html attribute
     */
    public function getSelectedAttr()
    {
        return 'class="jstree-clicked"';
    }

    /**
     * Print html
     * 
     * @return string html
     */
    public function printHtml()
    {
        Permission_Cache::setCache($this->cache);
        $key = static::CACHE_KEY . $this->getUserID();

        if (($html = Permission_Cache::data($key)) === false) {
            
            $parser = new Permission_Tree_Json($this);
            $html   = $parser->build();

            Permission_Cache::set($key, $html);
        }
        return $html;
    }

    /**
     * Print html
     * 
     * @return string html
     */
    public function printJson()
    {
        Permission_Cache::setCache($this->cache);
        $key = static::CACHE_KEY . $this->getUserID();

        if (($json = Permission_Cache::data($key)) === false) {
            
            $parser = new Permission_Tree_Json($this);
            $json   = json_encode($parser->build());

            Permission_Cache::set($key, $json);
        }
        return $json;
    }

}


// END Tree Class

/* End of file Tree.php */
/* Location: .classes/Permission/Provider/Tree.php */