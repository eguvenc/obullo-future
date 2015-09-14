<?php

/**
 * Jelly Textarea
 * 
 * @category  Jelly
 * @package   Elements
 * @author    Obullo Framework <obulloframework@gmail.com>
 * @author    Ali Ihsan Caglayan <ihsancaglayan@gmail.com>
 * @copyright 2009-2014 Obullo
 * @license   http://www.gnu.org/licenses/gpl-3.0.html GPL Licence
 * @link      http://obullo.com/package/jelly
 */
Class Jelly_View_Elements_Textarea implements Jelly_View_Elements_ElementsInterface
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
        $element = $this->validator->getError($data[Jelly_Form::ELEMENT_NAME]);
        $element.= $this->formElement->textarea($data[Jelly_Form::ELEMENT_NAME], $data[Jelly_Form::ELEMENT_VALUE], $data[Jelly_Form::ELEMENT_ATTRIBUTE]);
        
        if ($view->isTranslatorEnabled() === true) {
            $this->c->load('return translator');
            $data[Jelly_Form::ELEMENT_LABEL]       = $this->c['translator'][$data[Jelly_Form::ELEMENT_LABEL]];
            $extra[Jelly_Form::ELEMENT_LABEL]      = $this->c['translator'][$extra[Jelly_Form::ELEMENT_LABEL]];
            $data[Jelly_Form::ELEMENT_DESCRIPTION] = $this->c['translator'][$data[Jelly_Form::ELEMENT_DESCRIPTION]];
            $extra[Jelly_Form::GROUP_LABEL]        = isset($extra[Jelly_Form::GROUP_LABEL]) ? $this->c['translator'][$extra[Jelly_Form::GROUP_LABEL]] : '';
        }
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
        $element = $this->jellyForm->getElementDiv($element, $extra[Jelly_Form::ELEMENT_LABEL]);
        $element.= $this->jellyForm->getDescriptionDiv($data[Jelly_Form::ELEMENT_DESCRIPTION], '');
        return $element;
    }
}

// END Textarea Class
/* End of file Textarea.php */

/* Location: .Obullo/Jelly/Textarea.php */