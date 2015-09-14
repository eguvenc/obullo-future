<?php 

 namespace Widgets\Jelly;

/**
 * $app add element
 * 
 * @var Controller
 */
class Add_Element extends \Controller
{

    /**
    * Loader
    *
    * @return void
    */
    public function load()
    { 
        $this->c['db'];
        $this->c['view'];
        $this->c['form'];
        $this->c['request']; 
        $this->c['validator'];
        $this->c['jelly as jellyForm'];
        $this->c['flash/session as flash'];
    }

    public function index($formId = '')
    {
        if ($this->request->isPost()) {
            $this->validator->setRules('forms_form_id', 'Form', 'required|isNumeric');
            $this->validator->setRules('form_element_name', 'Name', 'required|callback_name');
            $this->validator->setRules('form_element_type', 'Type', 'required|alpha');
            $this->validator->setRules('form_element_order', 'Order', 'required|isNumeric');
            $this->validator->func(
                'callback_name',
                function () {
                    //-- Only type radio allowed --//
                    if ($this->request->post('form_element_type') == 'radio') {
                        return true;
                    }
                    $this->db->prepare('SELECT forms_form_id,form_element_name FROM form_elements WHERE form_element_name = ? AND forms_form_id = ?');
                    $this->db->bindValue(1, $this->request->post('form_element_name'), PARAM_STR);
                    $this->db->bindValue(2, $this->request->post('forms_form_id'), PARAM_INT);
                    $this->db->execute();
                    if ($this->db->count() > 0) {
                        $this->setMessage('callback_name', 'Input name has already taken.');
                        return false;
                    }
                    return true;
                }
            );
            if ($this->validator->isValid()) {
                $data = array();
                $data['forms_form_id']                 = $this->request->post('forms_form_id');
                $data['form_element_type']             = $this->request->post('form_element_type');
                $data['form_element_value_type']       = $this->request->post('form_element_value_type');
                $data['form_element_name']             = $this->request->post('form_element_name');
                $data['form_element_title']            = $this->request->post('form_element_title');
                $data['form_element_rules']            = $this->request->post('form_element_rules');
                $data['form_element_widget']           = $this->request->post('form_element_widget');
                $data['form_element_label']            = $this->request->post('form_element_label');
                $data['form_element_attribute']        = $this->request->post('form_element_attribute');
                $data['form_element_value']            = $this->request->post('form_element_value');
                $data['form_element_form_to_database'] = $this->request->post('form_element_form_to_database');
                $data['form_element_database_to_form'] = $this->request->post('form_element_database_to_form');
                $data['form_element_order']            = $this->request->post('form_element_order');
                $data['form_groups_form_group_id']     = intval($this->request->post('form_groups_form_group_id'));
                $data['form_element_role']             = $this->request->post('form_element_role');
                $data['form_element_description']      = $this->request->post('form_element_description');

                $e = $this->db->transaction(
                    function () use ($data) { // Database save operation
                        $this->jellyForm->insertFormElement($data);
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
                    $this->form->setMessage('Form element successfully added.', NOTICE_SUCCESS);
                }
            }
        }
        $this->jellyForm->load('save'); // Set widget "formSave"
        $form = $this->jellyForm->save->printElementSaveForm(
            '/jelly/add_element/' . $formId,
            '',
            array(
                'method'   => 'POST',
                'class'    => 'form-horizontal',
                'role'     => 'form',
                'name'     => 'saveForm',
            ),
            $formId
        );
        $this->jellyForm->load('lists', $formId); // Set new \widget "formList"
        $tableList = $this->jellyForm->lists->printElementList('class="table table-bordered" id="data-table"');
        
        $this->view->load(
            'add_element',
            [
                'formData' =>  $form,
                'tableList' =>  $tableList,
            ]
        );
    }
}

/* End of file add_element.php */
/* Location: .public/jelly/controller/add_element.php */