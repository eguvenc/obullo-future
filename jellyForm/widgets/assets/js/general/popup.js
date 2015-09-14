/**
 * @package     POPUP Object
 * @copyright   2014 PARADOKS   <http://www.obullo.com/>, PBetting <http://www.pbetting.com/>.
 * @author      Rabih Abou Zaid <rabihsyw@gmail.com>
 * @dependency  Jquery, COMMON, LANG
 * 
 */

var POPUP =  new function () {

    var params   = {
        lang           : 'en',
        injectedValues : {},
        popup_str      : '',
        popup_obj      : {},
        buttons        : {}
    };
    
    var opened   = {};
    
    var _private = {
        buildModal  : function (name) {
            console.log('popup : ' + name, this.checkPopup(name));
            if (! this.checkPopup(name)) {

                params.popup_str = POPUP_HTML[name];
                this.fillTemplate();
// console.info(params.popup_str);
                params.popup_obj = $(params.popup_str);
                opened[name] = params.popup_obj;

                if (params.buttons[name] && opened[name].find('.modal-footer').length > 0) {
                    for (var i_b in params.buttons[name]) {
                        var btn          = $(document.createElement('button')).addClass('btn btn-primary').html(i_b).appendTo(opened[name].find('.modal-footer'));
                        btn.attr((params.buttons[name][i_b].attrs) ? params.buttons[name][i_b].attrs : {});
                        btn.attr('type', 'button');
                        
                        // var closureName  = name + i_b + 'Closure';

                        // console.info(closureName);
                        // POPUP[closureName] = function () {
                        var cljr = function () {
                            console.warn(i_b);
                        };

                        btn.off('click').on('click', params.buttons[name][i_b].func);
                        // btn[0].addEventListener('click', cljr, false);
                    }
                }

                if ($('body').find(opened[name]).length == 0) {
                    $('body').append(opened[name]);
                }
            }
        },
        buildDialog : function (name) {
            params.popup_str = POPUP_HTML[name];
            this.fillTemplate();

            params.popup_obj = $(params.popup_str);

            if (! this.checkPopup(name)) {
                var x = params.popup_obj.dialog({
                    title   : 'Modal title',
                    /*title   : (LANG.popup[name].title == null) ? 'Dialog Title' : LANG.popup[name].title,*/
                    autoOpen: false,
                    modal   : true,
                    minHeight : 350,
                    minWidth :450,
                    show: {
                        effect: "drop",
                        direction  : "up",
                        duration: 600
                    },
                    hide: {
                        effect: "drop",
                        direction  : "down",
                        duration: 600
                    },
                    close: function( event, ui ) {
                        /* obj.popup_obj.remove(); */

                        return;
                    }, 
                    buttons : (params.buttons.hasOwnProperty(name)) ? params.buttons[name].func : '',
                });
                opened[name] = x;
            }
            return opened[name];
        },
        checkPopup : function (name) {
            return (opened[name]) ? true : false;
        },
        fillTemplate : function (key, value) {
            params.popup_str = params.popup_str.replace(/##(\w*)##/gi, function(match, content) {
                return (params.injectedValues[content]) ? params.injectedValues[content] : '';
            });
        },
    };

    var obj      = {
        setLang : function (lang) {
            
            params.lang = lang;
        },
        show    : function (name) {

            obj = _private.buildDialog(name);
            
            opened[name].dialog('open');
        },
        modalSetHtml : function (name, html, getTemplate) {
            // if (! POPUP_HTML[name]) {
                var xhtml = '';
                if (getTemplate) {
                    xhtml = '<div class="modal fade" tabindex="-1" role="dialog"  aria-hidden="true" >\
                                <div class="modal-dialog ##modalClass##">\
                                    <div class="modal-content">\
                                        <div class="modal-header text-primary">\
                                            <button type="button" class="close" data-dismiss="modal">×</button>\
                                            <h3 class="noMargins">##title##</h3>\
                                        </div>\
                                        <div class="modal-body">\
                                            ' + html + '\
                                            <div class="row modal-row">\
                                                <div class="col-sm-12">\
                                                    <h5 class="control-label text-info">##popup_message##</h5>\
                                                </div>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>';
                } else {
                    xhtml = html;
                }
                POPUP_HTML[name] = xhtml;
            // }
            obj = _private.buildModal(name);
        },
        modal    : function (name, removeOnclose) {
            obj = _private.buildModal(name);

            opened[name].modal({show : true , backdrop : 'static', keyboard : true});

            opened[name].on('hide.bs.modal', function () {
                if (removeOnclose) {
                    delete opened[name];
                    delete params.buttons[name];
                    params.injectedValues = {};
                    $(this).remove();
                }
            });

            return opened[name];
        },
        newWindow : function (name, title, afterClose) {
            popupWindow = window.open(name, (title) ? title : name, 'left=20,top=20,menubar=0,scrollbars=1,resizable=1,width=1024,height=600');

            if (typeof afterClose == 'function') {
                popupWindow.onbeforeunload = function () {
                    popupWindow.window['afterClose'] = afterClose;
                    popupWindow.window['afterClose']();
                }
            }

            opened[name] = popupWindow;
            return false;
        },
        resetElement : function (name) {
            delete opened[name];
        },
        setButton : function (name, buttonName, buttonFunc , attrs) {
            var x = {}; 
            if (params.buttons[name]) {
                x = params.buttons[name];
            }
            x[buttonName] = {};
            x[buttonName]['func'] = buttonFunc;
            x[buttonName]['attrs'] = attrs
            // x[buttonName] = buttonFunc;

            params.buttons[name] = x;
        },
        close    : function (name) {
            if (_private.checkPopup(name)) {
                try {
                    opened[name].dialog('close');
                } catch (e) {
                    try {
                        opened[name].modal('hide');
                    } catch (e2) {
                    }
                }
            }
        },
        delete      : function (name) {
            if (_private.checkPopup(name)) {
                delete opened[name];
            }
        },
        injectValue : function (key, value) {
            params.injectedValues[key] = value;
        },
        reset       : function (name) {
            if (_private.checkPopup(name)) {
                opened[name].dialog('close').remove();
                delete opened[name];
            }
        },
        clearInjects : function () {
            params.injectedValues = {};
        },
        init         : function () {
            this.setLang(COMMON.userLang());
        }
    };

    return obj;
};

