
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
            showSuccess("#patternError", "The pattern was successfully saved");
        })
        .fail(function (msg) {
            showError("#patternError", "Something went wrong, please try again.");
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

//Elementname must be given with their .class or #id.
function showError(elementName, message)
{
    $(elementName).show();
    $(elementName).css("color", "red");
    $(elementName).text(message);

    //turn the display to none after 10 seconds.
    setTimeout(function () {
        $(elementName).hide();
    }, 10000);
}

//Elementname must be given with their .class or #id.
function showSuccess(elementName, message)
{
    $(elementName).show();
    $(elementName).css("color", "green");
    $(elementName).text(message);

    //turn the display to none after 10 seconds.
    setTimeout(function () {
        $(elementName).hide();
    }, 10000);
}