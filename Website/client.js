
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
        alert("Pattern Form");
        event.preventDefault();
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
