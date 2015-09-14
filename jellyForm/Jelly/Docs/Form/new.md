## Jelly Form Class

Jelly Form Class

<a href="https://raw.githubusercontent.com/obullo/demo_blog/2f3ed528f978240e9075b285c48e6d3bce7191e7/assets/jelly/images/diagram.png" target="_blank"><img src="https://raw.githubusercontent.com/obullo/demo_blog/2f3ed528f978240e9075b285c48e6d3bce7191e7/assets/jelly/images/diagram.png"></a>

<ul>
    <li><a href='#creatingforms'>Creating forms to database</a></li>
        <ul>
    	   <li><a href='#createanexampleinsertform'>Create an example insert form.</a></li>
           <li><a href='#createanexampleinsertformforajax'>Create an example insert form for ajax.</a></li>
        </ul>
    <li><a href='#updatingforms'>Updating forms to database</a></li>
        <ul>
           <li><a href='#createanexampleupdateform'>Create an example update form</a></li>
        </ul>
    <li><a href='#readingforms'>Reading forms to database</a></li>
</ul>

### Initializing the Class

------

First you need to define <kbd>Jelly/Form</kbd> class as services. Update your service.php

```php
<?php
/*
|--------------------------------------------------------------------------
| Jelly Form
|--------------------------------------------------------------------------
*/
$c['jelly/form'] = function () use ($c) {
    return new JellyForm(
        $c, 
        array(
            'db.form_tablename'    => 'forms',
            'db.group_tablename'   => 'form_groups',
            'db.option_tablename'  => 'form_options',
            'db.element_tablename' => 'form_elements',
            'tpl.elementDiv' => '<div class="col-sm-12" %s>
            <label class="label-control col-sm-3">%s</label>
                <div class="form-group col-sm-9">
                    %s
                </div>
            </div>',
            'tpl.descriptionDiv' => '<div class="col-sm-12" style="margin-top: -10px; margin-left: 3px">
            <label class="label-control col-sm-3"></label>
                <div class="form-group col-sm-9">
                    %s
                </div>
            </div>',
            'tpl.groupElementDiv' => array(
                'groupedDiv' => '<div class="col-sm-12">
                    <div class="col-sm-3"></div>
                    <div id="%s_inputError" class="col-sm-9"></div>
                    <label class="label-control col-sm-3">%s</label>
                    %s
                </div>', // We replace groupedDiv's "%s"
                         // with parentDiv value after that foreach process.
                'parentDiv' => '##label##
                                <div class="form-group col-sm-%d">%s</div>',
                // The label field is not empty, We are replace the parenDiv => ##label##
                'parentLabel' => '<label class="label-control col-sm-1" for="">%s</label>'
            ),
            'ajax.function' => 'submitAjax(%s)'
        )
    );
};
```

```php
<?php
$c->load('service/jelly/form');
$this->jellyForm->method();
```

### Form Query Operations ( Reading Forms ) <a name='readingforms'></a>

------

#### $this->jellyForm->getForm($primaryKey, $select);

Get one form.

```php
<?php
print_r($this->jellyForm->getForm($primaryKey = 1, 'id,name,resource_id'));
// Gives
Array
(
    [id] => 1
    [name] => userEdit
    [resource_id] => admin/user/edit
)
```

#### $this->jellyForm->getAllForms($select);

Get all forms.

```php
<?php
print_r($this->jellyForm->getAllForms('id,name,resource_id,action,attribute'));
// Gives
Array
(
    [0] => Array
        (
            [id] => 1
            [name] => updateTwoElements
            [resource_id] => admin/user/edit
            [action] => /jelly/test_update_two_elements
            [attribute] => id="user"
        )
    [1] => Array
        (
            [id] => 2
            [name] => updateAllElements
            [resource_id] => admin/user/edit
            [action] => /jelly/test_update_all_elements
            [attribute] => id="user"
        )
)
```

#### $this->jellyForm->getFormElement($primaryKey, $select);

Get one form element.

```php
<?php
print_r($this->jellyForm->getFormElement(1, 'id,label,name,rules'));
// Gives
Array
(
    [id] => 1
    [label] => Username
    [name] => username
    [rules] => required|min(4)|max(25)
)
```

#### $this->jellyForm->getFormElements($formId, $select);

Get all elements of the form.

