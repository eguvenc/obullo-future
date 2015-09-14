<?php 

 namespace Widgets\Jelly;

/**
 * $app test_update_all_elements
 * 
 * @var Controller
 */
class Test_Update_All_Elements extends \Controller
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
	

        $this->user->setUserId(1);
        $this->user->setRoleIds($this->rbac->user->getRoles());
        $this->rbac->resource->setId('admin/user/edit');

        $this->jellyForm->setId('update_form');

        $this->db->where('user_id', 1);
        $this->db->get('users');
        $row = $this->db->rowArray();
        
        $birthdate = explode('-', $row['birthdate']);
        $row['day']   = $birthdate[2];
        $row['month'] = $birthdate[1];
        $row['year']  = $birthdate[0];

        $this->jellyForm->setValues($row);

        if ($this->request->isPost()) {

            if ( ! $this->jellyForm->validate('update')) {

                $this->form->setErrors($this->validator);
                $this->form->setMessage('There are some errors in the form.');
                
            } else {
                $e = $this->db->transaction(
                    function () {
                        $this->db->where('user_id', $this->request->post('user_id'));
                        $this->db->update('users', $this->jellyForm->getValues());
                    }
                );
                if (is_object($e)) {
                    $this->form->setMessage($e->getMessage(), NOTICE_ERROR);
                } else {
                    $this->form->setMessage('User successfully updated.', NOTICE_SUCCESS);
                }
            }        
        }
        if ($this->request->isAjax()) { // Form is ajax post?
            echo $this->response->json($this->form->getOutput());
            return;
        }
        // Example
        // Append hidden input
        // ----------------------
        $this->jellyForm->append(
            13,
            array(
                'type'  => 'hidden',
                'name'  => 'user_id',
                'value' => $row['user_id'],
                'rules' => 'required|isNumeric',
            )
        );
        // Example
        // Override username input
        // ---------------------------
        // $this->jellyForm->override(
        //     1,
        //     array(
        //         'name'  => 'username',
        //         'value' => 'test'
        //     )
        // );

        $this->jellyForm->render('update'); // Create the form.
        $this->view->load('test_form');
    
	}


/* End of file test_update_all_elements.php */
/* Location: .public/jform/controller/test_update_all_elements.php */
}