if (typeof JSON !== "object") {
	JSON = {};
}

(function() {
	"use strict";

	var rx_one = /^[\],:{}\s]*$/;
	var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
	var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
	var rx_four = /(?:^|:|,)(?:\s*\[)+/g;
	var rx_escapable = /[\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

	function f(n) {
		// Format integers to have at least two digits.
		return n < 10 ? "0" + n : n;
	}

	function this_value() {
		return this.valueOf();
	}

	if (typeof Date.prototype.toJSON !== "function") {

		Date.prototype.toJSON = function() {

			return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-"
					+ f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate())
					+ "T" + f(this.getUTCHours()) + ":"
					+ f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds())
					+ "Z" : null;
		};

		Boolean.prototype.toJSON = this_value;
		Number.prototype.toJSON = this_value;
		String.prototype.toJSON = this_value;
	}

	var gap;
	var indent;
	var meta;
	var rep;

	function quote(string) {

		rx_escapable.lastIndex = 0;
		return rx_escapable.test(string) ? "\""
				+ string.replace(rx_escapable,
						function(a) {
							var c = meta[a];
							return typeof c === "string" ? c : "\\u"
									+ ("0000" + a.charCodeAt(0).toString(16))
											.slice(-4);
						}) + "\"" : "\"" + string + "\"";
	}

	function str(key, holder) {

		// Produce a string from holder[key].

		var i; // The loop counter.
		var k; // The member key.
		var v; // The member value.
		var length;
		var mind = gap;
		var partial;
		var value = holder[key];

		// If the value has a toJSON method, call it to obtain a replacement
		// value.

		if (value && typeof value === "object"
				&& typeof value.toJSON === "function") {
			value = value.toJSON(key);
		}

		// If we were called with a replacer function, then call the replacer to
		// obtain a replacement value.

		if (typeof rep === "function") {
			value = rep.call(holder, key, value);
		}

		// What happens next depends on the value's type.

		switch (typeof value) {
		case "string":
			return quote(value);

		case "number":

			// JSON numbers must be finite. Encode non-finite numbers as null.

			return isFinite(value) ? String(value) : "null";

		case "boolean":
		case "null":

			return String(value);

		case "object":

			if (!value) {
				return "null";
			}

			// Make an array to hold the partial results of stringifying this
			// object value.

			gap += indent;
			partial = [];

			// Is the value an array?

			if (Object.prototype.toString.apply(value) === "[object Array]") {

				// The value is an array. Stringify every element. Use null as a
				// placeholder
				// for non-JSON values.

				length = value.length;
				for (i = 0; i < length; i += 1) {
					partial[i] = str(i, value) || "null";
				}

				// Join all of the elements together, separated with commas, and
				// wrap them in
				// brackets.

				v = partial.length === 0 ? "[]" : gap ? "[\n" + gap
						+ partial.join(",\n" + gap) + "\n" + mind + "]" : "["
						+ partial.join(",") + "]";
				gap = mind;
				return v;
			}

			// If the replacer is an array, use it to select the members to be
			// stringified.

			if (rep && typeof rep === "object") {
				length = rep.length;
				for (i = 0; i < length; i += 1) {
					if (typeof rep[i] === "string") {
						k = rep[i];
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ": " : ":") + v);
						}
					}
				}
			} else {

				// Otherwise, iterate through all of the keys in the object.

				for (k in value) {
					if (Object.prototype.hasOwnProperty.call(value, k)) {
						v = str(k, value);
						if (v) {
							partial.push(quote(k) + (gap ? ": " : ":") + v);
						}
					}
				}
			}

			// Join all of the member texts together, separated with commas,
			// and wrap them in braces.

			v = partial.length === 0 ? "{}" : gap ? "{\n" + gap
					+ partial.join(",\n" + gap) + "\n" + mind + "}" : "{"
					+ partial.join(",") + "}";
			gap = mind;
			return v;
		}
	}

	// If the JSON object does not yet have a stringify method, give it one.

	if (typeof JSON.stringify !== "function") {
		meta = { // table of character substitutions
			"\b" : "\\b",
			"\t" : "\\t",
			"\n" : "\\n",
			"\f" : "\\f",
			"\r" : "\\r",
			"\"" : "\\\"",
			"\\" : "\\\\"
		};
		JSON.stringify = function(value, replacer, space) {

			var i;
			gap = "";
			indent = "";

			if (typeof space === "number") {
				for (i = 0; i < space; i += 1) {
					indent += " ";
				}

				// If the space parameter is a string, it will be used as the
				// indent string.

			} else if (typeof space === "string") {
				indent = space;
			}

			// If there is a replacer, it must be a function or an array.
			// Otherwise, throw an error.

			rep = replacer;
			if (replacer
					&& typeof replacer !== "function"
					&& (typeof replacer !== "object" || typeof replacer.length !== "number")) {
				throw new Error("JSON.stringify");
			}

			// Make a fake root object containing our value under the key of "".
			// Return the result of stringifying the value.

			return str("", {
				"" : value
			});
		};
	}

	// If the JSON object does not yet have a parse method, give it one.

	if (typeof JSON.parse !== "function") {
		JSON.parse = function(text, reviver) {

			// The parse method takes a text and an optional reviver function,
			// and returns
			// a JavaScript value if the text is a valid JSON text.

			var j;

			function walk(holder, key) {

				// The walk method is used to recursively walk the resulting
				// structure so
				// that modifications can be made.

				var k;
				var v;
				var value = holder[key];
				if (value && typeof value === "object") {
					for (k in value) {
						if (Object.prototype.hasOwnProperty.call(value, k)) {
							v = walk(value, k);
							if (v !== undefined) {
								value[k] = v;
							} else {
								delete value[k];
							}
						}
					}
				}
				return reviver.call(holder, key, value);
			}

			// Parsing happens in four stages. In the first stage, we replace
			// certain
			// Unicode characters with escape sequences. JavaScript handles many
			// characters
			// incorrectly, either silently deleting them, or treating them as
			// line endings.

			text = String(text);
			rx_dangerous.lastIndex = 0;
			if (rx_dangerous.test(text)) {
				text = text.replace(rx_dangerous,
						function(a) {
							return "\\u"
									+ ("0000" + a.charCodeAt(0).toString(16))
											.slice(-4);
						});
			}

			if (rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]")
					.replace(rx_four, ""))) {

				j = eval("(" + text + ")");

				// In the optional fourth stage, we recursively walk the new
				// structure, passing
				// each name/value pair to a reviver function for possible
				// transformation.

				return (typeof reviver === "function") ? walk({
					"" : j
				}, "") : j;
			}

			// If the text is not JSON parseable, then a SyntaxError is thrown.

			throw new SyntaxError("JSON.parse");
		};
	}
}());