POPUP.init();



var POPUP_HTML = {
    login_popup : '<div class="modal fade" id="login-error-modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">\
                        <div class="modal-dialog"> \
                          <div class="modal-content"> \
                            <div class="modal-header">\
                                <button type="button" class="close" data-dismiss="modal">Ã—</button>\
                                <h2>LOGIN</h2>\
                            </div>\
                            <div class="modal-body">\
                                <div data-message-form="login_popup_form"></div>\
                                <div class="header-login-error-modal-left">\
                                    <p class="header-login-error-message">##msg##</p>\
                                    <form data-ajax="1" id="login_popup_form" method="post" action="/membership/login">\
                                        <div class="control-field">\
                                            <label class="control-label" for="">USERNAME</label>\
                                            <div class="controls">\
                                                <input type="text" class="login-error-input" id="" name="username" data-validate="required|minLen(6)|maxLen(15)">\
                                            </div>\
                                        </div>\
                                        <div class="control-field">\
                                            <label class="control-label" for="">PASSWORD</label>\
                                            <div class="controls">\
                                                <input type="password" class="login-error-input" id="" name="password" data-validate="required|minLen(8)|maxLen(15)">\
                                            </div>\
                                        </div>\
                                        <div class="control-field">\
                                            <div class="controls">\
                                                <button type="submit" class="btn btn-primary" id="header-submit" name="header-submit">LOGIN</button>\
                                                <span class="login-modal-login-error">errorMessage</span>\
                                            </div>\
                                            <a href="#" class="login-modal-forgotten-details">FORGOT PASSWORD</a>\
                                        </div>\
                                    </form>\
                                </div>\
                                <div class="header-login-error-modal-right">\
                                    <div class="modal-register-container">\
                                        <h3>GENERAL</h3>\
                                        <a href="membership/signup" class="getRegister-button"></a>\
                                    </div>\
                                </div>\
                                <div style="clear:both;"></div>\
                          </div>\
                          <div class="modal-footer"></div>\
                          </div>\
                      </div>\
                    </div>',
    test : '<div class="modal fade" tabindex="-1" role="dialog"  aria-hidden="true" >\
                        <div class="modal-dialog">\
                            <div class="modal-content">\
                                <div class="modal-header bg-info text-primary">\
                                    <button type="button" class="close" data-dismiss="modal">×</button>\
                                    <h2>##popup_title##</h2>\
                                </div>\
                                <div class="modal-body bg-info">\
                                    <div data-message-form="verify_code_popup_form"></div>\
                                    <div class="row modal-row">\
                                        <div class="col-sm-12">\
                                            <h5 class="control-label text-info">##popup_message##</h5>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                   </div>',
    verify_code_popup : '<div class="modal updateModal" tabindex="-1" role="dialog" aria-hidden="true"> \
                    <div class="modal-dialog ##modalClass##"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              <div class="modal-body">\
                              <div data-message-form="verify_code_popup_form"></div>\
                              ##content## \
                              <form action="/login/login_verify" class="" method="post" data-ajax="1" id="verify_code_popup_form">\
                                    <div class="col-sm-6">\
                                            <input type="text" name="verify_code" value=""  data-validate="required|exactLen(6)" class="form-control input-sm"/>\
                                    </div>\
                                    <div class="col-sm-2">\
                                            <button type="submit" class="btn btn-primary login-button" id="header-submit" name="header-submit">Continue</button>\
                                    </div>\
                                </form>\
                              <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> Cancel</button> \
                              </div> \
                        </div> \
                    </div> \
                </div>',
    generalContent    : '<div class="modal updateModal" tabindex="-1" role="dialog" aria-hidden="true"> \
                    <div class="modal-dialog"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              <div class="modal-body">\
                              <div id="responseContent"></div>\
                              ##content## \
                              <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer">##submit##<button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> ##cancel##</button> \
                              </div> \
                        </div> \
                    </div> \
                </div>',
    message : '<div class="modal fade" tabindex="-1" role="dialog"  aria-hidden="true" >\
                        <div class="modal-dialog">\
                            <div class="modal-content">\
                                <div class="modal-header bg-info text-primary">\
                                    <button type="button" class="close" data-dismiss="modal">×</button>\
                                    <h2>##popup_title##</h2>\
                                </div>\
                                <div class="modal-body bg-info">\
                                    <div data-message-form="verify_code_popup_form"></div>\
                                    <div class="row modal-row">\
                                        <div class="col-sm-12">\
                                            <h5 class="control-label text-info">##popup_message##</h5>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>\
                   </div>',    
    jellyEdit : '<div class="modal updateModal" tabindex="-1" role="dialog" aria-hidden="true"> \
                    <div class="modal-dialog ##modalClass##"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              ##open## \
                              <div class="modal-body">\
                              <table id="grid1" class="table table-bordered table-striped no-footer dataTable" ></table> \
                              <div class="clearfix"></div>\
                              <div id="response_##formID##"></div>\
                              ##content## \
                              <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer">##submit##<button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> ##cancel##</button> \
                              </div> \
                              ##close## \
                        </div> \
                    </div> \
                </div>',    
    gridList : '<div class="modal updateModal" tabindex="-1" role="dialog"> \
                    <div class="modal-dialog ##modalClass##""> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              <div class="modal-body">\
                              <div id="response_##responseId##"></div>\
                                <table id="##tableId##" class="table table-bordered table-striped">\
                                    <thead>\
                                        <tr>\
                                           ##th##\
                                        </tr>\
                                    </thead>\
                                </table>\
                              <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer">##submit##<button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> ##cancel##</button> \
                              </div> \
                        </div> \
                    </div> \
                </div>',    
    gridMultipleFormList : '<div class="modal updateModal" tabindex="-1" role="dialog"> \
                    <div class="modal-dialog ##modalClass##"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              <div class="modal-body">\
                              <div id="response_##responseId##"></div>\
                                ##filter##\
                                <table id="##tableId##" class="table table-bordered table-striped">\
                                    <thead>\
                                        <tr>\
                                           ##th##\
                                        </tr>\
                                    </thead>\
                                </table>\
                                <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-header"> \
                                    <h4 class="modal-title" id="myModalLabel">##formTitle##</h4>\
                              </div> \
                              ##open## \
                              <div class="modal-body">\
                                ##content## \
                              </div> \
                              <div class="clearfix"></div>\
                              <div class="modal-footer">##submit##<button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> ##cancel##</button> \
                              </div> \
                              ##close## \
                        </div> \
                    </div> \
                </div>',
    gridFormList : '<div class="modal updateModal" tabindex="-1" role="dialog"> \
                    <div class="modal-dialog"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              <div class="modal-body">\
                              <div id="response_##responseId##"></div>\
                                <table id="##tableId##" class="table table-bordered table-striped">\
                                    <thead>\
                                        <tr>\
                                           ##th##\
                                        </tr>\
                                    </thead>\
                                </table>\
                                <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer">##submit##<button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> ##cancel##</button> \
                              </div> \
                        </div> \
                    </div> \
                </div>',
    jellyForm : '<div class="modal editModal" id="edit" tabindex="-1" role="dialog"> \
                          <div class="modal-dialog"> \
                            <div class="modal-content"> \
                              <div class="modal-header"> \
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              ##open## \
                              <div class="modal-body"> \
                              <div id="response_##formID##"></div>\
                                ##data## \
                                <div class="clearfix"></div> \
                              </div> \
                              <div class="modal-footer"> \
                                ##submit## \
                              </div> \
                              ##close## \
                            </div> \
                          </div> \
                        </div>',    
jellyFormLg : '<div class="modal editModal" id="edit" tabindex="-1" role="dialog"> \
                          <div class="modal-dialog modal-lg"> \
                            <div class="modal-content"> \
                              <div class="modal-header"> \
                                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              ##open## \
                              <div class="modal-body"> \
                              <div id="response_##formID##"></div>\
                                ##data## \
                                <div class="clearfix"></div> \
                              </div> \
                              <div class="modal-footer"> \
                                ##submit## \
                              </div> \
                              ##close## \
                            </div> \
                          </div> \
                        </div>',
    couponDetails : '<div class="modal updateModal" tabindex="-1" role="dialog"> \
                    <div class="modal-dialog ##modalClass##"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              <div class="modal-body">\
                              <div class="modal-body">\
                                <table id="##tableId2##" class="table table-bordered table-striped">\
                                </table>\
                                <hr clear="all" /> \
                                <table id="##tableId##" class="table table-bordered table-striped">\
                                </table>\
                              <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> ##cancel##</button> \
                              </div> \
                        </div> \
                    </div> \
                </div>',
    scratchcardDetails : '<div class="modal updateModal" tabindex="-1" role="dialog"> \
                    <div class="modal-dialog ##modalClass##"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              <div class="modal-body">\
                              <div class="modal-body">\
                                <table id="##tableId2##" class="table table-bordered table-striped">\
                                </table>\
                                <hr clear="all" /> \
                                <table id="##tableId##" class="table table-bordered table-striped">\
                                </table>\
                                <div id="optionsChart"></div>\
                              <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> ##cancel##</button> \
                              </div> \
                        </div> \
                    </div> \
                </div>',
    transactionDetails : '<div class="modal updateModal" tabindex="-1" role="dialog"> \
                    <div class="modal-dialog ##modalClass##"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                              <div class="modal-body">\
                                <table id="##tableId##" class="table table-bordered table-striped">\
                                </table>\
                              <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer"><button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> ##cancel##</button> \
                              </div> \
                        </div> \
                    </div> \
                </div>',
    cancel_market_popup :  '<div class="modal updateModal" tabindex="-1" role="dialog" aria-hidden="true"> \
                    <div class="modal-dialog ##modalClass##"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                             <form action="##url##" class="" method="post" data-ajax="1" id="cancel_market_popup_form">\
                              <div class="modal-body">\
                              <div data-message-form="cancel_market_popup_form"></div>\
                                <div class="col-sm-12" style="margin-bottom:10px">\
                                    <label for="" class="col-sm-2"></label>\
                                    <div class="col-sm-8">\
                                    ##content## \
                                    </div>\
                                </div>\
                                <div class="col-sm-12" style="margin-bottom:10px">\
                                    <label for="cancel_note" class="col-sm-2">Note :</label>\
                                    <div class="col-sm-8">\
                                    <textarea name="cancel_note" data-validate="required|min(5)" class="form-control input-sm"/></textarea>\
                                    </div>\
                                </div>\
                                <br>\
                                <br>\
                                <br>\
                                <div class="col-sm-12">\
                                    <label for="cancel_note" class="col-sm-2">Verify :</label>\
                                    <div class="col-sm-6">\
                                            <input type="text" name="verify_code" value=""  data-validate="required|exact(6)" class="form-control input-sm"/>\
                                    </div>\
                                    <div class="col-sm-2">\
                                            <button type="button" class="btn btn-primary btn-sm" data-link="send_verify" id="send_verify" name="send_verify">Send Code</button>\
                                    </div>\
                                </div>\
                              <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer">\
                              <button type="submit" class="btn btn-success" id="confirm_cancel">Confirm</button>\
                              </form>\
                              <button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> Cancel</button>\
                              </div> \
                        </div> \
                    </div> \
                </div>',    
    save_event_popup :  '<div class="modal updateModal" tabindex="-1" role="dialog" aria-hidden="true"> \
                    <div class="modal-dialog ##modalClass##"> \
                        <div class="modal-content"> \
                              <div class="modal-header"> \
                                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button> \
                                    <h4 class="modal-title" id="myModalLabel">##title##</h4> \
                              </div> \
                             <form action="/ajax/bets/event_winner_save" class="" method="post" data-ajax="1" id="event_winner_save_form">\
                              <div class="modal-body">\
                              <div data-message-form="event_winner_save_form"></div>\
                                <div class="col-sm-12" style="margin-bottom:10px">\
                                    <label for="" class="col-sm-2"></label>\
                                    <div class="col-sm-8">\
                                    ##content## \
                                    </div>\
                                </div>\
                                <br>\
                                <br>\
                                <br>\
                                <div class="col-sm-12">\
                                    <label for="cancel_note" class="col-sm-2">Verify :</label>\
                                    <div class="col-sm-6">\
                                            <input type="text" name="verify_code" value=""  data-validate="required|exact(6)" class="form-control input-sm"/>\
                                    </div>\
                                    <div class="col-sm-2">\
                                            <button type="button" class="btn btn-primary btn-sm" data-link="send_verify" id="send_verify" name="send_verify">Send Code</button>\
                                    </div>\
                                </div>\
                              <div class="clearfix"></div>\
                              </div> \
                              <div class="modal-footer">\
                              <button type="submit" class="btn btn-success" id="confirm_cancel">Confirm</button>\
                              </form>\
                              <button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fa fa-close"></i> Cancel</button>\
                              </div> \
                        </div> \
                    </div> \
                </div>',
};
