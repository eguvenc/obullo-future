<?php 

 namespace Widgets\Jelly;

/**
 * $app edit group
 * 
 * @var Controller
 */
class Edit_Group extends \Controller
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
        $this->c['flash/session as flash'];
        $this->c['jelly as jellyForm'];
        $this->c['validator']; 
	}


	public function index($primaryKey)
	{
	
        if ($this->request->post('submit')) {
            $this->validator->setRules('form_group_name', 'Name', 'required');
            if ($this->validator->isValid()) {
                $data = array();
                $data['form_group_id']               = $primaryKey;
                $data['forms_form_id']               = $this->request->post('forms_form_id');
                $data['form_group_name']             = $this->request->post('form_group_name');
                $data['form_group_label']            = $this->request->post('form_group_label');
                $data['form_group_value']            = $this->request->post('form_group_value');
                $data['form_group_widget']           = $this->request->post('form_group_widget');
                $data['form_group_class']            = $this->request->post('form_group_class');
                $data['form_group_form_to_database'] = $this->request->post('form_group_form_to_database');
                $data['form_group_database_to_form'] = $this->request->post('form_group_database_to_form');
                $data['form_group_order']            = $this->request->post('form_group_order');
                $data['form_group_description']      = $this->request->post('form_group_description');

                $e = $this->db->transaction(
                    function () use ($data) {
                        $this->jellyForm->updateFormGroup($data);
                    }
                );
                if (is_object($e)) {
                    echo $e->getMessage();
                    $this->form->setMessage($e->getMessage(), NOTICE_ERROR);
                } else {
                    $this->form->setMessage('Form group successfully edited.', NOTICE_SUCCESS);
                }
            }
        }
        $this->jellyForm->load('save'); // Set widget "formSave"
        $groupData = $this->jellyForm->getFormGroup($primaryKey, '*');
        $form = $this->jellyForm->save->printGroupEditForm(
            '/jelly/edit_group/'. $primaryKey,
            $groupData,
            array(
                'method'   => 'POST',
                'class'    => 'form-horizontal',
                'role'     => 'form',
                'name'     => 'saveForm',
            ),
            $groupData['forms_form_id']
        );
        $this->jellyForm->load('lists', $groupData['forms_form_id']); // Set new \widget "formList"
        $tableList = $this->jellyForm->lists->printGroupList('class="table table-bordered" id="data-table"');

        $this->view->load(
			'edit_group',
			[
                'formData' =>  $form,
                'tableList' =>  $tableList,
            ]
		);
	}
	/* End of file edit_group.php */
/* Location: .public/jelly/controller/edit_group.php */
}