<?php 

 namespace Widgets\Jelly;

/**
 * $app add form
 * 
 * @var Controller
 */
class Edit_Option extends \Controller
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
            $this->validator->setRules('forms_form_id', 'Form id', 'required|isNumeric');
            $this->validator->setRules('form_option_name', 'option name', 'required');
            $this->validator->setRules('form_option_value', 'Option value', 'isNumeric');
            if ($this->validator->isValid()) {
                $data = array();
                $data['form_option_id']    = $primaryKey;
                $data['forms_form_id']     = $this->request->post('forms_form_id');
                $data['form_option_name']  = $this->request->post('form_option_name');
                $data['form_option_value'] = $this->request->post('form_option_value');

                $e = $this->db->transaction(
                    function () use ($data) {
                        $this->jellyForm->updateFormOption($data);
                    }
                );
                if (is_object($e)) {
                    $this->form->setMessage($e->getMessage(), NOTICE_ERROR);
                } else {
                    $this->form->setMessage('Option successfully updated.', NOTICE_SUCCESS);
                }
            }
        }
        $this->jellyForm->load('save'); // Set widget "formSave"
        $optionData = $this->jellyForm->getFormOption($primaryKey, 'form_option_id,forms_form_id,form_option_name,form_option_value');
        $formId = $optionData['forms_form_id'];
        unset($optionData['forms_form_id']);
        $form = $this->jellyForm->save->printOptionEditForm(
            '/jelly/edit_option/' . $primaryKey,
            $optionData,
            array(
                'method' => 'POST',
                'class'  => 'form-horizontal',
                'role'   => 'form',
            ),
            $formId
        );
        $this->jellyForm->load('lists', $formId); // Set new \widget "formList"

        $tableList = $this->jellyForm->lists->printOptionList('class="table table-bordered" id="data-table"');

        $this->view->load(
			'add_option',
			[
                'formData' =>  $form,
                'tableList' =>  $tableList,
            ]
		);
	}
	/* End of file add_form.php */
/* Location: .public/jelly/controller/add_form.php */
}