<?php 

 namespace Widgets\Jelly;

/**
 * $app delete form
 * 
 * @var Controller
 */
class Delete_Form extends \Controller
{

	/**
	* Loader
	*
	* @return void
	*/
	public function load()
	{ 
        $this->c['url'];
        $this->c['db'];
        
        $this->c['flash/session as flash'];
        $this->c['jelly as jellyForm'];
        $this->c['user/agent']; 
	}


	public function index($formId)
	{
	
        $e = $this->db->transaction(
            function () use ($formId) {
                $this->jellyForm->deleteForm($formId);
            }
        );
        if ($e === true) {
            $this->flash->set(array('notice' => 'Form successfully deleted.', 'status' => NOTICE_SUCCESS));
        } else {
            $this->flash->set(array('notice' => $e->getMessage(), 'status' => NOTICE_ERROR));
        }
        $this->url->redirect($this->userAgent->getReferrer());
    
	}


/* End of file delete_form.php */
/* Location: .public/jform/controller/delete_form.php */
}