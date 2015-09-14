<?php

/**
 * Jelly Captcha
 * 
 * @category  Jelly
 * @package   Elements
 * @author    Obullo Framework <obulloframework@gmail.com>
 * @author    Ali Ihsan Caglayan <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/package/jelly
 */
Class Jelly_View_Elements_Captcha implements Jelly_View_Elements_ElementsInterface
{
    /**
     * Constructor
     * 
     * @param array $c container
     */
    public function __construct($c)
    {
        $this->c = $c;
        $this->validator   = $c->load('validator');
        $this->formElement = $c->load('form/element');
        $this->jellyForm   = $c['jelly'];
        $this->captcha     = $c->load('service/captcha');
    }

    /**
     * Render
     * 
     * @param object $view View object
     * 
     * @return string
     */
    public function render(Jelly_View_View $view)
    {
        $data  = $view->getFieldData();
        $extra = $view->getFieldExtraData();

        $element = $this->validator->getError($data[Jelly_Form::ELEMENT_NAME]);
        $element.= $this->formElement->input($data[Jelly_Form::ELEMENT_NAME], $data[Jelly_Form::ELEMENT_VALUE], $data[Jelly_Form::ELEMENT_ATTRIBUTE]);
        $tmp     = $this->jellyForm->getGroupParentDiv($element);
        $captcha = '<img src="/index.php/widgets/captcha/create" id="captchaImg">';
        $tmp    .= $this->jellyForm->getGroupParentDiv($captcha);
        $tmp    .= '<a href="javascript:void(0);" onclick="document.getElementById(\'captchaImg\').src=\'/index.php/widgets/captcha/create/\'+Math.random();" id="image">Refresh</a> ';

        return $this->jellyForm->getGroupDiv(
            $tmp,
            $extra['label']
        );
    }
}

// END Captcha Class
/* End of file Captcha.php */

/* Location: .Obullo/Jelly/Captcha.php */