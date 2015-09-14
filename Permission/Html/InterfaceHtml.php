<?php

/**
 * Provider Interface
 * 
 * @category  Provider
 * @package   ProviderInterface
 * @author    Ali İhsan ÇAĞLAYAN <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/docs
 */
interface Permission_Html_InterfaceHtml
{
    /**
     * Contructor
     * 
     * @param object $c container
     */
    public function __construct($c);

    /**
     * Returns navbar configuration data.
     * 
     * @return array config
     */
    public function getConfig();

    /**
     * Get translate key
     * 
     * @return string
     */
    public function getTranslateKey();

    /**
     * Print html
     * 
     * @return string html
     */
    public function printHtml();
}