function sendAjax(config) {
	var xmlhttp = new XMLHttpRequest();
	console.log("config:" + config);
	if (xmlhttp) {
		// console.log(config.url);
		xmlhttp.open("POST", config.url, false);
		// xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xmlhttp.setRequestHeader("Content-type",
				"application/x-www-form-urlencoded;charset=utf-8");
		config["timeout"] = 360000;
		var data = JSON.stringify(config);
		console.log("data:" + data);
		// alert(data);
		xmlhttp.send(data);
		return config.callback(xmlhttp.responseText);
		/*
		 * xmlhttp.onreadystatechange= function(){ if(xmlhttp.readyState == 4 &&
		 * xmlhttp.status==200){ //success
		 * config.callback(xmlhttp.responseText); }else{ //error
		 * //console.log('error'); } }
		 */
	} else {
		// IE5,IE6
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

}
// base - over
function CerticateCollectionX() {
	var selfP = this;
	var config = {
		HBCAFunctionID : 100,
		parameterValue1 : '',
		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			selfP.guid = json.RetVal;
			selfP.setQuiet(1);
		},
		url : CerticateCollectionX.baseHttpUrl
	};
	sendAjax(config);
};
CerticateCollectionX.baseHttpUrl = "http://localhost:10808/api/CA/Post";
// CerticateCollectionX.baseHttpUrl = "http://127.0.0.1:36157";
CerticateCollectionX.prototype.DelICCX = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 99,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.NewICCX = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 100,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.SelectCertificateDialog = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 101,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return new CerticateX(json.RetVal);
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.Load = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 102,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.GetAt = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 103,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return new CerticateX(json.RetVal);
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.Find = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 104,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.CreateCertificateBase64 = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 105,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return new CerticateX(json.RetVal);
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.CreateCertificateDER = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 106,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return new CerticateX(json.RetVal);
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.CreateCertificateFile = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 107,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return new CerticateX(json.RetVal);
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getDebug = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 108,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setDebug = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 109,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getQuiet = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 110,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setQuiet = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 111,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getSize = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 112,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setSize = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 113,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getLastError = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 114,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setLastError = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 115,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getErrorString = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 116,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setErrorString = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 117,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getCF_KeyUsage = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 118,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setCF_KeyUsage = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 119,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getCF_Subject_Contains = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 120,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setCF_Subject_Contains = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 121,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getCF_Issuer_Contains = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 122,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setCF_Issuer_Contains = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 123,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getCryptoInterface = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 124,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setCryptoInterface = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 125,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getCF_Issuer_Regex = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 126,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setCF_Issuer_Regex = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 127,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getCF_Subject_Regex = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 128,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setCF_Subject_Regex = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 129,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.CreatePKCS10Req = function(value1, value2,
		value3, value4, value5) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 130,
		parameterValue1 : value1,
		parameterValue2 : value2,
		parameterValue3 : value3,
		parameterValue4 : value4,
		parameterValue5 : value5,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.WriteToDev = function(value1, value2, value3,
		value4, value5, value6) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 131,
		parameterValue1 : value1,
		parameterValue2 : value2,
		parameterValue3 : value3,
		parameterValue4 : value4,
		parameterValue5 : value5,
		parameterValue6 : value6,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.GetKeySN = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 132,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.InnerTest = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 133,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getDevInfoJson = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 134,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setDevInfoJson = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 135,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.DeleteDevStruct = function(value1, value2,
		value3, value4) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 136,
		parameterValue1 : value1,
		parameterValue2 : value2,
		parameterValue3 : value3,
		parameterValue4 : value4,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getCF_CertAlg = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 137,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setCF_CertAlg = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 138,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.FindByCertId = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 139,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getCF_SoftEnabled = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 140,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setCF_SoftEnabled = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 141,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.MakeSealToDev = function(value1, value2, value3) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 142,
		parameterValue1 : value1,
		parameterValue2 : value2,
		parameterValue3 : value3,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.LoadSeal = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 143,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getSealSize = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 144,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setSealSize = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 145,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.GetAtSeal = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 146,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.SelectSealDialog = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 147,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getSortPrior = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 148,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setSortPrior = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 149,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.getCF_CSP_JSONCLUDE = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 150,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.setCF_CSP_JSONCLUDE = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 151,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}