```php
<?php
print_r($this->jellyForm->getFormElements(1, 'id,label,name,rules'));
// Gives
Array
(
    [0] => Array
        (
            [id] => 1
            [label] => Username
            [name] => username
            [rules] => required|min(4)|max(25)
        )
    [1] => Array
        (
            [id] => 2
            [label] => Email
            [name] => email
            [rules] => required|email
        )
    [2] => Array
        (
            [id] => 3
            [label] => First Name
            [name] => firstname
            [rules] => required|min(3)|max(30)
        )
)
```

#### $this->jellyForm->getFormGroup($primaryKey, $select);

Get one group.

```php
<?php
print_r($this->jellyForm->getFormGroup(1, 'id,name,label,class,func'));
// Gives
Array
(
    [id] => 1
    [name] => birthdate
    [label] => Birthdate
    [class] => birthdate
    [func] => function($data) { return implode('-', $data); }
)
```

#### $this->jellyForm->getFormGroups($formId, $select);

Get all groups of the form.

```php
<?php
print_r($this->jellyForm->getFormGroups(1, 'id,name,label,class,func'));
// Gives
Array
(
    [0] => Array
        (
            [id] => 1
            [name] => birthdate
            [label] => Birthdate
            [class] => birthdate
            [func] => function($data) { return implode('-', $data); }
        )
    [1] => Array
        (
            [id] => 2
            [name] => testRadio
            [label] => Radio
            [class] => radio
            [func] => function($data) { if (isset($data['foo'])) { return 'bar'; } }
        )
)
```

#### $this->jellyForm->getFormOption($primaryKey, $select);

Get one option.

```php
<?php
print_r($this->jellyForm->getFormOption(1, 'id,form_id,name,value'));
// Gives
Array
(
    [id] => 1
    [form_id] => 1
    [name] => ajax
    [value] => 1
)
```

#### $this->jellyForm->getFormOptions($formId, $select);

Get all options of the form.

```php
<?php
print_r($this->jellyForm->getFormOptions(1, 'id,form_id,name,value'));
// Gives
Array
(
    [0] => Array
        (
            [id] => 3
            [form_id] => 1
            [name] => ajax
            [value] => 1
        )
    [1] => Array
        (
            [id] => 2
            [form_id] => 1
            [name] => foo
            [value] => bar
        )
)   
```

### Save Operations ( Creating Forms )

-----

##### Create an example insert form. <a name='createanexampleinsertform'></a>

The creation of forms that are created in the database.

```php
<?php
$this->user->setUserId($this->auth->data('user_id'));
$this->user->setRoleIds($this->user->getRoles());

if ($this->user->hasPagePermission('user/create') === false) {
    $this->response->show404();
    return;
}

if ($this->request->isPost()) {

    $this->validator->func(
        'callback_username',
        function () {
            $this->db->prepare('SELECT * FROM users WHERE user_username = ?');
            $this->db->bindValue(1, $this->post['user_username'], PARAM_STR);
            $this->db->execute();

            if ($this->db->count() > 0) {
                $this->setMessage('callback_username', 'Username has already taken.');
                return false;
            }
            return true;
        }
    );

    if ( ! $this->jellyForm->validate('insert')) {

        $this->form->setErrors($this->validator);
        $this->form->message('There are some errors in the form.');

    } else {
        $e = $this->db->transaction(
            function () {
                $data = $this->jellyForm->getValues();
                $data['user_password'] = $this->password->hash($data['user_password']);
                $data['user_creation_date'] = time();
                $data['user_modification_date'] = 0;

                $this->db->insert('users', $data);
            }
        );
        if (is_object($e)) {
            $this->form->message($e->getMessage(), NOTICE_ERROR);
        } else {
            $this->form->message('User successfully inserted.', NOTICE_SUCCESS);
        }
    }
}

$this->jellyForm->setId('addNewUserForm');
$this->jellyForm->render('insert');
$this->jellyForm->setValues($this->post[true]); // If ajax form you don't need to use this function.

// Now you can use this functions in view page.
// echo $this->jellyForm->printOpen();
// echo $this->jellyForm->printForm();
// echo $this->jellyForm->printSubmit();
// echo $this->jellyForm->printClose();

$this->view->load(
    'user_create',
    function () use ($columns) {
        $this->getScheme('default');
        $this->assign('footer', $this->template('footer'));
    }
);
```

##### Create an example insert form for ajax. <a name='createanexampleinsertformforajax'></a>

