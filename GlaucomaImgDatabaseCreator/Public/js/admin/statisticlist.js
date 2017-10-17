$(document).ready(function ()
{
	$(document).on('pjax:popstate', function() {
		location.reload();
	})
	var pjaxflag = false;
	$(document).on('pjax:end', function() {
		ondo_statisticlist();
		pjaxflag = true;
	})
	if(!pjaxflag)
		ondo_statisticlist();
})
function ondo_statisticlist()
{
	if(!$.fn.dataTable.isDataTable($('#statisticlist_list')))
		InitStatisticlistTable();
}
function change_statistic_available(obj)
{
 	$.get(
		'/bgidb/admin/change_statistic_available_ajax', 
		{id: $(obj).attr('name')},
		function(data){
			if(data["wrongcode"] != 999)
				alertify.error(data["wrongmsg"]);
			else
			{
				alertify.success("修改成功");
				if(data['available'] == 0)
				{
					$(obj).removeClass('blue');
					$(obj).addClass('grey');
					$(obj).text('隐藏=>显示')
				}
				else
				{
					$(obj).removeClass('grey');
					$(obj).addClass('blue');
					$(obj).text('显示=>隐藏')
				}
			}
		},
		"json");
}
function InitStatisticlistTable()
{
	 $('#statisticlist_list').unbind("dataTable").dataTable( {
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
				"url": "/bgidb/admin/statisticlist_ajax/",
				"type": "POST",
				pages: 5 // number of pages to cache
			},
		    "order": [ 0, 'desc' ],
			"columns": [
						{ 
							"data": "id",
							"width": "50px",
							className: "center",
						},
						{
							"data": "title",
//							"width": "600px",
						},
						{ 
							"data": "name",
							"width": "100px",
							className: "center",
						},
						{
							"data": "submittime",
							"width": "100px",
							className: "center",
							 "searchable": false
						},
						{
							"data": "starttime",
							"width": "100px",
							className: "center",
							 "searchable": false
						},
						{
							"data": "endtime",
							"width": "100px",
							className: "center",
							 "searchable": false
						},
						{
							"data": "available",
							"width": "150px",
							className: "center",
							 "searchable": false
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