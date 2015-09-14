"use strict";
/**
 * @package		LOGIN Object
 * @copyright 	2014 PARADOKS 	<http://www.obullo.com/>, PBetting <http://www.pbetting.com/>.
 * @author 		Rabih Abou Zaid <rabihsyw@gmail.com>
 * @dependency	Jquery, COMMON, TEMPLATE, POPUP
 *
 */


var LOGIN = new function (){

	var _params   = { 
		ajax : COMMON.ajax,
		confirmation : {
			
		}, /* setting verifying methods here */
		login_popup   : {
			/* step_name : '', ... */
		}, /* setting login-popup vars */
		steps : {},
		refreshInterval : {},
		invitePopup     : {}
	};
		
	var _private = { 
		loginFormPopup : function (next_step) {

			try {
				POPUP.setButton(next_step, 'Close' , function (){POPUP.close(next_step)});
				POPUP.modal(next_step, true); /* showing login-form popup */

	            _params.login_popup['form'] = FORM_FACTORY.create(next_step + '_form', true, true); /* creating form-js object for popup-login-form */
	            
	            _params.login_popup['form'].whenSubmit(function(res){ /* process popup-login-form response */
	               LOGIN.processLoginResponse(res);
	            });
	            
	            try {
		            _params.login_popup['form'].response = _params.json;    /* setting errors from header-login-form to popup-login-form */
		            _params.login_popup['form'].processErrorsResponse(_params.json.errors);    /* setting errors from header-login-form to popup-login-form */
		            _params.login_popup['form'].processMessagesResponse(_params.json.message); /* setting messages from header-login-form to popup-login-form */
		            
	            } catch (e) {
	            	COMMON.logger.warn(e);
	            }

	            if ($('#'+_params.login_popup['form'].formId).find('[name=username]').val().length == 0) {
	            	$('#'+_params.login_popup['form'].formId).find('[name=username]').val($('#Login_Form').find('[name=username]').val());
	            }

	        	_params.steps[next_step] = 1; /* define popup-login as a passed step // allows us to turn off the form and close popup */
			} catch (e_base) {
				COMMON.logger.error(e_base);
			}


		},
		confirmationPopup : function (next_step) {
				
			if (next_step == 'email_activation_popup') { /* if next-step is 'email-activation' : inject the the email address to popup and create link to verify email */
				
				POPUP.injectValue("email_address", _params.json.user_email);
			
				$(document).off('click', '#send-verify-email').on('click', '#send-verify-email', function (){
					LOGIN.sendVerifyingEmail();
				});
			}

			POPUP.modal(next_step, true); /* showing confirmation-login-popup */

            _params.confirmation['form'] = FORM_FACTORY.create(next_step + '_form'); /* creating form-object */

			try {
	            _params.confirmation['form'].response = _params.json; /* setting messages from header-login-form to popup-login-form */
	            _params.confirmation['form'].processMessagesResponse(_params.json.message); /* setting messages from header-login-form to popup-login-form */
	            
            } catch (e) {
            	COMMON.logger.log(e);
            }

            _params.confirmation.form.whenSubmit(function(res){
                LOGIN.processLoginResponse(res);
            });

            _params.steps[next_step] = 1; /* define popup-login as a passed step // allows us to turn off the form and close popup */
		},
	};
		
	var obj      = { 
		closeLoginPopup      : function () {
			if (_params.login_popup.hasOwnProperty('form')){

				POPUP.close('login_popup');
				_params.login_popup['form'].off();
				delete _params.login_popup['form'];
			}
		},
		closeConfimationPopup: function () {
			if (_params.confirmation.hasOwnProperty('form')){
				_params.confirmation['form'].off();
				delete _params.confirmation['form'];
			}
		},
		closeAllPopups 		 : function (except) {
			COMMON.logger.log( 'Opened popups : ', _params.steps);
			for (var i in _params.steps) {
				if (except !== i) {

					POPUP.close(i);
					POPUP.delete(i);
				}
			}
		},
		processLoginResponse : function (json) {
			
			try {
				json = jQuery.parseJSON(json);
			} catch (e) {

			}

			if (json.next_step) {
				_params.json = json; /* setting json response to local private valiable */

				switch (json.next_step) {
					case 'login_popup' : {

						obj.closeAllPopups(json.next_step);
						obj.closeConfimationPopup();

						obj.initNotLogedIn();

						_private.loginFormPopup(json.next_step);
                        break;
					}
					case 'header_refresh' : {

						obj.closeAllPopups();
						obj.closeLoginPopup();
						obj.closeConfimationPopup();

						/* then initalize header refresh for members */
						obj.initLogedIn();
						$(document).trigger(CUSTOM_EVENTS.get('login'));
						
						break;
					}
					default : {

						obj.closeLoginPopup();

						_private.confirmationPopup(json.next_step);
						break;
					}
				}
			}
		},
		checkCouponConfig : function(){
			var config = COMMON.sessionStorage.get('coupon_c');
            if (config && config['USER']) {
                return;
            }
            COMMON.JQueryAjax('/post/coupon_config', {}, {
                type  : 'GET',
                async : false
            }, function(response) {
                try { response = JSON.parse(response)} catch (e) {}
                if(typeof COUPON !== 'undefined') {
                	COUPON.setConfig(response);
                }
                COMMON.sessionStorage.set('coupon_c', response, 15);
            })
	        
		},
		sendVerifyingEmail : function () {
			return COMMON.ajax('/membership/send_activation_email');
		},
		headerRefreshLogedIn	   : function () {
			COMMON.ajax( '/header/items_refresh','',{type:'post', async : true}, function (response){
				try {
					try {
			        	response=jQuery.parseJSON(response);
					} catch (e1) {

					}
			        $('#new-message-count').text(response.message_count);
			        $('#nickname').text(response.username);
			        $('#user_id').text(response.account_id);
			        $('#realWallet').text(response.wallets.real.user_wallet_current_balance);
			        $('#bonusWallet').text(response.wallets.bonus.user_wallet_current_balance);
				} catch (e) {
					COMMON.logger.warn(e);
					obj.initNotLogedIn();
					$(document).trigger(CUSTOM_EVENTS.get('logout'));
				}
		    });
		},
		initLogedIn 	    : function () {

			$('#public-header').css('display', 'none');
			$('#member-header').css('display', 'block');
			LOGIN.headerRefreshLogedIn();
			// REFRESH_INTERVAL.start('member_header', "[data-ref='header-count-down']", function () {
			// 	obj.headerRefreshLogedIn();
			// }, 60);

			$(document).off('click', '[data-link="'+LINKS_STATICS.get('refresh_header')+'"]').on('click', '[data-link="'+LINKS_STATICS.get('refresh_header')+'"]', function () {
				// REFRESH_INTERVAL.forceRefresh('member_header');
			});
		},
		initNotLogedIn      : function () {
			// REFRESH_INTERVAL.stop('member_header');

			$('#member-header').css('display', 'none');
			$('#public-header').css('display', 'block');

			var Login_Form = FORM_FACTORY.create('Login_Form',false);
		    Login_Form.whenSubmit(
		        function(data){ 
		            LOGIN.processLoginResponse(data);
		        }, 
		        function () { 
		            if (! Login_Form.isValid() ){
		                LOGIN.processLoginResponse({
		                    'next_step' : 'login_popup',
		                    'message'   : LANG.errors.fill_fields,
		                });
		                return false;
		            }
		            return true;
		        }
		    );
		},
		inviteFriend 		: function () {
			
			POPUP.injectValue('randImg', Math.random()); /* this random value , to force reload captcha image and stop loading it from cache. */
			POPUP.modal('invitations_create', true); /* showing login-form popup */

			if (_params.invitePopup['form']) {
				_params.invitePopup['form'].off();
				delete _params.invitePopup['form'];
			}

			if (! _params.invitePopup['form']) {
				_params.invitePopup['form'] = FORM_FACTORY.create('invitations_create_form',true);
				_params.invitePopup['form'].setLoading(function(){
					 _params.invitePopup['form'].formElement.append($(document.createElement('div')).addClass('loading-cover'));
				});

				_params.invitePopup['form'].whenSubmit(
					 function(data){
							 _params.invitePopup['form'].formElement.find('.loading-cover').remove();
							 CaptchaRefresh("invationCaptcha");
							 if (data.success) {
									 POPUP.close('invitations_create');
							 }
					 }, 
					 function () { 
							 return true;
					 }
				);
			} 
		},
		resetFavourites : function (){
            COMMON.localStorage.erase('favourites');
        },
		init 				: function () {
			$(document).ready(function(){

				// if (COMMON.cookie.get('auth') && COMMON.cookie.get('auth') == 1) {
				// 	obj.initLogedIn();
				// } else {
				// 	obj.initNotLogedIn();
				// }
				
				$(document).on(CUSTOM_EVENTS.get('login_popup'), function(e, data){
					obj.processLoginResponse((! data || typeof data != 'object') ? {next_step : 'login_popup'} : data);
				});

				// $(document).on(CUSTOM_EVENTS.get('login'), function (){
				// 	COMMON.cookie.init();
				// 	try {
				// 			obj.resetFavourites();
				// 			FAVOURITES.forceAjax();
				// 	}catch(e1){
						
				// 	}
				// 	obj.checkCouponConfig();
				// });
			});
		}
	};

	return obj;
}();

LOGIN.init();