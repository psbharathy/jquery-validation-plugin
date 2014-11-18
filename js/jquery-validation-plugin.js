(function($) {
                
	$.fn.validation = function(el) {
	    
	    var el = this;
	    
	    var error = [];
	    
	    var un;
	    
	    var errorMessages = {
		requiredMsg : "Value Required",
		invalidNumber : "Invalid Number",
		invalidFloat : "Invalid Float",
		invalidEmail : "Invalid Email"
	    };
	    
	    var errorClz = "v-error";
	    
	    var dispErrorMsg = $(el).attr('data-inline-error');
	    
	    var disp = false;
	    
	    if(dispErrorMsg !== un && dispErrorMsg === 'true') {
		var disp = true;
	    }
	    
	    var dispErrorClz = $(el).attr('data-error-class');
	    
	    var dispClz = "";
	    
	    if(dispErrorClz !== un && dispErrorClz) {
		var dispClz = dispErrorClz;
	    }
	    
	    var validate = {
		
		errorClz : function(clz) {
		    
		},
		
		dispError : function(attr, requireMsg) {
		    if(disp) {
		        return "<span class='" + errorClz + " " + dispErrorClz + "'>" + validate[requireMsg](attr) + "</span>";
		    } else {
		        return "<p class='" + errorClz + " " + dispErrorClz + "'>" + validate[requireMsg](attr) + "</p>";
		    }
		},
		
		dispErrorCheckBox : function(requireMsg) {
		    if(disp) {
		        return "<span class='" + errorClz + " " + dispErrorClz + "'>" + requireMsg + "</span>";
		    } else {
		        return "<p class='" + errorClz + " " + dispErrorClz + "'>" + requireMsg + "</p>";
		    }
		},
		
		removeError : function(el) {
		    el.next('span.' + errorClz + ',' + 'p.' + errorClz).remove();
		},
		
		require : function(field, attr) {
		    if(field.val() === '') {
		        field.after(validate.dispError(attr, 'requireMsg'));
		        error.push($(field));
		    }
		},
		
		requireMsg : function(attr) {
		    
		    var msg = errorMessages.requiredMsg;
		    
		    if(attr !== un) {
		        msg = attr.substring(1, attr.length-1).split(',');
		        msg = msg[0];
		    }
		    
		    return (msg) ? msg : errorMessages.requiredMsg;
		}, 
		
		number : function(field, attr) {
		    var re = /[^0-9]/g;
		    if(re.test(field.val())) {
		        field.after(validate.dispError(attr, 'invalidNumber'));
		        error.push($(field));
		    }
		},
		
		invalidNumber : function(attr) {
		    var msg = errorMessages.invalidNumber;
		    
		    if(attr !== un) {
		        msg = attr.substring(1, attr.length-1).split(',');
		        msg = msg[1];
		    }
		    
		    return (msg) ? msg : errorMessages.invalidNumber;
		},
		
		email : function(field, attr) {
		    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		    if(!regex.test(field.val())) {
		        field.after(validate.dispError(attr, 'invalidEmail'));
		        error.push($(field));
		    }
		},
		
		invalidEmail : function(attr) {
		    var msg = errorMessages.invalidEmail;
		    
		    if(attr !== un) {
		        msg = attr.substring(1, attr.length-1).split(',');
		        msg = msg[1];
		    }
		    
		    return (msg) ? msg : errorMessages.invalidEmail;
		},
		
		float : function(field, attr) {
		    if(!$.isNumeric(field.val())) {
		        field.after(validate.dispError(attr, 'invalidFloat'));
		        error.push($(field));
		    }
		},
		
		invalidFloat : function(attr) {
		    var msg = errorMessages.invalidFloat;
		    
		    if(attr !== un) {
		        msg = attr.substring(1, attr.length-1).split(',');
		        msg = msg[1];
		    }
		    
		    return (msg) ? msg : errorMessages.invalidFloat;
		}
		
	    };
	    
	    
	    $(el).find('input:text, input:password, input:file, select, textarea, input:radio, input:checkbox')
		    .each(function(index, value) {
	       
		if($(value).attr('data-validate') === un) {
		    return;
		}
		
		var attr = $(value).attr('data-validate');
		var sub = attr.substring(1, attr.length - 1);
		var spl = sub.split(',');
		
		if($.inArray("required", spl) === 0 || $.inArray(" required", spl) === 0) {
		    
		    validate.removeError($(value));
		    
		    validate.require($(value), $(value).attr('data-error-message'));
		      
		}
		
		if(($.inArray("email", spl) === 1 || $.inArray(" email", spl) === 1) && $(value).val() !=="") {
		    
		    validate.removeError($(value));
		    
		    validate.email($(value), $(value).attr('data-error-message'));
		    
		}
		
		if(($.inArray("numeric", spl) === 1 || $.inArray(" numeric", spl) === 1) && $(value).val() !=="") {
		    
		    validate.removeError($(value));
		    
		    validate.number($(value), $(value).attr('data-error-message'));
		    
		}
		
		if(($.inArray("float", spl) === 1 || $.inArray(" float", spl) === 1) && $(value).val() !=="") {
		    
		    validate.removeError($(value));
		    
		    validate.float($(value), $(value).attr('data-error-message'));
		    
		    
		}
		
		if($(value).attr('type') === 'radio' || $(value).attr('type') === 'checkbox') {
		    
		    var rName = $(value).attr('name');
		    
		    $(value).parent().find('span.error, p.error').remove();
		    
		    var eMsg = [];
		    
		    if($('input[name='+ rName +']:checked').length <= 0) {
		        var at = $(value).eq(0).attr('data-error-message');
		        var sMsg = at.substring(1, at.length-1).split(',');
		    } else {
		        sMsg = "";
		    }
		    
		    if(sMsg == '') {
		        eMsg.push(errorMessages.requiredMsg);
		    } else {
		        eMsg.push(sMsg[0]);
		    }
		    
		    $(value).parent().find('span.' + errorClz + ', p.'+errorClz).remove();
		    
		    if(sMsg !=='') {
		        $(value).parent().append(validate.dispErrorCheckBox(eMsg[0]));
		        error.push($(value));
		    }
		    
		}
		
	    });
	    
	    return (error.length > 0) ? false : true;
	    
	};
                
})(jQuery);
