<?php

/**
 * Jelly Submit
 * 
 * @category  Jelly
 * @package   Elements
 * @author    Obullo Framework <obulloframework@gmail.com>
 * @author    Ali Ihsan Caglayan <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/package/jelly
 */
Class Jelly_View_Elements_Submit implements Jelly_View_Elements_ElementsInterface
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
    }

    /**
     * Render
     * 
     * @param object $view View object
     * 
     * @return string
     * @todo line 71 change to Form\Element\Button
     */
    public function render(Jelly_View_View $view)
    {
        $data  = $view->getFieldData();
        $extra = $view->getFieldExtraData();

        if (strpos($data[Jelly_Form::ELEMENT_ATTRIBUTE], '{') !== false) {
            if (preg_match('#(?<key>{.*?})#', $data[Jelly_Form::ELEMENT_ATTRIBUTE], $match)) {
                $callBack = preg_replace_callback(
                    $match['key'],
                    function ($val) use ($data, $view) {
                        $values = $view->getFormValues();
                        return isset($values[$val[0]]) ? $values[$val[0]] : $data[Jelly_Form::ELEMENT_ATTRIBUTE];
                    },
                    $data[Jelly_Form::ELEMENT_ATTRIBUTE]
                );
                $data[Jelly_Form::ELEMENT_ATTRIBUTE] = str_replace(array('{', '}'), '', $callBack);
            }
        }

        if ($view->isAjax() === true) {
            $formId = "'". (string)$view->formData[Jelly_Form::FORM_ID] ."'";
            $data[Jelly_Form::ELEMENT_ATTRIBUTE] = ' onClick="'. sprintf($this->jellyForm->params['ajax.function'], $formId) .'"'. $data[Jelly_Form::ELEMENT_ATTRIBUTE];
        }
        // $value = $data[Jelly_Form::ELEMENT_VALUE];
        
        if ($view->isTranslatorEnabled() === true) {
            $this->c->load('translator');
            $data[Jelly_Form::ELEMENT_LABEL]       = $this->c['translator'][$data[Jelly_Form::ELEMENT_LABEL]];
            $extra[Jelly_Form::ELEMENT_LABEL]      = $this->c['translator'][$extra[Jelly_Form::ELEMENT_LABEL]];
            $data[Jelly_Form::ELEMENT_DESCRIPTION] = $this->c['translator'][$data[Jelly_Form::ELEMENT_DESCRIPTION]];
            $extra[Jelly_Form::GROUP_LABEL]        = isset($extra[Jelly_Form::GROUP_LABEL]) ? $this->c['translator'][$extra[Jelly_Form::GROUP_LABEL]] : '';
        }
        
        $element = $this->validator->getError($data[Jelly_Form::ELEMENT_NAME]);
        $element.= $this->formElement->button(array('type' => 'submit'), $data[Jelly_Form::ELEMENT_VALUE], $data[Jelly_Form::ELEMENT_ATTRIBUTE]);
        // $element.= '<button name="'. $data[Jelly_Form::ELEMENT_NAME] .'" type="submit"'. $data[Jelly_Form::ELEMENT_ATTRIBUTE] .'>'. $value .'</button>';
        // $element.= $this->formElement->submit($data[Jelly_Form::ELEMENT_NAME], $value, $data[Jelly_Form::ELEMENT_ATTRIBUTE]);

        if ($view->isGroup() === true) {
            
            if ($view->isGrouped() === true) {

                $elementTemp = $view->createHiddenInput($extra[Jelly_Form::ELEMENT_NAME]) . $view->getGroupElementsTemp();
                
                return $this->jellyForm->getGroupDiv(
                    $elementTemp,
                    $extra[Jelly_Form::GROUP_NAME],
                    $extra[Jelly_Form::GROUP_LABEL],
                    $extra[Jelly_Form::GROUP_CLASS]
                );
            }
            $element = $this->jellyForm->getGroupParentDiv($element, $view->getColSm(), $data[Jelly_Form::ELEMENT_LABEL]);

            if ($view->isGroupDescription()) {
                $element.= $this->jellyForm->getGroupDescriptionDiv($data[Jelly_Form::ELEMENT_DESCRIPTION], '');
            }
            return $element;
        }
        $view->setSubmit($element);
        return;
    }
}

// END Submit Class
/* End of file Submit.php */

/* Location: .Obullo/Jelly/Submit.php */