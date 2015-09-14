<?php
	$this->query = 'SELECT selected FROM users WHERE ';

	function addFilter($field, $value)
	{
		$this->query .= " AND  $field = $value";
	}

	function join()
	{

	}