```php
<?php
$this->user->setUserId($this->auth->data('user_id'));
$this->user->setRoleIds($this->user->getRoles());
if ($this->user->hasPagePermission('user/create') === false) {
    $this->response->show404();
    return;
}

if (sizeof($this->post[true]) == 0) {

    $this->jellyForm->setId('addNewUserForm');
    $this->jellyForm->render('insert');

    $r = array(
        'success' => NOTICE_SUCCESS,
        'open'    => $this->jellyForm->printOpen(),
        'close'   => $this->jellyForm->printClose(),
        'data'    => $this->jellyForm->printForm(),
        'submit'  => $this->jellyForm->printSubmit()
    );
    echo json_encode($r);
    return;
}

$this->validator->func(
    'callback_username',
    function () {
        $this->db->prepare('SELECT * FROM users WHERE user_username = ?');
        $this->db->bindValue(1, $this->post['user_username'], PARAM_STR);
        $this->db->execute();

        if ($this->db->count() > 0) {
            $this->setMessage('callback_username', 'Username has already taken.');
            return false;
        }
        return true;
    }
);

if ($this->request->isPost()) {

    if ( ! $this->jellyForm->validate('insert')) {

        $this->form->setErrors($this->validator);
        $this->form->mess('There are some errors in the form.');

    } else {
        $e = $this->db->transaction(
            function () {
                $data = $this->jellyForm->getValues();
                $data['user_password'] = $this->password->hash($data['user_password']);
                $data['user_creation_date'] = time();
                $data['user_modification_date'] = 0;

                $this->db->insert('users', $data);
            }
        );
        if (is_object($e)) {
            $this->form->message($e->getMessage(), NOTICE_ERROR);
        } else {
            $this->form->message('User successfully inserted.', NOTICE_SUCCESS);
        }
    }
}
echo $this->response->json($this->form->output());
return;
```

### Update Operations. <a name='updatingforms'></a>

-----

##### Create an example update form. <a name='createanexampleupdateform'></a>

Create update form using the "user form".

```php
<?php
$this->user->setUserId($this->auth->data('user_id'));
$this->user->setRoleIds($this->user->getRoles());

if ($this->user->hasPagePermission('user/update') === false) {
    $this->response->show404();
    return;
}

$this->jellyForm->setId('userUpdateForm');
$id = (int)$this->post['user_id']; // or you can use get.

if ($id > 0) {
    $this->db->prepare(
        'SELECT user_id,
                user_username,
                user_email,
                user_firstname,
                user_surname,
                user_birthdate,
                user_status,
                user_mobile_phone,
                user_phone
                FROM users WHERE user_id = ?'
    );
    $this->db->bindValue(1, $id, PARAM_INT);
    $this->db->execute();
    $row = $this->db->rowArray();

    if ($this->db->count() == 0) {
        $r = array(
            'success' => NOTICE_ERROR,
            'data'    => '',
            'submit'  => '',
        );
        echo json_encode($r);
        return;
    }
    $this->jellyForm->setValues($row);
    $this->jellyForm->append(1, array('type'  => 'hidden', 'name'  => 'user_id', 'value' => $id));
    $this->jellyForm->render('update'); // Create the form.
    $r = array(
        'success' => NOTICE_SUCCESS,
        'open'    => $this->jellyForm->printOpen(),
        'close'   => $this->jellyForm->printClose(),
        'data'    => $this->jellyForm->printForm(),
        'submit'  => $this->jellyForm->printSubmit(),
    );
    echo json_encode($r);
    return;
}

$this->validator->func(
    'callback_username',
    function ($username) use ($id) {
        $this->db->prepare('SELECT user_id,user_username FROM users WHERE user_username = ?');
        $this->db->bindValue(1, $username, PARAM_STR);
        $this->db->execute();
        $row = $this->db->rowArray();

        if ($this->db->count() > 0) {
            if ($row['user_id'] == $id) {
                return true;
            }
            $this->setMessage('callback_username', 'Username has already taken.');
            return false;
        }
        return true;
    }
);
// Set rule for append field.
$this->jellyForm->setRules('user_id', 'User id', 'required|isNumeric');

if ( ! $this->jellyForm->validate('update')) {

    $this->form->setErrors($this->validator);
    $this->form->message('There are some errors in the form.');

} else {
    $e = $this->db->transaction(
        function () use ($id) {

            $data = $this->jellyForm->getValues(); // get safely data.

            if (empty($data['user_password'])) {
                unset($data['user_password']);
            } else { // if set new password we can change password hash.
                $data['user_password'] = $c->load('service/password')->hash($data['user_password']);
            }
            $data['user_modification_date'] = time();

            $this->db->where('user_id', $id;
            $this->db->update('users', $data);
        }
    );
    if (is_object($e)) {
        $this->form->message($e->getMessage(), NOTICE_ERROR);
    } else {
        $this->form->message('User successfully inserted.', NOTICE_SUCCESS);
    }
}
echo $this->response->json($this->form->output());
return;
```

