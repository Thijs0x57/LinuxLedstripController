
window.onload = function () {

    $.getJSON("/patterns", function(result) {

        var $dropdown = $("#patternDropdown");

        $.each(result.patterns, function (index, value) {
            $dropdown.append($("<option />").val(value.name).text(value.display_name));
        });
    });

    $.getJSON("/status", function (result) {

        $("#color").text(result.color);
        $("#pattern").text(result.pattern);
        $("#brightness").text(result.brightness);
        $("#saving_brightness").text(result.mode_brightness);
        $("#start_time").text(result.mode_start_time);
        $("#end_time").text(result.mode_end_time);
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

        if (!$.isNumeric(brightness))
            showError("#brightnessError", "The given value was not a number. Please give a number between 0 and 100.");
        else if (brightness > 100)
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

    $("#brightnessModeForm").submit(function (event) {
        event.preventDefault();

        var brightness = $("#brightnessModeForm").find('input[name="brightnessModeInput"]').val();

        if(!$.isNumeric(brightness))
            showError("#brightnessModeError", "The given value was not a number. Please give a number between 0 and 100.");
        else if (brightness > 100)
            showError("#brightnessModeError", "The brightness cannot be higher than 100.");
        else if (brightness < 0)
            showError("#brightnessModeError", "The brightness cannot be lower than 0.");
        else {
            var data = JSON.stringify({
                "mode_brightness": brightness
            });

            $.ajax({
                method: "POST",
                url: "/brightness/mode",
                contentType: "application/json",
                data: data
            })
            .done(function () {
                showSuccess("#brightnessModeError", "The brightness was successfully saved");
                $("#brightnessModeForm").find('input[name="brightnessModeInput"]').val("");
            })
            .fail(function (msg) {
                showError("#brightnessModeError", "Something went wrong, please try again.");
            });
        }
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