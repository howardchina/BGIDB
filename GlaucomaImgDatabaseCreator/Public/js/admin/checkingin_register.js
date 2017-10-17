$(document).ready(function ()
{
	$(document).on('pjax:popstate', function() {
		location.reload();
	})
	var pjaxflag = false;
	$(document).on('pjax:end', function() {
		ondo_checkingin_register();
		pjaxflag = true;
	})
	if(!pjaxflag)
		ondo_checkingin_register();
	
})
function ondo_checkingin_register()
{
	if(!$.fn.dataTable.isDataTable($('#checkingin_register')))
		InitCheckingin_registerTable();
	
	$('.set_checkingin_uid_button').bind('click', function(){alert(123);});
}
function SetCheckinginUid(obj)
{
 	$.get(
		'/bgidb/admin/change_checkingin_uid_ajax', 
		{
			uid: $('#checkinginuser_'+$(obj).attr('name')).val(),
			id: $(obj).attr('name')
		},
		function(data){
	    	if(data["wrongcode"] == 72)
	        	alertify.log(data["wrongmsg"]);
	    	else if(data["wrongcode"] < 900)
				alertify.error(data["wrongmsg"]);
			else
				alertify.success("设定成功");
		},
		"json");
}
function InitCheckingin_registerTable()
{
	 $('#checkingin_register').unbind("dataTable").dataTable( {
			"processing": true,
			"serverSide": true,
			stateSave: true,// restore table state on page reload
			"pagingType": "full_numbers",//first/last page button
			"pageLength": 50,
			"lengthMenu": [ 10, 25, 50, 100],
			"language": {//	like $645.750,00
				"decimal": ",",
				"thousands": "."
			},
			"ajax": {
				"url": "/bgidb/admin/checkingin_register_ajax/",
				"type": "POST",
				pages: 5 // number of pages to cache
			},
		    "order": [ 0, 'desc' ],
			"columns": [
				{ 
					"data": "id",
					"width": "60px",
					className: "center",
					"orderSequence": ["desc", "asc"],
					"searchable": false
				},
				{
					"data": "onlyname",
					"width": "300px",
					"orderDataType": "dom-text",
					"orderable": false,
					className: "center",
					"searchable": false
				},
				{
					"data": "clientIP",
					"width": "200px",
					className: "center",
				},
				{
					"data": "uid",
//					"width": "100px",
					className: "center",
				},
				{
					"data": "setbtn",
					"width": "100px",
					className: "center",
				}
			]
	 } );
}

//
//Pipelining function for DataTables. To be used to the `ajax` option of DataTables
//
$.fn.dataTable.pipeline = function ( opts ) {
 // Configuration options
 var conf = $.extend( {
		pages: 5,		// number of pages to cache
		url: '',		// script url
		data: null,	// function or object with parameters to send to the server
						 // matching how `ajax.data` works in DataTables
		method: 'GET' // Ajax HTTP method
 }, opts );

 // Private variables for storing the cache
 var cacheLower = -1;
 var cacheUpper = null;
 var cacheLastRequest = null;
 var cacheLastJson = null;

 return function ( request, drawCallback, settings ) {
		var ajax			 = false;
		var requestStart	= request.start;
		var drawStart		= request.start;
		var requestLength = request.length;
		var requestEnd	 = requestStart + requestLength;
		
		if ( settings.clearCache ) {
			// API requested that the cache be cleared
			ajax = true;
			settings.clearCache = false;
		}
		else if ( cacheLower < 0 || requestStart < cacheLower || requestEnd > cacheUpper ) {
			// outside cached data - need to make a request
			ajax = true;
		}
		else if ( JSON.stringify( request.order )	!== JSON.stringify( cacheLastRequest.order ) ||
					JSON.stringify( request.columns ) !== JSON.stringify( cacheLastRequest.columns ) ||
					JSON.stringify( request.search )	!== JSON.stringify( cacheLastRequest.search )
		) {
			// properties changed (ordering, columns, searching)
			ajax = true;
		}
		
		// Store the request for checking next time around
		cacheLastRequest = $.extend( true, {}, request );

		if ( ajax ) {
			// Need data from the server
			if ( requestStart < cacheLower ) {
				 requestStart = requestStart - (requestLength*(conf.pages-1));

				 if ( requestStart < 0 ) {
						requestStart = 0;
				 }
			}
			 
			cacheLower = requestStart;
			cacheUpper = requestStart + (requestLength * conf.pages);

			request.start = requestStart;
			request.length = requestLength*conf.pages;

			// Provide the same `data` options as DataTables.
			if ( $.isFunction ( conf.data ) ) {
				 // As a function it is executed with the data object as an arg
				 // for manipulation. If an object is returned, it is used as the
				 // data object to submit
				 var d = conf.data( request );
				 if ( d ) {
						$.extend( request, d );
				 }
			}
			else if ( $.isPlainObject( conf.data ) ) {
				 // As an object, the data given extends the default
				 $.extend( request, conf.data );
			}

			settings.jqXHR = $.ajax( {
				 "type":		conf.method,
				 "url":		conf.url,
				 "data":		request,
				 "dataType": "json",
				 "cache":	 false,
				 "success":	function ( json ) {
						cacheLastJson = $.extend(true, {}, json);

						if ( cacheLower != drawStart ) {
							json.data.splice( 0, drawStart-cacheLower );
						}
						json.data.splice( requestLength, json.data.length );
						
						drawCallback( json );
				 }
			} );
		}
		else {
			json = $.extend( true, {}, cacheLastJson );
			json.draw = request.draw; // Update the echo for each response
			json.data.splice( 0, requestStart-cacheLower );
			json.data.splice( requestLength, json.data.length );

			drawCallback(json);
		}
 }
};

//Register an API method that will empty the pipelined data, forcing an Ajax
//fetch on the next draw (i.e. `table.clearPipeline().draw()`)
$.fn.dataTable.Api.register( 'clearPipeline()', function () {
 return this.iterator( 'table', function ( settings ) {
	settings.clearCache = true;
 });
});