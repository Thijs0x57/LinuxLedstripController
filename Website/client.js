
window.onload = function () {

    $.getJSON("/patterns", function(result) {

        var $dropdown = $("#patternDropdown");

        console.log(result);

        $.each(result.patterns, function (index, value) {
            $dropdown.append($("<option />").val(value.name).text(value.display_name));
        });
    });
};

$(function () {

    $("#patternForm").submit(function (event) {
        event.preventDefault();

        var pattern = $("#patternDropdown").val();
        
        var data = JSON.stringify({
            "pattern": pattern 
        });

        $.ajax({
            method: "POST",
            url: "/pattern",
            contentType: "application/json",
            data: data
        })
        .done(function () {
            alert("Success");
        })
        .fail(function (msg) {
            alert(msg);
        });
    });

    $("#brightnessForm").submit(function (event) {
        alert("Pattern Form");
        event.preventDefault();
    });

    $("#brightnessModeInputForm").submit(function (event) {
        alert("Pattern Form");
        event.preventDefault();
    });
});
