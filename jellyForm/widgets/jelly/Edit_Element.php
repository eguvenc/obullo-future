<?php 

 namespace Widgets\Jelly;

/**
 * $app edit element
 * 
 * @var Controller
 */
class Edit_Element extends \Controller
{

	/**
	* Loader
	*
	* @return void
	*/
	public function load()
	{ 
        $this->c['view'];
        $this->c['db'];
        $this->c['request'];
        $this->c['form'];
        $this->c['request'];
        $this->c['flash/session as flash'];
        $this->c['jelly as jellyForm'];
        $this->c['validator']; 
	}


	public function index($primaryKey)
	{
	
        if ($this->request->post('submit')) {
            $this->validator->setRules('form_element_name', 'Name', 'required');
            if ($this->validator->isValid()) {
                $data = array();
                $data['form_element_id']               = $primaryKey;
                $data['forms_form_id']                 = $this->request->post('forms_form_id');
                $data['form_element_type']             = $this->request->post('form_element_type');
                $data['form_element_name']             = $this->request->post('form_element_name');
                $data['form_element_value_type']       = $this->request->post('form_element_value_type');
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
                    function () use ($data) {
                        $this->jellyForm->updateFormElement($data);
                    }
                );
                if (is_object($e)) {
                    $this->form->setMessage($e->getMessage(), NOTICE_ERROR);
                } else {
                    $this->form->setMessage('Form element successfully updated.', NOTICE_SUCCESS);
                }
            }
        }
        $this->jellyForm->load('save'); // Set widget "formSave"
        $elementData = $this->jellyForm->getFormElement($primaryKey, '*');

        $form = $this->jellyForm->save->printElementEditForm(
            '/jelly/edit_element/'. $primaryKey,
            $elementData,
            array(
                'method'   => 'POST',
                'class'    => 'form-horizontal',
                'role'     => 'form',
                'name'     => 'saveForm',
            ),
            $elementData['forms_form_id']
        );
        $this->jellyForm->load('lists', $elementData['forms_form_id']); // Set new \widget "formList"
        $tableList = $this->jellyForm->lists->printElementList('class="table table-bordered" id="data-table"');

        $this->view->load(
			'edit_element',
			[
                'formData' =>  $form,
                'tableList' =>  $tableList,
            ]
		);
	}
	/* End of file edit_element.php */
/* Location: .public/jelly/controller/edit_element.php */
}