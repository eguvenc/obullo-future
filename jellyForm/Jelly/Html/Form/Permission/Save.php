<?php

/**
 * Form Save
 * 
 * @category  Jelly
 * @package   Html
 * @author    Obullo Framework <obulloframework@gmail.com>
 * @author    Ali Ihsan Caglayan <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/docs
 */
Class Jelly_Html_Form_Permission_Save
{
    /**
     * Constructor
     * 
     * @param array $c container
     */
    public function __construct($c)
    {
        $this->rbac = $c['rbac'];
        $this->db   = $c['service provider database']->get(['connection' => 'betforyousystem']);
    }

    /**
     * Add permission
     * 
     * @param array $data permission data
     * 
     * @return description
     */
    public function add($data)
    {
        if ($data['permission_parent_id'] > 0) {
            $this->rbac->permissions->append(
                $data['permission_parent_id'],
                $data['permission_name'],
                array(
                    'rbac_permission_resource' => $data['permission_resource_id'],
                    'rbac_permission_type' => $data['permission_type']
                )
            );
        } else {
            $this->rbac->permissions->addRoot(
                $data['permission_name'],
                array(
                    'rbac_permission_resource' => $data['permission_resource_id'],
                    'rbac_permission_type' => $data['permission_type']
                )
            );
        }
    }
 
}

// END Permission Save Class
/* End of file Save.php */

/* Location: .Obullo/Jelly/Html/Form/Permission/Save.php */