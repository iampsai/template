var OCookies =
{
	nTimeCookie: 31536000, //1 year

	getCookieVal: function(offset)
	{
		var endstr = document.cookie.indexOf(";", offset);
		if(endstr == -1)
		{
			endstr = document.cookie.length;
		}
		return unescape(document.cookie.substring(offset, endstr));
	},

	getCookie: function(name)
	{
		var arg = name + "=";
		var alen = arg.length;
		var clen = document.cookie.length;
		var i = 0;
		while(i < clen)
		{
			var j = i + alen;
			if(document.cookie.substring(i, j) == arg)
			{
				return OCookies.getCookieVal(j);
			}
			i = document.cookie.indexOf(" ", i) + 1;
			if(i == 0)
			{
				break;
			}
		}
		return null;
	},

	getIntCookie: function(name)
	{
		var co;
		var cc;
		co = parseInt(OCookies.getCookie(name));
		if(co !== co) co = 0;
		return co;
	},

	//name - cookie name
	//value - cookie val (string)
	//options - obj with additional properties:
	//		expires - time of exp.
	//			number - seconds.
	//			Date obj - date.
	//		if expires in past - cookie will be deleted.
	//		if expires = 0 (or miss), cookie will be set as session.
	setCookie: function(name, value, options)
	{
		options = options || { expires: OCookies.nTimeCookie };
		var expires = options.expires;
		if(typeof expires == "number" && expires)
		{
			var d = new Date();
			d.setTime(d.getTime() + expires*1000);
			expires = options.expires = d;
		}

		if(expires && expires.toUTCString)
		{
			options.expires = expires.toUTCString();
		}

		value = encodeURIComponent(value);
		var updatedCookie = name + "=" + value;

		for(var propName in options)
		{
			updatedCookie += "; " + propName;
			var propValue = options[propName];   
			if(propValue !== true)
			{
				updatedCookie += "=" + propValue;
			}
		}
		document.cookie = updatedCookie;
	},

	set: function(name, val)
	{
		if(fSCORM)
		{
			//if SCORM: save state oState
			saveState();
		}
		else
		{
			//save cookie
			if(val == undefined) val = "0";
			OCookies.setCookie(name, val);
		}
	},
	/*
	//attr: "passed", "time", ...etc
	setLessonAttr: function(nLesson, attr, val)
	{
		if(val == undefined) val = "0";
		OCookies.setCookie("lesson"+nLesson +"_"+attr, val);

		//if SCORM: save state
		ScormObj.saveState();
	},
	*/

	// Remove cookie
  clearCookies: function (nPage) {
    OCookies.setCookie("pageCookie" + nPage, "0", -3600);
  },
};