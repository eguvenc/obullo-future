<script>
<%
   var total = 1;
   var editable = (typeof data.editable == 'undefined') ? true : data.editable;
   delete data.editable;
   

    for(var i in data) {
        var match = data[i];
        %>
<div class="event" style="border: 1px solid #ddd;padding: 10px 25px;text-align: center;">
    <div style="margin-bottom: 5px;text-align: center;display: inline-block;">
            <h4 style="display: inline-block;">
                <span class="sCode"> </span>
                <span class="ttp"><%= match.eName%></span>
            </h4>
    <% if (editable) { %>
        <span class="removeSelection" data-link="remove-odd" data-param="<%= match.eId%>" style="display: inline-block;font-size: 11px;background: #eee;padding: 11px 5px;line-height: 0;color: #777;"><a href="javascript:;">X</a>
        </span>
    <% } %>
    </div>
    <div class="item marketinfo" style="color: #777;font-size: 13px;text-align: center;"><%= match.mName%> <%= match.sOVal%> </div>
    <div class="betTitle" style="margin-bottom: 5px;text-align: center;display: inline-block;">
    <div class="item" style="margin-right: 10px;margin-top: 10px;">
        <div class="selectionDetails">
                <span class="selection">
                    <%= match.oCome%>
                </span>
                <span class="badge alert-info odds odds1">
                    <span class="current"><%= match.odd%> </span>
                </span>
        </div>
    </div>
    </div>

</div>
<% total *= match.odd %>
<% } %>
<br>
<div class="alert alert-info badge total"><b>TOTAL ODD : <%= parseFloat(total).toFixed(2)%></b></div>

</script>


