<?php

/**
 * AbstractAdapter
 * 
 * @category  Permission
 * @package   AbstractAdapter
 * @author    Ali İhsan ÇAĞLAYAN <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/docs
 */
abstract Class Permission_AbstractAdapter
{
    /**
     * Is translator?
     * 
     * @var boolean
     */
    protected $isTranslator = false;

    /**
     * User id
     * 
     * @var integer
     */
    protected $userID = 0;

    /**
     * Page urls
     * 
     * @var array
     */
    protected $pages = array();

    /**
     * Print Html
     * 
     * @var string
     */
    protected $html = '';

    /**
     * Configuration
     * 
     * @var array
     */
    public $config = array();

    /**
     * Selected data
     * 
     * @var array
     */
    public $selectedData = array();

    /**
     * Print html
     * 
     * @return string html
     */
    abstract public function printHtml();

    /**
     * Get selected html attribute
     * 
     * @return string html
     */
    abstract public function getSelectedAttr();

    /**
     * Contructor
     * 
     * @param object $cache  cache instance
     * @param array  $config configuration
     */
    public function __construct($cache, $config)
    {
        $this->cache  = $cache;
        $this->config = $config;
    }

    /**
     * Get pages
     * 
     * @return array
     */
    public function getRawPages()
    {
        return $this->pages;
    }

    /**
     * Get user id
     * 
     * @return int
     */
    public function getUserID()
    {
        if (empty($this->userID)) {
            throw new RunTimeException('You must define the user id.');
        }
        return $this->userID;
    }

    /**
     * Set pages
     * 
     * @param array $pages page urls
     * 
     * @return self object
     */
    public function setRawPages(array $pages)
    {
        $this->pages = $pages;
        return $this;
    }

    /**
     * Set selected data
     * 
     * @param array $data selected data
     * 
     * @return void
     */
    public function setSelectedData(array $data)
    {
        $this->selectedData = $data;
        return $this;
    }

    /**
     * Get selected data
     * 
     * @return array
     */
    public function getSelectedData()
    {
        return $this->selectedData;
    }

    /**
     * Set user id for cache key.
     * 
     * @param int $userID user id
     * 
     * @return self object
     */
    public function setUserID($userID)
    {
        $this->userID = $userID;
        return $this;
    }

    /**
     * Translator enable.
     * 
     * @param boolean $enable enable
     * 
     * @return void
     */
    public function enableTranslator($enable = false)
    {
        $this->isTranslator = $enable;
        return $this;
    }

    /**
     * Is translator?
     * 
     * @return boolean
     */
    public function isTranslator()
    {
        return $this->isTranslator;
    }
}


// END AbstractAdapter Class

/* End of file AbstractAdapter.php */
/* Location: .classes/Permission/AbstractAdapter.php */