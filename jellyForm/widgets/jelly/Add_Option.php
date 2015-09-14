<?php 

 namespace Widgets\Jelly;

/**
 * $app add form
 * 
 * @var Controller
 */
class Add_Option extends \Controller
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


	public function index($formId = '')
	{
	
        if ($this->request->post('submit')) {
            $this->validator->setRules('forms_form_id', 'Form id', 'required|isNumeric');
            $this->validator->setRules('form_option_name', 'Option name', 'required|callback_name');
            $this->validator->setRules('form_option_value', 'Option value', 'required|isNumeric');
            $this->validator->func(
                'callback_name',
                function () {
                    $this->db->prepare('SELECT form_option_name FROM form_options WHERE form_option_name = ? AND forms_form_id = ?');
                    $this->db->bindValue(1, $this->request->post('form_option_name'), PARAM_STR);
                    $this->db->bindValue(2, $this->request->post('forms_form_id'), PARAM_INT);
                    $this->db->execute();
                    
                    if ($this->db->count() > 0) {
                        $this->setMessage('callback_name', 'Option name has already taken.');
                        return false;
                    }
                    return true;
                }
            );
            if ($this->validator->isValid()) {
                $data = array();
                $data['forms_form_id']     = $this->request->post('forms_form_id');
                $data['form_option_name']  = $this->request->post('form_option_name');
                $data['form_option_value'] = $this->request->post('form_option_value');
                $e = $this->db->transaction(
                    function () use ($data) {
                        $this->jellyForm->insertFormOption($data);
                    }
                );
                if (is_object($e)) {
                    $this->form->setMessage($e->getMessage(), NOTICE_ERROR);
                } else {
                    $this->form->setMessage('Option successfully added.', NOTICE_SUCCESS);
                }
            }
        }
        $this->jellyForm->load('save'); // Set widget "formSave"
        $form = $this->jellyForm->save->printOptionSaveForm(
            '/jelly/add_option/' . $formId,
            '',
            array(
                'method'   => 'POST',
                'class'    => 'form-horizontal',
                'role'     => 'form',
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