$(document).ready(function ()
{
	ondo_register();
	$(document).on('pjax:success', function() {
    	ondo_register();
	})
})

function ondo_register()
{
	$('#register_form').unbind("ajaxForm").ajaxForm();
    $('#register_form').unbind("submit").submit(function(){
    	if($('#registerformdiv').form('validate form'))
    		RegisterAjaxSubmit();
    	return false;
    });
    $(".ui.dropdown").unbind("dropdown").dropdown();
    $(".ui.checkbox").unbind("checkbox").checkbox();
    
    $.fn.form.settings.rules.username = function(value) {
 		usernameRegExp = new RegExp("^[a-z0-9]*$", "i");
      	return usernameRegExp.test(value);
    };
    $('#registerformdiv').unbind("form").form(
	{
        Username :
        {
            identifier : 'username',
            rules : [
                {
                    type : 'empty',
                    prompt : 'Please enter your username'
                },
                {
                    type : 'maxLength[20]',
                    prompt : 'Username should not be longer than 20'
                },
                {
                	type : 'username',
                	prompt : 'Username should contain only letter or number.'
                }
            ]
        },
        password :
        {
            identifier : 'password',
            rules : [
                {
                    type : 'empty',
                    prompt : 'Please enter a password'
                },
                {
                    type : 'length[6]',
                    prompt : 'Password must be at least 6 characters'
                },
                {
                    type : 'maxLength[20]',
                    prompt : 'Password should not be longer than 20'
                }
            ]
        },
        passwordConfirm :
        {
            identifier : 'password_confirm',
            rules : [
                {
                    type : 'empty',
                    prompt : 'Please confirm your password'
                },
                {
                    type : 'match[password]',
                    prompt : 'Please verify password matches'
                },
                {
                    type : 'maxLength[20]',
                    prompt : 'Password should not be longer than 20'
                }
            ]
        },
        email :
        {
            identifier : 'email',
            rules : [
                {
                    type : 'empty',
                    prompt : 'Please enter your email'
                },
                {
                    type : 'email',
                    prompt : 'Please enter a valid email'
                },
                {
                    type : 'maxLength[50]',
                    prompt : 'Email should not be longer than 50'
                }
            ]
        },
        nickname :
        {
            identifier : 'nickname',
            rules : [
                {
                    type : 'maxLength[50]',
                    prompt : 'Nickname should not be longer than 50'
                }
            ]
        },
        school :
        {
            identifier : 'school',
            rules : [
                {
                    type : 'maxLength[50]',
                    prompt : 'School should not be longer than 50'
                }
            ]
        },
        motto :
        {
            identifier : 'motto',
            rules : [
                {
                    type : 'maxLength[140]',
                    prompt : 'Motto should not be longer than 140'
                }
            ]
        }
    },
    {
        inline : true,
        on : 'blur'
	    
    });
    
}
function RegisterAjaxSubmit()
{
    $('#register_form').ajaxSubmit(function(data){
    	jsondata = $.parseJSON(data);
    	if(jsondata["valid"] == false)
        	alertify.error(jsondata["retMsg"]);
        else
        {
        	alertify.alert( "Successfully Registered!", function () { 
        		$.pjax({url: "/powerjudge", container: '#mainpage'});
        		ChangeLoginLogoutDiv(jsondata["username"], true);//in page_manager
			});
        }
        return false;
    });
    return false;
}