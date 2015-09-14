<?php 

 namespace Widgets\Jelly;

/**
 * $app test_insert_two_elements
 * 
 * @var Controller
 */
class Test_Insert_Two_Elements extends \Controller
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
        $this->c['form/element'];

        $this->c['crud as db'];
        $this->c['request'];
        $this->c['validator'];
        $this->c['jelly as jellyForm']; 
	}


	public function index()
	{
	
        $this->user->setUserId(2);
        $this->user->setRoleIds($this->rbac->user->getRoles());
        $this->rbac->resource->setId('admin/user/add');
        $this->jellyForm->setId('insert_form_two');
        $this->jellyForm->setValues($this->request->post(true));

        if ($this->request->isPost()) {

            if ( ! $this->jellyForm->validate('insert')) {

                $this->form->setErrors($this->validator);
                $this->form->setMessage('There are some errors in the form.');
                
            } else {
                $e = $this->db->transaction(
                    function () {
                        $this->db->insert('users', $this->jellyForm->getValues());
                    }
                );
                if (is_object($e)) {
                    $this->form->setMessage($e->getMessage(), NOTICE_ERROR);
                } else {
                    $this->form->setMessage('User successfully inserted.', NOTICE_SUCCESS);
                }
            }
        }
        if ($this->request->isAjax()) { // Form is ajax post?
            echo $this->response->json($this->form->getOutput());
            return;
        }
        $this->jellyForm->render('insert'); // Create the form.
        $this->view->load('test_form');
    
	}



/* End of file test_insert_two_elements.php */
/* Location: .public/jform/controller/test_insert_two_elements.php */
}