<?php

/**
 * Tree
 * 
 * @category  Permission
 * @package   Tree
 * @author    Ali İhsan ÇAĞLAYAN <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/docs
 */
Class Permission_Tree_Json
{
    /**
     * Operation Constants
     */
    const OPERATION_VIEW   = 1;
    const OPERATION_UPDATE = 2;
    const OPERATION_DELETE = 3;
    const OPERATION_INSERT = 4;
    const OPERATION_SAVE   = 5;

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
     * Array data
     * 
     * @var array
     */
    public $data = array(
        'titles' => array(
            array(
                'id'   => 'v',
                'name' => 'View'
            ),
            array(
                'id'   => 'u',
                'name' => 'Update'
            ),
            array(
                'id'   => 'i',
                'name' => 'Insert'
            ),
            array(
                'id'   => 'd',
                'name' => 'Delete'
            )
        )
    );

    /**
     * Constructor
     * 
     * @param object $provider provider instance
     */
    public function __construct($provider)
    {
        if ( ! is_object($provider)) {
            throw new RunTimeException("Must be required object");
        }
        $this->c        = $provider->c;
        $this->provider = $provider;
    }

    /**
     * Sub-categories to html
     * 
     * @param array $subCategories sub-categories
     * @param array &$data         data
     * 
     * @return void
     */
    protected function subCategoryToArray(array $subCategories, &$data)
    {
        foreach ($subCategories as $v) {

            $this->count++;
            $isSubCategory = (isset($v['subs'])) ? true : false;

            $data[] = array(
                'id'         => $v['rbac_permission_id'],
                'name'       => $this->translate($v[$this->provider->getTranslateKey()]),
                'operations' => array(
                    'view'   => false,
                    'update' => false,
                    'insert' => false,
                    'delete' => false
                )
            );
        
            if ($isSubCategory) {
                $this->subCategoryToArray($v['subs'], $data[sizeof($data)-1]['children']);
            }
        }
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
     * Build array of categories
     * 
     * @param array $raw raw data
     * 
     * @return array
     */
    protected function buildArrayOfCategories2(array $raw)
    {
        // $tree = array();
        // foreach ($raw as &$item) {
        //     $tree[$item['rbac_permission_parent_id']][] = &$item;
        // }
        // unset($item);
        $data = array();
        foreach ($raw as $v) {
            // var_dump($this->checkOperation($v['rbac_permission_id'], static::OPERATION_DELETE));

            $data[$v['rbac_permission_id']] = array(
                'id'         => $v['rbac_permission_id'],
                'name'       => $this->translate($v[$this->provider->getTranslateKey()]),
                'pId'       => $v['rbac_permission_parent_id'],
                'o' => array(
                    'v' => $this->checkOperation($v['rbac_permission_id'], static::OPERATION_VIEW),
                    'u' => $this->checkOperation($v['rbac_permission_id'], static::OPERATION_UPDATE),
                    'i' => $this->checkOperation($v['rbac_permission_id'], static::OPERATION_INSERT),
                    'd' => $this->checkOperation($v['rbac_permission_id'], static::OPERATION_DELETE),
                )
            );
        }
        // echo '<pre>';
        // print_r($data);
        // die('die');
        // foreach ($raw as &$item) {
        //     if (isset($tree[$item['rbac_permission_id']])) {
        //         $item['subs'] = $tree[$item['rbac_permission_id']];
        //     }
        // }
        // unset($item);
    
        return $data;
    }


    /**
     * Check operation
     * 
     * @param int $opType operation type
     * 
     * @return boolean
     */
    public function checkOperation($permId, $opType)
    {
        foreach ($this->provider->getSelectedData() as $val) {
            if ($permId == $val['rbac_permissions_rbac_permission_id'] AND $val['rbac_operations_rbac_operation_id'] == $opType) {
                return true;
            }
        }
        return false;
    }

    /**
     * Build menu
     * 
     * @return void
     */
    public function build()
    {
        $this->count = 0;
        // $categories  = $this->buildArrayOfCategories($this->provider->getRawPages());

        // foreach ($categories as $v) {

        //     $this->count++;

        //     if ($v['rbac_permission_parent_id'] == 0) {

        //         $data[] = array(
        //             'id'         => $v['rbac_permission_id'],
        //             'name'       => $this->translate($v[$this->provider->getTranslateKey()]),
        //             'operations' => array(
        //                 'view'   => false,
        //                 'update' => false,
        //                 'insert' => false,
        //                 'delete' => false
        //             )
        //         );

        //         if (isset($v['subs']) AND count($v['subs']) > 0) {
        //             $this->subCategoryToArray($v['subs'], $data[sizeof($data)-1]['children']);
        //         }
        //     }
        // }
        // $this->data['data'] = $data;
        $this->data['data'] = $this->buildArrayOfCategories2($this->provider->getRawPages());
       
        return $this->data;
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
        if ($this->provider->isTranslator() AND isset($this->provider->config['translate'][$key])) {
            return $this->c->load('translator')[$this->provider->config['translate'][$key]];
        }
        return $key;
    }
}


// END Tree Class

/* End of file Tree.php */
/* Location: .classes/Permission/Tree.php */