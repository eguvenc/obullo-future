<?php 

 namespace Widgets\Jelly;

/**
 * $app edit form
 * 
 * @var Controller
 */
class Edit_Form extends \Controller
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
            $this->validator->setRules('form_attr_name', 'Name', 'required');
            if ($this->validator->isValid()) {
                $data = array();
                $data['form_id']            = $primaryKey;
                $data['form_attr_name']     = $this->request->post('form_attr_name');
                $data['form_attr_id']       = $this->request->post('form_attr_id');
                $data['form_resource_id']   = $this->request->post('form_resource_id');
                $data['form_attr_action']   = $this->request->post('form_attr_action');
                $data['form_attr_extra']    = $this->request->post('form_attr_extra');
                $data['form_attr_method']   = $this->request->post('form_attr_method');
                $data['form_creation_date'] = time();

                $e = $this->db->transaction(
                    function () use ($data) {
                        $this->jellyForm->updateForm($data);
                    }
                );
                if (is_object($e)) {
                    $this->form->setMessage($e->getMessage(), NOTICE_ERROR);
                } else {
                    $this->form->setMessage('Form successfully updated.', NOTICE_SUCCESS);
                }
            }
        }
        $this->jellyForm->load('save'); // Set widget "formSave"
        $form = $this->jellyForm->save->printEditForm(
            '/jelly/edit_form/'. $primaryKey,
            $this->jellyForm->getForm($primaryKey, 'form_attr_name,form_attr_id,form_resource_id,form_attr_action,form_attr_extra,form_attr_method'),
            array(
                'method' => 'POST',
                'class'  => 'form-horizontal',
                'role'   => 'form',
            )
        );
        $this->jellyForm->load('lists'); // Set new \widget "formList"
        $tableList = $this->jellyForm->lists->printList('class="table table-bordered" id="data-table"');
        
        $this->view->load(
			'edit_form',
			[
                'formData' =>  $form,
                'tableList' =>  $tableList,
            ]
		);
	}
	/* End of file edit_form.php */
/* Location: .public/jelly/controller/edit_form.php */
}