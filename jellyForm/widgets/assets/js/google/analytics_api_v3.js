function makeAnalyticsApiCall(metrics, dimensions, sort, targetId) {
  var apiQuery = new gapi.client.analytics.data.ga.get({
    'ids': 'ga:86480655',
    'start-date': '2010-01-01',
    'end-date': '2015-01-15',
    'metrics': metrics,
    'dimensions': dimensions,
    'sort': sort,
    'filters': 'ga:medium==organic',
    'max-results': 5
  });
  
  apiQuery.execute(function (results) {
    if (!results.error) {
      // printColumnHeaders(results);
      printRows(results, targetId);
    } else {
    alert('There was an error: ' + results.message);
    }
  });
}

function printColumnHeaders(results) {
  var output = [];

  for (var i = 0, header; header = results.columnHeaders[i]; ++i) {
    output.push(
        'Name        = ', header.name, '\n',
        'Column Type = ', header.columnType, '\n',
        'Data Type   = ', header.dataType, '\n'
    );
  }

  alert(output.join(''));
}

function printRows(results, targetId) {
  output = [];

  if (results.rows && results.rows.length) {
    var table = ['<table class="table table-bordered table-striped table-hover dataTable no-footer">'];

    // Put headers in table.
    table.push('<tr>');
    for (var i = 0, header; header = results.columnHeaders[i]; ++i) {
      table.push('<th>', header.name, '</th>');
    }
    table.push('</tr>');

    // Put cells in table.
    for (var i = 0, row; row = results.rows[i]; ++i) {
      table.push('<tr><td>', row.join('</td><td>'), '</td></tr>');
    }
    table.push('</table>');

    output.push(table.join(''));
  } else {
    output.push('<p>No Results Found</p>');
  }

  $(targetId).html(output.join(''));
}

function printReportInfo(results) {
  var output = [];

  output.push(
      'Contains Sampled Data  = ', results.containsSampledData, '\n',
      'Kind                   = ', results.kind, '\n',
      'ID                     = ', results.id, '\n',
      'Self Link              = ', results.selfLink, '\n');

  alert(output.join(''));
}