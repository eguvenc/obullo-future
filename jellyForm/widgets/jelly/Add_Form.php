<?php 

namespace Widgets\Jelly;

/**
 * $app add form
 * 
 * @var Controller
 */
class Add_Form extends \Controller
{

    /**
    * Loader
    *
    * @return void
    */
    public function load()
    { 
        $this->c['view'];
        $this->c['form'];
        $this->c['request'];
        $this->c['validator']; 
        $this->c['flash/session as flash'];
        $this->c['jelly as jellyForm'];
        $this->db = $this->c['service provider database']->get(['connection' => 'betforyousystem']);
    }

    /**
     * Index
     * 
     * @return void
     */
    public function index()
    {
        if ($this->request->post('submit')) {
            $this->validator->setRules('form_attr_name', 'Form name', 'required|callback_name');
            $this->validator->func(
                'callback_name',
                function () {
                    $this->db->prepare('SELECT * FROM forms WHERE form_attr_name = ?');
                    $this->db->bindValue(1, $this->request->post('form_attr_name'), PARAM_STR);
                    $this->db->execute();

                    if ($this->db->count() > 0) {
                        $this->setMessage('callback_name', 'Form name has already taken.');
                        return false;
                    }
                    return true;
                }
            );
            if ($this->validator->isValid()) {
                $data = array();
                $data['form_attr_name']     = $this->request->post('form_attr_name');
                $data['form_attr_id']       = $this->request->post('form_attr_id');
                $data['form_resource_id']   = $this->request->post('form_resource_id');
                $data['form_attr_action']   = $this->request->post('form_attr_action');
                $data['form_attr_extra']    = $this->request->post('form_attr_extra');
                $data['form_attr_method']   = $this->request->post('form_attr_method');
                $data['form_creation_date'] = time();

                $e = $this->db->transaction(
                    function () use ($data) {
                        $this->jellyForm->insertForm($data);
                        if ($this->request->post('add_permission')) {
                            $permData['permission_name']        = $this->request->post('permission_name');
                            $permData['permission_type']        = $this->request->post('permission_type');
                            $permData['permission_parent_id']   = $this->request->post('permission_parent_id');
                            $permData['permission_resource_id'] = $this->request->post('permission_resource_id');
                            $this->jellyForm->addPermission($permData);
                        }
                    }
                );
                if (is_object($e)) {
                    $this->form->setMessage($e->getMessage(), NOTICE_ERROR);
                } else {
                    $this->form->setMessage('Form has successfully added.', NOTICE_SUCCESS);
                }
            }
        }
        $this->jellyForm->load('save'); // Set widget "formSave"
        $form = $this->jellyForm->save->printSaveForm(
            '/jelly/add_form',
            '',
            array(
                'method' => 'POST',
                'class'  => 'form-horizontal',
                'name'   => 'saveForm',
                'role'   => 'form'
            )
        );
        $this->jellyForm->load('lists'); // Set new \widget "formList"
        $tableList = $this->jellyForm->lists->printList('class="table table-bordered" id="data-table"');

        $this->view->load(
            'add_form', 
            [
                'formData' => $form,
                'tableList' => $tableList,
            ]
        );
    }
}

/* End of file add_form.php */
/* Location: .public/jelly/controller/add_form.php */