<b>If you want use group inputs, you need to before the last function <kbd>response->json()</kbd> set key <kbd>'groupData'</kbd></b>

```php
$this->form->setKey('groupData', $this->jellyForm->getGroupData());
echo $this->response->json($this->form->output());
return;
```

### Delete Operations

-----

An example delete user.

```php
$c->load('service/rbac/user');

$this->user->setUserId($this->auth->data('user_id'));
$this->user->setRoleIds($this->user->getRoles());

if ($this->user->hasPagePermission('user/delete', 'delete') === false) {
    $this->response->show404();
    return;
}

try {
    $this->db->transaction();
    $this->user->deleteRoleFromUsers($this->post['user_id']);
    $this->db->prepare('DELETE FROM users WHERE user_id = ?');
    $this->db->bindValue(1, $this->post['user_id'], PARAM_INT);
    $this->db->execute();
    $this->db->commit();
    $this->form->message('User successfully deleted.', NOTICE_SUCCESS);
} catch (Exception $e) {
    $this->db->rollBack();
    $this->form->message($e->getMessage(), NOTICE_ERROR);
}
```

### Function Reference

-----

#### $this->jellyForm->printOpen();

Open a form tag. ```<form action="" name="">```

#### $this->jellyForm->printForm();

Print a form all elements, except submit.

#### $this->jellyForm->printSubmit();

Print a submit button. ```<input type="submit" onclick="submitAjax('saveForm')"/>```

#### $this->jellyForm->printClose();

Print a form close tag. ```</form>```

#### $this->jellyForm->setRules(string $field, string $label, string $rules);

Set rules.

#### $this->jellyForm->getForm(int $primaryKey, mixed $select);

Get one form.

#### $this->jellyForm->getFormElement(int $primaryKey, mixed $select);

Get one form element.

#### $this->jellyForm->getAllForms(mixed $select);

Get all forms.

#### $this->jellyForm->getFormElements(int $formId,mixed $select);

Get all elements of the form.

#### $this->jellyForm->getFormGroup(int $primaryKey,mixed $select);

Get one group.

#### $this->jellyForm->getFormGroups(int $formId,mixed $select);

Get all groups of the form.

#### $this->jellyForm->getFormOption(int $primaryKey,mixed $select);

Get one option.

#### $this->jellyForm->getFormOptions(int $formId,mixed $select);

Get all options of the form.

#### $this->jellyForm->insertForm(array $data);

Add a new form to database.

#### $this->jellyForm->insertFormElement(array $data);

Add a new form element to "form_elements" table.

#### $this->jellyForm->insertFormOption(array $data);

Add a new custom form option to "form_options" table.

#### $this->jellyForm->insertFormGroup(array $data);

Groups is a wrapper for your form elements this functions adds a group to your form_groups table.

#### $this->jellyForm->updateForm(array $data);

Update form table.

#### $this->jellyForm->updateFormElement(array $data);

Update form element table.

#### $this->jellyForm->updateFormOption(array $data);

Update form option table.

#### $this->jellyForm->updateFormGroup(array $data);

Update form group table.

#### $this->jellyForm->deleteForm(int $primaryKey);

Delete form table.

#### $this->jellyForm->deleteFormElement(int $primaryKey);

Delete form element table.

#### $this->jellyForm->deleteFormOption(int $primaryKey);

Delete form option table.

#### $this->jellyForm->deleteFormGroup(int $primaryKey);

Delete form group table.

#### $this->jellyForm->render(int $primaryKey, mixed $select);

Create of forms that are created in the database.

#### $this->jellyForm->setValues(array $values = array());

Set form values.

#### $this->jellyForm->setId(string $id);

Set form identifier.

#### $this->jellyForm->toArray($data = null);

If type of data is array return it as json type, otherwise return the same data type

#### $this->jellyForm->toJson($data = null, $jsonType = true);

Return json.