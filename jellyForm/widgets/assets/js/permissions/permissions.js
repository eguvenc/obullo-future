$.fn.betAdminTable = function()
{

	var rows  			= $(this).find('tbody tr');
	var table 			= $(this);
  	$.each(rows, function(index, val)
  	{
  		var dataID 		= $(this).attr('data-id');
  		var dataParent	= $(this).attr('data-parent');
  		var padding = (70*dataParent) + "px";
  		$(this).find('td:first-child').css('paddingLeft', padding);
  		if (dataParent)
  			{
  				$(this).addClass('hidden');
  			};
  	});

  	$(document).on('click',".toggleChild", function(event)
  	{
  		event.preventDefault();
  		var currentElem = $(this);
  		var parent   	  = $(this).parent().parent();
  		var parentID  	= $(this).parent().parent().attr('data-id');

  		$(rows).each(function(index, el)
  		{
  			if ($(this).attr('data-parent')===parentID)
  				{ 
            
            $(this).toggleClass('hidden');
            $(this).nextUntil('tr.primary-row').toggle();

            if ($(currentElem).children('span.glyphicon').hasClass('glyphicon-plus'))
              {
                    $(currentElem).children('span.glyphicon').removeClass('glyphicon-plus').addClass('glyphicon-minus')
              }
            else
              {
                    $(currentElem).children('span.glyphicon').removeClass('glyphicon-minus').addClass('glyphicon-plus')
              }

  				}
  		});
  	});
};