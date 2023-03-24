var table = new Tabulator("#attributes-table", {
    selectable: 1,
    layout: "fitDataTable",
    layoutColumnsOnNewData:true,
    columns:[
        {title:"Attribute Name", field:"name", editor:"input"},
        {title:"Attribute Value", field:"value", editor:"input"},
    ],
    data: [{id:1, name:"region", value:"south"}, {id:2, name:"role", value:"developer"}]
});

function addRow()
{
    table.addRow();
}

function removeSelectedRows()
{
    var selectedRows = table.getSelectedRows();
    for (var i = 0; i < selectedRows.length; i++)
    {
        selectedRows[i].delete();
    }
}

function loadViz()
{
    var vizUrl = $("#viz-url").val();
    var attributes = {};

    var tableData = table.getData();
    for (var i = 0; i < tableData.length; i++)
    {
        attributes[tableData[i].name] = tableData[i].value.split(",").map(v => v.trim());;
    }

    $.ajax({
        url: "/getToken",
        type: "POST",
        data: JSON.stringify(attributes),
        contentType: "application/json",
        success: function(token) {
            $("#viz-pane").empty();

            var vizContent = `
                <tableau-viz id="tableauViz" src='${vizUrl}' toolbar="bottom" token='${token}'>
                </tableau-viz>
            `;

            $("#viz-pane").append(vizContent);
        }
    });
}