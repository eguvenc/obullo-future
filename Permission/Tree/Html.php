<?php

/**
 * Tree Html
 * 
 * @category  Tree
 * @package   Html
 * @author    Ali İhsan ÇAĞLAYAN <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/docs
 */
Class Permission_Tree_Html
{
    /**
     * Config parameters
     * for str_replace
     */
    const STR_REPLACE_URL      = '##url##';
    const STR_REPLACE_ICON     = '##icon##';
    const STR_REPLACE_NAME     = '##name##';
    const STR_REPLACE_VALUE    = '##value##';
    const STR_REPLACE_COUNT    = '##count##';
    const STR_REPLACE_SELECTED = '##selected##';

    /**
     * Selected item
     * 
     * @var array
     */
    public $selected = array();

    /**
     * Element counter
     * 
     * We use for the attribute
     * id="tree_1"
     * id="tree_2"
     * 
     * @var integer
     */
    public $count = 0;

    /**
     * Html
     * 
     * @var string
     */
    public $html = '';

    /**
     * Locale (en, tr)
     * 
     * @var string
     */
    public $locale = 'en';

    /**
     * Constructor
     * 
     * @param object $c        container
     * @param object $provider provider instance
     */
    public function __construct($c, $provider)
    {
        if (! is_object($provider)) {
            throw new RunTimeException("Must be required object");
        }
        $this->c = $c;
        $this->provider = $provider;

        $this->locale = $this->c['translator']->getLocale();
    }

    /**
     * Selected data
     * 
     * @param string $key selected key
     * 
     * @return array
     */
    public function selectedItem($key)
    {
        if (sizeof($this->selected) == 0) {
            $this->selected = $this->provider->getSelectedData();
        }
        foreach ($this->selected as $val) {
            if ($key == $val['rbac_permissions_rbac_permission_id']) {
                return $key;
            }
        }
        return false;
    }

    /**
     * Sub-categories to html
     * 
     * @param array   $subCategories sub-categories
     * @param boolean $firstItem     first item
     * 
     * @return void
     */
    protected function subCategoryToHtml(array $subCategories, $firstItem = true)
    {
        foreach ($subCategories as $v) {
            $this->count++;

            $isSubCategory = (isset($v['subs'])) ? true : false;
            $tempParentKey = ($isSubCategory) ? 'secondOfParent' : 'secondNoParent';
            $iconClassName = (isset($this->provider->config['icons'][$v['rbac_permission_resource']])) ? $this->provider->config['icons'][$v['rbac_permission_resource']] : '';
            $selectedAttr  = '';

            if ($this->selectedItem($v['rbac_permission_id'])) {
                $selectedAttr = $this->provider->getSelectedAttr();
            }

            if ($firstItem === true) {
                $this->html.= $this->provider->config['template']['open']['sub']['first'];
            }
            $this->html.= str_replace(
                array(
                    static::STR_REPLACE_COUNT,
                    static::STR_REPLACE_URL,
                    static::STR_REPLACE_ICON,
                    static::STR_REPLACE_NAME,
                    static::STR_REPLACE_VALUE,
                    static::STR_REPLACE_SELECTED
                ),
                array(
                    $this->count,
                    $this->locale .'/'. $v['rbac_permission_resource'],
                    $iconClassName,
                    $this->translate($v[$this->provider->getTranslateKey()]),
                    $v['rbac_permission_id'],
                    $selectedAttr
                ),
                $this->provider->config['template']['open']['sub'][$tempParentKey]
            );

            if ($isSubCategory) {
                $this->html.= $this->subCategoryToHtml($v['subs'], true);
            }
            $firstItem = false;
        }
        $this->html.= $this->provider->config['template']['close']['sub']['first'];
    }

    /**
     * Build array of categories
     * 
     * @param array $raw raw data
     * 
     * @return array
     */
    protected function buildArrayOfCategories(array $raw)
    {
        $tree = array();
        foreach ($raw as &$item) {
            $tree[$item['rbac_permission_parent_id']][] = &$item;
        }
        unset($item);

        foreach ($raw as &$item) {
            if (isset($tree[$item['rbac_permission_id']])) {
                $item['subs'] = $tree[$item['rbac_permission_id']];
            }
        }
        unset($item);

        return $tree[0];
    }

    /**
     * Build menu
     * 
     * @return void
     */
    public function build()
    {
        $categories = $this->buildArrayOfCategories($this->provider->getRawPages());
        foreach ($categories as $v) {
            $this->count++;

            $selectedAttr = '';

            if ($this->selectedItem($v['rbac_permission_id'])) {
                $selectedAttr = $this->provider->getSelectedAttr();
            }

            if ($v['rbac_permission_parent_id'] == 0) {

                $iconClassName = (isset($this->provider->config['icons'][$v['rbac_permission_resource']])) ? $this->provider->config['icons'][$v['rbac_permission_resource']] : '';                
                $this->html .= str_replace(
                    array(
                        static::STR_REPLACE_COUNT,
                        static::STR_REPLACE_URL,
                        static::STR_REPLACE_ICON,
                        static::STR_REPLACE_NAME,
                        static::STR_REPLACE_VALUE,
                        static::STR_REPLACE_SELECTED
                    ),
                    array(
                        $this->count,
                        $this->locale .'/'. $v['rbac_permission_resource'],
                        $iconClassName,
                        $this->translate($v[$this->provider->getTranslateKey()]),
                        $v['rbac_permission_id'],
                        $selectedAttr
                    ),
                    $this->provider->config['template']['open']['main']['first']
                );
            }
            if (isset($v['subs']) AND count($v['subs']) > 0) {
                $this->html .= $this->subCategoryToHtml($v['subs'], true);
            }
            $this->html .= $this->provider->config['template']['close']['main']['first'];
        }
        return $this->html;
    }

    /**
     * Translate
     * 
     * @param string $key translate key
     * 
     * @return string translated
     */
    public function translate($key)
    {
        if ($this->provider->isTranslator()) {
            return (isset($this->provider->config['translate'][$key])) ? $this->c['translator'][$this->provider->config['translate'][$key]] : $key;
        }
        return $key;
    }
}


// END Html Class

/* End of file Html.php */
/* Location: .classes/Permission/Tree/Html.php */