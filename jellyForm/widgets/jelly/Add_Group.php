<?php 

 namespace Widgets\Jelly;

/**
 * $app add group
 * 
 * @var Controller
 */
class Add_Group extends \Controller
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
        $this->c['form'];
        $this->c['request'];
        $this->c['flash/session as flash'];
        $this->c['jelly as jellyForm'];
        $this->c['validator']; 
	}


	public function index($formId = '')
	{
	
        if ($this->request->post('submit')) {
            $this->validator->setRules('forms_form_id', 'Form', 'required|isNumeric');
            $this->validator->setRules('form_group_name', 'Group Name', 'required|callback_name');
            $this->validator->func(
                'callback_name',
                function () {
                    $this->db->prepare('SELECT form_group_name FROM form_groups WHERE form_group_name = ?');
                    $this->db->bindValue(1, $this->request->post('name'), PARAM_STR);
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
                $data['form_group_name']               = $this->request->post('form_group_name');
                $data['form_group_label']              = $this->request->post('form_group_label');
                $data['form_group_value']              = $this->request->post('form_group_value');
                $data['form_group_widget']             = $this->request->post('form_group_widget');
                $data['form_group_class']              = $this->request->post('form_group_class');
                $data['form_group_form_to_database']   = $this->request->post('form_group_form_to_database');
                $data['form_group_database_to_form']   = $this->request->post('form_group_database_to_form');
                $data['form_group_order']              = intval($this->request->post('form_group_order'));
                $data['form_group_number_of_elements'] = 0;
                $data['form_group_description']        = $this->request->post('form_group_description');
                $e = $this->db->transaction(
                    function () use ($data) {
                        $this->jellyForm->insertFormGroup($data);
                    }
                );
                if (is_object($e)) {
                    $this->form->error($e->getMessage());
                } else {
                    $this->form->success('Form group successfully added.');
                }
            }
        }
        $this->jellyForm->load('save'); // Set widget "formSave"
        $form = $this->jellyForm->save->printGroupSaveForm(
            '/jelly/add_group/' . $formId,
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
        $tableList = $this->jellyForm->lists->printGroupList('class="table table-bordered" id="data-table"');
        
        $this->view->load(
			'add_group',
			[
                'formData' =>  $form,
                'tableList' =>  $tableList,
            ]
		);
	}
	/* End of file add_group.php */
/* Location: .public/jelly/controller/add_group.php */
}