CerticateCollectionX.prototype.ViewSeal = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 152,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateCollectionX.baseHttpUrl,
		iccx_guid : selfP.guid
	};
	return sendAjax(config);

}

// CerticateCollectionX Over
// ICCX-over
function CerticateX(guid) {
	var selfP = this;
	selfP.guid = guid;
	selfP.setQuiet(1);
};
CerticateX.baseHttpUrl = 'http://localhost:10808/api/CA/Post';
// CerticateX.baseHttpUrl = 'http://127.0.0.1:36157';
CerticateX.prototype.DelICX = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 200,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS1String = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 201,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS1Base64 = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 202,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS1Bytes = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 203,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS1File = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 204,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS1Digest = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 205,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS1Verify = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 206,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS1VerifyFile = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 207,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS1VerifyDigest = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 208,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS7String = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 209,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS7Bytes = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 210,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS7Base64 = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 211,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PublicEncrypt = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 212,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PrivateDecrypt = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 213,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.EnvSeal = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 214,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.EnvSealFile = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 215,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.ExtSealFile = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 216,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.EnvOpen = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 217,
		parameterValue1 : value1,
		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.EnvOpenFile = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 218,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.ExtOpenFile = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 219,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.XMLSign = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 220,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.XMLSignEnveloping = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 221,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.GetExtensionString = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 222,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getDebug = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 223,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setDebug = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 224,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getQuiet = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 225,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setQuiet = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 226,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getLastError = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 227,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setLastError = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 228,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getErrorString = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 229,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setErrorString = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 230,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getSubject = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 231,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setSubject = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 232,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getThumbPrintSHA1 = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 233,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setThumbPrintSHA1 = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 234,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getThumbPrintMD5 = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 235,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setThumbPrintMD5 = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 236,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getFriendlyName = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 237,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setFriendlyName = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 238,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getContent = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 239,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setContent = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 240,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getSerialNumber = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 241,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setSerialNumber = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 242,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getIssuer = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 243,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setIssuer = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 244,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getVersion = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 245,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setVersion = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 246,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getSignatureAlgorithm = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 247,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setSignatureAlgorithm = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 248,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getNotBeforeTimestamp = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 249,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setNotBeforeTimestamp = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 250,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getNotAfterTimestamp = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 251,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setNotAfterTimestamp = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 252,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getNotBeforeSystemTime = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 253,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setNotBeforeSystemTime = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 254,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getNotAfterSystemTime = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 255,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setNotAfterSystemTime = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 256,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getIssuerUniqueIdHexString = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 257,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setIssuerUniqueIdHexString = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 258,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getSubjectUniqueIdHexString = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 259,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setSubjectUniqueIdHexString = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 260,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getSubjectUniqueIdPrintable = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 261,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setSubjectUniqueIdPrintable = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 262,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getIssuerUniqueIdPrintable = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 263,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setIssuerUniqueIdPrintable = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 264,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getDeviceName = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 265,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setDeviceName = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 266,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getApplicationName = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 267,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setApplicationName = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 268,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getContainerName = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 269,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setContainerName = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 270,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getProviderName = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 271,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setProviderName = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 272,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getIsPrivateKeyAccessible = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 273,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setIsPrivateKeyAccessible = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 274,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getKeyBits = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 275,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setKeyBits = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 276,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getCryptoInterfaceName = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 277,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setCryptoInterfaceName = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 278,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getUserPIN = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 279,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setUserPIN = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 280,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getKeyUsage = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 281,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setKeyUsage = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 282,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getAlgorithm = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 283,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setAlgorithm = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 284,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getDefaultCipher = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 285,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setDefaultCipher = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 286,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getDefaultP1Digest = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 287,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setDefaultP1Digest = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 288,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getDefaultP7Digest = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 289,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setDefaultP7Digest = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 290,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.PKCS7Verify = function(value1, value2) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 291,
		parameterValue1 : value1,
		parameterValue2 : value2,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.InnerTest = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 292,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.GetCertFromP7SignedData = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 293,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.GetPlainTextFromP7SignedData = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 294,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.GetIssuerFromP7SignedData = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 295,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.GetSeriNoFromP7SignedData = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 296,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.GetP1FromP7SignedData = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 297,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.getKeySN = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 298,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.setKeySN = function(value1) {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 299,
		parameterValue1 : value1,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.GenRandom = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 300,

		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}
CerticateX.prototype.GetPinRetryRemainCount = function() {
	var selfP = this;
	/**/
	var config = {
		HBCAFunctionID : 301,
		callback : function(responseTxt) {
			var json = JSON.parse(responseTxt);
			return json.RetVal;
		},
		url : CerticateX.baseHttpUrl,
		icx_guid : selfP.guid
	};
	return sendAjax(config);
}

// CerticateX Over
// ICX-over
function isIe() {
	return ("ActiveXObject" in window);
}