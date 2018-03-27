
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
        event.preventDefault();

        var brightness = $("#brightnessForm").find('input[name="brightnessInput"]').val();

        if (brightness > 100)
            showError("#brightnessError", "The brightness cannot be higher than 100.");
        else if (brightness < 0)
            showError("#brightnessError", "The brightness cannot be lower than 0.");
        else {
            var data = JSON.stringify({
                "brightness": brightness
            });

            $.ajax({
                method: "POST",
                url: "/brightness",
                contentType: "application/json",
                data: data
            })
            .done(function () {
                showSuccess("#brightnessError", "The brightness was successfully saved");
                $("#brightnessForm").find('input[name="brightnessInput"]').val("");
            })
            .fail(function (msg) {
                showError("#brightnessError", "Something went wrong, please try again.");
            });
        }
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